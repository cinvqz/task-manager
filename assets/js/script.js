// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskId = `task_${nextId++}`;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return taskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-task-id', task.id);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const taskName = document.createElement('h5');
    taskName.classList.add('card-title');
    taskName.textContent = task.name;
    cardBody.appendChild(taskName);

    const dueDate = document.createElement('p');
    dueDate.classList.add('card-text');
    dueDate.textContent = 'Due Date: ' + task.dueDate;
    cardBody.appendChild(dueDate);

    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = 'Description: ' + task.description;
    cardBody.appendChild(description);

    const deletion =document.createElement('button');
    deletion.classList.add('deletion-button');
    deletion.textContent = 'Delete';
    deletion.addEventListener('click', function() {
        card.remove();
    });
    cardBody.appendChild(deletion);

    card.appendChild(cardBody);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskListContainer = document.getElementById('taskListContainer');

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        taskListContainer.appendChild(taskCard);
    });

    $('.card').draggable({
        revert: 'invalid',
        helper: 'clone',
        zIndex: 100
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const description = document.getElementById('description').value;

    if (taskName && dueDate && description) {
        const newTask = {
            id: generateTaskId(),
            name: taskName,
            dueDate: dueDate,
            description: description
        };
        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
        $('#staticBackdrop').modal('hide');
        document.getElementById('form').reset();
    } else {
        alert('Please fill in all fields.');
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = event.target.closest('.card').getAttribute('data-task-id');
    const index = taskList.findIndex(task => task.id === taskId);
    if (index !== -1) {
        taskList.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }
}

// Todo: create a function to handle dropping a task into a new status lane


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    // form submission
    document.getElementById('form').addEventListener('submit', handleAddTask);

    // task deletion
    document.getElementById('taskListContainer').addEventListener('click', handleDeleteTask);


    // Make lanes droppable
    $('.card-container').droppable({
        accept: '.card',
        drop: function (event, ui) {
            const card = ui.draggable;
            const taskId = card.attr('data-task-id');
            const targetLaneId = $(this).attr('id');
            const targetLane = $(this).find('.card-container');

            // Move the card to the target lane
            card.appendTo(targetLane);
           
        }
    });
});
