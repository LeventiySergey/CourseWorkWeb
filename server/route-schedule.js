const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('users.db');

router.post('/addSchedule', async (req, res) => {
    try {
        const { scheduleName, scheduleData } = req.body;

        // Проверка, существует ли расписание с таким названием
        const existingSchedule = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM schedules WHERE LOWER(scheduleName) = LOWER(?)', [scheduleName], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (existingSchedule) {
            return res.status(400).json({ message: 'Розклад з такою назвою вже існує' });
        }

        // Добавление записей в базу данных для каждого элемента расписания
        scheduleData.forEach(async (entry) => {
            const { timeStart, timeEnd, discipline } = entry;
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO schedules (scheduleName, timeStart, timeEnd, discipline) VALUES (?, ?, ?, ?)', [scheduleName, timeStart, timeEnd, discipline], (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });

        res.status(201).json({ message: 'Розклад успішно додано' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});

router.post('/searchSchedule', async (req, res) => {
    try {
        const { scheduleName } = req.body;

        // Поиск расписания в базе данных
        const schedules = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM schedules WHERE LOWER(scheduleName) = LOWER(?)', [scheduleName], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        if (schedules.length === 0) {
            return res.status(404).json({ message: 'Розклад не знайдено' });
        }

        res.status(200).json({ message: 'Розклад знайдено', schedules });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});

module.exports = router;
