const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
let todaySettings = {}; // { userId: todaySetting } 형태로 저장
const bcrypt = require('bcrypt');
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
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'src/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // 파일 저장 위치
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // 파일 확장자
        const filename = Date.now() + ext; // 고유한 파일명 (타임스탬프 + 확장자)
        cb(null, filename); // 파일명 설정
    }
});

const upload = multer({ storage: storage });


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
        const baseUrl = "http://localhost:8080";

        // URL이 상대 경로인 경우 baseUrl 추가
        const addBaseUrlIfNeeded = (url) => {
            if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                return `${baseUrl}${url}`;
            }
            return url; // URL이 이미 전체 경로라면 그대로 반환
        };

        product.iconpicture = addBaseUrlIfNeeded(product.iconpicture);
        product.prodpicture = addBaseUrlIfNeeded(product.prodpicture);
        product.prodcontent1 = addBaseUrlIfNeeded(product.prodcontent1);
        product.prodcontent2 = addBaseUrlIfNeeded(product.prodcontent2);
        product.prodcontent3 = addBaseUrlIfNeeded(product.prodcontent3);
        product.prodcontent4 = addBaseUrlIfNeeded(product.prodcontent4);

        // facility_pictures 처리
        if (product.facility_pictures) {
            try {
                const pictures = JSON.parse(product.facility_pictures);
                product.facility_pictures = pictures.map(addBaseUrlIfNeeded);
            } catch (e) {
                console.error("Error parsing facility_pictures:", e);
                product.facility_pictures = [];
            }
        }

        // 최근 본 제품에 추가
        if (userId) {
            const addRecentViewedQuery = `INSERT INTO recent_viewed_products (userId, prodid) VALUES (?, ?)`;
            db.query(addRecentViewedQuery, [userId, prodid], (err) => {
                if (err) {
                    console.error("Error adding product to recent viewed:", err);
                }
            });
        }

        res.json(product);
    });
});


// 카테고리와 제품 조회 API
app.get('/product_Main/:category', (req, res) => {
    const category = req.params.category;
    const sortOption = req.query.sort || 'prodrating'; // 기본 정렬 기준
    const sortOrder = 'DESC'; // 내림차순 정렬
    const baseUrl = "http://localhost:8080"; // Base URL

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

            // URL이 상대 경로인 경우 baseUrl 추가
            const addBaseUrlIfNeeded = (url) => {
                if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                    return `${baseUrl}${url}`;
                }
                return url;
            };

            const productsWithImagePaths = productResults.map(product => ({
                ...product,
                iconpicture: addBaseUrlIfNeeded(product.iconpicture),
                prodpicture: addBaseUrlIfNeeded(product.prodpicture),
            }));

            res.json({
                category: categoryResults[0],
                products: productsWithImagePaths
            });
        });
    });
});

