const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const {v4: uuidv4} = require('uuid');


const web = express();
const PORT = 4000;

web.use(bodyParser.urlencoded({ extended: true }));
web.use(express.json());

web.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '171999',  
  database: 'login_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

web.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).send('Error');
    if (results.length > 0) {
        const token = uuidv4(); // Create unique token
        const updateSql = 'UPDATE users SET token = ? WHERE email = ?';
        // Save the token in database
        db.query(updateSql, [token, email], (err2) => {
            if (err2) return res.status(500).send('Error saving token');
            res.redirect(`/profile?token=${token}`);
        });
    } else {
      res.send('Invalid email or password.');
    }
  });
});


web.get('/profile', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).send('Missing token in URL');
  const sql = 'SELECT * FROM users WHERE token = ?';
  db.query(sql, [token], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length > 0) {
      const user = results[0];
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Profile</title></head>
        <body>
          <h2>Welcome, ${user.email}</h2>
          <p>This is your profile page.</p>
          <p><a href="/">Logout</a></p>
        </body>
        </html>
      `);
    } else {
      res.status(401).send('Invalid or expired token');
    }
  });
});

web.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
