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



// fetch(`${config.ApiUrl}/dir_get_all`, {
//   method: 'GET',
//   headers: {
//     'Authorization': localStorage.getItem('authToken')
//   }
// })
//   .then(response => response.json()) 
//   .then(data => {
//   // Создаем таблицу команд
//   const dirTable = document.createElement('table');
//   dirTable.innerHTML = `
//     <tr>
//       <th>Имя</th>
//       <th>Директория</th>
//       <th>Описание</th>
//       <th>Активный</th>
//       <th>Действие</th>
//     </tr>
//   `;
//   // Добавляем строки с данными пользователей
//   data.forEach(dir => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>${dir.name}</td>
//       <td>${dir.directory}</td>
//       <td>${dir.description}</td>
//       <td>${dir.active ? 'Да' : 'Нет'}</td>
//       <td><button class="edit-dir" data-guid="${dir.guid}">Редактировать</button></td>
//     `;
//     dirTable.appendChild(row);
//   });
//   // Отображаем таблицу пользователей
//   const dirTableContainer = document.getElementById('dirTableContainer');
//   dirTableContainer.innerHTML = ''; // Очищаем предыдущее содержимое
//   dirTableContainer.appendChild(dirTable);
//   // Добавляем обработчик события для кнопок редактирования
//   const editButtons = document.querySelectorAll('.edit-dir');
//   editButtons.forEach(button => {
//     button.addEventListener('click', function() {
//       const guid = this.dataset.guid;
//       // Находим полный объект пользователя по GUID
//       const dir = data.find(dir => dir.guid === guid);
//       // Открываем модальное окно с данными пользователя
//       openEditDirModal(dir);
//     });   
//   });
//  })

// Функция для добавления новой категории в элемент
function addCategory(item) {
  // Получить введенный текст
  var inputText = document.getElementById('inputText').value;

  // Создать новый div категории
  var newCategory = document.createElement('div');
  newCategory.className = 'category';
  newCategory.textContent = '- ' + inputText;

  // Создать кнопку удаления для новой категории
  var deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.innerHTML = '<img class="trash_bin" src="../img/trash_bin_icon.png" alt="trash_bin">';

  // Добавить кнопку удаления к новой категории
  newCategory.appendChild(deleteButton);

  // Добавить новую категорию в content-wrapper элемента
  item.querySelector('.content-wrapper').appendChild(newCategory);

  // Очистить поле ввода
  document.getElementById('inputText').value = '';
}

// Функция для отображения модального окна и обработки нажатия кнопки ОК
function showModal(item) {
  document.getElementById('modal').style.display = 'block';
  document.getElementById('okButton').onclick = function() {
      addCategory(item);
      document.getElementById('modal').style.display = 'none';
  };
}

// Добавить обработчики событий на все кнопки "Добавить"
var addButtons = document.getElementsByClassName('addCard');
for (var i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener('click', function(event) {
      // Получить элемент, который содержит нажатую кнопку
      var item = event.target.closest('.item');
      showModal(item);
  });
}
