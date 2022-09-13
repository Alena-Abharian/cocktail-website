export function onEscKeyPressWrapper(element) {
  return function onEscKeyPress(event) {
    const ESC_KEY_CODE = 'Escape';
    const isEscKey = event.code === ESC_KEY_CODE;
    if (isEscKey) {
      onModalClose(element);
    }
  };
}

function onModalClose(element) {
  element.classList.add('visually-hidden');
}

export function onBackdropClickWrapper(element) {
  return function onBackdropClick(event) {
    if (event.currentTarget === event.target) {
      onModalClose(element);
    }
  };
}
