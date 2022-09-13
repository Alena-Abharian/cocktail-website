import CocktailApiService from './CocktailApiService';
import renderRandomData from './renderRandomData';
import { refs } from '../config/refs';
import { renderCards, noResultRender } from './renderCards';
import smoothScroll from './smoothScroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const cocktailApiService = new CocktailApiService();
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 500;

refs.form.addEventListener('submit', onSubmitBtnClick);
refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
refs.menuForm.addEventListener('submit', onSubmitBtnClick);
refs.menuInput.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

async function onInputChange(e) {
  if (e.target.value.trim() === '') {
    try {
      cocktailApiService.resetSetting();
      const responce = await renderRandomData();
      renderCards(responce);
    } catch (error) {
      console.log(error.message);
    }
    return;
  }
  await fetchSearchValue(e.target.value);
  if (!cocktailApiService.drinks) return noResultRender();

  renderCards(cocktailApiService.drinks);
  refs.galleryTitle.textContent = 'Cocktails';
}

async function onSubmitBtnClick(e) {
  e.preventDefault();
  if (e.currentTarget.elements.search.value.trim() === '')
    return Notify.info('Add some letters');
  await fetchSearchValue(e.currentTarget.elements.search.value);
  if (window.screen.width > 768) smoothScroll(1.5);

  if (!cocktailApiService.drinks) return noResultRender();

  renderCards(cocktailApiService.drinks);
  refs.galleryTitle.textContent = 'Cocktails';
  refs.form.reset();
}

async function fetchSearchValue(input) {
  cocktailApiService.searchQuery = input.trim();
  try {
    await cocktailApiService.fetchCocktaileByName();
  } catch (error) {
    console.log(error.message);
  }
}
