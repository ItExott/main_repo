const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 8080;
const session = require('express-session');

// CORS 설정
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend 주소
    credentials: true                // Allow credentials to be sent
}));

app.use(express.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,  // MySQL의 포트 번호 (기본 포트는 3306, 사용하는 포트에 맞게 수정)
    password: 'root',  // MySQL 비밀번호 (환경에 맞게 수정)
    database: 'itsoftgym'  // 사용하려는 데이터베이스 이름
});

app.use(session({
    secret: 'your-secret-key',  // 세션 암호화 키
    resave: false,  // 세션이 수정되지 않았을 경우에도 저장할지 여부
    saveUninitialized: false,  // 초기화되지 않은 세션을 저장할지 여부
    cookie: {
        maxAge: 3600000,  // 세션 만료 시간: 1시간
        httpOnly: true,    // 클라이언트에서 JavaScript로 쿠키 접근 불가
        sameSite: 'None',  // cross-origin 요청을 허용하려면 'None'으로 설정
    }
}));

// MySQL 데이터베이스 연결
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});


// 특정 제품 상세 조회
app.get('/product/:id', (req, res) => {
    const prodid = req.params.id;
    const query = "SELECT * FROM Product WHERE prodid = ?";

    db.query(query, [prodid], (err, results) => {
        if (err) {
            console.error("Error fetching product data:", err);
            res.status(500).send("Internal server error");
        } else if (results.length === 0) {
            res.status(404).send("Product not found");
        } else {
            res.json(results[0]); // 제품 데이터 응답
        }
    });
});

// 카테고리와 제품을 가져오는 API
app.get('/product_Main/:category', (req, res) => {
    const category = req.params.category;  // URL에서 category 받아옴
    const sortOption = req.query.sort || 'prodrating';  // 정렬 옵션 (기본값은 'prodrating')
    const sortOrder = 'DESC'; // 내림차순 정렬

    // 카테고리 정보 가져오기
    const categoryQuery = `
        SELECT * FROM divisionsport WHERE category = ?
    `;

    // 제품 정보 가져오기
    const productQuery = `
        SELECT * FROM Product WHERE category = ? ORDER BY ${sortOption} ${sortOrder}
    `;

    // 카테고리 정보 요청
    db.query(categoryQuery, [category], (err, categoryResults) => {
        if (err) {
            console.error("Error fetching category data:", err);
            return res.status(500).send("Internal server error");
        }

        if (categoryResults.length === 0) {
            return res.status(404).send("No category found for this category");
        }

        // 제품 정보 요청
        db.query(productQuery, [category], (err, productResults) => {
            if (err) {
                console.error("Error fetching product data:", err);
                return res.status(500).send("Internal server error");
            }

            // Send back both category and product data
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

    // SQL 쿼리로 데이터베이스에 회원 정보 삽입
    const query = 'INSERT INTO users (userId, userpw, name, email, phoneNumber, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, userpw, name, email, phoneNumber, address, userType], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            return res.json({ success: false, message: '회원가입 실패' });
        }

        // 성공적으로 삽입되었으면
        res.json({ success: true, message: '회원가입 성공' });
    });
});

// 로그인 API
app.post('/api/login', (req, res) => {
    console.log('Request body:', req.body);
    const { userid, userpw } = req.body;

    const query = 'SELECT * FROM users WHERE userid = ? AND userpw = ?';
    db.query(query, [userid, userpw], (err, result) => {
        if (err) {
            console.error('Database query error: ', err);  // 여기서 자세한 에러 정보를 출력
            return res.status(500).json({ success: false, message: 'Internal server error', error: err });
        }

        if (result.length > 0) {
            req.session.userId = userid;
            req.session.name = result[0].name;

            res.json({ success: true, name: result[0].name, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// 로그아웃 API (세션 종료)
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');  // 세션 쿠키 삭제
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});