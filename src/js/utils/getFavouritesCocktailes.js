const FAVOURITES_COCKTAILS_KEY = 'favouriteCocktails';

export function getFavoritesCocktails() {
  return JSON.parse(localStorage.getItem(FAVOURITES_COCKTAILS_KEY) || null) || [];
}
