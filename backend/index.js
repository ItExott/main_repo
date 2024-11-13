const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

// CORS 설정
app.use(cors());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    port     : 3307,
    password : 'root',
    database : 'itsoftgym'
});

// MySQL 데이터베이스 연결
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 로그인 구현


app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { id, password } = req.body;

    // 예시: 아이디와 비밀번호 검증
    if (id === 'suhokym' && password === 'suhokym') {
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
});




// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});