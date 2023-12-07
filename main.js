const bookShelf = [];
const RENDER_EVENT = "render-todo";

function generateID() {
  return +new Date();
}

function generateBookShelfObj(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBookId(bookId) {
  for (const bookItem of bookShelf) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookShelf) {
    if (bookShelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function addBookShelfData() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearBook = document.getElementById("inputBookYear").value;

  const generateId = generateID();
  const bookShelfObj = generateBookShelfObj(
    generateId,
    titleBook,
    authorBook,
    yearBook
  );
  bookShelf.push(bookShelfObj);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function createBookShelf(bookShelfObj) {
  const { id, title, author, year, isCompleted } = bookShelfObj;

  const createTitle = document.createElement("h3");
  createTitle.innerText = title;

  const createAuthor = document.createElement("p");
  createAuthor.innerText = "Penulis : " + author;

  const createYear = document.createElement("p");
  createYear.innerText = "Tahun Terbit : " + year;

  const createContainer = document.createElement("div");
  createContainer.classList.add("inner-container");
  createContainer.append(createTitle, createAuthor, createYear);

  const container = document.createElement("div");
  container.classList.add("outer-container");
  container.append(createContainer);
  container.setAttribute("id", `book-${id}`);

  const bookshelfContainer = document.getElementById("book-item");
  bookshelfContainer.appendChild(container);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "X";
  deleteButton.addEventListener("click", function () {
    deleteBookShelfList(id);
  });

  if (isCompleted) {
    const statusFinish = document.createElement("span");
    statusFinish.classList.add("span-status-belum");
    statusFinish.innerText = "Belum Selesai Baca";

    statusFinish.addEventListener("click", function () {
      moveBookToNotFinish(id);
    });

    container.append(deleteButton);
    createContainer.append(statusFinish);
  } else {
    const statusNotFinish = document.createElement("span");
    statusNotFinish.classList.add("span-status-sudah");
    statusNotFinish.innerText = "Selesai Baca";

    statusNotFinish.addEventListener("click", function () {
      moveBookToFinish(id);
    });
    container.append(deleteButton);
    createContainer.append(statusNotFinish);
  }

  return container;
}

function moveBookToFinish(bookId) {
  const bookTarget = findBookId(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function moveBookToNotFinish(bookId) {
  const bookTarget = findBookId(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBookShelfList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookShelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookShelfData();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const incompletedReading = document.getElementById("book-item");
  incompletedReading.innerHTML = "";

  const completedReading = document.getElementById("book-item-finish");
  completedReading.innerHTML = "";

  console.log(bookShelf);
  for (const bookItem of bookShelf) {
    const bookShelfElement = createBookShelf(bookItem);
    if (bookItem.isCompleted) {
      completedReading.append(bookShelfElement);
    } else {
      incompletedReading.append(bookShelfElement);
    }
  }
});
