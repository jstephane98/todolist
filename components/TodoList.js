import { createElement } from "../js/dom.js";

/**
 * @typedef {object} Todo 
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class TodoList {

    /**@type {Todo[]} */
    #todos = [];

    /**@type {HTMLUListElement[]} */
    #listElement = [];

    /**
     * @param {Todo[]} todos 
     */
    constructor (todos) {
        this.#todos = todos;
    }

    /**
     * @param {HTMLElement} element 
     * @returns
     */
    appendTo(element) {
        element.innerHTML = `<form id="add-task">
        <input type="text" name="title" class="title" placeholder="Enter new task">
        <button type="submit">
            <i class='bx bx-plus'></i> <span>Add</span>
        </button>
    </form>

    <div class="filter">
        <button type="button" class="all active" data-filter="all">All</button>
        <button type="button" class="completed" data-filter="completed">Completed</button>
        <button type="button" class="todo" data-filter="todo">To do</button>
    </div>

    <ul id="task-list" class="task-list">
    </ul>`

        this.#listElement = element.querySelector('.task-list');
        for (const todo of this.#todos) {
            const t = new TodoListItem(todo)
            this.#listElement.append(t.element)
        }

        element.querySelector('#add-task').addEventListener('submit', (e) => this.#onSubmit(e));
        element.querySelectorAll('.filter button').forEach((button) => {
            button.addEventListener('click', (e) => this.#toggleFilter(e))
        })
    }

    /**
     * @param {SubmitEvent} e 
     */
    #onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        let title = new FormData(form).get('title').toString().trim();
        if(title === '') {
            return;
        }

        const todo = {
            id: Date.now(),
            title: title,
            completed: false
        }
        const item = new TodoListItem(todo);
        this.#listElement.prepend(item.element)
        form.reset();
    }

    /**
     * @param {PointerEvent} e 
     */
    #toggleFilter(e) {
        e.preventDefault();
        const filter = e.currentTarget.getAttribute('data-filter');
        e.currentTarget.parentElement.querySelector('.active').classList.remove('active')
        e.currentTarget.classList.add('active')
        switch (filter) {
            case 'completed':
                this.#listElement.classList.add('hide-todo');
                this.#listElement.classList.remove('hide-completed');
                break;
            case 'todo':
                this.#listElement.classList.add('hide-completed');
                this.#listElement.classList.remove('hide-todo');
                break;
            default:
                this.#listElement.classList.remove('hide-completed');
                this.#listElement.classList.remove('hide-todo');
                break;
        }
    }
}

class TodoListItem {
    #element;

    /**
     * @param {Todo} todo 
     */
    constructor(todo) {
        const id = `todo-${todo.id}`;
        const classCompleted = todo.completed ? 'is_completed' : 'todo';
        const li = createElement('li', {
            class: `task ${classCompleted}`,
            id: "task-element"
        });
        this.#element = li
        const divFirst = createElement('div', {
            class: "first"
        })
        const checkbox = createElement('input', {
            type: 'checkbox',
            id: id,
            name: 'do',
            checked: todo.completed
        })
        const label = createElement('label', {
            for: id
        })
        label.innerText = todo.title

        divFirst.append(checkbox);
        divFirst.append(label);
        li.append(divFirst);

        const divActions = createElement('div', {
            class: "actions"
        });
        const buttonDelete = createElement('button', {
            class: "delete"
        })
        buttonDelete.innerHTML = '<i class="bx bxs-trash"></i>'

        divActions.append(buttonDelete)
        li.append(divActions)
        this.completed(checkbox)

        checkbox.addEventListener('change', (e) => this.completed(e.currentTarget));
        buttonDelete.addEventListener('click', (e) => this.remove(e));
    }

    /**
     * @return {HTMLElement}  
     */
    get element () {
        return this.#element;
    }

    /**
     * @param {HTMLInputElement} checkbox 
     */
    completed(checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add('is_completed')
            this.#element.classList.remove('todo')
        }
        else {
            this.#element.classList.remove('is_completed')
            this.#element.classList.add('todo')
        }
    }

    /**
     * @param {PointerEvent} e 
     */
    remove(e) {
        e.preventDefault();
        this.#element.remove();
    }
}