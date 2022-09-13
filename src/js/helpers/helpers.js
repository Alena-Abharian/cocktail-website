import notifyConfigs from '../config/notify';
import Notiflix, { Notify } from 'notiflix';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';


// export function letMsgRegistrationSuccess(msg) {
//     return Notify.success(msg,notifyConfigs)
// }

// export function letMsgNoImagesByQuery() {
//     return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
// }

// export function letMsgAllImagesLoaded() {
//     return Notify.failure("We're sorry, but you've reached the end of search results.")
// }

// export function letMsgTotalFindImages(total) {
//     return Notify.success(`Hooray! We found ${total} images.`)
// }


export function validateDate(obj, key) {
    let array = obj[key] === undefined ? [] : obj[key];
    return array;
}