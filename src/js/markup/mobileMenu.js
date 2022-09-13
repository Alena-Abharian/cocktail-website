// mobileMenu.js
import { refs } from '../config/refs';
import { onBackdropClickWrapper, onEscKeyPressWrapper } from '../utils/onModalClose';

refs.menuBtn.addEventListener('click', toggleMenu);

function toggleMenu(e) {
  // e.preventDefault();
  refs.body.classList.toggle('overflow-hidden');
  refs.mobMenu.classList.toggle('visually-hidden');
  refs.menuBtn.classList.toggle('is-active');
}

