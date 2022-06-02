'use strict'

const menuOpen = document.getElementById('js-menuOpen');
const menuClose = document.getElementById('js-menuClose');
const menu = document.getElementById('js-menu');
menuOpen.addEventListener('click', (e) => {
  e.preventDefault();
  menu.style.transform = 'translateX(0)'
});
menuClose.addEventListener('click', (e) => {
  e.preventDefault();
  menu.style.transform = 'translateX(100%)'
})