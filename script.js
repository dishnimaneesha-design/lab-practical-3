// Element Selectors
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const errorMessage = document.getElementById('errorMessage');
const emptyMessage = document.getElementById('emptyMessage');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
let currentFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Task 3 & Task 6: Add Task with Validation
function addTask() {
    const text = taskInput.value.trim();

    // Validation (Prevent empty or space-only input)
    if (text === '') {
        errorMessage.classList.remove('d-none');
        return;
    }

    errorMessage.classList.add('d-none');

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = ''; // Clear input field
}

// Event Listeners for Adding Task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Save to Local Storage & Render UI
function saveAndRender() {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    renderTasks();
}

// Render Tasks based on Filters & Update UI
function renderTasks() {
    taskList.innerHTML = '';

    // Task 7: Filter Logic
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    // Empty state visibility
    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove('d-none');
    } else {
        emptyMessage.classList.add('d-none');
    }

    // Task Items Generation
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';

        li.innerHTML = `
            <div class="form-check d-flex align-items-center gap-2">
                <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="${task.completed ? 'completed-task' : ''} fs-6">${escapeHtml(task.text)}</span>
            </div>
            <button class="btn btn-danger btn-sm px-3" onclick="deleteTask(${task.id})">Delete</button>
        `;

        taskList.appendChild(li);
    });

    // Task 8: Update Counter
    updateCounter();
}

// Helper to escape HTML characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Task 4: Mark Task as Completed / Active
window.toggleTask = function (id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
};

// Task 5: Delete Task
window.deleteTask = function (id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
};

// Task 8: Update Remaining Task Counter
function updateCounter() {
    const activeCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${activeCount} remaining`;
}

// Task 8: Clear Completed Tasks
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
});

// Task 7: Filter Event Handlers
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    });
});