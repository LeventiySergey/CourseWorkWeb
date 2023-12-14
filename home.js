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
        userInfoContainer.innerHTML = ''; // Clear the container
        const userText = `Ласкаво просимо, ${user.username} (${user.email})`;
        const userInfoParagraph = document.createElement('p');
        userInfoParagraph.textContent = userText;
        userInfoContainer.appendChild(userInfoParagraph);

        // Добавляем обработчик для кнопки выхода
        logoutButton.addEventListener('click', async function () {
            try {
                console.log('Вы нажали кнопку "Вийти"');

                const response = await fetch('http://localhost:3000/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    localStorage.removeItem('user');
                    window.location.href = './login.html';
                } else {
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