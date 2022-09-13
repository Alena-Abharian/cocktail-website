import CocktailApiService from '../services/CocktailApiService';
import { refs } from '../config/refs';
import {
  onBackdropClickWrapper,
  onEscKeyPressWrapper,
} from '../utils/onModalClose';
import { getFavoritesCocktails } from '../utils/getFavouritesCocktailes';
import { toggleCocktailModalInDb } from '../firebase/firebaseDb'



const { img, cocktailList, instructions, cocktailName } = refs.cocktail;
const cocktailApiService = new CocktailApiService();

refs.openModalCocktailBtn.addEventListener('click', onOpenModalCocktail);
refs.closeModalCocktailBtn.addEventListener('click', toggleModal);

const FAVOURITES_COCKTAILS_KEY = 'favouriteCocktails';

async function onOpenModalCocktail(e) {
  window.addEventListener(
    'keydown',
    onEscKeyPressWrapper(refs.backdropCocktail)
  );
  refs.backdropCocktail.addEventListener(
    'click',
    onBackdropClickWrapper(refs.backdropCocktail)
  );
  try {
    // const findCocktailName = e.currentTarget.querySelector('li > p').textContent
    cocktailApiService.searchQuery = e.target.dataset.id;
    // const cocktailId = cocktailApiService.searchQuery;
    await cocktailApiService.fetchCocktailById();
    const cocktail = cocktailApiService.drinks[0];

    await markupCocktail(cocktail);

    const dataType = e.target.getAttribute('data-type');
    if (dataType === 'open-learn-more') {
      refs.backdropCocktail.classList.toggle('visually-hidden');
      const favourites = getFavoritesCocktails();
      const isAddedToFavourites = favourites.some(
        ({ strDrink }) => strDrink === cocktail.strDrink
      );
      if (isAddedToFavourites) {
        toggleAddFavouriteIngredientBtn(true);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function toggleModal() {
  refs.backdropCocktail.classList.toggle('visually-hidden');
  toggleAddFavouriteIngredientBtn(false);
}

function markupCocktail(cocktail) {
  const { strDrinkThumb, strDrink, strInstructions } = cocktail;
  img.src = strDrinkThumb;
  cocktailName.innerHTML = strDrink;
  instructions.innerHTML = strInstructions;
  let ingredients = '';
  for (let i = 1; i <= 15; i += 1) {
    const ingredientKey = 'strIngredient' + i;
    const measureKey = 'strMeasure' + i;
    const ingredient = cocktail[ingredientKey];
    const measure = cocktail[measureKey];
    if (ingredient) {
      ingredients += `<li class='ingredient__item'><span class='ingredient__accent'>&#9733</span><span> ${measure || ''
        }</span> <a
            class='link ingredient-link' data-type='open-ingredient'>${ingredient}</a>
          </li>`;
    }
  }
  cocktailList.innerHTML = ingredients;
}

//remove and add btn

refs.addCocktail.addEventListener('click', onAddCocktail);
refs.removeCocktail.addEventListener('click', onRemoveCocktail);


function onAddCocktail(e) {
  if (e.target.textContent === 'Add to favorite') {
    const cocktail = cocktailApiService.drinks[0];
    const favourites = getFavoritesCocktails();
    localStorage.setItem(
      FAVOURITES_COCKTAILS_KEY,
      JSON.stringify([...favourites, cocktail])
    );
    toggleAddFavouriteIngredientBtn(true);
  }
}

function onRemoveCocktail(e) {
  if (e.target.textContent === 'Remove from favorite') {
    const cocktail = cocktailApiService.drinks[0];
    localStorage.removeItem(cocktail.strDrink);
    toggleAddFavouriteIngredientBtn(false);
  }
}

function toggleAddFavouriteIngredientBtn(isActive) {
  refs.addCocktail.classList.toggle('visually-hidden', isActive);
  refs.removeCocktail.classList.toggle('visually-hidden', !isActive);
}

//
// function getFavoritesCocktails() {
//   return JSON.parse(localStorage.getItem(FAVOURITES_COCKTAILS_KEY) || null) || [];
// }
