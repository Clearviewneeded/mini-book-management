// script.js - clean DOM-based book manager

const BOOK_IMAGE = "https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg";

let books = []; // in-memory array
let sortAZ = true; // next sort direction: true => A→Z

// DOM refs
const form = document.getElementById('add-book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const categorySelect = document.getElementById('category');
const booksGrid = document.getElementById('books-grid');
const emptyMsg = document.getElementById('empty-msg');
const sortBtn = document.getElementById('sort-btn');
const filterSelect = document.getElementById('filter-select');
const clearFormBtn = document.getElementById('clear-form');

function createBookObject(title, author, category){
  return {
    id: cryptoRandomId(),
    title: title.trim(),
    author: author.trim(),
    category,
    imageUrl: BOOK_IMAGE
  };
}

// simple unique id (not cryptographically required)
function cryptoRandomId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function addBook(e){
  e.preventDefault();
  const title = titleInput.value;
  const author = authorInput.value;
  const category = categorySelect.value;

  if(!title || !author || !category){
    alert('Please fill all fields');
    return;
  }

  const book = createBookObject(title, author, category);
  books.push(book);
  form.reset();
  renderBooks();
}

function deleteBookById(id){
  books = books.filter(b => b.id !== id);
  renderBooks();
}

function renderBooks(){
  // apply filter
  const filter = filterSelect.value || 'All';
  let visible = (filter === 'All') ? books.slice() : books.filter(b => b.category === filter);

  // show empty message
  booksGrid.innerHTML = '';
  if(visible.length === 0){
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
  }

  // create cards
  visible.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card card';

    // image
    const img = document.createElement('img');
    img.src = book.imageUrl;
    img.alt = book.title;
    card.appendChild(img);

    // body
    const body = document.createElement('div');
    body.className = 'card-body';

    const t = document.createElement('div');
    t.className = 'card-title';
    t.textContent = book.title;

    const a = document.createElement('div');
    a.className = 'card-meta';
    a.textContent = `Author: ${book.author}`;

    const c = document.createElement('div');
    c.className = 'card-meta';
    c.textContent = `Category: ${book.category}`;

    body.appendChild(t);
    body.appendChild(a);
    body.appendChild(c);

    // bottom row
    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';

    const idspan = document.createElement('span');
    idspan.className = 'muted';
    idspan.style.fontSize = '12px';
    idspan.textContent = '';

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
      if(confirm(`Delete "${book.title}"?`)) deleteBookById(book.id);
    });

    bottom.appendChild(idspan);
    bottom.appendChild(del);

    body.appendChild(bottom);
    card.appendChild(body);

    booksGrid.appendChild(card);
  });
}

function sortBooks(){
  // toggle sort direction
  if(sortAZ){
    books.sort((a,b) => a.title.localeCompare(b.title, undefined, {sensitivity:'base'}));
    sortBtn.textContent = 'Sort by Title Z → A';
  } else {
    books.sort((a,b) => b.title.localeCompare(a.title, undefined, {sensitivity:'base'}));
    sortBtn.textContent = 'Sort by Title A → Z';
  }
  sortAZ = !sortAZ;
  renderBooks();
}

// when filter changes, re-render (no change to underlying array)
function onFilterChange(){
  renderBooks();
}

function clearForm(){
  form.reset();
}

// Attach events
form.addEventListener('submit', addBook);
sortBtn.addEventListener('click', sortBooks);
filterSelect.addEventListener('change', onFilterChange);
clearFormBtn.addEventListener('click', clearForm);

// initial render
renderBooks();
