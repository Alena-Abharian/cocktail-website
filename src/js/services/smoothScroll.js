import { refs } from '../config/refs';

export default function smoothScroll(value) {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * value,
    behavior: 'smooth',
  });
}
