import CocktailApiService from './CocktailApiService';
import { refs } from '../config/refs';
import { createDroplist } from './renderMobLetters';
import { renderCards, noResultRender } from './renderCards';
import smoothScroll from './smoothScroll';

const cocktailApiService = new CocktailApiService();
let checked = document.querySelector('.select__input');
let mobOpen = document.querySelector('.gallery__title');

refs.lettersList.addEventListener('click', onLetterClick);
refs.inputMobile.addEventListener('click', onMobLetterClick);

async function onLetterClick(e) {
  checked.classList.add('select__input-checked');
  if (!e.target.dataset.letter) return;
  cocktailApiService.searchQuery = e.target.dataset.letter;

  try {
    await cocktailApiService.fetchCocktaileByFirstLetter();
    if (!cocktailApiService.drinks) return noResultRender();

    renderCards(cocktailApiService.drinks);
    refs.galleryTitle.textContent = 'Cocktails';
  } catch (error) {
    console.log(error.message);
  }
}

function onMobLetterClick() {
  mobOpen.classList.add('mob-open');
  if (refs.selectLetter.children.length > 1) {
    mobOpen.classList.remove('mob-open');
    refs.selectLetter.lastChild.remove();
    return;
  }

  createDroplist();
  refs.selectLetter.lastChild.addEventListener('click', e => {
    onLetterClick(e);
    refs.inputSpan.textContent = e.target.dataset.letter.toUpperCase();
    refs.selectLetter.lastChild.remove();
    mobOpen.classList.remove('mob-open');
  });
}

let fav = document.querySelector('.fav__select-input');
let favList = document.querySelector('.fav__list');
fav.addEventListener('click', e => {
  if (!favList.classList.contains('visually-hidden')) {
    favList.classList.add('visually-hidden');
    return;
  }
  favList.classList.remove('visually-hidden');
});
