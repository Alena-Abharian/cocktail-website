import { refs } from '../config/refs';
import * as icons from '../../images/icons.svg';
import mob from '../../images/group/groupmob.png';
import mob2 from '../../images/group/groupxmob.png';
import tab from '../../images/group/grouptab.png';
import tab2 from '../../images/group/groupxtab.png';
import { refreshFavCocktailOnPage } from './../firebase/firebaseDb';

export function createMarkup(data = []) {
  let markupArray = [];
  let markup = '';
  for (let i = 0; i < data.length; i++) {
    if (!data[i]) {
      continue;
    };
    const { strDrink, strDrinkThumb, idDrink } = data[i]
    markup = `<li class="gallery__list-item card-set-item"  data-id="${idDrink}">
          <img
            class="gallery__img"
            src="${strDrinkThumb}"
            alt="${strDrink}"
            loading="lazy"
          />
          <p class="gallery__list-name">${strDrink}</p>
          <div class="gallery__btn-container">
            <button
              class="gallery__btn gallery__btn-more"
              type="button"
              data-type="open-learn-more"
              data-id="${idDrink}"
            >
              Learn more
            </button>
            <button class="gallery__btn gallery__btn-fav js-btn-fav" type="button" data-id="${idDrink}" data-favorite="cocktail">
              <span class="js-btn-gallery-text">Add to</span>
              <svg width="16" height="14" data-favorite class="gallery__btn-fav-svg">
                <use
                  class="gallery__btn-fav-svg"
                  href="${icons}#icon-heart"
                ></use>
              </svg>
            </button>
          </div>
        </li>`;
    markupArray.push(markup);
  }
  return markupArray;

  // if (!data) console.log('fignya');
  //   return data.map(({ strDrink, strDrinkThumb, idDrink }) => {
  //     return `<li class="gallery__list-item card-set-item"  data-id="${idDrink}">
  //         <img
  //           class="gallery__img"
  //           src="${strDrinkThumb}"
  //           alt="${strDrink}"
  //           loading="lazy"
  //         />
  //         <p class="gallery__list-name">${strDrink}</p>
  //         <div class="gallery__btn-container">
  //           <button
  //             class="gallery__btn gallery__btn-more"
  //             type="button"
  //             data-type="open-learn-more"
  //             data-id="${idDrink}"
  //           >
  //             Learn more
  //           </button>
  //           <button class="gallery__btn gallery__btn-fav js-btn-fav" type="button" data-id="${idDrink}" data-favorite="cocktail">
  //             <span class="js-btn-gallery-text">Add to</span>
  //             <svg width="16" height="14" data-favorite class="gallery__btn-fav-svg">
  //               <use
  //                 class="gallery__btn-fav-svg"
  //                 href="${icons}#icon-heart"
  //               ></use>
  //             </svg>
  //           </button>
  //         </div>
  //       </li>`;
  //   });
}

export function noResultRender() {
  refs.galleryTitle.textContent = '';

  refs.gallery.innerHTML = '';
  const markup = ` <div class="container sorry ">
    <h2 class="sorry__title">Sorry, we didn't find any cocktail for you</h2>
    <div class="sorry__picture">
      <picture>
        <source
          srcset="${mob} 1x, ${mob2} 2x"
          media="(min-width: 768px)"
        />
        <source
          srcset="${tab} 1x, ${tab2} 2x"
          media="(max-width: 767px)"
        />
        <img
          class="sorry__img"
          src="${mob}"
          alt="group"
          loading="lazy"
        />
      </picture>
    </div>
  </div>`;
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

export function cardsQuantity(markup) {
  if (window.screen.width < 768) {
    const render = markup.filter((el, i) => i <= 2);
    return render.join('');
  } else if (window.screen.width >= 768 && window.screen.width < 1280) {
    const render = markup.filter((el, i) => i <= 5);
    return render.join('');
  }
  const render = markup.filter((el, i) => i <= 8);
  return render.join('');
}

export function renderCards(data = []) {
  refs.gallery.innerHTML = '';
  const render = cardsQuantity(createMarkup(data));
  refs.gallery.insertAdjacentHTML('beforeend', render);
  refreshFavCocktailOnPage();
}


export function quantityOnPage() {
  if (window.screen.width < 768) {
    return 3;
  } else if (window.screen.width >= 768 && window.screen.width < 1280) {
    return 6;
  }
  return 9;
}


