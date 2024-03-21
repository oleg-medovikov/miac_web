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
        <th>Дата создания</th>
        <th>Команда</th>
        <th>Имя файла</th>
        <th>Действие</th>
        <th>Скачать</th>
      </tr>
    `;
    // Добавляем строки с данными пользователей
    data.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${file.date}</td>
        <td>${file.command}</td>
        <td>${file.name}</td>   
        <td>${file.download}</td>
        <td><button class="edit-file" data-guid="${file.guid}">Редактировать</button></td>
      `;
      fileTable.appendChild(row);
    });
    // Отображаем таблицу пользователей
    const fileTableContainer = document.getElementById('fileTableContainer');
    fileTableContainer.innerHTML = ''; // Очищаем предыдущее содержимое
    fileTableContainer.appendChild(fileTable);
    // Добавляем обработчик события для кнопок редактирования
    const editButtons = document.querySelectorAll('.edit-file');
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const guid = this.dataset.guid;
        // Находим полный объект пользователя по GUID
        const file = data.find(file => file.guid === guid);
        // Открываем модальное окно с данными пользователя
        openEditFileModal(file);
      });   
    });
   })
  
  
    .catch(error => {
      console.error('Ошибка при загрузке пользователей:', error);
    });
    
  
    // Объявляем переменную modal в глобальной области видимости
  var modal;
  
  // Функция для открытия модального окна
  function openEditFileModal(file) {
    // Получаем модальное окно
    modal = document.getElementById('editFileModal');
  
  // Проверяем, существует ли file
  if (file) {
    // Заполняем поля формы данными пользователя
    document.getElementById('guid').value = file.guid || '';
    document.getElementById('date').value = file.date || '';
    document.getElementById('command').value = file.command || '';
    document.getElementById('name').value = file.name || '';
    document.getElementById('download').value = file.download || '';
    document.getElementById('updateModalButton').style.display = 'block';
    document.getElementById('FileModalTitle').innerHTML = 'Редактировать'
  } else {
    // Если file не определен, очищаем поля формы
    document.getElementById('guid').value = '';
    document.getElementById('date').value = '';
    document.getElementById('command').value = '';
    document.getElementById('name').value = '';
    document.getElementById('download').value = ''; 
    document.getElementById('createModalButton').style.display = 'block';
    document.getElementById('FileModalTitle').innerHTML = 'Добавить файл'
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
    var date = document.getElementById('date').value;
    var command = document.getElementById('command').value;
    var name = document.getElementById('name').value;
    var download = document.getElementById('download').value;
  
    // Создаем объект с данными   ВОПРОС
    var data = {
      guid: guid,
      date: date,
      command: command, 
      name: name,                 
      download: download,
    };
  
    // Отправляем запрос
    fetch(`${config.ApiUrl}/file_update`, {
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
  var addBtn = document.getElementById("addFileModal");
    // Добавляем обработчик события на кнопку закрытия
  addBtn.addEventListener("click", function() {
    openEditFileModal();
  });
  
  
  //Создание нового пользователя
  var okBtn = document.getElementById("createModalButton");
  okBtn.addEventListener("click", function() {
   // Получаем данные из формы
    var date = document.getElementById('date').value;
    var command = document.getElementById('command').value;
    var name = document.getElementById('name').value;
    var download = document.getElementById('download').value;
  
     // Проверяем, заполнены ли все поля
     if (!date || !command || !name || !download) {
      alert('Все поля должны быть заполнены.');
      return; // Прекращаем выполнение функции, если какое-либо поле не заполнено
    }
  
    // Создаем объект с данными
    var data = {
        date: date,
        command: command,
        name: name,
        download: download,
    };
  
    // Отправляем запрос
    fetch(`${config.ApiUrl}/file_create`, {
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