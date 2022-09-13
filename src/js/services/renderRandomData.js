import CocktailApiService from './CocktailApiService';
import { renderCards } from './renderCards';
const cocktailApiService = new CocktailApiService();
renderStartMarkup();

export async function renderStartMarkup() {
  const responce = await renderRandomData();
  renderCards(responce);
}

export default async function renderRandomData() {
  const array = [];

  for (let i = 0; i < 9; i += 1) {
    await cocktailApiService.fetchRandomCocktaile();
    array.push(...cocktailApiService.randomDrink);
  }

  checkUniqueId(array);
  return array;
}

function checkUniqueId(arr) {
  const idOfCocktails = [...new Set(arr.map(el => el.idDrink))];
  if (idOfCocktails.length < 9) {
    return renderRandomData();
  }
}
