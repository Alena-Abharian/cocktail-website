import DrinkingUser from './../drinkingUser/createUser';
import { getDatabase, ref, set, get } from "firebase/database";
const axios = require('axios');

export default class UserManager {

    constructor(db) {
        this.db = db;
        this.path = "users/";
    }

    //TODO методи юзера

    // //* Забрати юзера з бази
    fetchUserById(id) {
        if (!id) {
            throw new Error("could fetch empty user id");
        }
        const user = new DrinkingUser(id);
        return get(ref(this.db, this.path + `id:${user.getId()}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let dataDb = snapshot.val();
                    //*** cocktails
                    let cocktails = dataDb.cocktails === undefined ? [] : dataDb.cocktails;
                    user.importCocktails(cocktails);
                    let ingredients = dataDb.cocktails === undefined ? [] : dataDb.ingredients;
                    user.importIngredients(ingredients);
                    user.setFetched(true);
                    // console.log("Sucsses fetch");
                } else {
                    console.log("No data available");
                }
                return user;
            })
            .catch((error) => {
                throw new Error(error);
            });
    }



    //* Записати юзера в базу
    pushUser(user) {
        if (!(user instanceof DrinkingUser)) {
            throw new Error("wrong parame type");
        }
        const id = user.getId();
        if (!id) {
            throw new Error("could write empty user id");
        }
        let dataDb = {};
        dataDb.cocktails = user.getFavoritesCocktails();
        dataDb.ingredients = user.getFavoritesIngredients();
        return set(ref(this.db, this.path + `id:${id}`), dataDb)
            .then((response) => {
                // console.log("Susses set")
            })
            .catch((error) => {
                throw new Error(error);
            });
    }
}