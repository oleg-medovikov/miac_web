import config from '../config.js';

if (!localStorage.getItem('authToken')) {
  window.location.href = '../html/login.html';
} else {
  // ... остальная часть вашего кода ...

  // Функция для обработки удаления строки
  function handleDelete(event) {
    const button = event.target; // Кнопка, которая была нажата
    const guid = button.dataset.guid.split(',');
    const user_guid = guid[0];
    const command_guid = guid[1];

    // Отправка запроса на удаление
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
        // Удаление строки из таблицы
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

  // Асинхронная функция для добавления строк в таблицу
  async function addRowsToTable() {
    try {
      const response = await fetch(`${config.ApiUrl}/access_get_all`, {
        method: 'GET',
        headers: {
          'Authorization': localStorage.getItem('authToken')
        }
      });
      const data = await response.json();

      const dataTable = document.createElement('table');
      dataTable.innerHTML = `
        <tr>
          <th>ФИО</th>
          <th>Команды</th>
          <th>Действие</th>
        </tr>
      `;
      data.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.user_fio}</td>
          <td>${data.command_name}</td>
          <td><img src="../img/add_table_icon.png" alt="delete" class="edit-data" data-guid="${data.user_guid},${data.command_guid}"> 
          <img src="../img/trash_icon.png" alt="delete" class="edit-data delete_btn_data" data-guid="${data.user_guid},${data.command_guid}"></td> 
        `;
        dataTable.appendChild(row);
      });

      const dataTableContainer = document.getElementById('dataTableContainer');
      dataTableContainer.innerHTML = '';
      dataTableContainer.appendChild(dataTable);

      // Добавляем обработчики событий к кнопкам удаления только после добавления строк в таблицу
      const deleteButtons = document.querySelectorAll('.delete_btn_data');
      if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
          button.addEventListener('click', handleDelete);
        });
      } else {
        console.error('Кнопки удаления не найдены в DOM');
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  }

  // Вызываем асинхронную функцию для добавления строк в таблицу
  addRowsToTable();
}
