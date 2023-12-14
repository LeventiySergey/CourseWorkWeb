document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Очищаем предупреждение
            document.getElementById('warningMessage').textContent = '';

            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Выводим данные пользователя в консоль
            console.log('Данные пользователя:', data.user);

            // Показываем сообщение о результате
            alert(data.message);

            if (response.ok) {
                // Перенаправляем на домашнюю страницу или другую страницу после входа
                window.location.href = './home.html';

                // Сохраняем данные пользователя в локальном хранилище
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    });
});