app.get('/recent-products', (req, res) => {
    const userId = req.session?.userId;  // 로그인된 사용자의 ID 가져오기

    if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const baseUrl = "http://localhost:8080"; // Base URL for 이미지 경로

    // 최근 본 제품 6개를 시간순으로 조회
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

        // URL이 상대 경로인 경우 baseUrl 추가
        const addBaseUrlIfNeeded = (url) => {
            if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                return `${baseUrl}${url}`;
            }
            return url;
        };

        const productsWithImagePaths = products.map(product => ({
            ...product,
            iconpicture: addBaseUrlIfNeeded(product.iconpicture),
            prodpicture: addBaseUrlIfNeeded(product.prodpicture),
        }));

        res.json(productsWithImagePaths);
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

    const query = 'INSERT INTO users (userId, userpw, name, email, phoneNumber, address, userType, money) VALUES (?, ?, ?, ?, ?, ?, ?,0)';
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
            // 출석 정보 업데이트
            const currentDate = new Date();
            const currentDay = currentDate.getDate(); // 일(day)만 추출

            // 기존 출석 정보 가져오기
            const getAttendanceQuery = `SELECT attendance FROM attendance WHERE userid = ?`;
            db.query(getAttendanceQuery, [userid], (getErr, getResults) => {
                if (getErr) {
                    console.error('Error fetching attendance:', getErr);
                    return res.status(500).json({ message: '출석 정보 조회 실패' });
                }

                // 기존 출석 정보가 있으면 JSON으로 파싱, 없으면 빈 배열로 시작
                let attendance = [];
                if (getResults.length > 0 && getResults[0].attendance) {
                    attendance = JSON.parse(getResults[0].attendance); // 기존 출석 정보 배열로 파싱
                }
                // 새로운 출석 날짜가 이미 존재하는지 확인
                if (!attendance.includes(currentDay)) {
                    attendance.push(currentDay); // 새로운 날짜 추가
                }
                // 업데이트 쿼리 (출석 정보 저장)
                const updateAttendanceQuery = `UPDATE attendance SET attendance = ? WHERE userid = ?;`;
                db.query(updateAttendanceQuery, [ JSON.stringify(attendance),userid], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating attendance:', updateErr);
                        return res.status(500).json({ message: '출석 정보 저장 실패' });
                    }

                    // 세션 저장 후 응답
                    req.session.save(err => {
                        if (err) {
                            console.error('Session save error:', err);
                            return res.status(500).json({ success: false, message: 'Session save error' });
                        }
                        res.json({
                            success: true,
                            name: results[0].name,
                            profileimg: results[0].profileimg,
                            phonenumber: results[0].phonenumber,
                            money: results[0].money,
                            message: '로그인 성공'
                        });
                    });
                });
            });
        } else {
            res.json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
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

        const query = 'SELECT money,email,userpw, userType, alertlist FROM users WHERE userId = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('DB 쿼리 오류:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length > 0) {
                const money = results[0].money;
                const email = results[0].email;
                const userpw = results[0].userpw;
                const userType = results[0].userType;
                const alertlist = results[0].alertlist ? JSON.parse(results[0].alertlist) : [];
                const profileImgUrl = req.session.profileimg || '/uploads/default-profile.png';
                res.json({
                    success: true,
                    userId: req.session.userId,
                    name: req.session.name,
                    profileimg: profileImgUrl,
                    phonenumber: req.session.phonenumber,
                    money: money,
                    userpw: userpw,
                    email: email,
                    userType: userType,
                    alertlist: alertlist
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

app.get('/api/attendance/:userId', (req, res) => {
    const { userId } = req.params;

    // 쿼리 실행
    const getAttendanceQuery = `SELECT attendance FROM attendance WHERE userid = ?`;

    db.query(getAttendanceQuery, [userId], (err, results) => {
        if (err) {
            console.error("출석 데이터 로드 오류:", err);
            return res.status(500).json({ message: '서버 오류' });
        }

        if (results.length > 0) {
            // 출석 정보가 있으면 문자열을 배열로 파싱
            let attendanceDays = results[0]?.attendance ? JSON.parse(results[0].attendance) : [];

            // 출석일을 1~31 범위로 필터링
            const days = attendanceDays.filter(day => day >= 1 && day <= 31);

            // 출석일 반환
            res.json({ success: true, days });
        } else {
            res.status(404).json({ success: false, message: '출석 데이터가 없습니다.' });
        }
    });
});

app.get('/api/suggestions', async (req, res) => {
    const { query } = req.query; // 검색어

    try {
        // 쿼리 실행: prodtitle 뿐만 아니라 다른 필드도 가져오도록 수정
        db.query(
            `SELECT * FROM product WHERE prodtitle LIKE ? LIMIT 5`,
            [`%${query}%`],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Server error');
                }

                // 결과가 없으면 빈 배열 반환
                if (results.length > 0) {
                    // 결과에서 필요한 필드만 추출하여 반환
                    const suggestions = results.map(result => ({
                        prodid: result.prodid,
                        prodtitle: result.prodtitle,
                        prodprice: result.prodprice,
                        prodaddress: result.prodaddress,
                        prodrating: result.prodrating,
                        iconpicture: result.iconpicture,
                    }));
                    return res.json({ suggestions });
                } else {
                    return res.json({ suggestions: [] });
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// 사용자 아이디 찾기 API
app.post('/api/findUserId', (req, res) => {
    const { name, phoneNumber } = req.body;

    // 콘솔에 입력 데이터 출력 (디버깅용)
    console.log('입력 데이터:', { name, phoneNumber });

    // 이름과 전화번호가 전달되었는지 확인
    if (!name || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: '이름과 전화번호를 모두 입력해주세요.',
        });
    }

    // SQL 쿼리: 이름과 전화번호로 사용자 검색
    const query = 'SELECT userid FROM users WHERE name = ? AND phonenumber = ?';

    db.query(query, [name, phoneNumber], (err, results) => {
        if (err) {
            console.error('쿼리 오류:', err);
            return res.status(500).json({
                success: false,
                message: '서버 오류가 발생했습니다.',
            });
        }

        // 결과 처리: 아이디가 존재하면 응답, 없으면 에러 메시지
        if (results.length > 0) {
            const userId = results[0].userid; // `userid` 컬럼에서 값 가져오기
            console.log('찾은 아이디:', userId); // 디버깅용 로그
            return res.json({
                success: true,
                userId: userId,
            });
        } else {
            console.log('일치하는 사용자 없음.');
            return res.status(404).json({
                success: false,
                message: '이름과 전화번호가 일치하는 아이디가 없습니다.',
            });
        }
    });
});

app.post('/api/resetPassword', (req, res) => {
    const { userId, name, phoneNumber, tempPassword } = req.body;

    // 유효성 검사
    if (!userId || !name || !phoneNumber || !tempPassword) {
        return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
    }

    // SQL 쿼리: ID, 이름, 전화번호로 사용자 검증
    const query = 'SELECT * FROM users WHERE userid = ? AND name = ? AND phonenumber = ?';
    db.query(query, [userId, name, phoneNumber], (err, results) => {
        if (err) {
            console.error('쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }

        if (results.length > 0) {
            // 일치하는 사용자가 있으면 비밀번호 업데이트
            const updateQuery = 'UPDATE users SET userpw = ? WHERE userid = ?';
            db.query(updateQuery, [tempPassword, userId], (err, updateResult) => {
                if (err) {
                    console.error('비밀번호 업데이트 오류:', err);
                    return res.status(500).json({ success: false, message: '비밀번호 업데이트에 실패했습니다.' });
                }

                res.json({ success: true, message: '비밀번호가 재설정되었습니다.', tempPassword });
            });
        } else {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
    });
});

// "오늘 하루 보지 않기" 상태 저장
function resetTodaySettingsAtMidnight() {
    const now = new Date();
    const timeUntilMidnight = new Date(now.setHours(24, 0, 0, 0)) - new Date(); // 자정까지 남은 시간 계산

    setTimeout(() => {
        // 자정이 되면 todaySettings 객체를 초기화
        todaySettings = {};

        // 매일 자정마다 this function이 실행되도록 반복
        setInterval(() => {
            todaySettings = {}; // todaySettings 초기화
            console.log('오늘 하루 보지 않기 설정이 초기화되었습니다.');
        }, 24 * 60 * 60 * 1000); // 24시간마다 실행
    }, timeUntilMidnight);
}

// 서버 시작 시 자정 리셋 함수 호출
resetTodaySettingsAtMidnight();

// 오늘 하루 보지 않기 상태 저장
app.post('/api/attendance/today', (req, res) => {
    const { userId, today } = req.body;

    // 서버 메모리에 today 설정 저장
    todaySettings[userId] = today;
    console.log('세션에 저장된 today 값:', req.session.today);
    res.json({ success: true });
});

// "오늘 하루 보지 않기" 상태 조회
app.get('/api/attendance/today/:userId', (req, res) => {
    const { userId } = req.params;

    // 서버 메모리에서 오늘 하루 보지 않기 설정을 조회
    const today = todaySettings[userId] || 0; // 기본값 0 (설정 안됨)
    console.log('세션에서 조회된 today 값:', today);

    res.json({ success: true, today });
});
// 자정마다 서버 메모리에서 모든 사용자에 대해 today 값을 0으로 초기화
setInterval(() => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    // 자정이 되면 today 값을 0으로 초기화
    if (currentHour === 0 && currentMinute === 0) {
        todaySettings = {}; // 모든 사용자에 대해 today 설정 초기화
        console.log('오늘 하루 보지 않기 상태 초기화');
    }
}, 60000); // 1분마다 확인

app.get('/cart-products', (req, res) => {
    // Check if user is logged in by verifying session
    if (!req.session || !req.session.userId) {
        // If user is not logged in, return an error
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = req.session.userId;  // Retrieve userId from session
    const baseUrl = "http://localhost:8080"; // Base URL for 이미지 경로

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

            // URL이 상대 경로인 경우 baseUrl 추가
            const addBaseUrlIfNeeded = (url) => {
                if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                    return `${baseUrl}${url}`;
                }
                return url;
            };

            // 각 제품에 이미지 경로 추가
            const productsWithImagePaths = products.map(product => ({
                ...product,
                iconpicture: addBaseUrlIfNeeded(product.iconpicture),
                prodpicture: addBaseUrlIfNeeded(product.prodpicture),
            }));

            // Return the product details to the frontend
            res.json(productsWithImagePaths);
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
    const userId = req.session?.userId;  // 로그인된 사용자의 ID 가져오기

    if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const baseUrl = "http://localhost:8080"; // Base URL for 이미지 경로

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

        // URL이 상대 경로인 경우 baseUrl 추가
        const addBaseUrlIfNeeded = (url) => {
            if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                return `${baseUrl}${url}`;
            }
            return url;
        };

        // 각 제품에 이미지 경로 추가
        const productsWithImagePaths = products.map(product => ({
            ...product,
            iconpicture: addBaseUrlIfNeeded(product.iconpicture),
            prodpicture: addBaseUrlIfNeeded(product.prodpicture),
        }));

        // 구독된 제품 정보를 반환
        res.json(productsWithImagePaths);
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
    const userId = req.session?.userId;  // 로그인된 사용자의 ID 가져오기

    if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const baseUrl = "http://localhost:8080"; // Base URL for 이미지 경로

    // 관심 제품 목록을 가져오는 쿼리
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

        // URL이 상대 경로인 경우 baseUrl 추가
        const addBaseUrlIfNeeded = (url) => {
            if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                return `${baseUrl}${url}`;
            }
            return url;
        };

        // 각 제품의 이미지 경로를 변환
        const productsWithImagePaths = products.map(product => ({
            ...product,
            iconpicture: addBaseUrlIfNeeded(product.iconpicture),
            prodpicture: addBaseUrlIfNeeded(product.prodpicture),
        }));

        // 관심 제품 정보를 반환
        res.json(productsWithImagePaths);
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

    const userId = req.session.userId; // Retrieve userId from session
    const baseUrl = "http://localhost:8080"; // Base URL for 이미지 경로

    // Query to get the user's buylist (a single prodid in this case)
    const getBuylistQuery = `SELECT buylist FROM users WHERE userid = ?`;

    db.query(getBuylistQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching user's buylist:", err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        // If no buylist is found, return an error
        if (!results[0] || !results[0].buylist) {
            return res.status(404).json({ success: false, message: "구매할 제품이 없습니다." });
        }

        const buylist = results[0].buylist;
        const prodid = parseInt(buylist, 10); // Convert the string to a number

        if (isNaN(prodid)) {
            return res.status(400).json({ success: false, message: "잘못된 prodid 형식입니다." });
        }

        // Query to fetch product details for the prodid
        const getProductQuery = `SELECT * FROM Product WHERE prodid = ?`;

        db.query(getProductQuery, [prodid], (err, products) => {
            if (err) {
                console.error("Error fetching product details:", err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }

            // If no product is found, return an empty array
            if (products.length === 0) {
                return res.status(404).json({ success: false, message: "제품 정보를 찾을 수 없습니다." });
            }

            // URL이 상대 경로인 경우 baseUrl 추가
            const addBaseUrlIfNeeded = (url) => {
                if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                    return `${baseUrl}${url}`;
                }
                return url;
            };

            // 각 제품의 이미지 경로를 변환
            const productsWithImagePaths = products.map(product => ({
                ...product,
                iconpicture: addBaseUrlIfNeeded(product.iconpicture),
                prodpicture: addBaseUrlIfNeeded(product.prodpicture),
            }));

            // Return the product details to the frontend
            res.json(productsWithImagePaths[0]); // Return single product since prodid is unique
        });
    });
});

app.post('/api/upload', upload.single('profileImg'), (req, res) => {
    try {
        // 업로드된 이미지의 경로
        const filePath = `/uploads/${req.file.filename}`;

        // 세션에 프로필 이미지 경로 저장
        req.session.profileimg = filePath;

        res.status(200).send({ url: filePath });
    } catch (error) {
        res.status(500).send({ message: 'Error uploading file', error });
    }
});

app.put('/api/updateProfile', (req, res) => {
    const { profileimg } = req.body;
    const userId = req.session.userId;  // 세션에서 userId 가져오기

    // userId가 세션에 없을 경우 처리
    if (!userId) {
        return res.status(401).send({ message: 'User not logged in' });
    }

    if (!profileimg) {
        return res.status(400).send({ message: 'No profile image provided' });
    }

    // 쿼리 실행 전 로그 출력
    console.log('Received profileimg:', profileimg);
    console.log('User ID:', userId);

    const query = 'UPDATE users SET profileimg = ? WHERE userid = ?';
    db.query(query, [profileimg, userId], (err, result) => {
        if (err) {
            console.error('Database error:', err);  // DB 오류 출력
            return res.status(500).send({ message: 'Database update error', error: err });
        }

        // 업데이트 결과 확인
        console.log('Update result:', result);  // 쿼리 실행 결과 확인

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found or profile image not updated' });
        }

        res.status(200).send({ message: 'Profile image updated successfully' });
    });
});

const util = require('util');
const query = util.promisify(db.query).bind(db);  // MySQL의 콜백을 Promise로 변경

app.put('/api/updateEmail', async (req, res) => {
    const { email } = req.body;  // 새로운 이메일 값
    const userId = req.session.userId;  // 로그인된 사용자 ID (세션에서 가져오기)

    if (!email || !userId) {
        return res.status(400).send({ message: 'Email and User ID are required' });
    }

    const query = 'UPDATE users SET email = ? WHERE userid = ?';  // 이메일 업데이트 쿼리

    try {
        db.query(query, [email, userId], (err, result) => {
            if (err) {
                console.error('Error updating email:', err);
                return res.status(500).send({ message: 'Server error occurred while updating email.' });
            }

            if (result.affectedRows === 1) {
                return res.status(200).send({ message: 'Email updated successfully' });
            } else {
                return res.status(400).send({ message: 'Email update failed. User not found or invalid email.' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send({ message: 'Unexpected error occurred.' });
    }
});

// 현재 비밀번호 확인
app.post('/api/checkPassword', (req, res) => {
    if (req.session && req.session.userId) {
        const userId = req.session.userId;
        const currentPassword = req.body.currentPassword;

        // 비밀번호 확인을 위한 쿼리
        const query = 'SELECT userpw FROM users WHERE userId = ?';

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('DB 쿼리 오류:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length > 0) {
                const storedPassword = results[0].userpw; // DB에 저장된 비밀번호

                // 입력된 비밀번호와 DB의 비밀번호 비교 (단순 비교로 처리)
                if (currentPassword === storedPassword) {
                    return res.json({ success: true, isCorrect: true });
                } else {
                    return res.json({ success: false, isCorrect: false });
                }
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

app.put('/api/updatePassword', (req, res) => {
    const { currentPassword, newPassword } = req.body;  // 현재 비밀번호와 새 비밀번호
    const userId = req.session.userId;  // 세션에서 로그인한 사용자 ID

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: '새 비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // 1. 현재 비밀번호 확인
    const query = 'SELECT userpw FROM users WHERE userId = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('DB 쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        if (results.length > 0) {
            const storedPassword = results[0].userpw;  // DB에서 가져온 저장된 비밀번호

            // 2. 현재 비밀번호가 맞는지 확인
            if (currentPassword !== storedPassword) {
                return res.status(400).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
            }

            // 3. 새 비밀번호로 업데이트
            const updateQuery = 'UPDATE users SET userpw = ? WHERE userid = ?';
            db.query(updateQuery, [newPassword, userId], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('DB 업데이트 오류:', updateErr);
                    return res.status(500).json({ success: false, message: '비밀번호 업데이트 중 오류가 발생했습니다.' });
                }

                if (updateResult.affectedRows === 1) {
                    return res.status(200).json({ success: true, message: '비밀번호가 성공적으로 업데이트되었습니다.' });
                } else {
                    return res.status(400).json({ success: false, message: '비밀번호 업데이트에 실패했습니다.' });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: '사용자가 존재하지 않습니다.' });
        }
    });
});

app.delete("/api/users", (req, res) => {
    const userId = req.session?.userId;

    if (!userId) {
        return res.status(401).json({ error: "로그인되지 않았거나 유효하지 않은 세션입니다." });
    }

    const query = "DELETE FROM users WHERE userid = ?";
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("회원 삭제 중 오류 발생:", err);
            return res.status(500).json({ error: "회원 삭제 중 오류가 발생했습니다." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "해당 회원을 찾을 수 없습니다." });
        }

        // 세션 종료
        req.session.destroy((err) => {
            if (err) {
                console.error("세션 종료 중 오류 발생:", err);
                return res.status(500).json({ error: "세션 종료 중 오류가 발생했습니다." });
            }
            res.status(200).json({ message: "회원 삭제 및 로그아웃 완료!" });
        });
    });
});

app.post('/api/inquiry', (req, res) => {
    const { userId, phone, category, inqtitle, inqcontent, inqdate, id } = req.body;
    const name = req.session.name;

    // 모든 필드가 채워졌는지 확인
    if (!userId || !phone || !category || !inqtitle || !inqcontent || !inqdate) {
        return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
    }

    // MySQL INSERT 쿼리 (product_inquiry에 데이터 추가)
    const sql = `
        INSERT INTO product_inquiry (userid, phone, category, inqtitle, inqcontent, inqdate, prodid, name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [userId, phone, category, inqtitle, inqcontent, inqdate, id, name], (err, results) => {
        if (err) {
            console.error('문의 저장 중 오류 발생:', err);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }

        // product 테이블에서 prodid에 해당하는 userid 찾기
        const getProductUserSql = 'SELECT userid FROM product WHERE prodid = ?';
        db.query(getProductUserSql, [id], (err, productResults) => {
            if (err) {
                console.error('제품 정보 조회 중 오류 발생:', err);
                return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
            }

            if (productResults.length > 0) {
                const productUserId = productResults[0].userid;

                // 해당 userid에 맞는 users 테이블에서 alertlist 조회
                const getUserAlertListSql = 'SELECT alertlist FROM users WHERE userid = ?';
                db.query(getUserAlertListSql, [productUserId], (err, userResults) => {
                    if (err) {
                        console.error('사용자 정보 조회 중 오류 발생:', err);
                        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
                    }

                    if (userResults.length > 0) {
                        let alertlist = userResults[0].alertlist ? JSON.parse(userResults[0].alertlist) : [];

                        // prodid가 alertlist에 이미 없으면 추가
                        if (!alertlist.includes(id.toString())) {
                            alertlist.push(id.toString());
                        }

                        // 업데이트 쿼리 실행
                        const updateAlertListSql = 'UPDATE users SET alertlist = ? WHERE userid = ?';
                        db.query(updateAlertListSql, [JSON.stringify(alertlist), productUserId], (err, updateResults) => {
                            if (err) {
                                console.error('alertlist 업데이트 중 오류 발생:', err);
                                return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
                            }

                            return res.status(200).json({ success: true, message: '문의가 성공적으로 저장되었습니다.' });
                        });
                    } else {
                        return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
                    }
                });
            } else {
                return res.status(404).json({ success: false, message: '해당 제품을 찾을 수 없습니다.' });
            }
        });
    });
});



app.get('/api/product_inquiry/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT
            prodid, 
            category, 
            inqtitle, 
            inqcontent, 
            inqdate, 
            phone, 
            userid, 
            name, 
            ansertitle, 
            ansercontent,
            CASE 
                WHEN ansertitle IS NOT NULL AND ansercontent IS NOT NULL THEN '답변 완료'
                ELSE '답변 대기 중'
            END AS status
        FROM product_inquiry
        WHERE prodid = ?
        ORDER BY inqdate DESC
        LIMIT 3;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('쿼리 실행 오류:', err);
            res.status(500).json({ error: '데이터베이스 오류' });
            return;
        }
        res.json(results); // 결과 반환
    });
});


app.get('/category/products', (req, res) => {
    const category = req.query.category; // 프론트에서 전달된 category 값
    const baseUrl = "http://localhost:8080"; // Base URL for 이미지 경로

    const query = `
        SELECT prodid, iconpicture, prodtitle 
        FROM product 
        WHERE category = ? 
        ORDER BY prodid DESC 
        LIMIT 3
    `;

    db.query(query, [category], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // URL이 상대 경로인 경우 baseUrl 추가
            const addBaseUrlIfNeeded = (url) => {
                if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                    return `${baseUrl}${url}`;
                }
                return url;
            };

            // 각 결과의 iconpicture 경로 변환
            const resultsWithImagePaths = results.map(product => ({
                ...product,
                iconpicture: addBaseUrlIfNeeded(product.iconpicture),
            }));

            res.json(resultsWithImagePaths);
        }
    });
});


app.post('/api/products', upload.fields([
    { name: 'iconpicture' },
    { name: 'prodpicture' },
    { name: 'prodcontent1' },
    { name: 'prodcontent2' },
    { name: 'prodcontent3' },
    { name: 'prodcontent4' },
    { name: 'facility_pictures' }
]), (req, res) => {
    // Body와 File로부터 값을 가져옴
    const { prodtitle, category, prodsmtitle, prodaddress, address, prodprice, prodprice2, prodprice3, prodprice4, userId, description, facilities } = req.body;

    // 파일이 있을 경우 업로드 경로 설정
    const iconPicture = req.files.iconpicture ? `/uploads/${req.files.iconpicture[0].filename}` : null;
    const prodPicture = req.files.prodpicture ? `/uploads/${req.files.prodpicture[0].filename}` : null;
    const prodContent = [
        req.files.prodcontent1 ? `/uploads/${req.files.prodcontent1[0].filename}` : null,
        req.files.prodcontent2 ? `/uploads/${req.files.prodcontent2[0].filename}` : null,
        req.files.prodcontent3 ? `/uploads/${req.files.prodcontent3[0].filename}` : null,
        req.files.prodcontent4 ? `/uploads/${req.files.prodcontent4[0].filename}` : null,
    ];
    const facilityPictures = req.body.facility_pictures ? JSON.parse(req.body.facility_pictures) : [];

    const selectedFacilities = facilities ? JSON.parse(facilities) : [];
    // MySQL에 데이터 삽입
    const sql = `
    INSERT INTO product (
        userid, category, prodtitle, iconpicture, 
        prodcontent1, prodcontent2, prodcontent3, prodcontent4,
        prodsmtitle, prodaddress, address, prodpicture, prodprice, 
        prodprice2, prodprice3, prodprice4, facility_pictures, prodrating, description, selectedFacilities
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        userId, category, prodtitle, iconPicture, prodContent[0], prodContent[1], prodContent[2], prodContent[3],
        prodsmtitle, prodaddress, address,
        prodPicture, prodprice, prodprice2, prodprice3, prodprice4,
        JSON.stringify(facilityPictures), 0, description, JSON.stringify(selectedFacilities)
    ];

    // MySQL 쿼리 실행
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).json({ message: "제품 등록 실패", error: err });
        }
        res.status(200).json({ message: "제품이 성공적으로 등록되었습니다.", productId: result.insertId });
    });
});

app.get('/user/products/count', (req, res) => {
    const userId = req.session.userId; // 로그인한 유저의 userId

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    const query = "SELECT COUNT(*) AS productCount FROM Product WHERE userId = ?";
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching product count:", err);
            return res.status(500).send("Internal server error");
        }

        const productCount = results[0].productCount;
        res.json({ productCount });
    });
});

