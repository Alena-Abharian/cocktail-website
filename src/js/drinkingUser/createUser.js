export default class DrinkingUser {
    constructor(id) {
        this.id = id;
        this.name = null;
        this.email = null;

        this.favoritesCocktails = [];
        this.favoritesIngredients = [];
        this._isFetched = false;
    }

    //! get юзера
    getId() {
        return this.id;
    }

    //!get + set статус юзера в db
    isFetched() {
        return this._isFetched;
    }

    setFetched(newFetched = true) {
        this._isFetched = newFetched;
    }

    //TODO методи роботи з коктейлями

    addFavoriteCocktailById(id) {
        if (!this.favoritesCocktails.find(dataId => dataId === id)) {
            this.favoritesCocktails.push(id);
        }
    }

    deleteFavoriteCocktailById(id) {
        this.favoritesCocktails = this.favoritesCocktails.filter(dataId => dataId !== id)
    }

    getFavoritesCocktails() {
        return this.favoritesCocktails
    }

    hasFavoriteCocktailById(id) {
        return this.favoritesCocktails.find(dataId => dataId === id);
    }

    importCocktails(data) {
        for (let i in data) {
            this.addFavoriteCocktailById(data[i])
        }
        return this;
    }

    //TODO методи роботи з інгредієнтами

    addFavoriteIngredientById(id) {
        if (!this.favoritesIngredients.includes(id)) {
            this.favoritesIngredients.push(id);
        }
    }

    deleteFavoritesIngredientById(id) {
        this.favoritesIngredients = this.favoritesIngredients.filter(dataId => dataId !== id)
        return this;
    }

    getFavoritesIngredients() {
        return this.favoritesIngredients;
    }

    hasFavoriteIngredientById(id) {
        return this.favoritesIngredients.includes(id);
    }

    importIngredients(data) {
        for (let i in data) {
            this.addFavoriteIngredientById(data[i])
        }
    }
}