import { refs } from '../config/refs';
import { onBackdropClickWrapper, onEscKeyPressWrapper } from '../utils/onModalClose';

refs.openModalTeam.addEventListener('click', onCloseSignIn);
refs.closeBtnModalTeam.addEventListener('click', toggleModalTeam);

function onCloseSignIn(e) {
  window.addEventListener('keydown', onEscKeyPressWrapper(refs.backdropModalTeam));
  refs.body.classList.toggle('overflow-hidden');
  refs.backdropModalTeam.classList.toggle('visually-hidden');
  refs.backdropModalTeam.addEventListener('click', onBackdropClickWrapper(refs.backdropModalTeam));
}

function toggleModalTeam() {
  refs.body.classList.toggle('overflow-hidden');
  refs.backdropModalTeam.classList.toggle('visually-hidden');
}
