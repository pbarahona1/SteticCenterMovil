const menu = document.querySelector('.menu');
const toggle = document.querySelector('.menu__toggle');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});