/**
 * Template Name: jmPortfolio
 * Updated: Oct 19 2023 without css framework
 */

(function (window, document) {
  'use strict';

  /* --------------------------------------------------------------
  *    DOM utility functions
  -------------------------------------------------------------- */
  const selectEl = (selector, scope = document) => {
    if (typeof selector === 'string' && typeof scope === 'object')
      return scope.querySelector(selector);
  };

  const selectEls = (selector, scope = document) => {
    if (typeof selector === 'string' && typeof scope === 'object')
      return Array.from(scope.querySelectorAll(selector));
  };

  const addListener = (selector, eventType, callbackFn) => {
    const strOrObj =
      typeof selector === 'string' || typeof selector === 'object';
    const isFunc =
      typeof callbackFn !== 'undefined' || typeof callbackFn === 'function';
    const isString = typeof eventType === 'string';

    if (strOrObj && isString && isFunc)
      return selector.addEventListener(eventType, callbackFn);
  };

  /* --------------------------------------------------------------
  *    Helper functions
  -------------------------------------------------------------- */
  const distanceFromTop = (distance) => {
    return (
      window.pageYOffset > distance ||
      window.scrollY > distance ||
      document.body.scrollTop > distance ||
      document.documentElement.scrollTop > distance
    );
  };

  const windowHeight = (section) => {
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    section.style.height = height + 'px';
  };

  /* --------------------------------------------------------------
  *    Selectors
  -------------------------------------------------------------- */
  const preloader = selectEl('.preloader');
  const toggler = selectEl('.toggler');
  const slideUp = selectEl('.slide-up');
  const menuIcon = selectEl('.menu-icon');
  const navLinks = selectEls('.navigation');
  const sections = selectEls('section');
  const backtotop = selectEl('.back-to-top');
  const slider = selectEls('.slider');

  /* --------------------------------------------------------------
  *      Preloader
  -------------------------------------------------------------- */
  addListener(window, 'load', fadeEffect);
  function fadeEffect() {
    const id = setInterval(() => {
      if (!preloader.style.opacity) {
        preloader.style.opacity = 1;
        preloader.style.display = 'flex';
      } else if ((preloader.style.opacity = 0.1)) {
        preloader.style.display = 'none';
      }

      if (preloader.style.opacity > 0) {
        preloader.style.opacity -= 0.1;
      } else {
        clearInterval(id);
      }
    }, 200);
  }

  /* --------------------------------------------------------------
*    Open/Close mobile nav with click
-------------------------------------------------------------- */
  addListener(toggler, 'click', toggleMobileNav);
  function toggleMobileNav() {
    slideUp.classList.toggle('active');
    menuIcon.classList.toggle('fa-times');
    menuIcon.classList.toggle('fa-bars');
    toggler.setAttribute(
      'aria-expanded',
      `${!(toggler.getAttribute('aria-expanded') === 'true')}`
    );
  }

  /* --------------------------------------------------------------
*      Close mobile nav with escape key (keyboard)
-------------------------------------------------------------- */
  addListener(document, 'keydown', (event) =>
    closeMobileNavwithKeyboardEscapeKey(event)
  );

  function closeMobileNavwithKeyboardEscapeKey(event) {
    const isNavActive = slideUp.classList.contains('active');
    const escapeKey = event.key === 'Escape';

    if (isNavActive && escapeKey) {
      slideUp.classList.remove('active');
      menuIcon.classList.toggle('fa-times');
      menuIcon.classList.toggle('fa-bars');
      toggler.setAttribute(
        'aria-expanded',
        `${!(toggler.getAttribute('aria-expanded') === 'true')}`
      );
    }
  }

  /* --------------------------------------------------------------
*      smooth scroll
-------------------------------------------------------------- */

  function scrollToTarget(selector) {
    const element = selectEl(selector);
    const elemTop = parseInt(element.getBoundingClientRect().top);
    const pageOffset = window.pageYOffset || window.scrollY;
    window.scrollTo({
      top: elemTop + pageOffset,
      behavior: 'smooth',
    });
  }

  navLinks.forEach((link) => {
    addListener(link, 'click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      scrollToTarget(href);
    });
  });

  /* --------------------------------------------------------------
*    Navbar active link on page scroll
-------------------------------------------------------------- */
  function activeNavlinkWithScroll() {
    sections.forEach((section) => {
      let sectionTop = section.getBoundingClientRect().top;
      const sectionInView = section.getAttribute('id');
      if (sectionTop < window.innerHeight - 200) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href').slice(1) === sectionInView) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  addListener(window, 'scroll', activeNavlinkWithScroll);
  addListener(window, 'load', activeNavlinkWithScroll);

  /* --------------------------------------------------------------
*    Mobile nav toggle
-------------------------------------------------------------- */
  navLinks.forEach((link) =>
    addListener(link, 'click', (event) => closeSidebar(event))
  );

  function closeSidebar(event) {
    event.preventDefault();
    slideUp.classList.toggle('active');
    menuIcon.classList.toggle('fa-times');
    menuIcon.classList.toggle('fa-bars');
    toggler.setAttribute(
      'aria-expanded',
      `${!(toggler.getAttribute('aria-expanded') === 'true')}`
    );
  }

  /* --------------------------------------------------------------
*    Toggle display when scroll to some distance
-------------------------------------------------------------- */
  addListener(document, 'scroll', () =>
    distanceFromTop(100)
      ? backtotop.classList.add('show')
      : backtotop.classList.remove('show')
  );

  /* --------------------------------------------------------------
*    Back to top 
-------------------------------------------------------------- */
  function scrollBackToTop(clickHandler) {
    let rootElement = document.documentElement;
    let rootTop = rootElement.offsetTop;
    addListener(selectEl(clickHandler), 'click', () => {
      rootElement.scrollTo({
        top: rootTop,
        behavior: 'smooth',
      });
    });
  }

  scrollBackToTop('.back-to-top');
  scrollBackToTop('.header-text');

  /* --------------------------------------------------------------
*    scroll to an element with click
-------------------------------------------------------------- */
  function scrollToSection(clickHandler, whichSection) {
    addListener(selectEl(clickHandler), 'click', () =>
      scrollToTarget(whichSection)
    );
  }

  scrollToSection('#goToAbout', '#about');
  scrollToSection('#goToResume', '#resume');

  /* --------------------------------------------------------------
*    Hero slider effect
-------------------------------------------------------------- */
  slider.forEach((slide) => {
    setInterval(function () {
      const current = slide.querySelector('.active');
      current.classList.remove('active');
      const next = current.nextElementSibling || slide.firstElementChild;
      next.classList.add('active');
    }, 3000);
  });

  /* --------------------------------------------------------------
*    Porfolio isotope and filter
-------------------------------------------------------------- */

  window.addEventListener('load', () => {
    const portfolio = document.querySelector('.filters-wrapper');
    const filters = document.querySelectorAll('.filter');

    if (portfolio) {
      const isotop = new Isotope(portfolio, {
        itemSelector: '.filters-item',
        layoutMode: 'fitRows',
      });

      for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        filter.addEventListener('click', (event) => {
          event.preventDefault();

          for (let index = 0; index < filters.length; index++) {
            const item = filters[index];
            item.classList.remove('active');
          }

          filter.classList.add('active');

          isotop.arrange({
            filter: filter.getAttribute('data-filter-for'),
          });
          isotop.on('arrangeComplete', () => AOS.refresh());
        });
      }
    }
  });

  /* --------------------------------------------------------------
*    Chocolat Lightbox
-------------------------------------------------------------- */

  const imageWrap = document.querySelectorAll('.portfolio-lightbox');
  const ChocolatOptions = {
    loop: true,
    imageSize: 'contain', // possible values : 'scale-down', 'contain', 'native', or 'cover'
    closeOnBackgroundClick: true, // Boolean
    fullScreen: false, // Boolean
    allowZoom: false, // Boolean
    className: 'lightbox', // default : undefined
  };

  addListener(window, 'load', () => Chocolat(imageWrap, ChocolatOptions));

  /* --------------------------------------------------------------
*    Porfolio Modal Popup
-------------------------------------------------------------- */

  function modalInit(openBtn, modalNo, container, btnClose) {
    const modal = selectEl(modalNo);
    const modalOpenBtn = selectEl(openBtn);
    const closeButton = selectEl(btnClose);
    const modalContainer = selectEl(container);

    const modalCallback = (event) => {
      event.target.classList !== modalContainer &&
      !modalContainer.contains(event.target) &&
      event.target.classList.value !== 'modal-container'
        ? closeModal()
        : false;
    };

    const openModal = () => modal.classList.add('is-open');
    const closeModal = () => modal.classList.remove('is-open');

    addListener(modalOpenBtn, 'click', openModal);
    addListener(closeButton, 'click', closeModal);
    addListener(modal, 'click', (event) => modalCallback(event));
    addListener(document, 'keydown', (event) => {
      event.key === 'Escape' ? closeModal() : false;
    });
  }

  const modalArray = [
    {
      openBtn: '#portfolio-1',
      modalNo: '.modal-1',
      container: '.container-1',
      btnClose: '.close-1',
    },
    {
      openBtn: '#portfolio-2',
      modalNo: '.modal-2',
      container: '.container-2',
      btnClose: '.close-2',
    },
    {
      openBtn: '#portfolio-3',
      modalNo: '.modal-3',
      container: '.container-3',
      btnClose: '.close-3',
    },
    {
      openBtn: '#portfolio-4',
      modalNo: '.modal-4',
      container: '.container-4',
      btnClose: '.close-4',
    },
    {
      openBtn: '#portfolio-5',
      modalNo: '.modal-5',
      container: '.container-5',
      btnClose: '.close-5',
    },
    {
      openBtn: '#portfolio-6',
      modalNo: '.modal-6',
      container: '.container-6',
      btnClose: '.close-6',
    },
    {
      openBtn: '#portfolio-7',
      modalNo: '.modal-7',
      container: '.container-7',
      btnClose: '.close-7',
    },
    {
      openBtn: '#portfolio-8',
      modalNo: '.modal-8',
      container: '.container-8',
      btnClose: '.close-8',
    },
    {
      openBtn: '#portfolio-9',
      modalNo: '.modal-9',
      container: '.container-9',
      btnClose: '.close-9',
    },
  ];

  for (let index = 0; index < modalArray.length; index++) {
    const modal = modalArray[index];
    modalInit(modal.openBtn, modal.modalNo, modal.container, modal.btnClose);
  }

  /* --------------------------------------------------------------
*    Initiate Testimonials slider (Splide)
-------------------------------------------------------------- */
  var splide = new Splide('.splide', {
    perPage: 1,
    perMove: 1,
    rewind: true,
    type: 'loop',
    autoplay: true,
    arrows: false,
    pagination: true,
    drag: true,
    snap: true,
    pauseOnHover: false,
    updateOnMove: true,
    paginationDirection: 'ltr',
    speed: 500,
  });
  splide.mount();

  /* --------------------------------------------------------------
*    Animation on scroll
-------------------------------------------------------------- */

  function aosAnimateOnScroll(duration, easing) {
    AOS.init({
      duration,
      easing,
      once: true,
      mirror: false,
    });
  }

  addListener(window, 'load', () => aosAnimateOnScroll(1000, 'ease-in-out'));

  /* --------------------------------------------------------------
*    Initiate Pure Counter
-------------------------------------------------------------- */
  new PureCounter();

  /* --------------------------------------------------------------
*    apply 100% height to div
-------------------------------------------------------------- */
  const homeSection = document.querySelector('#home');
  window.onload = () => windowHeight(homeSection);
  window.onresize = () => windowHeight(homeSection);
})(window, document);
