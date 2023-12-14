const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('users.db');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Проверка, существует ли пользователь с такой почтой
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з такою поштою вже існує' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавление нового пользователя в базу данных
        db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Внутрішня помилка сервера' });
            }
            res.status(201).json({ message: 'Користувач успішно зареєстрований' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверка, существует ли пользователь с такой почтой
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (!user) {
            return res.status(404).json({ message: 'Користувача з такою поштою не існує' });
        }

        // Проверка соответствия пароля
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Неправильний пароль' });
        }

        // Успешный вход
        res.status(200).json({
            message: 'Ви успішно увійшли в систему',
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});

router.post('/logout', (req, res) => {
    // Здесь вы можете добавить необходимую логику для выхода, например, удаление сессии
    res.status(200).json({ message: 'Ви успішно вийшли з акаунту' });
});

module.exports = router;
