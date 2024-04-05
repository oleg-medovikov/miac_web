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
      <td><button class="edit-data" data-guid="${data.user_guid, data.command_guid}">Удалить</button></td>
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
  


  // Объявляем переменную modal в глобальной области видимости
var modal;

// Функция для открытия модального окна
function openEditDataModal(data) {
  // Получаем модальное окно
  modal = document.getElementById('editDataModal');

// Проверяем, существует ли data
if (data) {
  // Заполняем поля формы данными пользователя
  document.getElementById('guid').value = data.guid || '';
  document.getElementById('fio').value = data.fio || '';
  document.getElementById('category').value = data.category || '';
  document.getElementById('updateModalButton').style.display = 'block';
  document.getElementById('DataModalTitle').innerHTML = 'Редактировать'
} else {
  // Если data не определен, очищаем поля формы
  document.getElementById('guid').value = '';
  document.getElementById('fio').value = '';
  document.getElementById('category').value = '';
  document.getElementById('createModalButton').style.display = 'block';
  document.getElementById('DataModalTitle').innerHTML = 'Добавить пользователя'
}
  // Отображаем модальное окно
  modal.style.display = 'block';
}


// Получаем кнопку закрытия модального окна
var closeBtn = document.getElementById("closeModalButton");
  // Добавляем обработчик события на кнопку закрытия
closeBtn.addEventListener("click", function() {
  // Скрываем модальное окно
  modal.style.display = "none";
});


var okBtn = document.getElementById("updateModalButton");
okBtn.addEventListener("click", function() {
 // Получаем данные из формы
  var guid = document.getElementById('guid').value;
  var fio = document.getElementById('fio').value;
  var category = document.getElementById('category').value;

  // Создаем объект с данными
  var data = {
    guid: guid,
    fio: fio,
    category: category,

  };

  // Отправляем запрос
  fetch(`${config.ApiUrl}/data_update`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': localStorage.getItem('authToken')
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Успешно:', data);
    // Здесь можно обработать ответ от сервера, например, обновить интерфейс пользователя
    modal.style.display = "none"; 
    location.reload();
  });
});

  
// Получаем кнопку открытия для создания пользователя
var addBtn = document.getElementById("addDataModal");
  // Добавляем обработчик события на кнопку закрытия
addBtn.addEventListener("click", function() {
  openEditDataModal();
});


//Создание нового пользователя
var okBtn = document.getElementById("createModalButton");
okBtn.addEventListener("click", function() {
 // Получаем данные из формы
  var fio = document.getElementById('fio').value;
  var category = document.getElementById('category').value;


   // Проверяем, заполнены ли все поля
   if (!fio || !category) {
    alert('Все поля должны быть заполнены.');
    return; // Прекращаем выполнение функции, если какое-либо поле не заполнено
  }

  // Создаем объект с данными
  var data = {
    fio: fio,
    category: category,
  };

  // Отправляем запрос
  fetch(`${config.ApiUrl}/data_create`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': localStorage.getItem('authToken')
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Успешно:', data);
    // Здесь можно обработать ответ от сервера, например, обновить интерфейс пользователя
    modal.style.display = "none"; 
    location.reload();
  });
});