app.post('/alertlist/remove', async (req, res) => {
    // Check if user is logged in by verifying session
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = req.session.userId; // Retrieve userId from session
    const { prodid } = req.body; // Get prodid from request body

    console.log("Product ID to remove from alertlist:", prodid); // Log the prodid

    try {
        // Get the user's alertlist
        const getAlertlistQuery = `SELECT alertlist FROM users WHERE userid = ?`;
        db.query(getAlertlistQuery, [userId], (err, results) => {
            if (err) {
                console.error("Error fetching alertlist:", err);
                return res.status(500).json({ message: "Failed to fetch alertlist" });
            }

            if (!results[0]) {
                console.log("No alertlist found for this user.");
                return res.status(404).json({ message: "Alertlist not found" });
            }

            // Parse the alertlist from the database (stored as a JSON string)
            const rawAlertlist = results[0]?.alertlist;
            console.log("Raw alertlist data:", rawAlertlist); // Log the raw alertlist

            let alertlist = [];
            try {
                alertlist = rawAlertlist ? JSON.parse(rawAlertlist) : [];
            } catch (err) {
                console.error("Error parsing alertlist JSON:", err);
                return res.status(500).json({ message: "Invalid alertlist format" });
            }

            console.log("Current alertlist after parsing:", alertlist); // Log the parsed alertlist

            // Check if the product exists in the user's alertlist
            const productIndex = alertlist.indexOf(prodid);

            if (productIndex === -1) {
                // If the product is not in the list, return an error
                return res.status(404).json({ message: "Product not found in alertlist" });
            }

            // Remove the product from the alertlist
            alertlist.splice(productIndex, 1);

            console.log("Updated alertlist after removal:", alertlist); // Log the updated alertlist

            // Update the alertlist in the database
            const updateAlertlistQuery = `UPDATE users SET alertlist = ? WHERE userid = ?`;
            db.query(updateAlertlistQuery, [JSON.stringify(alertlist), userId], (err, updateResult) => {
                if (err) {
                    console.error("Error updating alertlist:", err);
                    return res.status(500).json({ message: "Failed to update alertlist" });
                }

                console.log("Update result:", updateResult); // Log the result of the update query

                // Check if the update was successful
                if (updateResult.affectedRows === 0) {
                    console.error("No rows were updated, alertlist might not have changed.");
                    return res.status(500).json({ message: "Failed to update alertlist" });
                }

                // Return the updated alertlist to the client
                return res.json({ message: "Product removed from alertlist", updatedAlertlist: alertlist });
            });
        });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/api/packages', async (req, res) => {
    try {
        // 'category'가 'package'인 데이터 3개를 내림차순으로 가져오기
        db.query('SELECT * FROM product WHERE category = ? ORDER BY prodid DESC LIMIT 3', ['package'], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching packages');
            }
            res.json(rows);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching packages');
    }
});

app.get('/products', (req, res) => {
    // 세션에서 로그인된 사용자 ID 가져오기
    const userId = req.session.userId;  // 또는 JWT 토큰에서 userId를 추출하는 방식으로 변경

    if (!userId) {
        // 만약 userId가 없다면(로그인되지 않은 경우), 에러 응답 반환
        return res.status(401).json({ error: 'User not logged in' });
    }

    // MySQL 쿼리: 로그인된 사용자 ID에 해당하는 상품 데이터를 가져옵니다.
    const query = 'SELECT * FROM product WHERE userId = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database query failed:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        // 결과를 응답으로 반환
        res.json(results);
    });
});

