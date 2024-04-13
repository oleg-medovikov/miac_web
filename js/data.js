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
fetch(`${config.ApiUrl}/access_get_all`, {
  method: 'GET',
  headers: {
    'Authorization': localStorage.getItem('authToken')
  }
})
  .then(response => response.json()) 
  .then(data => {
  // Создаем таблицу пользователей
  const dataTable = document.createElement('table');
  dataTable.innerHTML = `
    <tr>
      <th>ФИО</th>
      <th>Команды</th>
      <th>Действие</th>
    </tr>
  `;
  // Добавляем строки с данными пользователей
  data.forEach(data => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.user_fio}</td>
      <td>${data.command_name}</td>
      <td><img src="../img/add_table_icon.png" alt="delete" class="edit-data" data-guid="${data.user_guid, data.command_guid}"> <img src="../img/trash_icon.png" alt="delete" class="edit-data" data-guid="${data.user_guid, data.command_guid}"></td> 
      
    `;
    dataTable.appendChild(row);
  });
  // Отображаем таблицу пользователей
  const dataTableContainer = document.getElementById('dataTableContainer');
  dataTableContainer.innerHTML = ''; // Очищаем предыдущее содержимое
  dataTableContainer.appendChild(dataTable);
  // Добавляем обработчик события для кнопок редактирования
  const editButtons = document.querySelectorAll('.edit-data');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const guid = this.dataset.guid;
      // Находим полный объект пользователя по GUID
      const data = data.find(data => data.guid === guid);
      // Открываем модальное окно с данными пользователя
      openEditDataModal(data);
    });   
  });
 })


  .catch(error => {
    console.error('Ошибка при загрузке пользователей:', error);
  });
  


  