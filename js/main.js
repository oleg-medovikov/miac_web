import config from '../config.js';

// Проверяем наличие токена в localStorage
if (!localStorage.getItem('authToken')) {
  // Если токена нет, перенаправляем на страницу входа
  window.location.href = '../html/login.html';
} else {
  // Отправляем запрос к API для проверки токена
  fetch(`${config.ApiUrl}/check_token`, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('authToken')
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (!data.token_valid) {
      // Если токен не валиден, перенаправляем на страницу входа
      window.location.href = '../html/login.html';
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}
