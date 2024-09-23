import config from '../config.js';

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); 
  // const username = document.getElementById('username').value;
  // const password = document.getElementById('password').value;


  fetch(`${config.ApiUrl}/user_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      username: event.target.username.value,
      password: event.target.password.value
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('authToken', data.token);
    window.location.href = '../html/users.html';
  })
  .catch(error => {
    console.error('Возникла проблема с операцией выборки:', error);

    alert('Ошибка входа. Пожалуйста, проверьте свои учетные данные.');
  });
});

