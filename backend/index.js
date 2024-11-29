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
    cookie: { maxAge: 60 * 60 * 1000 }  // For development purposes; set to true for HTTPS in production
}));

// CORS 설정
app.use(cors({
    origin: 'http://localhost:5173', // 프론트엔드 주소
    credentials: true // 쿠키를 포함한 요청 허용
}));

// JSON 요청 본문 처리
app.use(express.json());


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
    const userId = req.session.userId;

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

        if (userId) {
            const addRecentViewedQuery = `INSERT INTO recent_viewed_products (userId, prodid) VALUES (?, ?)`;
            db.query(addRecentViewedQuery, [userId, prodid], (err) => {
                if (err) {
                    console.error("Error adding product to recent viewed:", err);
                }
            });
        }

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

app.get('/recent-products', (req, res) => {
    const userId = req.session.userId;  // 로그인된 사용자의 ID 가져오기

    if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 최근 본 제품 5개를 시간순으로 조회
    const query = `
        SELECT p.*
        FROM recent_viewed_products rv
        JOIN Product p ON rv.prodid = p.prodid
        WHERE rv.userId = ?
        ORDER BY rv.viewed_at DESC
        LIMIT 6
    `;

    db.query(query, [userId], (err, products) => {
        if (err) {
            console.error("Error fetching recent viewed products:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        res.json(products);
    });
});
app.post('/api/check-userId', async (req, res) => {
    const { userId } = req.body;  // Get userId from the body of the request

    if (!userId) {
        return res.status(400).json({ success: false, message: "아이디를 입력하세요." });
    }

    try {
        // db.query를 Promise로 래핑
        const result = await new Promise((resolve, reject) => {
            db.query('SELECT count(*) AS count FROM users WHERE userid = ?', [userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // 결과를 확인
        const count = result[0].count;
        console.log(result);
        console.log(count);

        // 결과에 따라 응답
        if (count > 0) {
            return res.status(200).json({ success: false, message: "이미 존재하는 아이디입니다." });
        } else {
            return res.status(200).json({ success: true, message: "사용 가능한 아이디입니다." });
        }
    } catch (error) {
        console.error("Error checking userId:", error);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
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
        const { userid, userpw, profileimg, money } = req.body;

        const query = 'SELECT * FROM users WHERE userid = ? AND userpw = ?';
        db.query(query, [userid, userpw, profileimg, money], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (results.length > 0) {
                req.session.userId = userid;
                req.session.name = results[0].name;
                req.session.profileimg = results[0].profileimg;
                req.session.money = results[0].money;
                req.session.phonenumber = results[0].phonenumber;

                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).json({ success: false, message: 'Session save error' });
                    }
                    res.json({
                        success: true,
                        name: results[0].name,
                        profileimg : results[0].profileimg,
                        phonenumber: results[0].phonenumber,
                        money : results[0].money,
                        message: '로그인 성공' });
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
        const userId = req.session.userId;

        const query = 'SELECT money FROM users WHERE userId = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('DB 쿼리 오류:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length > 0) {
                const money = results[0].money;
                res.json({
                    success: true,
                    userId: req.session.userId,
                    name: req.session.name,
                    profileimg: req.session.profileimg,
                    phonenumber: req.session.phonenumber,
                    money: money
                });
            } else {
                console.log("사용자가 존재하지 않음");
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        });
    } else {
        console.log("로그인되지 않은 상태");
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
        return res.json({
            loggedIn: true,
            userId: req.session.userId,
            profileimg : req.session.profileimg,
            money : req.session.money
        });
    } else {
        // 로그인되지 않았으면 false 반환
        return res.json({ loggedIn: false });
    }
});

app.post("/api/charge", (req, res) => {
    const { userId, chargeAmount } = req.body;

    // 금액이 0 이상인 경우에만 처리
    if (chargeAmount > 0) {
        // 현재 사용자의 money 필드를 업데이트하는 SQL 쿼리
        const query = 'UPDATE users SET money = money + ? WHERE userId = ?';

        // 쿼리 실행
        db.query(query, [chargeAmount, userId], (err, results) => {
            if (err) {
                console.error('DB 업데이트 오류:', err);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }

            if (results.affectedRows > 0) {
                // 충전 성공 시
                return res.json({ success: true, message: '충전 완료' });
            } else {
                // 사용자가 존재하지 않는 경우
                return res.status(404).json({ success: false, message: '유저가 존재하지 않거나 충전 실패' });
            }
        });
    } else {
        return res.status(400).json({ success: false, message: '올바른 금액을 입력하세요.' });
    }
});

app.post('/api/deductMoney', (req, res) => {
    const { amount, products, startDate } = req.body;  // The amount to deduct, products, and startDate
    const userId = req.session.userId;  // Logged-in user's ID

    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }

    // Fetch the user's current money and prodlist
    db.query('SELECT money, prodlist FROM users WHERE userid = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user money:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
        }

        const currentMoney = results[0].money;
        const prodlist = results[0].prodlist ? JSON.parse(results[0].prodlist) : []; // Ensure prodlist is parsed properly
        console.log('Current Money:', currentMoney);
        // Check if user has enough money
        if (currentMoney < amount) {
            console.log('잔액 부족:', amount, currentMoney);
            return res.status(400).json({ success: false, message: '잔액이 부족합니다.' });
        }

        // Deduct money from the user's balance
        const newMoney = currentMoney - amount;
        db.query('UPDATE users SET money = ? WHERE userid = ?', [newMoney, userId], (err) => {
            if (err) {
                console.error('Error updating user money:', err);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }

            // Insert the purchased products into buy_product table with the startdate
            const productValues = products.map((prodid) => [userId, prodid, startDate]); // Ensure startDate is included
            db.query('INSERT INTO buy_product (userid, prodid, startdate) VALUES ?', [productValues], (err) => {
                if (err) {
                    console.error('Error inserting into buy_product:', err);
                    return res.status(500).json({ success: false, message: '서버 오류' });
                }

                // Remove purchased products from prodlist
                const updatedProdlist = prodlist.filter((id) => !products.includes(id)); // Filter out products that were bought

                // Update the prodlist in the users table
                db.query('UPDATE users SET prodlist = ? WHERE userid = ?', [JSON.stringify(updatedProdlist), userId], (err) => {
                    if (err) {
                        console.error('Error updating prodlist:', err);
                        return res.status(500).json({ success: false, message: '서버 오류' });
                    }

                    // Success response after all queries are completed
                    return res.status(200).json({ success: true, message: '결제가 완료되었습니다.' });
                });
            });
        });
    });
});

app.post('/recently-viewed', (req, res) => {
    const { productId, userId } = req.body;

    if (!userId || !productId) {
        return res.status(400).send("Missing productId or userId");
    }

    const query = "INSERT INTO recent_viewed_products (userId, prodid) VALUES (?, ?)";
    db.query(query, [userId, productId], (err) => {
        if (err) {
            console.error("Error saving recent viewed product:", err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).send("Product added to recent viewed");
    });
});

app.get('/api/user/subscriptions', (req, res) => {
    const userId = req.session.userId;  // 로그인된 사용자의 ID 가져오기

    if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // buy_product 테이블에서 사용자가 구독한 제품들의 정보 가져오기
    const query = `
        SELECT p.*, b.startdate
        FROM buy_product b
        JOIN product p ON b.prodid = p.prodid
        WHERE b.userid = ?
        ORDER BY b.startdate DESC  -- 구독한 날짜 순으로 정렬
        LIMIT 6  -- 최근 6개의 구독 제품만 반환
    `;

    db.query(query, [userId], (err, products) => {
        if (err) {
            console.error("Error fetching subscribed products:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // 구독된 제품 정보를 반환
        res.json(products);
    });
});

app.post('/api/user/interest', async (req, res) => {
    const { userId, prodid } = req.body;  // 사용자 ID와 제품 ID를 받아옴

    if (!userId || !prodid) {
        return res.status(400).json({ success: false, message: '필요한 데이터가 없습니다.' });
    }

    try {
        const query = 'INSERT INTO interest_products (userid, prodid) VALUES (?, ?)';
        await db.query(query, [userId, prodid]);

        res.json({ success: true, message: '관심 상품에 추가되었습니다.' });
    } catch (error) {
        console.error('Error adding product to interest list:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

app.post('/api/user/remove-interest', async (req, res) => {
    const { userId, prodid } = req.body;  // 사용자 ID와 제품 ID를 받아옴

    if (!userId || !prodid) {
        return res.status(400).json({ success: false, message: '필요한 데이터가 없습니다.' });
    }

    try {
        // 관심 상품에서 제거
        const query = 'DELETE FROM interest_products WHERE userid = ? AND prodid = ?';
        await db.query(query, [userId, prodid]);

        res.json({ success: true, message: '관심 상품에서 제거되었습니다.' });
    } catch (error) {
        console.error('Error removing product from interest list:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});


app.get('/api/user/liked-items', (req, res) => {
    const userId = req.session.userId;  // 로그인된 사용자의 ID 가져오기

    if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 관심 제품 목록을 가져오는 쿼리 (예시로 user_liked_products 테이블 사용)
    const query = `
        SELECT p.*
        FROM interest_products i
        JOIN product p ON i.prodid = p.prodid
        WHERE i.userid = ?
        LIMIT 6  -- 최근 6개의 관심 제품만 반환
    `;

    db.query(query, [userId], (err, products) => {
        if (err) {
            console.error("Error fetching liked products:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // 관심 제품 정보를 반환
        res.json(products);
    });
});

app.post('/api/buy-now', async (req, res) => {
    const { prodid } = req.body;
    const userId = req.session.userId; // 세션에서 로그인 사용자 ID 가져오기

    if (!userId) {
        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    try {
        // `users` 테이블의 `buylist` 컬럼에 단일 prodid 저장
        await db.query(`
            UPDATE users SET buylist = ? WHERE userid = ?
        `, [prodid, userId]); // buylist에 단일 prodid를 설정

        res.json({ success: true, message: "구매 요청이 처리되었습니다." });
    } catch (error) {
        console.error("Error updating buylist:", error);
        res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
});

app.get('/api/buy-product', (req, res) => {
    // Check if user is logged in by verifying session
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
    }

    const userId = req.session.userId;  // Retrieve userId from session
    console.log("Session object:", req.session);

    // Query to get the user's buylist (a single prodid in this case)
    const getBuylistQuery = `SELECT buylist FROM users WHERE userid = ?`;
    console.log("User ID from session:", userId);  // Log the userId to ensure it's correct

    db.query(getBuylistQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user's buylist:", err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        // If no buylist is found, return an error
        if (!results[0] || !results[0].buylist) {
            console.log("No buylist found for this user.");
            return res.status(404).json({ success: false, message: "구매할 제품이 없습니다." });
        }

        // Get the buylist value (a single prodid, which is stored as TEXT)
        const buylist = results[0].buylist;

        // Convert the buylist to an integer (prodid) since it's stored as a string
        const prodid = parseInt(buylist, 10); // Convert the string to a number

        if (isNaN(prodid)) {
            return res.status(400).json({ success: false, message: "잘못된 prodid 형식입니다." });
        }

        // Query to fetch product details for the prodid
        const getProductQuery = `SELECT * FROM Product WHERE prodid = ?`;

        console.log("Executing query:", getProductQuery);  // Log the query for debugging

        db.query(getProductQuery, [prodid], (err, products) => {
            if (err) {
                console.error("Error fetching product details:", err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }

            // If no product is found, return an empty array
            if (products.length === 0) {
                console.log("No products found for this prodid.");
                return res.status(404).json({ success: false, message: "제품 정보를 찾을 수 없습니다." });
            }

            // Return the product details to the frontend
            res.json(products);
        });
    });
});







// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
