import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove, onValue, child } from "firebase/database";
import { firebaseConfig } from '../config/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { notifyConfigs } from './../config/notify'

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();

import { refs } from "../config/refs"
import UserManager from '../drinkingUser/managerUser'
import DrinkingUser from '../drinkingUser/createUser';

export const userManager = new UserManager(db);



//Додаємо і знімаємо події
export function addListenerAfterLogIn() {
    listFavCocktailGallery.addEventListener("click", onBtnFavCocktailGalleryClick);
}

export function delListenerAfterLogOut() {
    listFavCocktailGallery.removeEventListener("click", onBtnFavCocktailGalleryClick);
}

export function addListenerAuthLogOut() {
    listFavCocktailGallery.addEventListener("click", onBtnFavAfterLogOutCocktailGalleryClick);
}

export function delListenerAuthLogOut() {
    listFavCocktailGallery.removeEventListener("click", onBtnFavAfterLogOutCocktailGalleryClick);
}


export function onBtnFavAfterLogOutCocktailGalleryClick(e) {
    e.preventDefault();
    const favoriteBtn = e.target.closest(".js-btn-fav");
    if (!favoriteBtn) {
        return;
    }
    Notify.info('Please login for adding to favorites', notifyConfigs);
}

export function delBtnFavoriteClassChecked() {
    const isCheckedArrayBtns = document.querySelectorAll(".is-checked")
    isCheckedArrayBtns.forEach(el => el.classList.remove('is-checked'))
}

const btnListCocktail = document.querySelectorAll('.js-btn-fav');
const btnListIngredients = document.querySelectorAll('[data-favorite=ingredient]');

//TODO *************************************************************************************
//!клік по кнопці додати до улюблених коктейлів в галереї
const listFavCocktailGallery = document.querySelector('[data-gallery-cocktail]');
async function onBtnFavCocktailGalleryClick(e) {
    const auth = JSON.parse(localStorage.getItem("user") || null);
    const favoriteBtn = e.target.closest(".js-btn-fav")
    let btnGalleryRef = favoriteBtn;

    e.preventDefault();

    if (!auth) {
        return;
    }

    if (!favoriteBtn) {
        return;
    }

    const idFavorite = favoriteBtn.dataset.id;
    if (!idFavorite) {
        Notify.failure('Something wrong. Try again!', notifyConfigs);
        return;
    };

    const text = favoriteBtn.classList.contains("is-checked") ? "Add to" : "Remove ";
    favoriteBtn.children[0].textContent = text;

    if (favoriteBtn.dataset.favorite === "cocktail") {
        await toggleCocktailGalleryInDb(idFavorite, btnGalleryRef)
    } else if (favoriteBtn.dataset.favorite === "ingredient") {
        await toggleIngredientGalleryInDb(idFavorite, btnGalleryRef);
    }

}

//********************************* */

//! маніпуляція з коктейлями модалки 
export function addModalCocktailClick() {
    refs.backdropCocktail.addEventListener("click", onBtnFavCocktailModalClick);
}

export function delModalCocktailClick() {
    refs.backdropCocktail.removeEventListener("click", onBtnFavCocktailModalClick);
}

async function onBtnFavCocktailModalClick(e) {
    const auth = JSON.parse(localStorage.getItem("user") || null);

    e.preventDefault();

    const favoriteBtn = e.target.classList.contains('modal__btn')

    if (!favoriteBtn) {
        return;
    }

    if (!auth) {
        Notify.info('Please login for adding to favorites', notifyConfigs);
        return;
    }

    let btnModalRef = e.target;
    const cocktailId = btnModalRef.dataset.id;
    if (!cocktailId) {
        Notify.failure('Something wrong. Try again!', notifyConfigs);
        return;
    };

    const text = btnModalRef.classList.contains("is-checked") ? "Add to favorite" : "Remove from favorite";
    e.target.textContent = text;
    await toggleCocktailModalInDb(cocktailId, btnModalRef)

}
//********************************* */

//! маніпуляція з інгредієнтами модалки
export function addModalIngredientClick() {
    refs.backdropCocktail.addEventListener("click", onBtnFavIngredientModalClick);
}

