'use strict';

// Elements selection
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const navLinks = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Learn more button scrolling
btnScrollTo.addEventListener('click', e => {
  const s1coords = sectionOne.getBoundingClientRect();
  sectionOne.scrollIntoView({ behavior: 'smooth' }); // modern browser
});

// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: "smooth"});
//   });
// });

// Event delegation: capturing and bubbling allow us to implement event handling patterns called event delegation.
// Main idea -> if a lot of elements are handled in similar way, then instead of assigning a handler to each of them, put a single handler on ther common ancestor.

// 1. Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabs components
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener(
  'click',
  function (e) {
    const clicked = e.target;
    if (!clicked) return; // guard clause

    // Active tab
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    // Activate content area
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  },
  false
);

// Links hovering effect -> Passing arguments to event handlers
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initCoords = sectionOne.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > initCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

// Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(sectionOne);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Revealing the sections with scroll
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replacing the src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add(`dots__dot--active`);
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);
activateDot(0);

// Next slides
const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && nextSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    e.target.classList.add('dots__dot--active');
    goToSlide(slide);
    activateDot(slide);
  }
});

///////////////////////////////////////////////////////////////////////
/*=========== Selecting elements ===========*/
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
// const body = document.querySelector('body');
// const header = document.querySelector('.header');
// // const allSections = document.querySelectorAll('.section');

// // // HTML collections - live collections(as dom changes, collection is updated).
// // const allButtons = document.getElementsByTagName('button');

// // console.log(document.getElementsByClassName('btn'));

// /*=========== Creating and inserting elements ===========*/
// // creating
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = 'We use cookies to provide an improved functionality <button class="btn btn--close--cookie">Got it!</button>';
// // header.prepend(message);
// header.append(message);

// // inserting as sibling
// header.before(message);
// // header.after(message);

// document.querySelector('.btn--close--cookie').addEventListener('click', ()=> {
//   message.remove();
// });

// ///////////////////////////////////////////////////////////////////////
// // Styles, attributes and classes

// // Styles
// message.style.backgroundColor = '#37383d';

// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).height);
// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'red');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);

// logo.alt = 'Beautiful minimalist logo';

// // console.log(logo.designer); // non-standard attribute
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// // getting src of image
// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add('');
// logo.classList.remove('');
// logo.classList.toggle('');
// logo.classList.contains('');

// Don't use because it will override the existing classes
// logo.className = 'anjor';

// ///////////////////////////////////////////////////////////////////////
// // Smooth scrolling

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const sectionOne = document.querySelector('#section--1');

// getBoundingClientRect -> returns size of an element and it's position relative to the viewport.

// pageXOffset -> it returns the number of pixels the document is currently scrolled along the vertical axis

btnScrollTo.addEventListener('click', e => {
  const s1coords = sectionOne.getBoundingClientRect();
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // using animation
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top:  s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  sectionOne.scrollIntoView({ behavior: 'smooth' }); // modern browser
});

// ///////////////////////////////////////////////////////////////////////
// // Types of event and event handlers

const h1 = document.querySelector('h1');

const alertH1 = e => {
  alert('addEventListener: Mouse enter event listener success!');
};

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.addEventListener('mouseenter', function(e){
//   alert('Mouse enter event listener success!');
// });

// h1.onmouseenter = function(e) {
//   alert('onmouseenter: Mouse enter event listener success!');
// };

// ///////////////////////////////////////////////////////////////////////
// // Bubbling and propogation

// rgb(255,255,255)
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// // console.log(randomColor());

// // e.target -> reference to the object onto which the event was dispatched
// // e.currentTarget -> event handler is called during the bubbling and capturing the phase of event
// // addeventlistener -> default working only bubbling phase
// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   // console.log(e.currentTarget === this);

//   // Stop propogation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// }, true);

// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// }); // adding true listen to capturing events

// ///////////////////////////////////////////////////////////////////////
// // DOM traversing

// Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children); // returns Live collections

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'white';

// Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// closest -> opposite of query selector, select parent element
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
// console.log((h1.previousElementSibling));
// console.log((h1.nextElementSibling));

// console.log((h1.previousSibling));
// console.log((h1.nextSibling));

// All the siblings
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el) {
//   if(el !== h1) el.style.transform = 'scale(1.5)';
// });

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree is built');
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = 'message';
// });

// ///////////////////////////////////////////////////////////////////////
// // Defer and async script loading
