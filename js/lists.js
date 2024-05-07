import { confirmAction, promptForInput } from './utilities.js';

export class ListManager {
    constructor(listContainerSelector) {
        this.container = document.querySelector(listContainerSelector);
        this.lists = ["List 1", "List 2", "List 3"];
        this.renderLists();
    }

    renderLists() {
        this.lists.forEach(list => {
            const listItem = this.createListItem(list);
            this.container.appendChild(listItem);
        });
    }

    createListItem(listName) {
        const li = document.createElement('p');
        li.className = 'sidebar-list-item';
        li.id = listName;
        li.textContent = listName;
        li.appendChild(this.createEditButton());
        li.appendChild(this.createDeleteButton());
        li.addEventListener('click', this.handleListClick.bind(this));
        return li;
    }

    createEditButton() {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.className = 'edit-list-button';
        button.addEventListener('click', (event) => this.editListName(event));
        return button;
    }

    createDeleteButton() {
        const button = document.createElement('button');
        button.textContent = 'X';
        button.className = 'delete-list-button';
        button.addEventListener('click', (event) => this.deleteList(event));
        return button;
    }

    handleListClick(event) {
        this.container.querySelectorAll('.sidebar-list-item').forEach(item => item.classList.remove('active-sidebar-item'));
        event.currentTarget.classList.add('active-sidebar-item');
    }

    deleteList(event) {
        if (confirmAction('Are you sure you want to delete this item?')) {
            const li = event.target.parentNode;
            li.parentNode.removeChild(li);
        }
    }

    editListName(event) {
        const currentText = event.target.parentNode.textContent;
        const newText = promptForInput('Edit list name:', currentText);
        if (newText) {
            event.target.parentNode.firstChild.textContent = newText;
        }
    }
}
