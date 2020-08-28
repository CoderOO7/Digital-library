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

  /**
   * Add book object to libaray array and render the DOM
   * @param {Object} book - Book instance
   */
  function addBookToLibrary(book) {
    library.push(book);
    render(library);
  }

  /**
   * It check if book exist in firebase db or not, used to prevent
   * invalid CRUD operations.
   * @param {String} bookId      -  The id of book stored in db collection.  
   * @return {Promise.<Object>}  -  A promise that return object if resolved. 
   */
  function checkIfBookExistsInDB(bookId) {
    return dbRefObject
      .child(bookId)
      .once('value')
      .then(dataSnapshot => {
        return Promise.resolve({
          bookExists: dataSnapshot.exists()
        });
      });
  }

  /**
   * Create a Book document in fireabse realtime database/
   * @param {Object} book - Book instance
   */
  function addBookToDB(book){
    dbRefObject.child(book.id).set(book,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Book inserted successfully: " + book.id);
        }
    })
  }

  /**
   * Delete a Book document from  fireabse realtime database
   * @param {String} bookId - Id of the book document to be deleted.
   */
  function deleteBookFromDB(bookId){
    checkIfBookExistsInDB(bookId)
      .then(({bookExists})=>{
        if(bookExists){
          dbRefObject.child(bookId).remove(function(err){
            if(err){
              console.log(err);
            }else{
              console.log("Book deleted successfully: " + bookId);
            }
          });
        }else{
          console.warn("Book don't exist in database");
        }
      })
      .catch( err=> console.error(err))
  }

  /**
   * Create a Book document in fireabse realtime database
   * @param {Book} book - Book instance
   */
  function updateBookInDB(book){
    checkIfBookExistsInDB(book.id)
    .then(({bookExists})=>{
      if(bookExists){
        dbRefObject.update({[book.id]:book},function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Book updated successfully: " + book.id);
          }
        });
      }else{
        console.warn("Book don't exist in database");
      }
    })
    .catch( err=> console.error(err))
  }

  /**
   * If the book with provided bookId is valid then,then book document deleted from 
   * local library and firebase realtime databse.
   * @param {String} bookId - The id of book to be deleted.
   */
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

  /**
   * Used to toggle the book read status as well as color of bookStatus Icon.
   * @param {Object} event - The MouseClick Event
   * @param {String} bookId -  The id of Book document to be updated.
   */
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

  /**
   * Add Click Listener to Delete button and ReadStatus span element
   * of bookCard.
   */
  function addListnerToBookCards(){
    document.querySelectorAll(".book-card").forEach((bookCard)=>{
      const bookId = bookCard.getAttribute('id');
      const bookCardReadStatus = bookCard.querySelector('.book-card__readStatus');
      const bookCardDeleteBtn = bookCard.querySelector('.book-card__btn--delete');
      
      bookCardReadStatus.addEventListener('click',e => changeBookReadStatus(e,bookId));
      bookCardDeleteBtn.addEventListener('click',e => deleteBookCard(bookId));
    })
  }

  /**
   * Add Click Listener to Delete button and ReadStatus span element
   * of bookCard.
   */
  function clearData(){
    document.querySelectorAll(".book-card").forEach((bookCard)=>{
      bookCard.remove();
    })
  }

  /**
   * Render the DOM
   * @param {Object} book - The Book instance
   */
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
    // Adding listener to each new BookCard created in DOM
    addListnerToBookCards();
  }
  
  // Reset the form content
  function resetForm(){
    form.reset();
  }

  /**
   * Form submit button event handler, used to fetch the user input data
   * and use them to create new Book instance whose entry saved in local
   * library and firebase realtime database.
   * @param {Object} -  The Submit event occur on submit button click 
   * or on pressing Enter to form input fields.
   */  
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

  /**
   * Used to create a sample book entry on startup that only 
   * store in local library not firebase realtime database. 
   */
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

  // Toggle the form modal,if open then close it, else vice-versa.
  function toggleModal(){
    modal.classList.toggle("modal--open");
  }

  /**
   * Used to fetch all data once on startup from firebase realtime database
   * which return reponse as POJO and this POJO is used to create 
   * a new Book Object to add in local library. 
   */
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

  // Add submit event on form to fetch input fields value and save them
  form.addEventListener('submit',saveBookData);
  // Add click event to toggleModal 
  openModalBtn.addEventListener('click',(e)=>toggleModal());
  // Add click event to toggleModal 
  closeModalBtn.addEventListener('click',(e)=>toggleModal());
  // Add DOMContentLoaded event to fetch the data from firebase as soon as DOM parsing complete.
  document.addEventListener('DOMContentLoaded',(e)=>fetchDataFromDB());
}()); // Invoke to prevent manipulation of data using global varible and functions on console.