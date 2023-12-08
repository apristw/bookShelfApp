const bookShelf = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Maaf Browser Kamu Tidak Mendukung Local Storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsedString = JSON.stringify(bookShelf);
    localStorage.setItem(STORAGE_KEY, parsedString);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function getDataFromLocalStorage() {
  const dataLocalStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataLocalStorage);

  if (data !== null) {
    for (const bookShelfData of data) {
      bookShelf.push(bookShelfData);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

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
  const statusBook = document.getElementById("inputBookIsComplete").checked;

  const generateId = generateID();
  const bookShelfObj = generateBookShelfObj(
    generateId,
    titleBook,
    authorBook,
    yearBook,
    statusBook
  );
  bookShelf.push(bookShelfObj);
  console.log(statusBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
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
  createContainer.setAttribute("id", `book-${id}`);

  const bookshelfContainer = document.getElementById("book-item");
  bookshelfContainer.appendChild(createContainer);

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "Hapus Buku";
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

    createContainer.append(statusFinish, deleteButton);
  } else {
    const statusNotFinish = document.createElement("span");
    statusNotFinish.classList.add("span-status-sudah");
    statusNotFinish.innerText = "Selesai Baca";

    statusNotFinish.addEventListener("click", function () {
      moveBookToFinish(id);
    });
    createContainer.append(statusNotFinish, deleteButton);
  }

  return createContainer;
}

function moveBookToFinish(bookId) {
  const bookTarget = findBookId(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveBookToNotFinish(bookId) {
  const bookTarget = findBookId(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBookShelfList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  bookShelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document
  .getElementById("searchSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const searchInput = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();

    const bookList = document.querySelectorAll(".book-item h3");

    bookList.forEach((book) => {
      if (searchInput === book.innerText.toLowerCase()) {
        book.parentElement.removeAttribute("hidden");
      } else {
        book.parentElement.setAttribute("hidden", true);
      }
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookShelfData();
  });

  if (isStorageExist()) {
    getDataFromLocalStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
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
