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

// List management
let lists = ["List 1", "List 2", "List 3"];
const sidebarLists = document.querySelector('.sidebar-lists');

function createListItem(listItemName) {
  const li = document.createElement('p');
  li.classList.add('sidebar-list-item');
  li.id = listItemName;
  li.textContent = listItemName;
  const editListButton = document.createElement('button');
  editListButton.classList.add('edit-list-button');
  editListButton.textContent = 'Edit';
  const deleteListButton = document.createElement('button');
  deleteListButton.classList.add('delete-list-button');
  deleteListButton.textContent = 'X';
  editListButton.addEventListener('click', editListName);
  deleteListButton.addEventListener('click', deleteList);
  li.appendChild(editListButton);
  li.appendChild(deleteListButton);
  li.addEventListener('click', handleClick);
  return li;
}

lists.forEach(listItem => {
  const li = createListItem(listItem);
  sidebarLists.appendChild(li);
});

function handleClick(event) {
  const listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(item => item.classList.remove('active-sidebar-item'));
  event.target.classList.add('active-sidebar-item');
}

function deleteList(event) {
  if (confirm('Are you sure you want to delete this item?')) {
    const li = event.target.parentElement;
    li.parentNode.removeChild(li);
    // TODO: Handle deletion in the backend
  }
}

function editListName(event) {
  const currentText = event.target.parentNode.firstChild.textContent;
  const newText = prompt('Edit list name:', currentText);
  if (newText) {
    event.target.parentNode.firstChild.textContent = newText;
    // TODO: Update list name in the backend
  }
}

function fetchAllLists() {
  fetch('api/example.php', {method: 'GET'}).then(response => response.json()).then(data => {
    console.log("Fetched lists:", data);
    updateSidebar(data);
  }).catch(error => console.error('Error fetching lists:', error));
}

function addNewList(listName) {
  console.log("Sending list name:", listName);
  fetch('api/example.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: listName })
  })
  .then(response => response.json())
  .then(data => {
      console.log('List added:', data);
      fetchAllLists();  // Refresh the list display
  })
  .catch(error => console.error('Error adding list:', error));
}

function deleteList(listId) {
  fetch(`api/example.php?id=${listId}`, { method: 'DELETE' })
  .then(response => response.json())
  .then(data => {
      console.log('List deleted:', data);
      fetchAllLists();  // Refresh the list display
  })
  .catch(error => console.error('Error deleting list:', error));
}

function updateListName(listId, newName) {
  fetch('api/example.php', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: listId, name: newName })
  })
  .then(response => response.json())
  .then(data => {
      console.log('List updated:', data);
      fetchAllLists();  // Refresh the list display
  })
  .catch(error => console.error('Error updating list:', error));
}

function updateSidebar(lists) {
  const sidebarLists = document.querySelector('.sidebar-lists');
  sidebarLists.innerHTML = '';

  lists.forEach(list => {
    const li = createListItem(list.name);
    sidebarLists.appendChild(li);
  })
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
  if (taskText) {
    addTaskToList(taskText);
    taskInput.value = '';
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
  setupModal(".modal", ".open-modal", ".close-modal");
  setupModal(".list-modal", ".listopen-modal", ".listclose-modal");

  document.getElementById('new-list-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const listInput = document.getElementById('new-list-input');
    const listName = listInput.value.trim();
    console.log("Trimmed Name:", listName);  // Debugging

    if (listName) {
      addNewList(listName);
      listInput.value = '';  // Clear the input after submitting
    } else {
      console.error('No list name provided');
    }
  });
});


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

setupModal(".modal", ".open-modal", ".close-modal", "#new-task-form");
setupModal(".list-modal", ".listopen-modal", ".listclose-modal", "#new-list-form");
