const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const session = require('express-session');
// CORS 설정
const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',  // React 앱이 호스트되는 주소
    credentials: true,  // 쿠키와 인증 정보를 포함한 요청을 허용
}));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    port     : 3306,  // MySQL의 포트 번호 (기본 포트는 3306, 사용하는 포트에 맞게 수정)
    password : 'root',  // MySQL 비밀번호 (환경에 맞게 수정)
    database : 'itsoftgym'  // 사용하려는 데이터베이스 이름
});

// MySQL 데이터베이스 연결
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
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

// 제품 목록 조회 (정렬 기준: 평점 또는 가격)
app.get('/product_Main', (req, res) => {
    const sortOption = req.query.sort || 'prodrating'; // 기본값은 'prodrating'
    const sortOrder = 'DESC'; // 내림차순 정렬

    let query = '';
    if (sortOption === 'prodrating') {
        query = `SELECT * FROM Product ORDER BY prodrating ${sortOrder}`;
    } else if (sortOption === 'prodprice') {
        query = `SELECT * FROM Product ORDER BY prodprice ${sortOrder}`;
    }

    // db.query()로 데이터베이스 쿼리 실행
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // 쿼리 결과를 응답으로 반환
    });
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