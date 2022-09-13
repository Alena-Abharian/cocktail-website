import { refs } from '../config/refs';
const buttons = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];

export function createDroplist() {
  const markup = `<div class="select__dropdown">
      <ul class="select__list">
      ${createButtonsMarkup()}
      </ul>
      </div>`;
  refs.selectLetter.insertAdjacentHTML('beforeend', markup);
}

function createButtonsMarkup() {
  return buttons
    .map(btn => {
      return `
      <li class="select__item" data-letter="${btn}">${btn.toUpperCase()}</li>
      `;
    })
    .join('');
}
