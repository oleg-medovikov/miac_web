import config from './config.js';

// JavaScript код для отправки формы
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Предотвращаем стандартное поведение формы
  // Получаем значения из полей формы
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Отправляем запрос на сервер
  //fetch( "http://192.168.0.140:8080/user_login", {
  fetch(`${config.ApiUrl}/user_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      username: username,
      password: password
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    // Обработка данных ответа
    alert('Login successful!');
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    // Обработка ошибок
    alert('Login failed. Please check your credentials.');
  });
});

