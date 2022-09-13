//TODO Function for Cocktail API.
const axios = require('axios');
export default class CocktailApiService {
  constructor() {
    this.BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';
    this.searchQuery = '';
    this.page = 1;
    this.drinks = {};
    this.ingredients = {};
    this.randomDrink = {};
    this.page = 1;
    this.favouriteDrinks = [];
    this.favouriteIngredients = [];
  }


  async fetchCocktaileByFirstLetter() {
    try {
      const url = `${this.BASE_URL}search.php?f=${this.searchQuery}`;
      const response = await axios.get(url);
      this.drinks = response.data.drinks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchCocktaileByName(search) {
    try {
      const url = `${this.BASE_URL}search.php?s=${search || this.searchQuery}`;
      const response = await axios.get(url);
      this.drinks = response.data.drinks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchIngredientsByName(query) {
    try {
      const url = `${this.BASE_URL}search.php?i=${query || this.searchQuery}`;
      const response = await axios.get(url);
      this.ingredients = response.data.ingredients;
      return response.data.ingredients;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchRandomCocktaile() {
    try {
      const url = `${this.BASE_URL}random.php`;
      const response = await axios.get(url);
      this.randomDrink = response.data.drinks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchCocktailById() {
    try {
      const url = `${this.BASE_URL}lookup.php?i=${this.searchQuery}`;
      const response = await axios.get(url);
      // return response.data.drinks;
      this.drinks = response.data.drinks;
    } catch (error) {
      throw new Error(error.message);
    }

  }

  async fetchIngredientById() {
    try {
      const url = `${this.BASE_URL}lookup.php?iid=${this.searchQuery}`;
      const response = await axios.get(url);
      // return response.data.ingredients;
      this.ingredients = response.data.ingredients;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  addFavouriteDrinksById(idDrink) {
    this.favouriteDrinks.push(idDrink);
  }

  deleteFavouriteDrinks(idDrink) {
    this.favouriteDrinks = this.favouriteDrinks.filter(
      data => data !== idDrink
    );
  }

  addFavouriteIngredientsById(idIngredient) {
    this.favouriteIngredients.push(idIngredient);
  }

  deleteFavouriteIngredientsById(idIngredient) {
    this.favouriteDrinks = this.favouriteDrinks.filter(
      data => data !== idIngredient
    );
  }

  resetSetting() {
    this.searchQuery = '';
    // this.per_page = 40;
    // this.page = 1;
    this.drinks = {};
    // this.totalHits = 0;
    // this.loading = false;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  // get drink() {
  //     return this.favouriteIngredient;
  // }

  // set drink(newDrink) {
  //     this.favouriteDrink = newDrink;
  // }

  // get Ingredient() {
  //     return this.favouriteIngredient;
  // }

  // set Ingredient(newIngredient) {
  //     this.favouriteIngredient = newIngredient;
  // }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }



}
