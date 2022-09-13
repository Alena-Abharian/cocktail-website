// export const getData = key => {
//     return JSON.parse(localStorage.getItem(key));
// };

// LOCALE_STORAGE_KEY = userInfo;

// export const safeData = (key, data) => {
//     let array = [];
//     const jsonData = getData(key);
//     if (jsonData) {
//         array = [...jsonData, data];
//     } else {
//         array.push(data);
//     }
//     saveDataLocalStorage(key, array);
// };

// export const createDataObject = value => {
//     return { isFavouriteDrink: [idDrink], isFavouriteIngredients: [idIngredients] };
// };

// export function saveDataLocalStorage(key, array) {
//     localStorage.setItem(key, JSON.stringify(array));
// }

// export const addFavourite = (array = [], ingredients) => {
//     if (!array.length) return;
//     const arrayFavourite = array.push(ingredients);
//     return arrayFavourite;
// }