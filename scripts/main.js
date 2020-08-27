(function(){
  const firebaseConfig = {
    apiKey: "AIzaSyCuCgN6Q-8QVjgmw8NuY5Xuf_bEEHfjYz0",
    authDomain: "digitallibrary-3a5de.firebaseapp.com",
    databaseURL: "https://digitallibrary-3a5de.firebaseio.com",
    projectId: "digitallibrary-3a5de",
    storageBucket: "digitallibrary-3a5de.appspot.com",
    messagingSenderId: "121376977943",
    appId: "1:121376977943:web:8e357c61f12330a0f05852",
    measurementId: "G-THMCJ3KJJ1"
  }

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  // Create DB Reference
  const dbRefObject = firebase.database().ref('books');

  // Selecting DOM Node
  const modal = document.querySelector(".modal");
  const form = document.querySelector(".modal__form");
  const openModalBtn = document.querySelector(".__add-btn--openModal");
  const closeModalBtn = document.querySelector(".modal__btn--closeModal");

  //Global variable
  let library = [];

  // Constructor function
  function Book(id,title, author,url, status) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.url = url;
      this.status = status;
  }

  Book.prototype.getStatusIconColor = function(){
    const statusIconColorState = {
      "Not Started" : "orangered",
      "In Progress" : "orange",
      "Finished" : "forestgreen"
    }
    return statusIconColorState[this.status];
  }

  Book.prototype.toggleBookReadStatus = function(){
    const readStatusState = {
      "Not Started" : "In Progress",
      "In Progress" : "Finished",
      "Finished"    : "Not Started"
    }
    this.status = readStatusState[this.status];
    return this.status;
  }

  function addBookToLibrary(book) {
    library.push(book);
    render(library);
  }

  function addBookToDB(book){
    dbRefObject.child(book.id).set(book,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Book inserted successfully: " + book.id);
        }
    })
  }

  function deleteBookFromDB(bookId){
    dbRefObject.child(bookId).remove(function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Book deleted successfully: " + bookId);
      }
    });
  }

  function updateBookInDB(book){
    let key = '/books/'+book.id;
    let value = book;
    firebase.database().ref().update({key:value},function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Book updated successfully: " + book.id);
      }
    });
  }
  
  function deleteBookCard(bookId){
    for(let i=0; i<library.length; i++) {
      if(Number(bookId) === library[i].id){
        library.splice(i,1);
        deleteBookFromDB(bookId);
        render(library);
        return;
      }
    }
  }

  function changeBookReadStatus(event,bookId){
    for(let i=0; i<library.length; i++) {
      if(Number(bookId) === library[i].id){
        let book = library[i];
        let bookCardStatusIcon = document.getElementById(bookId).firstChild;

        event.target.textContent = book.toggleBookReadStatus();
        bookCardStatusIcon.style.backgroundColor = book.getStatusIconColor();
        
        updateBookInDB(book);
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
    
    for(let i=0; i<books.length; i++){
      const bookCard = document.createElement('article');
      const bookCardStatusIcon = document.createElement('div');
      const bookCardImgDiv = document.createElement('div');
      const bookCardImg = document.createElement('img');
      const bookCardInfo = document.createElement('div');
      const bookCardTitle = document.createElement('h2');
      const bookCardAuthor= document.createElement('em');
      const bookCardOps = document.createElement('div');
      const bookCardReadStatus = document.createElement('span');
      const bookCardDeleteBtn = document.createElement('button');
      
      bookCard.setAttribute('class','book-card');
      bookCard.setAttribute('id',`${books[i].id}`);
      bookCardStatusIcon.setAttribute('class',"book-card__status-icon");
      bookCardImgDiv.setAttribute('class','book-card__img');
      bookCardImg.setAttribute('src',`${books[i].url}`);
      bookCardImg.setAttribute('onerror',"this.onerror=null;this.src='assets/image/no_cover.jpeg'");
      bookCardInfo.setAttribute('class','book-card__info');
      bookCardTitle.setAttribute('class','book-card__title');
      bookCardAuthor.setAttribute('class','book-card__author');
      bookCardOps.setAttribute('class','book-card__ops');
      bookCardReadStatus.setAttribute('class','book-card__readStatus');
      bookCardDeleteBtn.setAttribute('class','book-card__btn--delete');
      
      bookCardStatusIcon.style.backgroundColor = books[i].getStatusIconColor();
      bookCardTitle.textContent = books[i].title;
      bookCardAuthor.textContent = books[i].author;
      bookCardReadStatus.textContent = books[i].status;
      bookCardDeleteBtn.textContent = 'Delete';
      
      booksContainer.appendChild(bookCard);
      bookCard.appendChild(bookCardStatusIcon);
      bookCard.appendChild(bookCardImgDiv);
      bookCard.appendChild(bookCardInfo);
      bookCardImgDiv.appendChild(bookCardImg);
      bookCardInfo.appendChild(bookCardTitle);
      bookCardInfo.appendChild(bookCardAuthor);
      bookCardInfo.appendChild(bookCardOps);
      bookCardOps.appendChild(bookCardReadStatus);
      bookCardOps.appendChild(bookCardDeleteBtn);
    };
    
    addListnerToBookCards();
  }

  function resetForm(){
    form.reset();
  }

  function saveBookData(event){
      event.preventDefault();

      const id = +new Date(); //using timeStamp as id 
      const title = form.elements['title'].value;
      const author = form.elements['author'].value;
      const url = form.elements['url'].value;
      const status = form.elements['status'].options[form.elements['status'].selectedIndex].textContent;
      
      const bookData = new Book(id,title,author,url,status);
      addBookToLibrary(bookData);
      addBookToDB(bookData);
      resetForm();
      toggleModal();
  }

  (function showSampleOnStartup(){
    const id = +new Date();
    const title = "Keep Going";
    const author = "Dost";
    const imgurl =  "assets/image/kg.jpeg";
    const status = "In Progress";

    let sampleBook = new Book(id, title, author, imgurl, status);
    library.push(sampleBook);
    render(library);
  }());

  function toggleModal(){
    modal.classList.toggle("modal--open");
  }

  function fetchDataFromDB(){
    dbRefObject.once('value',bookList =>{
      bookList.forEach(book=>{
        const id = book.val().id; 
        const title = book.val().title;
        const author = book.val().author;
        const url = book.val().url;
        const status = book.val().status;
      
        let newbook = new Book(id, title, author, url, status);
        library.push(newbook);  
      });
      render(library);
    })
  } 

  form.addEventListener('submit',saveBookData);
  openModalBtn.addEventListener('click',(e)=>toggleModal());
  closeModalBtn.addEventListener('click',(e)=>toggleModal());
  document.addEventListener('DOMContentLoaded',(e)=>fetchDataFromDB());
}());