export class Sidebar {
    constructor(selector) {
        this.sidebar = document.querySelector(selector);
        this.initEvents();
    }

    toggle() {
        this.sidebar.classList.toggle('open');
    }

    initEvents() {
        this.sidebar.querySelector('.menu-button').addEventListener('click', () => this.toggle());
    }
}
