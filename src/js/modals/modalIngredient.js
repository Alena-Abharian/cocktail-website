refs.openModalIngredientBtn.addEventListener('click', onOpenModalIngredient);
refs.closeModalIngredientBtn.addEventListener('click', closeModal);

refs.addIngredient.addEventListener('click', onAddIngredient);
refs.removeIngredient.addEventListener('click', onRemoveIngredient);

async function onOpenModalIngredient(e) {
  window.addEventListener(
    'keydown',
    onEscKeyPressWrapper(refs.backdropIngredient)
  );
  refs.backdropIngredient.addEventListener(
    'click',
    onBackdropClickWrapper(refs.backdropIngredient)
  );
  const ingredientName = e.target.textContent;
  try {
    await cocktailApiService.fetchIngredientsByName(ingredientName);
    if (cocktailApiService.ingredients)
      await markupIngredient(cocktailApiService.ingredients[0]);

    const dataType = e.target.getAttribute('data-type');

    if (dataType === 'open-ingredient') {
      toggleModal(refs.backdropCocktail);
      toggleModal(refs.backdropIngredient);
    }
  } catch (err) {
    console.error(err);
  }
}

function closeModal(e) {
  toggleModal(refs.backdropIngredient);
  toggleModal(refs.backdropCocktail);
}

function toggleModal(element) {
  element.classList.toggle('visually-hidden');
}

function onAddIngredient(e) {
  if (e.target.textContent === 'Add to favorite') {
    refs.addIngredient.classList.add('visually-hidden');
    refs.removeIngredient.classList.remove('visually-hidden');
  }
}

function onRemoveIngredient(e) {
  if (e.target.textContent === 'Remove from favorite') {
    refs.addIngredient.classList.remove('visually-hidden');
    refs.removeIngredient.classList.add('visually-hidden');
  }
}
