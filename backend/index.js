const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const session = require('express-session');
// CORS 설정
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',  // Specify the exact origin of your frontend
    credentials: true                // Allow credentials to be sent
}));
app.use(express.json());

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

app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.get('/product_Main', (req, res) => {
    const sortOption = req.query.sort || 'prodrating'; // 기본값은 'prodrating'
    const sortOrder = 'DESC'; // 내림차순 정렬

    let query = '';
    if (sortOption === 'prodrating') {
        query = `
            SELECT p.* 
            FROM Product p
            JOIN divisionsport d ON p.category = d.category
            ORDER BY p.prodrating ${sortOrder}
        `;
    } else if (sortOption === 'prodprice') {
        query = `
            SELECT p.* 
            FROM Product p
            JOIN divisionsport d ON p.category = d.category
            ORDER BY p.prodprice ${sortOrder}
        `;
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

app.get('/product_Main/:category', (req, res) => {
    const prodcategory = req.params.category;

    const query = `
        SELECT p.*, d.* 
        FROM Product p
        JOIN divisionsport d ON p.category = d.category
        WHERE p.category = ?`;

    db.query(query, [prodcategory], (err, results) => {
        if (err) {
            console.error("Error fetching category data:", err);
            res.status(500).send("Internal server error");
        } else if (results.length === 0) {
            res.status(404).send("No products found for this category");
        } else {
            res.json(results); // Return the filtered products
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
    const { userid, userpw } = req.body;

    // Check if both fields are provided
    if (!userid || !userpw) {
        return res.json({ success: false, message: 'Both fields are required.' });
    }

    // Query the database for the user
    db.query('SELECT * FROM users WHERE userid = ?', [userid], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (result.length === 0) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }

        const user = result[0];
        // Compare password with stored hashed password
        bcrypt.compare(userpw, user.userpw, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.json({ success: false, message: 'Invalid username or password' });
            }

            // Set session or token if needed
            req.session.user = user;
            return res.json({ success: true, name: user.name });
        });
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