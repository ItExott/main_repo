const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 8080;

app.use(session({
    secret: 'your-secret-key',  // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // For development purposes; set to true for HTTPS in production
}));

// CORS 설정
app.use(cors({
    origin: 'http://localhost:5173', // 프론트엔드 주소
    credentials: true // 쿠키를 포함한 요청 허용
}));

// JSON 요청 본문 처리
app.use(express.json());

// 세션 설정 (메모리 기반)
app.use(session({
    secret: 'your-secret-key', // 세션 암호화 키
    resave: false, // 세션이 변경된 경우에만 저장
    saveUninitialized: false, // 초기화되지 않은 세션 저장 안 함
    cookie: {
        maxAge: 3600000, // 세션 만료 시간: 1시간
        httpOnly: true, // JavaScript로 쿠키 접근 차단
        secure: false, // HTTPS 환경이 아닌 경우 false
        sameSite: 'None' // 크로스 오리진 요청 허용
    }
}));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306, // MySQL 기본 포트
    password: 'root', // 비밀번호
    database: 'itsoftgym' // 사용할 데이터베이스
});

// MySQL 연결 확인
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 특정 제품 상세 조회 API
    app.get('/product/:id', (req, res) => {
    const prodid = req.params.id;
    const query = "SELECT * FROM Product WHERE prodid = ?";
    db.query(query, [prodid], (err, results) => {
        if (err) {
            console.error("Error fetching product data:", err);
            return res.status(500).send("Internal server error");
        }
        if (results.length === 0) {
            return res.status(404).send("Product not found");
        }
        const product = results[0];
        if (product.facility_pictures) {
            try {
                product.facility_pictures = JSON.parse(product.facility_pictures);
            } catch (e) {
                console.error("Error parsing facility_pictures:", e);
            }
        }
        res.json(product);
    });
});

// 카테고리와 제품 조회 API
app.get('/product_Main/:category', (req, res) => {
    const category = req.params.category;
    const sortOption = req.query.sort || 'prodrating'; // 기본 정렬 기준
    const sortOrder = 'DESC'; // 내림차순 정렬

    const categoryQuery = `SELECT * FROM divisionsport WHERE category = ?`;
    const productQuery = `SELECT * FROM Product WHERE category = ? ORDER BY ${sortOption} ${sortOrder}`;

    db.query(categoryQuery, [category], (err, categoryResults) => {
        if (err) {
            console.error("Error fetching category data:", err);
            return res.status(500).send("Internal server error");
        }
        if (categoryResults.length === 0) {
            return res.status(404).send("No category found for this category");
        }

        db.query(productQuery, [category], (err, productResults) => {
            if (err) {
                console.error("Error fetching product data:", err);
                return res.status(500).send("Internal server error");
            }
            res.json({
                category: categoryResults[0],
                products: productResults
            });
        });
    });
});

// 회원가입 API
app.post('/api/signup', (req, res) => {
    const { userId, userpw, name, email, phoneNumber, address, userType } = req.body;

    const query = 'INSERT INTO users (userId, userpw, name, email, phoneNumber, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, userpw, name, email, phoneNumber, address, userType], (err) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.json({ success: false, message: '회원가입 실패' });
        }
        res.json({ success: true, message: '회원가입 성공' });
    });
});

    // 로그인 API
    app.post('/api/login', (req, res) => {
        const { userid, userpw } = req.body;

        const query = 'SELECT * FROM users WHERE userid = ? AND userpw = ?';
        db.query(query, [userid, userpw], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (results.length > 0) {
                req.session.userId = userid;
                req.session.name = results[0].name;
                req.session.profileimg = results[0].profileimg;

                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).json({ success: false, message: 'Session save error' });
                    }
                    res.json({ success: true, name: results[0].name, message: 'Login successful' });
                });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        });
    });

// 로그아웃 API
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// 유저 세션 정보 확인 API
app.get('/api/userinfo', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            success: true,
            userId: req.session.userId,
            name: req.session.name,
            profileimg: req.session.profileimg
        });
    } else {
        res.status(401).json({ success: false, message: 'User not logged in' });
    }
});

