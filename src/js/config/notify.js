export const notifyConfigs = {
    timeout: 2000,
    showOnlyTheLastOne: true,
    clickToClose: true,
}


// nofifications

// export function needLoginFavCock() {
//     const auth = JSON.parse(localStorage.getItem("user") || null);
//       if (auth === null) {
//           Notify.failure('Error. Please login to get your favorites');
//           refs.favList.classList.remove('visually-hidden');
//       } else {
//           onFavoriteCocktailClick();
//       } 
//   }
  
//   export function needLogInFavIngrid() {
//     const auth = JSON.parse(localStorage.getItem("user") || null);
//       if (auth === null) {
//           Notify.failure('Error. Please login to get your favorites');
//           refs.favList.classList.remove('visually-hidden');
//       } else {
//           onFavoriteIngredientClick();
//       } 
//   }
  
//   function needLogIn() {
//     const auth = JSON.parse(localStorage.getItem("user") || null);
//       if (auth === null) {
//           Notify.failure('Error. Please login to get your favorites');
//       } 
//   }