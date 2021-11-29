// Model

let todos = [
  { id: 3, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 1, content: 'Javascript', completed: false },
];

let mode = 'all';

const filterTodos = mode => {
  return mode === 'all'
    ? todos
    : mode === 'active'
    ? todos.filter(todo => !todo.completed)
    : todos.filter(todo => todo.completed);
};
const generateId = () => Math.max(...todos.map(todo => todo.id), 0) + 1;

const addTodo = content => {
  todos = [{ id: generateId(), content, completed: false }, ...todos];
  render(mode);
};

const removeTodo = id => {
  todos = todos.filter(todo => todo.id !== +id);
  render(mode);
};

const updateTodo = (id, content) => {
  todos = todos.map(todo => (todo.id === +id ? { ...todo, content } : todo));
  render(mode);
};

const toggleCompletedById = id => {
  todos = todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo));
  render(mode);
};

const allToggleCompleted = flag => {
  todos = todos.map(todo => ({ ...todo, completed: flag }));
  render(mode);
};

const removeCompleteTodo = () => {
  todos = todos.filter(todo => !todo.completed);
  render(mode);
};

// Dom
const $newTodo = document.querySelector('.new-todo');
const $toggleAll = document.getElementById('toggle-all');
const $todoList = document.querySelector('.todo-list');
const $todoEdit = document.querySelector('.edit');
const $todoCount = document.querySelector('.todo-count');
const $toggleBtn = document.querySelector('.toggle');
const $all = document.getElementById('all');
const $active = document.getElementById('active');
const $completed = document.getElementById('completed');
const $clearCompleted = document.querySelector('.clear-completed');

const render = mode => {
  $todoList.innerHTML = filterTodos(mode)
    .map(
      ({ id, content, completed }) =>
        `<li data-id=${id}>
            <div class="view">
              <input type="checkbox" class="toggle" ${completed ? ' checked' : ''}/>
              <label>${content}</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value=${content} />
          </li>`
    )
    .join('');
  showCount();
  showClearCompleted();
};

//add, delete 할 때만 수행되면 됨
const showCount = () =>
  ($todoCount.textContent = todos.length > 1 ? `${todos.length} items left` : `${todos.length} item left`);

const showClearCompleted = () => {
  $clearCompleted.style.display = todos.filter(todo => todo.completed).length ? '' : 'none';
};

$newTodo.onkeyup = e => {
  if (e.key !== 'Enter') return;
  const content = $newTodo.value.trim();
  if (content !== '') {
    addTodo(content);
  }
  $newTodo.value = '';
};

let flag = false;
$toggleAll.addEventListener('click', function () {
  flag = !flag;
  allToggleCompleted(flag);
});

$todoList.addEventListener('click', function ({ target }) {
  const id = target.parentNode.parentNode.dataset.id;
  if (target.matches('.view > .destroy')) removeTodo(id);
  if (target.matches('.toggle')) toggleCompletedById(id);
});

$todoList.addEventListener('dblclick', function ({ target }) {
  if (!target.matches('.view > label')) return;
  const $li = target.parentNode.parentNode;
  const id = target.parentNode.parentNode.dataset.id;
  $li.classList.add('editing');
  const $edit = target.parentNode.nextElementSibling;
  $edit.onkeyup = e => {
    if (e.key !== 'Enter') return;
    const content = $edit.value.trim();
    if (content !== '') {
      updateTodo(id, content);
    }
  };
});

$clearCompleted.addEventListener('click', function () {
  removeCompleteTodo();
});

$all.addEventListener('click', () => {
  mode = 'all';
  $all.classList.add('selected');
  $active.classList.remove('selected');
  $completed.classList.remove('selected');
  render(mode);
});


$active.addEventListener('click', () => {
  mode = 'active';
  $active.classList.add('selected');
  $all.classList.remove('selected');
  $completed.classList.remove('selected');
  render(mode);
});


$completed.addEventListener('click', () => {
  mode = 'completed';
  $completed.classList.add('selected');
  $active.classList.remove('selected');
  $all.classList.remove('selected');
  render(mode);
});

render(mode);
