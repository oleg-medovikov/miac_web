import config from '../config.js';

if (!localStorage.getItem('authToken')) {
  window.location.href = '../html/login.html';
} else {
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
      window.location.href = '../html/login.html';
    } else {
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
        return response.json();
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

let url = 'http://localhost:8080/access_get_all';

let headers = {
  "Content-Type": "application/json",
  "Authorization": token
};

fetch(url, {
  method: 'GET',
  headers: headers
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
  console.error('Ошибка:', error);
});

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

  newCategory.appendChild(deleteButton);

  item.querySelector('.content-wrapper').appendChild(newCategory);

  document.getElementById('inputText').value = '';
}

function showModal(item) {
  document.getElementById('modal').style.display = 'block';
  document.getElementById('okButton').onclick = function() {
      addCategory(item);
      document.getElementById('modal').style.display = 'none';
  };
}

var addButtons = document.getElementsByClassName('addCard');
for (var i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener('click', function(event) {
      var item = event.target.closest('.item');
      showModal(item);
  });
}
