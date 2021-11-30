// Model
let todos = [
  { id: 3, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 1, content: 'Javascript', completed: false },
];

const setTodos = newTodos => {
  todos = newTodos;
  render();
};

const generateId = () => Math.max(...todos.map(todo => todo.id), 0) + 1;

const addTodo = content => setTodos([{ id: generateId(), content, completed: false }, ...todos]);

const removeTodo = id => setTodos(todos.filter(todo => todo.id !== +id));

const updateTodo = (id, content) => setTodos(todos.map(todo => (todo.id === +id ? { ...todo, content } : todo)));

const toggleCompletedById = id =>
  setTodos(todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo)));

const allToggleCompleted = toggleAllFlag => setTodos(todos.map(todo => ({ ...todo, completed: toggleAllFlag })));

const removeCompleteTodo = () => setTodos(todos.filter(todo => !todo.completed));

// Dom
const $newTodo = document.querySelector('.new-todo');
const $toggleAll = document.getElementById('toggle-all');
const $todoList = document.querySelector('.todo-list');
const $todoEdit = document.querySelector('.edit');
const $todoCount = document.querySelector('.todo-count');
const $all = document.getElementById('all');
const $active = document.getElementById('active');
const $completed = document.getElementById('completed');
const $clearCompleted = document.querySelector('.clear-completed');

// Controller
const MODE_TYPE = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

const modeHandler = (function () {
  let mode = MODE_TYPE.All;

  return {
    fetchTodos() {
      return mode === MODE_TYPE.All
        ? todos
        : mode === MODE_TYPE.ACTIVE
        ? todos.filter(todo => !todo.completed)
        : todos.filter(todo => todo.completed);
    },
    getMode() {
      return mode;
    },
    setMode(newMode) {
      mode = newMode;
      $all.classList.toggle('selected', this.getMode() === MODE_TYPE.All);
      $active.classList.toggle('selected', this.getMode() === MODE_TYPE.ACTIVE);
      $completed.classList.toggle('selected', this.getMode() === MODE_TYPE.COMPLETED);
      render();
    },
  };
})();

const toggleAllHandler = (function () {
  let completedFlag = false;

  return {
    getCompletedFlag() {
      return completedFlag;
    },
    reverseCompletedFlag() {
      completedFlag = !completedFlag;
    },
  };
})();

const updateItemCount = () =>
  ($todoCount.textContent = todos.length > 1 ? `${todos.length} items left` : `${todos.length} item left`);

const isVisibleClearCompleted = () => {
  $clearCompleted.style.display = todos.filter(todo => todo.completed).length ? '' : 'none';
};

// View
const render = () => {
  $todoList.innerHTML = '';
  const $fragment = document.createDocumentFragment();
  modeHandler.fetchTodos().forEach(({ id, content, completed }) => {
    const $li = document.createElement('li');
    $li.dataset.id = id;

    const $div = document.createElement('div');
    $div.classList.add('view');

    const $input = document.createElement('input');
    $input.setAttribute('type', 'checkbox');
    $input.classList.add('toggle');
    if (completed) $input.setAttribute('checked', '');

    const $label = document.createElement('label');
    $label.textContent = content;

    const $button = document.createElement('button');
    $button.classList.add('destroy');

    $div.append($input, $label, $button);

    const $editInput = document.createElement('input');
    $editInput.classList.add('edit');
    $editInput.setAttribute('value', content);

    $li.append($div, $editInput);
    $fragment.append($li);
  });

  $todoList.append($fragment);

  updateItemCount();
  isVisibleClearCompleted();
};

// event handler
$newTodo.addEventListener('keyup', e => {
  if (e.key !== 'Enter') return;

  const content = $newTodo.value.trim();
  if (content !== '') {
    addTodo(content);
  }
  $newTodo.value = '';
});

$toggleAll.addEventListener('click', () => {
  toggleAllHandler.reverseCompletedFlag();
  allToggleCompleted(toggleAllHandler.getCompletedFlag());
});

$todoList.addEventListener('click', ({ target }) => {
  const id = target.parentNode.parentNode.dataset.id;
  if (target.matches('.destroy')) removeTodo(id);
  if (target.matches('.toggle')) toggleCompletedById(id);
});

$todoList.addEventListener('dblclick', ({ target }) => {
  if (!target.matches('label')) return;

  const $li = target.parentNode.parentNode;
  $li.classList.add('editing');

  const $edit = target.parentNode.nextElementSibling;

  $edit.addEventListener('keyup', e => {
    if (e.key !== 'Enter') return;
    const content = $edit.value.trim();
    if (content !== '') {
      updateTodo($li.dataset.id, content);
    }
  });
});

$all.addEventListener('click', () => modeHandler.setMode(MODE_TYPE.ALL));

$active.addEventListener('click', () => modeHandler.setMode(MODE_TYPE.ACTIVE));

$completed.addEventListener('click', () => modeHandler.setMode(MODE_TYPE.COMPLETED));

$clearCompleted.addEventListener('click', removeCompleteTodo);

window.addEventListener('DOMContentLoaded', render);
