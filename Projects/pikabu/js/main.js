const firebaseConfig = {
  apiKey: "AIzaSyBnbfP972SqjGBU_3My3cnMAa5Ug5reZ04",
  authDomain: "pikadu-ee2d2.firebaseapp.com",
  databaseURL: "https://pikadu-ee2d2.firebaseio.com",
  projectId: "pikadu-ee2d2",
  storageBucket: "pikadu-ee2d2.appspot.com",
  messagingSenderId: "608800947207",
  appId: "1:608800947207:web:c98376ac7b054141253ea2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log('firebase: ', firebase);

// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');


// const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const regExpValidEmail = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*/;

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');

const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');

const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');

const postWrapper = document.querySelector('.posts');

const buttonNewPost = document.querySelector('.button-new-post');

const addPostElem = document.querySelector('.add-post')

const DEFAULT_PHOTO = userAvatarElem.src;


const setUsers = {
  user: null,
  initUser(handler) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
      if (handler) handler();
    })
  },
  logIn(email, password, handler) {
    if(!regExpValidEmail.test(email)) {
      alert('email не валиден');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => {
        const errCode = err.code;
        const errMessage = err.message;
        if (errCode === 'auth/wrong-password') {
          console.log(errMessage);
          alert('Неправильный пароль')
        } else if (errCode === 'auth/user-not-found') {
          console.log(errMessage);
          alert('Пользовательне найден')
        } else {
          alert(errMessage)
        }
        console.log(err);
      })

    // const user = this.getUser(email);
    // if(user && user.password === password) {
    //   this.autorizedUser(user)
    //   handler();
    // } else {
    //   alert('Пользователь с такими данными не найден');
    // }

  },
  logOut() {
    
    firebase.auth().signOut();

  },
  signUp(email, password, handler) {
    if(!regExpValidEmail.test(email)) {
      alert('email не валиден');
      return;
    } 

    if(!email.trim() || !password.trim()) {
      alert('Введите данные')
      return;
    }

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        this.editUser(email.substring(0, email.indexOf('@')), null, handler)
      })
      .catch(err => {
        const errCode = err.code;
        const errMessage = err.message;
        if (errCode === 'auth/weak-password') {
          console.log(errMessage);
          alert('Слабый пароль')
        } else if (errCode === 'auth/email-already-in-use') {
          console.log(errMessage);
          alert('Пользователь с таким email не найден')
        } else {
          alert(errMessage)
        }

        console.log(err);
      });


    // if (!this.getUser(email)) {
    //   const user = {email, password, displayName: email.substring(0, email.indexOf('@'))};
    //   listUsers.push();
    //   this.autorizedUser(user)
    //   handler();
    // } else {
    //   alert('Пользователь с таким email уже зарегестрирован')
    // }
  },
  editUser(displayName, photoURL, handler) {

    const user = firebase.auth().currentUser;

    if (displayName) {
      if (photoURL) {
        user.updateProfile({
          displayName,
          photoURL
        }).then(handler)
      } else {
        user.updateProfile({
          displayName
        }).then(handler)
      }
    }

  },

  // getUser(email) {
  //   return listUsers.find(item => item.email === email)
  // },
  // autorizedUser(user) {
  //   this.user = user;
  // },
  sendForget(email) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert('Письмо отправленно')
      })
      .catch(err => {
        console.log(err);
      })
  }
};

const loginForget = document.querySelector('.login-forget');

loginForget.addEventListener('click', event => {
  event.preventDefault();
  setUsers.sendForget(emailInput.value);
  emailInput.value = '';
})

const setPosts = {
  allPosts: [],
  addPost(title, text, tags, handler) {

    const user = firebase.auth().currentUser;

    this.allPosts.unshift({
      id: `postID${(+new Date()).toString(16)}-${user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
      },
      date: new Date().toLocaleString(),
      like: 0,
      comments: 0,

    })

    firebase.database().ref('post').set(this.allPosts)
      .then(() => this.getPosts(handler))

  },
  getPosts(handler) {
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      handler();
    })
  }
};

const toggleAuthDom = () => {
  const user = setUsers.user;
  console.log('user: ', user);

  if(user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postWrapper.classList.add('visible');
  }
};

const showAddPost = () => {
  addPostElem.classList.add('visible');
  postWrapper.classList.remove('visible');
}

const showAllPosts = () => {

  addPostElem.classList.remove('visible');
  postWrapper.classList.add('visible');

  let postsHTML = '';

  setPosts.allPosts.forEach(({ title, text, date, tags, like, comments, author }) => {

    postsHTML += `
    <section class="post">
        <div class="post-body">
          <h2 class="post-title">${title}</h2>
          <p class="post-text">${text}</p>
          <div class="tags">
            ${tags.map(tag => `<a href="#${tag}" class="tag">${tag}</a>`)}
          </div>
        </div>
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${like}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author.displayName}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link"><img src=${author.photo || "img/avatar.jpeg"} alt="avatar" class="author-avatar"></a>
          </div>
        </div>
      </section>
    `;
  })

  postWrapper.innerHTML = postsHTML;

  addPostElem.classList.remove('visible');
  postWrapper.classList.add('visible');

};

const init = () => {

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
  
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    
    setUsers.logIn(emailValue, passwordValue, toggleAuthDom);
    loginForm.reset();
  })
  
  loginSignup.addEventListener('click', event => {
    event.preventDefault();
  
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    
    setUsers.signUp(emailValue, passwordValue, toggleAuthDom);
    loginForm.reset();
  })
  
  exitElem.addEventListener('click', event => {
      event.preventDefault();
      setUsers.logOut();
  
  })
  
  editElem.addEventListener('click', event => {
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
  });
  
  editContainer.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove('visible');
  });

  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
  // отменяем стандартное поведение ссылки
    event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });

  buttonNewPost.addEventListener('click', event => {
    event.preventDefault();
    showAddPost();
  });

  addPostElem.addEventListener('submit', event => {
    event.preventDefault();
    const { title, text, tags } = addPostElem.elements;
    
    if(title.value.length < 6) {
      alert('Слишком короткий заголовок');
      return;
    }

    if(text.value.length < 50) {
      alert('Слишком короткий пост');
      return;
    }

    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);

    addPostElem.classList.remove('visible');
    addPostElem.reset();
  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);

}

document.addEventListener('DOMContentLoaded', init);
// document.addEventListener('DOMContentloaded', () => {
//   init();
// })

