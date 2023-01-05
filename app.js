const READ = "READ";
const NOT_READ = "NOT READ";
const MARK_READ_BTN = "MARK READ";
const MARK_NOT_READ_BTN = "MARK NOT READ"
const REMOVE_BTN = "REMOVE";

const NOT_READ_COLOR = "rgb(184,72,60)";
const READ_COLOR = "green";

const LIBRARY_KEY = 'library'

class Book {
    constructor(title, author, numOfPages, read) {
        this.title = title;
        this.author = author;
        this.numOfPages = numOfPages;
        this.read = read;       
    }

    toggleReadStatus() {
        this.read = !this.read;
    }
}

class Storage {
    saveToLocalStorage(library) {
        localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    }
    
    getFromLocalStorage() {
        const value = localStorage.getItem(LIBRARY_KEY);
        return value === null ? [] : JSON.parse(value);
    }
}

class Library {

    constructor(storage) {
        this.storage = storage;
    }

    addBookToLibrary(book) {
        const library = this.storage.getFromLocalStorage()
        if (library.length > 0) {
            const titles = library.map(b => b.title);
            if(titles.includes(book.title)) {
                alert(`${book.title} already existed.`)
                return;
            }
        }
        library.push(book);
        storage.saveToLocalStorage(library);
    }
    
    displayBooks() {
        const library = storage.getFromLocalStorage();
        const containerDiv = _clearCurrentDiv();
        library.forEach((book, index) => {
            containerDiv.appendChild(_createBookDiv(book, index));
        })
    }
    
    updateBooks(index) {
        const library = storage.getFromLocalStorage();
        const resultBook = library[index];
        // need to resconstruct the book
        const book = new Book(resultBook.title, resultBook.author, resultBook.numOfPages, resultBook.read);
        book.toggleReadStatus();
        library[index] = book;
    
        const containerDiv = _clearCurrentDiv();
        containerDiv.textContent = '';
        storage.saveToLocalStorage(library);
        this.displayBooks();
    }
    
    removeBooks(index) {
        const library = storage.getFromLocalStorage();
        library.splice(index, 1);
    
        _clearCurrentDiv();
        storage.saveToLocalStorage(library);
        this.displayBooks();
    }
}

const storage = new Storage();
const library = new Library(storage);
library.displayBooks();

function _clearCurrentDiv() {
    const containerDiv = document.querySelector("div#container");
    // clear all current displayed books
    containerDiv.textContent = '';
    return containerDiv;
}

function _createBookDiv(book, index) {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    const title = document.createElement("h3");
    title.textContent = `${book.title}`
    bookDiv.appendChild(title);
    const author = document.createElement("h4");
    author.textContent = `${book.author}`
    bookDiv.appendChild(author);
    const pages = document.createElement("p");
    pages.textContent = `${book.numOfPages} pages`
    bookDiv.appendChild(pages)

    const readStatus = document.createElement("div");
    readStatus.classList.add("read_status");

    readStatus.textContent = `${book.read ? READ : NOT_READ}`
    readStatus.style.color = `${book.read ? READ_COLOR : NOT_READ_COLOR}`

    const readToggleBtn = document.createElement("button");
    readToggleBtn.classList.add("read_toggle");
    readToggleBtn.setAttribute("data-index", `${index}`);
    readToggleBtn.textContent = `${book.read ? MARK_NOT_READ_BTN : MARK_READ_BTN}`;
    readStatus.appendChild(readToggleBtn);

    bookDiv.appendChild(readStatus);

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
    const read = form.elements['read'].value === 'yes' ? true : false;
    const book = new Book(title, author, numOfPages, read);

    library.addBookToLibrary(book);
    closeForm();
    library.displayBooks();
})

function openForm() {
    document.querySelector("#container").style.display = "none";
    document.querySelector("#btn_div").style.display = "none"

    document.querySelector(".form_container > form").reset();
    document.querySelector(".form_container").classList.add("form_display");
}
  
function closeForm() {
    document.querySelector(".form_container").classList.remove("form_display");

    document.querySelector("#container").style.display = "block";
    document.querySelector("#btn_div").style.display = "flex"
}


// need to select parent container because the remove and update read buttons 
// are dynamically generated each time a new book added
const bookDivContainer = document.querySelector("div#container");
bookDivContainer.addEventListener("click", function(e) {
    const targetElement = e.target;
    if (targetElement.className === 'remove') {
        const index = Number(targetElement.dataset.index);
        library.removeBooks(index)
    }
    
    if (targetElement.className === 'read_toggle') {
        const index = Number(targetElement.dataset.index);
        library.updateBooks(index)
    }
})