import { refs } from '../config/refs';
import { refreshFavCocktailOnPage } from '../firebase/firebaseDb';
import { renderCards, createMarkup, quantityOnPage } from './renderCards';
import {
  createFavIngMarkup,
  renderFavIngredients,
  renderNoFavorites,
} from '../favourites/renderFavorites';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebaseConfig';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { notifyConfigs } from './../config/notify';
import { addListeners } from '../modals/modals';
import { renderModalIngredient } from '../modals/renderModal';
import CocktailApiService from './CocktailApiService';
import { addModalIngredientClick } from '../firebase/firebaseDb';
const debounce = require('lodash.debounce');

const cocktailApiService = new CocktailApiService();
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const axios = require('axios');

refs.fav.addEventListener('click', e => {
  if (refs.favList.classList.contains('visually-hidden')) {
    refs.favList.classList.add('visually-hidden');
    return;
  }
  refs.favList.classList.remove('visually-hidden');
});

refs.favCockBtn.addEventListener('click', needLoginFavCock);
refs.favIngrBtn.addEventListener('click', needLogInFavIngrid);

async function onFavoriteCocktailClick() {
  refs.sectionHero.style.display = 'none';
  refs.galleryTitle.textContent = 'Favorite cocktails';
  refs.gallery.innerHTML = '';
  await markUpCocktails();
  refs.favList.classList.add('visually-hidden');
  refs.gallery.removeEventListener('click', onLearnMoreIngrClick);
}

async function onFavoriteIngredientClick() {
  refs.gallery.addEventListener('click', onLearnMoreIngrClick);
  refs.sectionHero.style.display = 'none';
  refs.galleryTitle.textContent = 'Favorite ingredients';
  refs.gallery.innerHTML = '';
  await markUpIngredients();
  refs.favList.classList.add('visually-hidden');
}

async function onLearnMoreIngrClick(e) {
  if (e.target.dataset.type !== 'open-ingredient') return;
  try {
    cocktailApiService.searchQuery = e.target.dataset.id;
    await cocktailApiService.fetchIngredientById();
    refs.backdropCocktail.classList.remove('visually-hidden');
  } catch (error) {
    console.log(error.message);
  }
  addListeners();
  renderModalIngredient(cocktailApiService.ingredients[0]);
  addModalIngredientClick();
  return;
}

async function markUpCocktails() {
  const auth = JSON.parse(localStorage.getItem('user') || null);
  if (!auth) {
    return;
  }
  let flag = false;
  cocktailApiService.resetPage();
  onValue(
    ref(db, `users/` + `id:${auth.uid}` + '/cocktails'),
    async snapshot => {
      const dataDb = snapshot.val();
      if (!dataDb) {
        renderNoFavorites();
        return;
      }
      const allData = dataDb.map(async el => {
        cocktailApiService.searchQuery = el;
        await cocktailApiService.fetchCocktailById();
        return cocktailApiService.drinks;
      });
      const result = await Promise.all(allData);
      await renderCards(result.flat(1));
      const onPage = quantityOnPage();
      if (result.length > onPage) {
        let res = 0;
        const nextResult = Math.ceil(result.length / onPage - 1);
        let leftCard = nextResult * onPage;
        window.addEventListener(
          'scroll',
          debounce(infinityScroll => {
            const documentRect =
              document.documentElement.getBoundingClientRect();
            if (
              documentRect.bottom <
              document.documentElement.clientHeight + 300
            ) {
              if (!(leftCard < onPage) && !flag) {
                leftCard = leftCard - onPage;
                cocktailApiService.incrementPage();
                res = cocktailApiService.page;
                let array = result
                  .flat(1)
                  .slice((res - 1) * onPage, res * onPage);
                let render = createMarkup(array).join('');
                if (render) {
                  refs.gallery.insertAdjacentHTML('beforeend', render);
                  refreshFavCocktailOnPage();
                }
              } else {
                flag = true;
              }
            }
          }, 100)
        );
      }
    }
  );
}