export function delModalIngredientClick() {
    refs.backdropCocktail.removeEventListener("click", onBtnFavIngredientModalClick);
}

async function onBtnFavIngredientModalClick(e) {
    const auth = JSON.parse(localStorage.getItem("user") || null);
    const favoriteBtn = e.target.classList.contains('modal__btn')

    e.preventDefault();

    if (!favoriteBtn) {
        return;
    }

    if (!auth) {
        Notify.info('Please login for adding to favorites', notifyConfigs);
        return;
    }

    let btnModalRef = e.target;
    const ingredientId = btnModalRef.dataset.id;

    if (!ingredientId) {
        Notify.failure('Something wrong. Try again!', notifyConfigs);
        return;
    };

    const text = btnModalRef.classList.contains("is-checked") ? "Add to favorite" : "Remove from favorite";
    e.target.textContent = text;
    await toggleIngredientModalInDb(ingredientId, btnModalRef)
}


//FireBase 
//*********************************************************************** */

//!Промісифікація функції авторизації.

export const userPromise = new Promise((res, reg) => {
    onAuthStateChanged(auth, user => {
        if (user) {
            res(userManager.fetchUserById(user.uid));
        } else {

        }
    });
})

//! *****************************************************************************************************************
//відмалювати улюблені в галереї
export function refreshFavCocktailOnPage() {
    const auth = JSON.parse(localStorage.getItem("user") || null);

    if (!auth) {
        return;
    }

    const btnListCocktail = document.querySelectorAll('.gallery__list-item .js-btn-fav');
    if (!btnListCocktail.length) return;
    userPromise.then((user) => {
        btnListCocktail.forEach(element => {
            let favId = element.dataset.id;
            const favorite = element.dataset.favorite;
            if (user.hasFavoriteCocktailById(favId)) {
                btnToggleFavGallery(element, true)
                element.children[0].textContent = "Remove";
            } else {
                btnToggleFavGallery(element, false)
                element.children[0].textContent = "Add to";
            }
        })
    }
    ).catch(error => {
        throw new Error(error.message)
    })
}

export function refreshFavIngredientsOnPage() {
    const auth = JSON.parse(localStorage.getItem("user") || null);

    if (!auth) {
        return;
    }

    const btnListCocktail = document.querySelectorAll('.gallery__list-item .js-btn-fav');
    if (!btnListCocktail.length) return;
    userPromise.then((user) => {
        btnListCocktail.forEach(element => {
            let favId = element.dataset.id;
            const favorite = element.dataset.favorite;
            if (user.hasFavoriteIngredientById(favId)) {
                btnToggleFavGallery(element, true)
                element.children[0].textContent = "Remove";
            } else {
                btnToggleFavGallery(element, false)
                element.children[0].textContent = "Add to";
            }
        })
    }
    ).catch(error => {
        throw new Error(error.message)
    })
}


//! *****************************************************************************************************************
// ************коктейлі****************************************************
// toggle коктейль в Галереї бази даних

function toggleCocktailGalleryInDb(cocktailId, btnGalleryRef) {
    userPromise.then((user) => {
        if (!user.hasFavoriteCocktailById(cocktailId)) {
            user.addFavoriteCocktailById(cocktailId);
            btnToggleFavGallery(btnGalleryRef, true);
            Notify.info('The cocktail has been added to favorites', notifyConfigs);
            // TODO Дописати нотіфікашку
            // console.log("Дописати нотіфікашку");
        } else {
            user.deleteFavoriteCocktailById(cocktailId);
            btnToggleFavGallery(btnGalleryRef, false);
            // TODO Дописати нотіфікашку
            // console.log("Дописати нотіфікашку");
        }

        if (!user.getId()) {
            // alert("авторизуйтесь");
        } else {
            userManager.pushUser(user);
        }
    }).catch(error => {
        throw new Error(error.message)
    })
}

