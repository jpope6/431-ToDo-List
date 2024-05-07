// main.js
import { Sidebar } from './sidebar.js';
import { ListManager } from './lists.js';

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = new Sidebar('.sidebar');
    const listManager = new ListManager('.sidebar-lists');
});
