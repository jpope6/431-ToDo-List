// Open sidebar
document.querySelector('.menu-button').addEventListener('click', function() {
  var sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  } else {
    sidebar.classList.add('open');
  }
});

// Get all the lists and put them in the siderbar
// NOTE: this will need to be changed to use out API 
let lists = ["List 1", "List 2", "List 3"]
var sidebarLists = document.querySelector('.sidebar-lists');

// Function to handle list item click
function handleClick(event) {
  // Remove the class 'active' from all list items
  var listItems = document.querySelectorAll('.sidebar-list-item');
  listItems.forEach(function(item) {
    item.classList.remove('active-sidebar-item');
  });

  // Add the class 'active' to the clicked list item
  event.target.classList.add('active-sidebar-item');
}

// Loop through the lists array
lists.forEach(function(listItem) {
  // Create a new list item element
  var li = document.createElement('p');

  // Add class to the list item
  li.classList.add('sidebar-list-item');

  // Set the text content of the list item
  li.textContent = listItem;
  
  // Creates a button to edit the name of the list.
  const editListButton = document.createElement('button');
  editListButton.classList.add('edit-list-button');
  editListButton.textContent = 'edit';
  editListButton.addEventListener('click', editListName);
  li.appendChild(editListButton);

  // Creates a delete button to the end of the list item.
  const deleteTaskButton = document.createElement('button');
  deleteTaskButton.classList.add('delete-list-button');
  deleteTaskButton.textContent = 'x';

  // Event handler for the delete button.
  deleteTaskButton.addEventListener('click', deleteList) 

  // Adds the delete button to the list item.
  li.appendChild(deleteTaskButton);

  // Add event listener to the list item
  li.addEventListener('click', handleClick);

  // Append the list item to the sidebar-lists div
  sidebarLists.appendChild(li);
});

// Function to handle list item deletion
function deleteList(event) {
  // Display a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this item?');
  // If the user clicked "OK", delete the item
  if (confirmation) {
    //Needs to be changed to use our API/backend.
    event.target.parentNode.remove();
  }
}

function editListName(event) {
  // Get the current text of the list item
  var currentText = event.target.parentNode.textContent;

  // Ask the user for new text
  var newText = prompt('Edit list name:', currentText);

  // Will update list name.
  if (newText) {
    // Need to be changed to use our API/backend.
    event.target.parentNode.textContent = newText;
  }
}

document.getElementById('new-task-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const taskInput = document.getElementById('new-task-input');
  const taskText = taskInput.value.trim();
  if (taskText) {
      addTaskToList(taskText);
      taskInput.value = ''; // Clear input after adding
  }
});

function addTaskToList(text) {
  const list = document.querySelector('.list');
  const li = document.createElement('li');
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

  const currentDate = new Date();
  li.setAttribute('data-date', currentDate.toISOString());

  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(deleteButton);
  list.appendChild(li);
}

// Event listener for delete buttons to handle task removal
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-task-btn')) {
    const li = event.target.parentElement;
    li.parentNode.removeChild(li);
    // TODO Later; Handle deletion in the backend
  }
});


document.querySelectorAll('.sort-button').forEach(button => {
  button.addEventListener('click', function() {
      // Determine current sorting direction
      const currentSort = this.getAttribute('data-sort');
      
      // Toggle sort direction and update button text and attribute
      if (currentSort.includes('asc')) {
          this.setAttribute('data-sort', currentSort.replace('asc', 'desc'));
          this.firstChild.classList.replace('fa-sort-alpha-down', 'fa-sort-alpha-up');
          this.firstChild.classList.replace('fa-sort-numeric-down', 'fa-sort-numeric-up');
      } else {
          this.setAttribute('data-sort', currentSort.replace('desc', 'asc'));
          this.firstChild.classList.replace('fa-sort-alpha-up', 'fa-sort-alpha-down');
          this.firstChild.classList.replace('fa-sort-numeric-up', 'fa-sort-numeric-down');
      }

      // Update sorting of the list
      sortTasks(this.id, this.getAttribute('data-sort'));
  });
});

function sortTasks(sortBy, direction) {
  const list = document.querySelector('.list');
  const items = Array.from(list.querySelectorAll('li'));

  // Sorting logic
  items.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'sort-name') {
          valA = a.querySelector('label').textContent.toLowerCase();
          valB = b.querySelector('label').textContent.toLowerCase();
      } else {
          valA = new Date(a.dataset.date);
          valB = new Date(b.dataset.date);
      }

      if (direction === 'name-asc' || direction === 'date-asc') {
          return valA > valB ? 1 : -1;
      } else {
          return valA < valB ? 1 : -1;
      }
  });

  // Re-append items to list in sorted order
  items.forEach(item => list.appendChild(item));
}


// Get the current date and put it in the .date div
let currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth();
let year = currentDate.getFullYear();

let monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let currentDateStr = monthNames[month] + " " + day + ", " + year;

document.querySelector('.date p').innerHTML = currentDateStr