function markUpIngredients() {
  const auth = JSON.parse(localStorage.getItem('user') || null);
  if (!auth) {
    return;
  }
  let flag = false;
  cocktailApiService.resetPage();

  onValue(
    ref(db, `users/` + `id:${auth.uid}` + '/ingredients'),
    async snapshot => {
      const dataDb = snapshot.val();
      if (!dataDb) {
        renderNoFavorites();
        return;
      }
      const allData = dataDb.map(async el => {
        cocktailApiService.searchQuery = el;
        await cocktailApiService.fetchIngredientById();
        return cocktailApiService.ingredients;
      });
      const result = await Promise.all(allData);
      await renderFavIngredients(result);
      const onPage = quantityOnPage();
      if (result.length > onPage) {
        let res = 0;
        const nextResult = Math.ceil(result.length / onPage - 1);
        let leftCard = nextResult * onPage;
        window.addEventListener(
          'scroll',
          debounce(infinityScroll => {
            const documentRect =
              document.documentElement.getBoundingClientRect();
            if (
              documentRect.bottom <
              document.documentElement.clientHeight + 300
            ) {
              if (!(leftCard < onPage) && !flag) {
                leftCard = leftCard - onPage;
                cocktailApiService.incrementPage();
                res = cocktailApiService.page;
                let array = result
                  .slice((res - 1) * onPage, res * onPage)
                  .flat(1);
                let render = createFavIngMarkup(array).join('');
                if (render) {
                  refs.gallery.insertAdjacentHTML('beforeend', render);
                }
              } else {
                flag = true;
              }
              // await renderFavIngredients(result.slice(onPage + 1, 2 * onPage));
            }
          }, 100)
        );
      }
    }
  );
}

export function needLoginFavCock() {
  const auth = JSON.parse(localStorage.getItem('user') || null);
  if (auth === null) {
    Notify.info('Please login to get your favorite cocktails', notifyConfigs);
    refs.favList.classList.add('visually-hidden');
  } else {
    onFavoriteCocktailClick();
  }
}

export function needLogInFavIngrid() {
  const auth = JSON.parse(localStorage.getItem('user') || null);
  if (auth === null) {
    Notify.info('Please login to get your favorite ingridients', notifyConfigs);
    refs.favList.classList.add('visually-hidden');
  } else {
    onFavoriteIngredientClick();
  }
}

refs.menuFavCock.addEventListener('click', needLoginMenuFavCock);
refs.manuFavIngrid.addEventListener('click', needLogInMenuFavIngrid);

export function needLoginMenuFavCock() {
  refs.body.classList.toggle('overflow-hidden');

  const auth = JSON.parse(localStorage.getItem('user') || null);
  if (auth === null) {
    Notify.info('Please login to get your favorites', notifyConfigs);
    refs.mobMenu.classList.add('visually-hidden');
    refs.menuBtn.classList.toggle('is-active');
  } else {
    refs.mobMenu.classList.add('visually-hidden');
    refs.menuBtn.classList.toggle('is-active');
    onFavoriteCocktailClick();
  }
}

export function needLogInMenuFavIngrid() {
  refs.body.classList.toggle('overflow-hidden');

  const auth = JSON.parse(localStorage.getItem('user') || null);
  if (auth === null) {
    Notify.info('Please login to get your favorites', notifyConfigs);
    refs.mobMenu.classList.add('visually-hidden');
    refs.menuBtn.classList.toggle('is-active');
  } else {
    refs.mobMenu.classList.add('visually-hidden');
    refs.menuBtn.classList.toggle('is-active');
    onFavoriteIngredientClick();
  }
}

// closing favMenu by clicking window
window.addEventListener('click', function (event) {
  if (event.target != refs.fav) {
    refs.favList.classList.add('visually-hidden');
  }
});
