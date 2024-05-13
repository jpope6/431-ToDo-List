// Utility functions
function toggleClass(element, className) {
  element.classList.toggle(className);
}

// Task management
function addTaskToList(text) {
  const list = document.querySelector('.list');
  const li = document.createElement('li');
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = text.toLowerCase().replace(/ /g, '-');
  input.name = text.toLowerCase().replace(/ /g, '-');
  const label = document.createElement('label');
  label.htmlFor = input.id;
  label.textContent = text;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-task-btn';
  taskDiv.appendChild(input);
  taskDiv.appendChild(label);
  li.appendChild(taskDiv);
  li.appendChild(deleteButton);
  list.appendChild(li);
}

function createListItem(list) {
  const li = document.createElement('p');
  li.classList.add('sidebar-list-item');
  li.setAttribute('data-id', list.idx);
  li.textContent = list.name;
  
  // Create Edit Button
  const editListButton = document.createElement('button');
  editListButton.classList.add('edit-list-button');
  editListButton.textContent = 'Edit';
  editListButton.addEventListener('click', editListName);
  
  // Create Delete Button
  const deleteListButton = document.createElement('button');
  deleteListButton.classList.add('delete-list-button');
  deleteListButton.textContent = 'X';
  deleteListButton.addEventListener('click', function(event) {
    deleteList(event, list.idx);
  });
  
  li.appendChild(editListButton);
  li.appendChild(deleteListButton);
  li.addEventListener('click', handleClick);
  return li;
}

function handleClick(event) {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(item => item.classList.remove('active-sidebar-item'));
  const listItem = event.target.closest('.sidebar-list-item');

  if (listItem) {
    listItem.classList.add('active-sidebar-item');
    const listId = listItem.getAttribute('data-id');
    fetchListItems(listId);
  }
}

function fetchListItems(listId) {
  fetch(`api/example.php?list_id=${listId}`, { method: 'GET'}).then(response => response.json()).then(items => {
    updateTaskListDisplay(items);
  }).catch(error => console.error('Error fetching list items:', error));
}

function updateTaskListDisplay(items) {
  const taskList = document.querySelector('.list');
  taskList.innerHTML = '';
  items.forEach(item => {
    const listItem = createTaskListItem(item);
    taskList.appendChild(listItem);
  });
}

function addListItem(text, listId) {
  fetch('api/example.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text, list_id: listId }) 
  })
  .then(response => response.json())
  .then(data => {
      fetchListItems(listId);
  })
  .catch(error => console.error('Error adding list item:', error));
}

function updateListItemStatus(itemId, isChecked) {
  fetch(`api/example.php?item_id=${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checked: isChecked })
  })
  .then(response => response.json())
  .then(result => {
    if (!result.success) {
      console.error('Failed to update list item status:', result.message);
    }
  })
  .catch(error => console.error('Error updating list item status:', error));
}

function createTaskListItem(item) {
  const li = document.createElement('li');
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = item.checked;
  input.id = `item-${item.idx}`;
  input.name = item.idx;

  input.addEventListener('change', () => {
    updateListItemStatus(item.idx, input.checked);
  });
  
  const label = document.createElement('label');
  label.htmlFor = `item-${item.idx}`;
  label.textContent = item.text;
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-task-btn';
  deleteButton.addEventListener('click', () => deleteTaskItem(item.idx));

  taskDiv.appendChild(input);
  taskDiv.appendChild(label);
  li.appendChild(taskDiv);
  li.appendChild(deleteButton);
  
  return li;
}

function deleteTaskItem(itemId) {
  if (confirm('Are you sure you want to delete this task?')) {
    fetch(`api/example.php?item_id=${itemId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          const listItem = document.querySelector(`input[id='${itemId}']`).parentNode.parentNode;
          listItem.remove();
        } else {
          console.error('Failed to delete task item:', result.message);
        }
      })
      .catch(error => console.error('Error deleting task item:', error));
  }
}