app.post('/add-to-cart', (req, res) => {
    const prodid = req.body.prodid;
    const userId = req.session.userId; // Getting userId from session

    console.log("Session userId:", userId);

    if (!userId) {
        // If user is not logged in
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // Query to get the user's product list (cart)
    const getProdlistQuery = `SELECT prodlist FROM users WHERE userid = ?`;
    db.query(getProdlistQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user's prodlist:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // Initialize an empty array if no products are in the cart
        let prodlist = results[0]?.prodlist ? JSON.parse(results[0].prodlist) : [];

        // Check if the product is already in the cart
        if (prodlist.includes(prodid)) {
            return res.status(400).json({ message: "상품이 이미 장바구니에 있습니다." });
        }

        // Limit to 3 items in the cart
        if (prodlist.length >= 3) {
            return res.status(400).json({ message: "장바구니는 최대 3개의 상품만 담을 수 있습니다." });
        }

        // Add the product to the cart
        prodlist.push(prodid);

        // Update the cart in the database
        const updateProdlistQuery = `UPDATE users SET prodlist = ? WHERE userid = ?`;
        db.query(updateProdlistQuery, [JSON.stringify(prodlist), userId], (err) => {
            if (err) {
                console.error("Error updating prodlist:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
            // Successful addition to the cart
            res.json({ message: "장바구니에 추가되었습니다." });
        });
    });
});

app.get('/cart-products', (req, res) => {
    // Check if user is logged in by verifying session
    if (!req.session || !req.session.userId) {
        // If user is not logged in, return an error
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = req.session.userId;  // Retrieve userId from session

    console.log("Session object:", req.session);
    // Query to get the user's prodlist (cart)
    const getProdlistQuery = `SELECT prodlist FROM users WHERE userid = ?`;
    console.log("User ID from session:", userId);  // Log the userId to ensure it's correct

    db.query(getProdlistQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user's prodlist:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // If no prodlist is found, return an empty array
        if (!results[0]) {
            console.log("No prodlist found for this user.");
            return res.json([]);
        }

        // Parse the prodlist from the database (stored as a JSON string)
        let prodlist = results[0]?.prodlist ? JSON.parse(results[0].prodlist) : [];

        // If the prodlist is empty, return an empty array
        if (prodlist.length === 0) {
            return res.json([]);
        }

        // Dynamically create placeholders for the IN clause based on the length of prodlist
        const placeholders = prodlist.map(() => '?').join(',');

        // Query to fetch product details based on prodlist
        const getProductsQuery = `
            SELECT *
            FROM Product
            WHERE prodid IN (${placeholders});
        `;

        console.log("Executing query:", getProductsQuery);  // Log the query for debugging

        // Execute the query with the prodlist array as parameters
        db.query(getProductsQuery, prodlist, (err, products) => {
            if (err) {
                console.error("Error fetching product details:", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            // If no products are found, return an empty array
            if (products.length === 0) {
                console.log("No products found for this prodlist.");
                return res.json([]);
            }

            // Return the product details to the frontend
            res.json(products);
        });
    });
});

app.delete('/cart-products/:prodid', async (req, res) => {
    // Check if user is logged in by verifying session
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = req.session.userId;  // Retrieve userId from session
    const prodid = Number(req.params.prodid);  // Convert prodid to a number

    console.log("Product ID to remove:", prodid);  // Log the prodid to ensure it's correct

    try {
        // Query to get the user's prodlist (cart)
        const getProdlistQuery = `SELECT prodlist FROM users WHERE userid = ?`;

        const results = await new Promise((resolve, reject) => {
            db.query(getProdlistQuery, [userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (!results[0]) {
            console.log("No prodlist found for this user.");
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check the raw value of prodlist before parsing
        const rawProdlist = results[0]?.prodlist;
        console.log("Raw prodlist data:", rawProdlist);  // Log the raw prodlist for debugging

        // Parse the prodlist from the database (stored as a JSON string)
        let prodlist = [];
        try {
            prodlist = rawProdlist ? JSON.parse(rawProdlist) : [];
        } catch (err) {
            console.error("Error parsing prodlist JSON:", err);
            return res.status(500).json({ message: "Invalid prodlist format" });
        }

        console.log("Current prodlist after parsing:", prodlist);  // Log the parsed prodlist

        // If the prodlist is empty, return a message
        if (prodlist.length === 0) {
            return res.status(404).json({ message: "No products in cart" });
        }

        // Check if the product exists in the user's prodlist
        const productIndex = prodlist.indexOf(prodid);

        console.log("Product index in prodlist:", productIndex);  // Log the index to check if it exists

        if (productIndex === -1) {
            // If the product is not in the list, return an error
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the product from the prodlist
        prodlist.splice(productIndex, 1);

        console.log("Updated prodlist after removal:", prodlist);  // Log the updated prodlist

        // Update the prodlist in the database
        const updateProdlistQuery = `UPDATE users SET prodlist = ? WHERE userid = ?`;

        const updateResult = await new Promise((resolve, reject) => {
            db.query(updateProdlistQuery, [JSON.stringify(prodlist), userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log("Update result:", updateResult);  // Log the result of the update query

        // Check if the update was successful
        if (updateResult.affectedRows === 0) {
            console.error("No rows were updated, prodlist might not have changed.");
            return res.status(500).json({ message: "Failed to update prodlist" });
        }

        // Return the updated prodlist to the client
        return res.json({ message: "Product removed from cart", updatedProdlist: prodlist });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/check-session', (req, res) => {
    // 세션에 userId가 존재하면 로그인된 상태
    if (req.session && req.session.userId) {
        return res.json({ loggedIn: true, userId: req.session.userId, profileimg : req.session.profileimg});
    } else {
        // 로그인되지 않았으면 false 반환
        return res.json({ loggedIn: false });
    }
});


// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
