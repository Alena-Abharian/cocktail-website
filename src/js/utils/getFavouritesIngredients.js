const FAVOURITES_INGREDIENTS_KEY = 'favouriteIngredients';

export function getFavoritesIngredients() {
  return JSON.parse(localStorage.getItem(FAVOURITES_INGREDIENTS_KEY) || null) || [];
}