function deleteList(event, listId) {
  event.preventDefault();

  if (!listId) {
    console.error('List ID not found');
    return;
  }

  if (confirm('Are you sure you want to delete this item?')) {
    fetch(`api/example.php?id=${listId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          event.target.closest('.sidebar-list-item').remove();
          fetchAllLists();
        } else {
          console.error('Failed to delete the list:', data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting list:', error);
      });
  } else {
    console.error('List ID not found or invalid element');
  }
}

function editListName(event) {
  event.preventDefault();

  const listItem = event.target.closest('.sidebar-list-item');
  if(!listItem) {
    console.error('Could not find the list item');
    return; 
  }

  const listId = listItem.getAttribute('data-id');
  const currentText = listItem.firstChild.textContent;

  const newText = prompt('Edit list name:', currentText);
  if (newText && newText !== currentText) { 
    listItem.firstChild.textContent = newText;

    updateListName(listId, newText);
  }
}

function fetchAllLists() {
  fetch('api/example.php', {method: 'GET'}).then(response => response.json()).then(data => {
    if(Array.isArray(data)){
    updateSidebar(data);
    } else {
      console.error('Data received is not an array:', data);
    }
  }).catch(error => console.error('Error fetching lists:', error));
}

function addNewList(listName) {
  fetch('api/example.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: listName })
  })
  .then(response => response.json())
  .then(data => {
      fetchAllLists();
  })
  .catch(error => console.error('Error adding list:', error));
}

function updateListName(listId, newName) {
  fetch(`api/example.php?id=${listId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
  })
  .then(response => { 
    if (!response.ok){
      throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.json()
  })
  .then(data => {
    if(!data.success) {
      console.error('Failed to update list:', data.message);
      alert('Failed to update list. Please try again');
      fetchAllLists();  // Refresh the list display
    }
  })
  .catch(error => {
    console.error('Error updating list:', error);
    alert('Error updating list. Please try again!');
    fetchAllLists(); 
  });
}

function updateSidebar(lists) {
  const sidebarLists = document.querySelector('.sidebar-lists');
  sidebarLists.innerHTML = '';

  lists.forEach((list, index) => {
    try {
      const li = createListItem(list);
      sidebarLists.appendChild(li);
    } catch (error) {
      console.error(`Error processing list ${index + 1}:`, error)
    }
  })

  if (lists.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No lists available';
    sidebarLists.appendChild(emptyMessage);
  }
}

// Date Display
const currentDate = new Date();
const dateDiv = document.querySelector('.date');
dateDiv.textContent = `${currentDate.toLocaleDateString('en-us', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

// Sidebar interactions
document.querySelector('.menu-button').addEventListener('click', function() {
  const sidebar = document.querySelector('.sidebar');
  toggleClass(sidebar, 'open');
});

document.getElementById('new-task-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const taskInput = document.getElementById('new-task-input');
  const taskText = taskInput.value.trim();

  const activeListId = document.querySelector('.sidebar-list-item.active-sidebar-item')?.getAttribute('data-id');
  
  if (taskText && activeListId) {
    addListItem(taskText, activeListId);
    taskInput.value = '';
  } else {
    console.error('No task text provided or no active list selected');
  }
});

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-task-btn')) {
    const li = event.target.parentElement;
    li.parentNode.removeChild(li);
    // TODO: Handle deletion in the backend
  }
});

document.addEventListener('DOMContentLoaded', function() {
  setupModal(".modal", ".open-modal", ".close-modal", "#new-task-form");
  setupModal(".list-modal", ".listopen-modal", ".listclose-modal", "#new-list-form");

  // Fetch lists from the backend and update sidebar on page load
  fetchAllLists();

  document.getElementById('new-list-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const listInput = document.getElementById('new-list-input');
    const listName = listInput.value.trim();

    if (listName) {
      addNewList(listName);
      listInput.value = '';  // Clear the input after submitting
    } else {
      console.error('No list name provided');
    }
  });

  const dateSortButton = document.getElementById('sort-list-date');
  const nameSortButton = document.getElementById('sort-list-name');

  dateSortButton.addEventListener('click', function() {
    // Get the current sort type
    const currentSortType = this.getAttribute('data-sort-type') || 'list-date-asc';
  
    // Determine the new sort type
    const newSortType = currentSortType === 'list-date-asc' ? 'list-date-desc' : 'list-date-asc';
  
    // Update the sort type on the button
    this.setAttribute('data-sort-type', newSortType);
  
    // Sort the data
    sortData(newSortType);
  });
  
  nameSortButton.addEventListener('click', function() {
    // Get the current sort type
    const currentSortType = this.getAttribute('data-sort-type') || 'list-name-asc';
  
    // Determine the new sort type
    const newSortType = currentSortType === 'list-name-asc' ? 'list-name-desc' : 'list-name-asc';
  
    // Update the sort type on the button
    this.setAttribute('data-sort-type', newSortType);
  
    // Sort the data
    sortData(newSortType);
  });
});

function sortData(sortType) {
  // Fetch the data
  fetch('api/example.php')
    .then(response => response.json())
    .then(data => {
      if(Array.isArray(data)){
        // Sort the data
        if(sortType === 'list-date-asc') {
          data.sort((a, b) => new Date(a.created) - new Date(b.created));
        } else if(sortType === 'list-date-desc') {
          data.sort((a, b) => new Date(b.created) - new Date(a.created));
        } else if(sortType === 'list-name-asc') {
          data.sort((a, b) => a.name.localeCompare(b.name));
        } else if(sortType === 'list-name-desc') {
          data.sort((a, b) => b.name.localeCompare(a.name));
        }

        // Update the UI with the sorted data
        updateSidebar(data);
      } else {
        console.error('Data received is not an array:', data);
      }
    })
    .catch(error => console.error('Error fetching lists:', error));
}


// Modals
function setupModal(modalSelector, openButtonSelector, closeButtonSelector, formSelector) {
  const modal = document.querySelector(modalSelector);
  const openModalButton = document.querySelector(openButtonSelector);
  const closeModalButton = document.querySelector(closeButtonSelector);
  const form = modal.querySelector(formSelector);

  if (!form) {
      console.error("Form not found within the modal using selector:", formSelector);
      return; // Exit the function if form is not found
  }

  openModalButton.addEventListener('click', () => modal.showModal());
  closeModalButton.addEventListener('click', () => {
    modal.close();
    form.reset();
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
      form.reset();
    }
  });
}