app.get('/api/productsadmin', (req, res) => {
    const query = 'SELECT * FROM product';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'DB 조회 오류' });
        }
        res.json(results);
    });
});
app.get("/api/usersadmin", (req, res) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {
        if (err) {
            console.error("유저 데이터를 가져오는 데 실패했습니다:", err);
            return res.status(500).json({ error: "유저 데이터를 가져오는 데 실패했습니다." });
        }

        res.json(results);
    });
});
// 특정 유저 정보 가져오기
app.get("/api/useradmin/:id", (req, res) => {
    const userId = req.params.id;
    const query = "SELECT * FROM users WHERE userid = ?";

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("유저 정보 가져오기 실패:", err);
            return res.status(500).json({ error: "유저 정보를 가져오는 데 실패했습니다." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "해당 유저를 찾을 수 없습니다." });
        }

        res.json(results[0]);
    });
});
// 유저 정보 수정
app.put("/api/usereditadmin/:id", (req, res) => {
    const userId = req.params.id;
    const { name, phonenumber, address, email, userType, profileimg, userpw } = req.body;
    const query = `
        UPDATE users 
        SET name = ?, phonenumber = ?, address = ?, email = ?, userType = ?, profileimg = ?, userpw = ? 
        WHERE userid = ?
    `;

    db.query(query, [name, phonenumber, address, email, userType, profileimg, userpw, userId], (err, results) => {
        if (err) {
            console.error("유저 정보 수정 실패:", err);
            return res.status(500).json({ error: "유저 정보를 수정하는 데 실패했습니다." });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "해당 유저를 찾을 수 없습니다." });
        }

        res.json({ message: "유저 정보가 성공적으로 수정되었습니다." });
    });
});

