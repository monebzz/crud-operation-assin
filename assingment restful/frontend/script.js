const API_URL = 'http://localhost:3000/api/tasks';

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        displayError('Error fetching tasks. Please try again later.');
    }
}

async function createTask() {
    const title = document.getElementById('titleInput').value;
    const description = document.getElementById('descriptionInput').value;
    if (!title || !description) return displayError("Please fill in title and description.");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        document.getElementById('titleInput').value = '';
        document.getElementById('descriptionInput').value = '';
        fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
        displayError('Error creating task. Please try again later.');
    }
}

async function updateTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
        displayError('Error updating task. Please try again later.');
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        displayError('Error deleting task. Please try again later.');
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <button onclick="updateTask('${task._id}', !${task.completed})">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(taskElement);
    });
}

function displayError(message) {
    const errorElement = document.createElement('p');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    document.getElementById('taskList').appendChild(errorElement);
}
// ... (Previous code remains the same)

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div>
                <input type="text" class="edit-input" value="${task.title}" data-field="title" data-id="${task._id}">
                <input type="text" class="edit-input" value="${task.description}" data-field="description" data-id="${task._id}">
            </div>
            <button onclick="updateTask('${task._id}', !${task.completed})">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
            <button onclick="saveTaskChanges(this)">Save Changes</button>
        `;
        taskList.appendChild(taskElement);
        //Adding Event Listener
        taskElement.addEventListener("click", function() {
            let inputs = this.querySelectorAll(".edit-input");
            inputs.forEach(input => input.style.display = "block");
        });
    });
}

async function saveTaskChanges(button) {
    const taskItem = button.parentNode;
    const taskId = taskItem.querySelector('.edit-input[data-field="title"]').dataset.id;
    const title = taskItem.querySelector('.edit-input[data-field="title"]').value;
    const description = taskItem.querySelector('.edit-input[data-field="description"]').value;

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchTasks();
    } catch (error) {
        console.error('Error saving task changes:', error);
        displayError('Error saving changes. Please try again later.');
    }
}


// ... (Rest of the code remains the same)

fetchTasks(); // Fetch tasks on page load
