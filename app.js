const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Закрыть меню' : 'Открыть меню';
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Открыть меню';
  nav.classList.remove('is-open');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = 'Открыть меню';
    nav.classList.remove('is-open');
    menuButton.focus();
  }
});

const locations = {
  caucasus: {name:'Кавказ',label:'ГОРНЫЙ ЛАНДШАФТ',image:'assets/caucasus.webp',alt:'Горная локация Кавказ в UAV SIM',description:'Скалистые массивы, травянистые склоны и объёмный туман. Пространство для тренировки маневрирования в горном рельефе.'},
  siberia: {name:'Сибирь',label:'ЗИМНИЙ ЛАНДШАФТ',image:'assets/siberia.webp',alt:'Заснеженные горы и долины локации Сибирь в UAV SIM',description:'Снежные горы, хвойные леса и зимние дороги. Тренируйте прохождение контрольных точек в условиях зимнего ландшафта.'},
  gobi: {name:'Пустыня Гоби',label:'ПЕСЧАНЫЙ ЛАНДШАФТ',image:'assets/gobi.webp',alt:'Песчаные дюны и учебные ворота в локации Пустыня Гоби',description:'Открытое пространство среди песчаных дюн. Визуальные маркеры и учебные ворота помогают осваивать маршрут и управлять дроном.'},
  kamchatka: {name:'Вулканическая пустошь',label:'ВУЛКАНИЧЕСКИЙ ЛАНДШАФТ',image:'assets/kamchatka.webp',alt:'Вулканические долины в симуляторе UAV SIM',description:'Тёмные вулканические породы, красноватые склоны и атмосферные эффекты. Исследуйте рельеф Камчатки в виртуальной среде.'}
};
const tabs = [...document.querySelectorAll('[data-location]')];
const locationImage = document.querySelector('#location-image');
const locationButton = locationImage.parentElement;
const panel = document.querySelector('#location-panel');
function selectLocation(button) {
  const key = button.dataset.location;
  const place = locations[key];
  tabs.forEach(tab => {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  locationImage.src = place.image;
  locationImage.alt = place.alt;
  locationButton.dataset.gallery = key;
  locationButton.setAttribute('aria-label', 'Увеличить скриншот локации ' + place.name);
  document.querySelector('#location-label').textContent = place.label;
  document.querySelector('#location-name').textContent = place.name;
  document.querySelector('#location-description').textContent = place.description;
  panel.setAttribute('aria-labelledby', button.id);
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectLocation(button));
  button.addEventListener('keydown', (event) => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    selectLocation(tabs[target]);
    tabs[target].focus();
  });
});

const gallery = [
  ...Object.entries(locations).map(([key,place]) => ({key,src:place.image,alt:place.alt,caption:place.name+' — кадр из UAV SIM'})),
  {key:'interface',src:'assets/interface.webp',alt:'Главное меню UAV SIM',caption:'Выбор дрона, локации, погоды и режима полёта'},
  {key:'vr',src:'assets/vr-test.webp',alt:'Тестирование UAV SIM в VR с пультом управления',caption:'Тестирование VR-режима и пульта радиоуправления'},
  {key:'gamepad',src:'assets/gamepad.webp',alt:'Тестирование UAV SIM с игровым геймпадом',caption:'Тестирование симулятора с игровым геймпадом'}
];
const dialog = document.querySelector('#gallery-dialog');
let galleryIndex = 0;
let galleryOpener;
function showGalleryImage(index) {
  galleryIndex = (index + gallery.length) % gallery.length;
  const item = gallery[galleryIndex];
  const image = document.querySelector('#gallery-image');
  image.src = item.src;
  image.alt = item.alt;
  document.querySelector('#gallery-caption').textContent = item.caption;
  document.querySelector('#gallery-counter').textContent = `${galleryIndex + 1} / ${gallery.length}`;
}
document.querySelectorAll('.gallery-trigger').forEach(button => button.addEventListener('click', () => {
  galleryOpener = button;
  showGalleryImage(gallery.findIndex(item => item.key === button.dataset.gallery));
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
document.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
document.querySelector('#gallery-prev').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
document.querySelector('#gallery-next').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
dialog.addEventListener('click', (event) => {if (event.target === dialog) dialog.close();});
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {event.preventDefault();showGalleryImage(galleryIndex + 1);}
  if (event.key === 'ArrowLeft') {event.preventDefault();showGalleryImage(galleryIndex - 1);}
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  galleryOpener?.focus();
});
