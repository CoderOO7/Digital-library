const modal = document.querySelector(".modal");
const form = document.querySelector(".modal__form");
const openModalBtn = document.querySelector(".__add-btn--openModal");
const closeModalBtn = document.querySelector(".modal__btn--closeModal");
const formSubmitBtn = document.querySelector(`button`);

let library = [];

function Book(title, author,url, status) {
    this.title =  title;
    this.author = author;
    this.url = url;
    this.status = status;
}

function addBookToLibrary(book) {
  library.push(book);
}

function render(book){
  const booksContainer= document.querySelector('.books-holder');

  const bookCard = document.createElement('article');
  bookCard.setAttribute('class','book-card');

  const bookCardImgDiv = document.createElement('div');
  bookCardImgDiv.setAttribute('class','book-card__img');

  const bookCardImg = document.createElement('img');
  bookCardImg.setAttribute('src',`${book.url}`);
  bookCardImgDiv.appendChild(bookCardImg);
  bookCard.appendChild(bookCardImgDiv);
  
  const bookCardInfo = document.createElement('div');
  bookCardInfo.setAttribute('class','book-card__info');
  
  const bookCardTitle = document.createElement('h2');
  bookCardTitle.setAttribute('class','book-card__title');
  bookCardTitle.textContent = book.title;
  bookCardInfo.appendChild(bookCardTitle);
  
  const bookCardAuthor= document.createElement('h3');
  bookCardAuthor.setAttribute('class','book-card__author');
  bookCardAuthor.textContent = book.author;
  bookCardInfo.appendChild(bookCardAuthor);

  bookCard.appendChild(bookCardInfo);
  booksContainer.appendChild(bookCard);

}


function saveBookData(event){
    console.log(event.target);
    const title = form.elements['title'].value;
    const author = form.elements['author'].value;
    const url = form.elements['url'].value;
    const status = form.elements['status'].value;
    
    event.preventDefault();
    const bookData = new Book(title,author,url,status);
    addBookToLibrary(bookData);
    render(bookData);
    resetForm();
    toggleModal();
}

function resetForm(){
  form.reset();
}

function toggleModal(event){
  modal.classList.toggle("modal--open");
}

form.addEventListener('submit',saveBookData);
openModalBtn.addEventListener('click',toggleModal);
closeModalBtn.addEventListener('click',toggleModal);