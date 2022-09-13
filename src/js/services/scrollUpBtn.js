import { refs } from '../config/refs';

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200) {
        refs.toTopBtn.classList.add('active');
    } else {
        refs.toTopBtn.classList.remove('active')
    }
})

