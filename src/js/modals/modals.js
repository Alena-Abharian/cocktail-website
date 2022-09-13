import CocktailApiService from '../services/CocktailApiService';
import { refs } from '../config/refs';
import { renderModalCocktail, renderModalIngredient } from './renderModal';
import {
  addModalCocktailClick,
  delModalCocktailClick,
  addModalIngredientClick,
  delModalIngredientClick,
} from '../firebase/firebaseDb';

const cocktailApiService = new CocktailApiService();

refs.gallery.addEventListener('click', onOpenModalCocktail);

async function onOpenModalCocktail(e) {
  if (e.target.dataset.type !== 'open-learn-more') return;
  refs.backdropCocktail.classList.remove('visually-hidden');
  refs.backdropCocktail.classList.add('js-modal-cocktail');

  cocktailApiService.searchQuery = e.target.dataset.id;
  await cocktailApiService.fetchCocktailById();

  renderModalCocktail(cocktailApiService.drinks[0]);
  addModalCocktailClick();
  addListeners();
}

export async function onClick(e) {
  if (e.target.dataset.type === 'open-ingredient') {
    delModalCocktailClick();
    onClickOpenIngr(e);
    addModalIngredientClick();
    return;
  }
  if (e.target.dataset.modal === 'close-cocktail') {
    delModalCocktailClick();
    onModalClose();
    return;
  }
  if (e.target.dataset.modal === 'close-ingredient') {
    if (
      refs.backdropCocktail.classList.contains('js-modal-cocktail') &&
      !document.querySelector('.modal__cocktail')
    ) {
      refs.backdropCocktail.classList.remove('js-modal-cocktail');
      renderModalCocktail(cocktailApiService.drinks[0]);
      addModalCocktailClick();
      return;
    }
    onModalClose();
    delModalIngredientClick();
    return;
  }
  if (e.target.classList.contains('backdrop__cocktail')) {
    if (
      refs.backdropCocktail.classList.contains('js-modal-cocktail') &&
      !document.querySelector('.modal__cocktail')
    ) {
      refs.backdropCocktail.classList.remove('js-modal-cocktail');
      renderModalCocktail(cocktailApiService.drinks[0]);
      addModalCocktailClick();
      return;
    }
    onModalClose();
    delModalCocktailClick();
    return;
  }
}

export function onModalClose() {
  removeListeners();
  startScrollWhenModalIsClosed();
  refs.backdropCocktail.classList.add('visually-hidden');
}

export function addListeners() {
  refs.backdropCocktail.addEventListener('click', onClick);
  document.addEventListener('keydown', onEscKeyPress);
}

export function removeListeners() {
  refs.backdropCocktail.removeEventListener('click', onClick);
  document.removeEventListener('keydown', onEscKeyPress);
}

export function onEscKeyPress(event) {
  if (
    refs.backdropCocktail.classList.contains('js-modal-cocktail') &&
    !document.querySelector('.modal__cocktail')
  ) {
    refs.backdropCocktail.classList.remove('js-modal-cocktail');
    delModalIngredientClick();
    renderModalCocktail(cocktailApiService.drinks[0]);
    addModalCocktailClick();
    return;
  }
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = event.code === ESC_KEY_CODE;
  if (isEscKey) {
    delModalCocktailClick();
    delModalIngredientClick();
    onModalClose();
  }
}

async function onClickOpenIngr(e) {
  try {
    cocktailApiService.searchQuery = e.target.dataset.name;
    await cocktailApiService.fetchIngredientsByName();
  } catch (error) {
    console.log(error.message);
  }
  return renderModalIngredient(cocktailApiService.ingredients[0]);
}
export function stopScrollWhenModalIsOpen() {
  refs.body.style.overflow = 'hidden';
}
function startScrollWhenModalIsClosed() {
  refs.body.style.overflow = 'auto';
}