// 유저 정보 삭제
app.delete("/api/useradmindelete/:id", (req, res) => {
    const userId = req.params.id;
    const query = "DELETE FROM users WHERE userid = ?";

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("유저 삭제 실패:", err);
            return res.status(500).json({ error: "유저 삭제에 실패했습니다." });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "해당 유저를 찾을 수 없습니다." });
        }

        res.json({ message: "유저 정보가 성공적으로 삭제되었습니다." });
    });
});

app.delete('/product/delete', (req, res) => {
    const { prodid } = req.query;  // URL 쿼리 파라미터에서 prodid를 가져옴
    const userId = req.session.userId; // 세션에서 userId 가져오기

    // 로그인되지 않은 경우
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    // prodid가 없을 경우
    if (!prodid) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    // 1. buy_product 테이블에서 해당 제품을 참조하는 레코드 삭제
    const deleteBuyProductQuery = 'DELETE FROM buy_product WHERE prodid = ?';
    db.query(deleteBuyProductQuery, [prodid], (err) => {
        if (err) {
            console.error('Failed to delete from buy_product:', err);
            return res.status(500).json({ error: 'Failed to delete from buy_product' });
        }

        // 2. 자식 테이블인 recent_viewed_products에서 prodid를 삭제
        const deleteRecentViewedQuery = 'DELETE FROM recent_viewed_products WHERE prodid = ?';
        db.query(deleteRecentViewedQuery, [prodid], (err) => {
            if (err) {
                console.error('Failed to delete from recent_viewed_products:', err);
                return res.status(500).json({ error: 'Failed to delete from recent_viewed_products' });
            }

            // 3. 다른 관련 테이블에서 prodid를 삭제 (예: inquiry 테이블 등)
            const deleteOtherRelatedQuery = 'DELETE FROM product_inquiry WHERE prodid = ?';
            db.query(deleteOtherRelatedQuery, [prodid], (err) => {
                if (err) {
                    console.error('Failed to delete from product_inquiry:', err);
                    return res.status(500).json({ error: 'Failed to delete from product_inquiry' });
                }

                // 4. product 테이블에서 prodid를 삭제
                const deleteProductQuery = 'DELETE FROM product WHERE prodid = ? AND userId = ?';
                db.query(deleteProductQuery, [prodid, userId], (err, results) => {
                    if (err) {
                        console.error('Database query failed:', err);
                        return res.status(500).json({ error: 'Database query failed' });
                    }

                    if (results.affectedRows === 0) {
                        // 삭제된 레코드가 없으면 권한이 없거나 상품이 존재하지 않음
                        return res.status(404).json({ error: 'Product not found or not authorized' });
                    }

                    res.status(200).json({ message: 'Product deleted successfully' });
                });
            });
        });
    });
});