// toggle коктейль в Модальному вікні бази даних
export function toggleCocktailModalInDb(cocktailId, btnGalleryRef) {
    userPromise.then((user) => {
        if (!user.hasFavoriteCocktailById(cocktailId)) {
            user.addFavoriteCocktailById(cocktailId);
            btnToggleFavModal(btnGalleryRef, true);
            // TODO Дописати нотіфікашку
            Notify.info('The cocktail has been added to favorites', notifyConfigs);
            // console.log("Дописати нотіфікашку");
        } else {
            user.deleteFavoriteCocktailById(cocktailId);
            btnToggleFavModal(btnGalleryRef, false);
            // TODO Дописати нотіфікашку
            console.log("Дописати нотіфікашку");
        }
        refreshFavCocktailOnPage();
        if (!user.getId()) {
            alert("авторизуйтесь");
        } else {
            userManager.pushUser(user);
        }
    }).catch(error => {
        throw new Error(error.message)
    })
}

// ************iнгредієнти****************************************************

// toggle інгредієнтів в Галереї бази даних
function toggleIngredientGalleryInDb(ingredientId, btnGalleryRef) {
    userPromise.then((user) => {
        if (!user.hasFavoriteIngredientById(ingredientId)) {
            user.addFavoriteIngredientById(ingredientId);
            btnToggleFavGallery(btnGalleryRef, true);
            // TODO Дописати нотіфікашку
            Notify.info('The ingredient has been added to favorites', notifyConfigs);
            // console.log("Дописати нотіфікашку");
        } else {
            user.deleteFavoritesIngredientById(ingredientId);
            btnToggleFavGallery(btnGalleryRef, false);
            // TODO Дописати нотіфікашку
            // console.log("Дописати нотіфікашку");
        }
        if (!user.getId()) {
            // alert("авторизуйтесь");
        } else {
            userManager.pushUser(user);
        }
    }).catch(error => {
        throw new Error(error.message)
    })
}

// toggle коктейль в Модальному вікні бази даних
function toggleIngredientModalInDb(ingredientId, btnGalleryRef) {
    userPromise.then((user) => {
        if (!user.hasFavoriteIngredientById(ingredientId)) {
            user.addFavoriteIngredientById(ingredientId);
            btnToggleFavModal(btnGalleryRef, true);
            Notify.info('The ingredient has been added to favorites', notifyConfigs);
            // TODO Дописати нотіфікашку
            // console.log("Дописати нотіфікашку");
        } else {
            user.deleteFavoritesIngredientById(ingredientId);
            btnToggleFavModal(btnGalleryRef, false);
            // TODO Дописати нотіфікашку
            // console.log("Дописати нотіфікашку");
        }
        refreshFavIngredientsOnPage();
        if (!user.getId()) {
            // alert("авторизуйтесь");
        } else {
            userManager.pushUser(user);
        }
    }).catch(error => {
        throw new Error(error.message)
    })
}



export async function isFavoriteCocktailsById(idDrink) {
    const auth = JSON.parse(localStorage.getItem("user") || null);
    let isCheck = false;
    if (!auth) {
        return;
    }
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `users/` + `id:${auth.uid}` + `/cocktails/`)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            isCheck = data.includes(idDrink);
            if (isCheck) {
                localStorage.setItem("favoriteCocktail", idDrink);
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export async function isFavoriteIngredients(idIngredient) {
    const auth = JSON.parse(localStorage.getItem("user") || null);
    let isCheck = false;
    if (!auth) {
        return;
    }
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `users/` + `id:${auth.uid}` + `/ingredients/`)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            isCheck = data.includes(idIngredient);
            if (isCheck) {
                localStorage.setItem("favoriteIngredient", idIngredient);
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

//! ***********************************************************************************************************************
// TODO зміна стилів в галереї по кліку додати до улюблених
// !!!   рядок btn.classList.add("is-checked"); - не змінювати

function btnToggleFavGallery(btn, isChecked) {
    if (isChecked) {
        btn.classList.add("is-checked");
        // btn.children[0].textContent = "Remove";
    } else {
        btn.classList.remove("is-checked");
        // btn.children[0].textContent = "Add to";
    }
}

// TODO зміна стилів по кліку в модальному вікні додати до улюблених
// !!!   рядок btn.classList.add("is-checked"); - не змінювати
function btnToggleFavModal(btn, isChecked) {
    if (isChecked) {
        btn.classList.add("is-checked");
        btn.classList.textContent = "Remove from favorite"
    } else {
        btn.classList.remove("is-checked");
        btn.classList.textContent = "Add to favorite"
    }
}


//! ***********************************************************************************************************************


