"use strict";

///////////////////////////////////////
//Variables
let CurSlide = 0;
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const body = document.querySelector("body");
const scrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("#section--1");
const navLinks = document.querySelector(".nav__links");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContents = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const Sections = document.querySelectorAll(".section");
const Images = document.querySelectorAll("img[data-src]");
const Sliders = document.querySelectorAll(".slide");
const leftBut = document.querySelector(".slider__btn--left");
const rightBut = document.querySelector(".slider__btn--right");
const DotContainer = document.querySelector(".dots");

const maxSlide = Sliders.length;
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const msg = document.createElement("div");
msg.classList.add("cookie-message");
msg.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
body.appendChild(msg);

btnsOpenModal.forEach(function (a) {
  a.addEventListener("click", openModal);
});
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
const closecook = document.querySelector(".btn--close-cookie");
closecook.addEventListener("click", function () {
  msg.remove();
});
scrollTo.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});
navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
});

tabContainer.addEventListener("click", function (e) {
  const tab = e.target.closest(".operations__tab");

  if (!tab) return;
  tabs.forEach(function (t) {
    t.classList.remove("operations__tab--active");
  });
  tab.classList.add("operations__tab--active");

  const tabNo = tab.getAttribute("data-tab");
  const cont = document.querySelector(`.operations__content--${tabNo}`);

  tabContents.forEach(function (t) {
    t.classList.remove("operations__content--active");
  });
  cont.classList.add("operations__content--active");
});
nav.addEventListener("mouseover", function (e) {
  menuNavFade(0.5, e);
});
nav.addEventListener("mouseout", function (e) {
  menuNavFade(1, e);
});
leftBut.addEventListener("click", SliderButLeft);
rightBut.addEventListener("click", SliderButRight);
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") SliderButLeft();
  else if (e.key === "ArrowRight") SliderButRight();
});
DotContainer.addEventListener("click", function (e) {
  const { slide } = e.target.dataset;
  DotShade(slide);
  MoveSlide(slide);
});
////FUNCTIONS
function menuNavFade(opacity, e) {
  if (e.target.classList.contains("nav__link")) {
    const all = e.target.closest(".nav").querySelectorAll(".nav__link");
    const img = e.target.closest(".nav").querySelector("img");
    all.forEach(function (a) {
      if (a !== e.target) {
        a.style.opacity = opacity;
      }
    });
    img.style.opacity = opacity;
  }
}
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 1, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
function stickyNav(entrie) {
  const [entries] = entrie;
  if (!entries.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}
const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
observer.observe(header);
function revealSection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}
const SectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
Sections.forEach(function (a) {
  a.classList.add("section--hidden");
  SectionObserver.observe(a);
});
function LazyImage(entries) {
  const [entry] = entries;
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove("lazy-img");
}
const ImageObserver = new IntersectionObserver(LazyImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

Images.forEach(function (a) {
  ImageObserver.observe(a);
});

function SliderButLeft() {
  if (CurSlide === 0) CurSlide = maxSlide - 1;
  else CurSlide--;
  DotShade(CurSlide);
  MoveSlide(CurSlide);
}
function SliderButRight() {
  if (CurSlide === maxSlide - 1) CurSlide = 0;
  else CurSlide++;
  DotShade(CurSlide);
  MoveSlide(CurSlide);
}
function MoveSlide(slide) {
  Sliders.forEach(function (s, i) {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
}
function createDots() {
  Sliders.forEach(function (_, i) {
    DotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}
function DotShade(slide) {
  document.querySelectorAll(".dots__dot").forEach(function (e, i) {
    e.classList.remove("dots__dot--active");
    if (i == slide) {
      e.classList.add("dots__dot--active");
    }
  });
}
createDots();
MoveSlide(0);
DotShade(0);
