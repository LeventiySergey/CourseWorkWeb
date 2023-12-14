// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const authRoutes = require('./route-auth');
const scheduleRoutes = require('./route-schedule');

const app = express();
const port = 3000;

// Підключення до бази даних SQLite
const db = new sqlite3.Database('users.db');

// Створення таблиці для розкладів
db.run(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheduleName TEXT NOT NULL,
    timeStart TIME NOT NULL,
    timeEnd TIME NOT NULL,
    discipline TEXT NOT NULL
  )
`);

// Створення таблиці для користувачів
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes); // Маршрути для автентифікації
app.use('/schedule', scheduleRoutes); // Маршрути для розкладу

app.get('/', (req, res) => {
    res.send('Сервер працює');
});

app.listen(port, () => {
    console.log(`Сервер запущено на порту ${port}`);
});
