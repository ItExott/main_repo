const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

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
    database : 'itbookstore'
});

// MySQL 데이터베이스 연결
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 책 정보를 가져오는 API 엔드포인트
app.get('/BookDetail/:id', (req, res) => {
    const bookId = req.params.id; // req.params를 사용하여 id를 가져옴
    const query = 'SELECT * FROM product WHERE book_num = ?';

    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error('Error fetching book data: ' + err.stack);
            res.status(500).send('Internal server error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Book not found');
            return;
        }

        res.json(results[0]);
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});