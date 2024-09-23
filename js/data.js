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
        localStorage.setItem('username', data.username); // Сохраняем username в localStorage
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

  function handleDelete(event) {
    const button = event.target; 
    const guid = button.dataset.guid.split(',');
    const user_guid = guid[0];
    const command_guid = guid[1];

    fetch(`${config.ApiUrl}/access_delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('authToken')
      },
      body: JSON.stringify({
        user_guid: user_guid,
        command_guid: command_guid
      })
    })
    .then(response => {
      if (response.ok) {
        const row = button.closest('tr');
        row.parentNode.removeChild(row);
      } else {
        throw new Error('Ошибка при удалении данных');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  async function addRowsToTable() {
    try {
      const [usersResponse, commandsResponse] = await Promise.all([
        fetch(`${config.ApiUrl}/users`, {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        }),
        fetch(`${config.ApiUrl}/commands`, {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('authToken')
          }
        })
      ]);

      const usersData = await usersResponse.json();
      const commandsData = await commandsResponse.json();

      const dataTable = document.createElement('table');
      dataTable.innerHTML = `
        <tr>
          <th>Имя пользователя</th>
          <th>Фамилия</th>
          <th>Команды</th>
          <th>Действие</th>
        </tr>
      `;

      usersData.forEach(user => {
        commandsData.forEach(command => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fio}</td>
            <td>${command.name}</td>
            <td>
              <img src="../img/trash_icon.png" alt="delete" class="edit-data delete_btn_data" data-guid="${user.guid},${command.guid}">
            </td> 
          `;
          dataTable.appendChild(row);
        });
      });

      const dataTableContainer = document.getElementById('dataTableContainer');
      dataTableContainer.innerHTML = '';
      dataTableContainer.appendChild(dataTable);

      const deleteButtons = document.querySelectorAll('.delete_btn_data');
      if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
          button.addEventListener('click', handleDelete);
        });
      } else {
        console.error('Кнопки удаления не найдены в DOM');
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей и команд:', error);
    }
  }

  addRowsToTable();
}

document.getElementById('addDataModal').addEventListener('click', function() {
  document.getElementById('editDataModal').style.display = 'block';
});

document.getElementById('createModalButton').addEventListener('click', function(event) {
  event.preventDefault(); 

  const fioInput = document.getElementById('fio');
  const groupsInput = document.getElementById('groups');

  if (fioInput && groupsInput) {
    const fio = fioInput.value;
    const groups = groupsInput.value;

    fetch(`${config.ApiUrl}/data_create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('authToken')
      },
      body: JSON.stringify({
        fio: fio,
        groups: groups
      })
    })
    .then(response => {
      if (response.ok) {
        // Обновляем таблицу
        addRowsToTable();

        // Закрываем модальное окно
        document.getElementById('editDataModal').style.display = 'none';
      } else {
        throw new Error('Ошибка при добавлении данных');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } else {
    console.error('Не удалось найти поля формы');
  }
});

// Добавьте этот код после создания модального окна
document.getElementById('closeModalButton').addEventListener('click', function() {
  document.getElementById('editDataModal').style.display = 'none';
});