app.put('/api/product/update/:id', (req, res) => {
    const productId = req.params.id;
    const {
        prodtitle,
        prodsmtitle,
        address,
        div1Bg,
        description,
        selectedFacilities,
        prodcontent1,
        prodcontent2,
        prodcontent3,
        prodcontent4,
        facility_pictures,
        prodpicture,
        iconpicture,
    } = req.body;

    // SQL query to update the product details
    const sql = `
        UPDATE product
        SET 
            prodtitle = ?,
            prodsmtitle = ?,
            address = ?,
            div1Bg = ?,
            description = ?,
            selectedFacilities = ?,
            prodcontent1 = ?,
            prodcontent2 = ?,
            prodcontent3 = ?,
            prodcontent4 = ?,
            facility_pictures = ?,
            prodpicture = ?,
            iconpicture = ?
        WHERE prodid = ?
    `;

    // Use the values to prevent SQL injection
    const values = [
        prodtitle,
        prodsmtitle,
        address,
        div1Bg,
        description,
        JSON.stringify(selectedFacilities),
        prodcontent1,
        prodcontent2,
        prodcontent3,
        prodcontent4,
        JSON.stringify(facility_pictures), // Convert array to JSON string if it's an array
        prodpicture,
        iconpicture,
        productId
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ success: false, message: 'Failed to update product' });
        }

        // Check if rows were affected
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: 'Product updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ url: filePath });
    } else {
        res.status(400).send('No file uploaded');
    }
});



app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
