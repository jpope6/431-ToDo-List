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

  // Add event listener to the list item
  li.addEventListener('click', handleClick);

  // Append the list item to the sidebar-lists div
  sidebarLists.appendChild(li);
});

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

  li.appendChild(input);
  li.appendChild(label);
  list.appendChild(li);
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
