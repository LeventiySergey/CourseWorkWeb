document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Перевірка на заповненість полів
    if (!username || !email || !password) {
        document.getElementById('warningMessage').textContent = 'Будь ласка, заповніть всі поля';
        return;
    }

    try {
        // Видалення попередження при настанні умови
        document.getElementById('warningMessage').textContent = '';

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        alert(data.message); // Показуємо повідомлення про результат
    } catch (error) {
        console.error('Помилка при відправці запиту:', error);
    }
});