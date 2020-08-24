const modal = document.querySelector(".modal");
const form = document.querySelector(".modal__form");
const openModalBtn = document.querySelector(".__add-btn--openModal");
const closeModalBtn = document.querySelector(".modal__btn--closeModal");

let library = [
  {
    id: +new Date(),
    title: "Keep Going",
    author: "Dost", 
    url: "./assets/image/kg.jpg",
    status: "In Progress"
  }
];

function Book(id,title, author,url, status) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.url = url;
    this.status = status;
}

function addBookToLibrary(book) {
  library.push(book);
  render(library);
}

function deleteBookCard(bookId){
  for(let i=0; i<library.length; i++) {
    if(Number(bookId) === library[i].id){
      console.log(123123);
      library.splice(i,1);
      render(library);
      return;
    }
  }
}

function changeBookReadStatus(event,bookId){
  console.log(bookId);
  let readStatusState = {
    "Not Started" : "In Progress",
    "In Progress" : "Finished",
    "Finished"    : "Not Started"
  }

  for(let i=0; i<library.length; i++) {
    if(Number(bookId) === library[i].id){
      let book = library[i];
      book.status = readStatusState[book.status];
      event.target.textContent = book.status;
      return;
    }
  }
}

function addListnerToBookCards(){
  document.querySelectorAll(".book-card").forEach((bookCard)=>{
    const bookId = bookCard.getAttribute('id');
    const bookCardReadStatus = bookCard.querySelector('.book-card__readStatus');
    const bookCardDeleteBtn = bookCard.querySelector('.book-card__btn--delete');
    
    bookCardReadStatus.addEventListener('click',e => changeBookReadStatus(e,bookId));
    bookCardDeleteBtn.addEventListener('click',e => deleteBookCard(bookId));
  })
}


function clearData(){
  document.querySelectorAll(".book-card").forEach((bookCard)=>{
    bookCard.remove();
  })
}

function render(books){
  const booksContainer= document.querySelector('.books-holder');
  
  clearData(booksContainer,books.length);
  
  books.forEach(book=>{
    const bookCard = document.createElement('article');
    const bookCardImgDiv = document.createElement('div');
    const bookCardImg = document.createElement('img');
    const bookCardInfo = document.createElement('div');
    const bookCardTitle = document.createElement('h2');
    const bookCardAuthor= document.createElement('em');
    const bookCardOps = document.createElement('div');
    const bookCardReadStatus = document.createElement('span');
    const bookCardDeleteBtn = document.createElement('button');
    
    bookCard.setAttribute('class','book-card');
    bookCard.setAttribute('id',`${book.id}`);
    bookCardImgDiv.setAttribute('class','book-card__img');
    bookCardImg.setAttribute('src',`${book.url}`);
    bookCardImg.setAttribute('onerror',"this.onerror=null;this.src='/assets/image/no_cover.jpeg'")
    bookCardInfo.setAttribute('class','book-card__info');
    bookCardTitle.setAttribute('class','book-card__title');
    bookCardAuthor.setAttribute('class','book-card__author');
    bookCardOps.setAttribute('class','book-card__ops');
    bookCardReadStatus.setAttribute('class','book-card__readStatus');
    bookCardDeleteBtn.setAttribute('class','book-card__btn--delete');
    
    bookCardTitle.textContent = book.title;
    bookCardAuthor.textContent = book.author;
    bookCardReadStatus.textContent = book.status;
    bookCardDeleteBtn.textContent = 'Delete';
  
    bookCardImgDiv.appendChild(bookCardImg);
    bookCard.appendChild(bookCardImgDiv);
    bookCardOps.appendChild(bookCardReadStatus);
    bookCardOps.appendChild(bookCardDeleteBtn);
    bookCardInfo.appendChild(bookCardTitle);
    bookCardInfo.appendChild(bookCardAuthor);
    bookCardInfo.appendChild(bookCardOps);
    bookCard.appendChild(bookCardInfo);
    booksContainer.appendChild(bookCard);
  });
  
  addListnerToBookCards();
}

function resetForm(){
  form.reset();
}

function saveBookData(event){
    event.preventDefault();

    const id =  + new Date(); //using timeStamp as id 
    const title = form.elements['title'].value;
    const author = form.elements['author'].value;
    const url = form.elements['url'].value;
    const status = form.elements['status'].options[form.elements['status'].selectedIndex].textContent;
    
    const bookData = new Book(id,title,author,url,status);
    addBookToLibrary(bookData);
    resetForm();
    toggleModal();
}


function toggleModal(event){
  modal.classList.toggle("modal--open");
}

//bookCardDeleteBtn.addEventListener('click',deleteBookCard);
form.addEventListener('submit',saveBookData);
openModalBtn.addEventListener('click',toggleModal);
closeModalBtn.addEventListener('click',toggleModal);

window.onload = (event) => {render(library)};