const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');
const app = express();
const port = 8080;

// CORS 설정
const cors = require('cors');
app.use(cors());
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
            res.json(results[0]);
        }
    });
});

// Middleware 설정
app.use(bodyParser.json());  // JSON 파싱

app.post('/api/signup', (req, res) => {
    const { userId, password, name, email, phoneNumber, address, userType } = req.body;

    // SQL 쿼리로 데이터베이스에 회원 정보 삽입
    const query = 'INSERT INTO users (userId, password, name, email, phoneNumber, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, password, name, email, phoneNumber, address, userType], (err, result) => {
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
    const { id, password } = req.body;  // 클라이언트에서 보낸 id와 password를 받음

    // id와 password를 MySQL에서 확인
    const query = 'SELECT * FROM users WHERE id = ? AND password = ?';
    db.query(query, [id, password], (err, result) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // 사용자가 존재하고 로그인 정보가 일치하면
        if (result.length > 0) {
            // 로그인 성공
            res.json({ success: true, name: result[0].name });  // 사용자의 이름을 응답에 포함
        } else {
            // 로그인 실패
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
