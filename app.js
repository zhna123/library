const READ = "READ";
const NOT_READ = "NOT READ";
const MARK_READ_BTN = "MARK READ";
const MARK_NOT_READ_BTN = "MARK NOT READ"
const REMOVE_BTN = "REMOVE";

const NOT_READ_COLOR = "rgb(184,72,60)";
const READ_COLOR = "green";

const LIBRARY_KEY = 'library'

// constructor
function Book(title, author, numOfPages, read) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.read = read;
    this.info = function() {
        const readStatus = read ? READ : NOT_READ;
        return `${title} by ${author}, ${numOfPages} pages, ${readStatus}`
    }
}
Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
}

function saveToLocalStorage(library) {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

function getFromLocalStorage() {
    const value = localStorage.getItem(LIBRARY_KEY);
    return value === null ? [] : JSON.parse(value);
}

displayBooks(getFromLocalStorage());

function addBookToLibrary(book) {
    const library = getFromLocalStorage()
    if (library.length > 0) {
        const titles = library.map(b => b.title);
        if(titles.includes(book.title)) {
            alert(`${book.title} already existed.`)
            return;
        }
    }
    library.push(book);
    saveToLocalStorage(library);
}

function displayBooks(library) {
    const containerDiv = clearCurrentDiv();
    library.forEach((book, index) => {
        containerDiv.appendChild(createBookDiv(book, index));
    })
}

function updateBooks(index) {
    const library = getFromLocalStorage();
    const resultBook = library[index];
    // need to resconstruct the book
    const book = new Book(resultBook.title, resultBook.author, resultBook.numOfPages, resultBook.read);
    book.toggleReadStatus();
    library[index] = book;

    const containerDiv = clearCurrentDiv();
    containerDiv.textContent = '';
    displayBooks(library);
    saveToLocalStorage(library);
}

function removeBooks(index) {
    const library = getFromLocalStorage();
    library.splice(index, 1);

    clearCurrentDiv();

    displayBooks(library);
    saveToLocalStorage(library);
}

function clearCurrentDiv() {
    const containerDiv = document.querySelector("div#container");
    // clear all current displayed books
    containerDiv.textContent = '';
    return containerDiv;
}

function createBookDiv(book, index) {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    const h1Title = document.createElement("h1");
    h1Title.textContent = `${book.title}`
    bookDiv.appendChild(h1Title);
    const h2Author = document.createElement("h2");
    h2Author.textContent = `by ${book.author}`
    bookDiv.appendChild(h2Author);
    const pages = document.createElement("p");
    pages.textContent = `${book.numOfPages} pages`
    bookDiv.appendChild(pages)

    const readStatus = document.createElement("p");
    readStatus.textContent = `${book.read ? READ : NOT_READ}`
    readStatus.style.color = `${book.read ? READ_COLOR : NOT_READ_COLOR}`
    bookDiv.appendChild(readStatus);
    
    const readToggleBtn = document.createElement("button");
    readToggleBtn.classList.add("read_toggle");
    readToggleBtn.setAttribute("data-index", `${index}`);
    readToggleBtn.textContent = `${book.read ? MARK_NOT_READ_BTN : MARK_READ_BTN}`;
    bookDiv.appendChild(readToggleBtn);

    const rmvButton = document.createElement("button");
    rmvButton.classList.add("remove");
    rmvButton.setAttribute("data-index", `${index}`)
    rmvButton.textContent = REMOVE_BTN;
    bookDiv.appendChild(rmvButton);
        
    return bookDiv;
}

// open form when click new book button
const newBookBtn = document.querySelector("button.new_book");
newBookBtn.addEventListener("click", function(e) {
    openForm();
})

const form = document.querySelector("#addNew")
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const title = form.elements['title'].value;
    const author = form.elements['author'].value;
    const numOfPages = Number(form.elements['numOfPages'].value);
    const read = form.elements['read'].value === yes ? true : false;
    const book = new Book(title, author, numOfPages, read);

    addBookToLibrary(book);
    closeForm();
    displayBooks(getFromLocalStorage());
})

function openForm() {
    document.querySelector("#container").style.display = "none";
    document.querySelector("button.new_book").style.display = "none"

    document.querySelector(".form_container > form").reset();
    document.querySelector(".form_container").classList.add("form_display");
}
  
function closeForm() {
    document.querySelector(".form_container").classList.remove("form_display");

    document.querySelector("#container").style.display = "flex";
    document.querySelector("button.new_book").style.display = "block"
}


// need to select parent container because the remove and update read buttons 
// are dynamically generated each time a new book added
const bookDivContainer = document.querySelector("div#container");
bookDivContainer.addEventListener("click", function(e) {
    const targetElement = e.target;
    if (targetElement.className === 'remove') {
        const index = Number(targetElement.dataset.index);
        removeBooks(index)
    }
    
    if (targetElement.className === 'read_toggle') {
        const index = Number(targetElement.dataset.index);
        updateBooks(index)
    }
})