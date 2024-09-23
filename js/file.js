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
  
  fetch(`${config.ApiUrl}/file_get_all`, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('authToken')
    }
  })
    .then(response => response.json()) 
    .then(data => {
    const fileTable = document.createElement('table');
    fileTable.innerHTML = `
      <tr>
        <th>Дата</th>
        <th>Название файла</th>
        <th>Действие</th>
      </tr>
    `;
    data.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${file.date}</td>
        <td>${file.name}</td>
        <td>${file.action}</td>
      `;
      fileTable.appendChild(row);
    });
    const fileTableContainer = document.getElementById('fileTableContainer');
    fileTableContainer.innerHTML = ''; 
    fileTableContainer.appendChild(fileTable);
      });   

  