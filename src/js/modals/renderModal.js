import { refs } from '../config/refs';
import * as icon from './../../images/icons.svg';
import {
  isFavoriteCocktailsById,
  isFavoriteIngredients,
} from './../firebase/firebaseDb';
import { stopScrollWhenModalIsOpen } from './modals';

export async function renderModalCocktail(data) {
  stopScrollWhenModalIsOpen();
  const { strDrinkThumb, strDrink, strInstructions, idDrink } = data;
  await isFavoriteCocktailsById(idDrink);
  const isCheck = JSON.parse(localStorage.getItem('favoriteCocktail') || null);
  localStorage.removeItem('favoriteCocktail');

  const text = isCheck ? 'Remove from favorite' : 'Add to favorite';
  const isClass = isCheck ? 'is-checked' : ' ';

  refs.backdropCocktail.innerHTML = '';
  const markup = `  <div class='modal__cocktail'>
    <div class='cocktail__wrap'>
      <div class='modal__wrap'>
        <img class='cocktail__img' alt='${strDrink}' src="${strDrinkThumb}" loading='lazy'/>
        <div class='cocktail__wrap'>
          <h2 class='cocktail__name'>${strDrink}</h2>
          <h3 class='cocktail__title'>Ingredients</h3>
          <p class='cocktail__text'>Per cocktail</p>
          <ul class='ingredient js-open-modal-ingredient'>${renderIngredients(
    data
  )}</ul>
        </div>
        <button type='button' class='btn--close' data-modal="close-cocktail">
          <svg width='32' height='32' data-modal="close-cocktail">
            <use href='${icon}#icon-close' data-modal="close-cocktail"></use>
          </svg>
        </button>
      </div>

      <div class='recipe__wrap'>
        <h4 class='recipe__title'>Instructions:</h4>
        <p class='recipe__text'>${strInstructions}</p>
      </div>
    </div>
    <div class='cocktail__modal-btn'>
      <button type='button' class='modal__btn js-btn-fav ${isClass}' data-add-cocktail data-id="${idDrink}">${text}</button>
    </div>
  </div>`;
  refs.backdropCocktail.insertAdjacentHTML('beforeend', markup);
}

export async function renderModalIngredient(data) {
  stopScrollWhenModalIsOpen();
  const {
    strIngredient: name,
    strType: type,
    strDescription: description,
    strABV: degree,
    strAlcohol: question,
  } = data;
  await isFavoriteIngredients(data.idIngredient);
  const isCheck = JSON.parse(
    localStorage.getItem('favoriteIngredient') || null
  );
  localStorage.removeItem('favoriteIngredient');

  const text = isCheck ? 'Remove from favorite' : 'Add to favorite';
  const isClass = isCheck ? 'is-checked' : ' ';

  refs.backdropCocktail.innerHTML = '';
  const markup = `  <div class='modal__ingredient'>
    <div class='modal__wrap'>
      <div class='ingredient__wrap'>
      <div class="ing_card_wrap">
       <img class="ing-card" src='https://www.thecocktaildb.com/images/ingredients/${name}-Small.png' alt=${name}>
      <div><h2 class='ingredient__name'>${name}</h2>
       <h3 class='ingredient__title view'>${type || ''}</h3></div>
     </div>
        <div class='line'></div>
        <p class='description__text'><span class='accent__text'>${name} </span>${description?.replace(name, '') || 'No description'
    }</p>
        <ul class='characteristic'>
            <li class='ingredient__item'><span class='ingredient__accent'>&#9733</span><span> Type:</span> ${name || '-'
    }</li>
            <li class='ingredient__item'><span class='ingredient__accent'>&#9733</span><span> Alcoholic:</span> ${question || ''
    }
            </li>
            <li class='ingredient__item'><span class='ingredient__accent'>&#9733</span><span> Alcohol content:</span>
              ${degree ? degree + '%' : '-'}
            </li>
          </ul>
      </div>
      <button type='button' class='btn--close' data-modal="close-ingredient">
        <svg width='32' height='32' data-modal="close-ingredient">
          <use href='${icon}#icon-close' data-modal="close-ingredient"></use>
        </svg>
      </button>
    </div>
  <div class='cocktail__modal-btn'>
    <button type='button' class='modal__btn js-btn-fav ${isClass}' data-add-ingredient data-id="${data.idIngredient
    }">${text}</button>
  </div>
  </div>
`;
  refs.backdropCocktail.insertAdjacentHTML('beforeend', markup);
}

function renderIngredients(data) {
  let markup = '';
  for (let i = 0; i < 15; i += 1) {
    if (data['strIngredient' + i]) {
      markup += `<li class='ingredient__item'><span class='ingredient__accent'>&#9733</span><span>${data['strMeasure' + i] || ''
        }</span> <a
            class='link ingredient-link' data-type='open-ingredient' data-name="${data['strIngredient' + i]
        }">${data['strIngredient' + i]}</a>
          </li>`;
    }
  }
  return markup;
}
