import config from '../config.js';

document.getElementById('logoutButton').addEventListener('click', function() {
  // Отправляем запрос на сервер для удаления токена
  fetch(`${config.ApiUrl}/drop_token`, {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem('authToken')
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Удаляем токен из localStorage
    localStorage.removeItem('authToken');
    // Перенаправляем пользователя на страницу входа
    window.location.href = 'login.html';
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
});
