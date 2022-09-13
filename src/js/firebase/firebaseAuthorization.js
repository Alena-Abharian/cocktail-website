import { initializeApp } from 'firebase/app';
// import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, get, push, onValue } from "firebase/database";

import { firebaseConfig } from '../config/firebaseConfig';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { renderStartMarkup } from '../services/renderRandomData'
import { refs } from '../config/refs';


import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { notifyConfigs } from './../config/notify'
import { Report } from 'notiflix/build/notiflix-report-aio';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();


import {
  addListenerAfterLogIn,
  delListenerAfterLogOut,
  addListenerAuthLogOut,
  delListenerAuthLogOut,
  delBtnFavoriteClassChecked,
  LogIn,
  LogOut
} from "./firebaseDb";

// TODO Change - Add listener when modal open
const modalBtnSignIn = document.querySelectorAll('[data-modal-sign-in-open]');

modalBtnSignIn.forEach(el => el.addEventListener("click", onLoginClick));

//modalBtnSignIn.addEventListener("click", onLoginClick);

function onLoginClick(evt) {
  let sign = evt.target.dataset.sign;
  if (sign === "sign-out") {
    userSignInWithGoogle();
  } else {
    userSignOut();
  }
}

function userSignInWithGoogle() {
  return signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      Report.success(
        user.displayName,
        `Nice to meet you. Are you ready to select drinks?`,
        'GO!!!',
      );

      //TODO close modal autorization  closeModalAuth();
      //TODO get data from user acount   getDataFromFirebase(user.uid);
      //TODO markup cocktaile renderFavouriteCocktaileByUser(user.uid);
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

onAuthStateChanged(auth, user => {
  if (user) {
    // Notify.success(`Nice to meet you ${user.displayName}. What cocktail do you want?`);
    // // LogIn(modalBtnSignIn);
    modalBtnSignIn.forEach(el => el.dataset.sign = "sign-in");
    modalBtnSignIn.forEach(el => el.textContent = "Log out");
    //modalBtnSignIn.dataset.sign = "sign-in";
    //modalBtnSignIn.textContent = "Log out";
    addListenerAfterLogIn();
    delListenerAuthLogOut();
    localStorage.setItem("user", JSON.stringify(user));

  } else {
    let user = JSON.parse(localStorage.getItem("user") || null);
    if (user) {
      Notify.success(`Good bye, ${user.displayName}! Hope to see you soon!`, notifyConfigs);
    }
    // // LogOut(modalBtnSignIn);
    localStorage.removeItem("user");
    renderStartMarkup();
    refs.sectionHero.style.display = 'block';
    refs.galleryTitle.textContent = 'Cocktails';
    delBtnFavoriteClassChecked();
    delListenerAfterLogOut();
    addListenerAuthLogOut();
    modalBtnSignIn.forEach(el => el.dataset.sign = "sign-out");
    modalBtnSignIn.forEach(el => el.textContent = "Log in");
    // modalBtnSignIn.dataset.sign = "sign-out"
    // modalBtnSignIn.textContent = "Log in";
  }


  // TODO toggleBtnContent(user);
});


export function userSignOut() {
  signOut(auth)
    .then(() => {


      // console.log("Sign-out successful");
      // localStorage.removeItem("user");

      // Sign-out successful.
      //TODO notify about SEE YOU LATER;
    })
    .catch(error => {
      // An error happened.
      //TODO notify Something went wrong. Please try again;
    });
}

export function getUser() {
  return auth?.currentUser?.uid;
}








