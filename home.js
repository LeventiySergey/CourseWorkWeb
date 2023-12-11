document.addEventListener('DOMContentLoaded', async function () {
    try {
        console.log('DOMContentLoaded запущен');

        const userInfoContainer = document.getElementById('userInfo');
        const logoutButton = document.getElementById('logoutBtn');

        // Получаем данные пользователя из локального хранилища
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            // Если пользователь не авторизован, перенаправляем на страницу входа
            window.location.href = './login.html';
            return;
        }

        console.log('Данные пользователя:', user);

        // Отображаем информацию о пользователе
        const userText = `Ласкаво просимо, ${user.username} (${user.email})`;
        const userInfoParagraph = document.createElement('p');
        userInfoParagraph.textContent = userText;
        userInfoContainer.appendChild(userInfoParagraph);

        // Добавляем обработчик для кнопки выхода
        logoutButton.addEventListener('click', async function () {
            try {
                console.log('Вы нажали кнопку "Вийти"');

                const response = await fetch('http://localhost:3000/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Передача данных (возможно, вам не понадобится тело запроса)
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    // Удаляем данные пользователя из локального хранилища
                    localStorage.removeItem('user');
                    // Перенаправляем на страницу входа
                    window.location.href = './login.html';
                } else {
                    // Выводим сообщение об ошибке
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.error('Помилка при відправці запиту:', error);
            }
        });
    } catch (error) {
        console.error('Ошибка во время выполнения скрипта:', error);
    }
});