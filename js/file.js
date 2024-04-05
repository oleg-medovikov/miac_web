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
    } else { // Если токен валидный - мы вытаскиваем пользователя
      fetch(`${config.ApiUrl}/user_get`, { 
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Преобразуем тело ответа в JSON
      })
      .then(data => {  
        localStorage.setItem('fio', data.fio); 
        localStorage.setItem('groups', data.groups);
        document.getElementById('UserFIO').innerHTML = localStorage.getItem('fio');
        document.getElementById('UserGroups').innerHTML = localStorage.getItem('groups');
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}
  
  // Отправляем запрос к API
  fetch(`${config.ApiUrl}/file_get_all`, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('authToken')
    }
  })
    .then(response => response.json()) 
    .then(data => {
    // Создаем таблицу команд
    const fileTable = document.createElement('table');
    fileTable.innerHTML = `
      <tr>
        <th>Дата</th>
        <th>Название файла</th>
        <th>Действие</th>
      </tr>
    `;
    // Добавляем строки с данными пользователей
    data.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${file.date}</td>
        <td>${file.name}</td>
        <td>${file.action}</td>
      `;
      fileTable.appendChild(row);
    });
    // Отображаем таблицу пользователей
    const fileTableContainer = document.getElementById('fileTableContainer');
    fileTableContainer.innerHTML = ''; // Очищаем предыдущее содержимое
    fileTableContainer.appendChild(fileTable);
      });   

  