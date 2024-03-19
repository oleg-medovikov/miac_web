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
  fetch(`${config.ApiUrl}/dir_get_all`, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('authToken')
    }
  })
    .then(response => response.json()) 
    .then(data => {
    // Создаем таблицу команд
    const dirTable = document.createElement('table');
    dirTable.innerHTML = `
      <tr>
        <th>Имя</th>
        <th>Директория</th>
        <th>Описание</th>
        <th>Активный</th>
      </tr>
    `;
    // Добавляем строки с данными пользователей
    data.forEach(dir => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${dir.name}</td>
        <td>${dir.directory}</td>
        <td>${dir.description}</td>
        <td>${dir.active ? 'Да' : 'Нет'}</td>
        <td><button class="edit-user" data-guid="${dir.guid}">Редактировать</button></td>
      `;
      dir.appendChild(row);
    });
    // Отображаем таблицу пользователей
    const dirTableContainer = document.getElementById('dirTableContainer');
    dirTableContainer.innerHTML = ''; // Очищаем предыдущее содержимое
    dirTableContainer.appendChild(dirTable);
    // Добавляем обработчик события для кнопок редактирования
    const editButtons = document.querySelectorAll('.edit-dir');
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const guid = this.dataset.guid;
        // Находим полный объект пользователя по GUID
        const dir = data.find(dir => dir.guid === guid);
        // Открываем модальное окно с данными пользователя
        openEditDirModal(dir);
      });   
    });
   })
  
  
    .catch(error => {
      console.error('Ошибка при загрузке пользователей:', error);
    });
    
  
    // Объявляем переменную modal в глобальной области видимости
  var modal;
  
  // Функция для открытия модального окна
  function openEditDirModal(dir) {
    // Получаем модальное окно
    modal = document.getElementById('editDirModal');
  
  // Проверяем, существует ли dir
  if (dir) {
    // Заполняем поля формы данными пользователя
    document.getElementById('guid').value = dir.guid || '';
    document.getElementById('name').value = dir.name || '';
    document.getElementById('directory').value = dir.directory || '';
    document.getElementById('description').value = dir.description || '';
    document.getElementById('active').value = dir.active ? 'true' : 'false';
    document.getElementById('updateModalButton').style.display = 'block';
    document.getElementById('sirModalTitle').innerHTML = 'Редактировать'
  } else {
    // Если dir не определен, очищаем поля формы
    document.getElementById('guid').value = '';
    document.getElementById('name').value = '';
    document.getElementById('directory').value = '';
    document.getElementById('description').value = '';
    document.getElementById('active').value = ''; 
    document.getElementById('createModalButton').style.display = 'block';
    document.getElementById('dirModalTitle').innerHTML = 'Добавить пользователя'
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
    var name = document.getElementById('name').value;
    var directory = document.getElementById('directory').value;
    var description = document.getElementById('description').value;
    var active = document.getElementById('active').value === 'true';
  
    // Создаем объект с данными   ВОПРОС
    var data = {
        guid: guid,
        directory: directory,
        name: name,
        description: description,                 
        active: active
    };
  
    // Отправляем запрос
    fetch(`${config.ApiUrl}/dir_update`, {
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
  var addBtn = document.getElementById("addDirModal");
    // Добавляем обработчик события на кнопку закрытия
    addBtn.addEventListener("click", function() {
    openEditDirModal();
  });
  
  
  //Создание нового пользователя
  var okBtn = document.getElementById("createModalButton");
  okBtn.addEventListener("click", function() {
   // Получаем данные из формы
    var name = document.getElementById('name').value;
    var directory = document.getElementById('directory').value;
    var description = document.getElementById('description').value;
    var active = document.getElementById('active').value === 'true';
  
     // Проверяем, заполнены ли все поля
     if (!directory || !description || !name) {
      alert('Все поля должны быть заполнены.');
      return; // Прекращаем выполнение функции, если какое-либо поле не заполнено
    }
  
    // Создаем объект с данными
    var data = {
        name: name,
        directory: directory,
        description: description,
        active: active
    };
  
    // Отправляем запрос
    fetch(`${config.ApiUrl}/dir_create`, {
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