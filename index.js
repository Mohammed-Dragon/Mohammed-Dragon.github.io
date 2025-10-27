const NAV_BAR = document.getElementById('navBar');
const NAV_LIST = document.getElementById('navList');
const HERO_HEADER = document.getElementById('heroHeader');
const HAMBURGER_BTN = document.getElementById('hamburgerBtn');
const NAV_LINKS = Array.from( document.querySelectorAll('.nav__list-link'));
const SERVICE_BOXES = document.querySelectorAll('.service-card__box');
const ACTIVE_LINK_CLASS = 'active';
const BREAKPOINT = 576;

let currentServiceBG = null;
let currentActiveLink = document.querySelector('.nav__list-link.active');

// Remove the active state once the breakpoint is reached
const resetActiveState = ()=>{
  NAV_LIST.classList.remove('nav--active');
  Object.assign(NAV_LIST.style, {
    height: null
  });
  Object.assign(document.body.style, {
    overflowY: null
  });
}

//Add padding to the header to make it visible because navbar has a fixed position.
const addPaddingToHeroHeaderFn = () => {
  const NAV_BAR_HEIGHT = NAV_BAR.getBoundingClientRect().height;
  const HEIGHT_IN_REM = NAV_BAR_HEIGHT / 10;

  // If hamburger button is active, do not add padding
  if (NAV_LIST.classList.contains('nav--active')) {
    return;
  }
  Object.assign(HERO_HEADER.style, {
    paddingTop: HEIGHT_IN_REM + 'rem'
  });
}
addPaddingToHeroHeaderFn();
window.addEventListener('resize', ()=>{
  addPaddingToHeroHeaderFn();

  // When the navbar is active and the window is being resized, remove the active state once the breakpoint is reached
  if(window.innerWidth >= BREAKPOINT){
    addPaddingToHeroHeaderFn();
    resetActiveState();
  }
});

// As the user scrolls, the active link should change based on the section currently displayed on the screen.
window.addEventListener('scroll', ()=>{
  const sections = document.querySelectorAll('#heroHeader, #services, #projects, #contact');

  // Loop through sections and check if they are visible
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - NAV_BAR.getBoundingClientRect().height;
    const sectionHeight = section.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      const ID = section.getAttribute('id');
      const LINK = NAV_LINKS.find(link => link.href.includes('#' + ID));

      if (LINK && currentActiveLink !== LINK) {
        currentActiveLink.classList.remove(ACTIVE_LINK_CLASS);
        LINK.classList.add(ACTIVE_LINK_CLASS);
        currentActiveLink = LINK;
      }
    }
  });

});

// Shows & hide navbar on smaller screen
HAMBURGER_BTN.addEventListener('click', ()=>{
  NAV_LIST.classList.toggle('nav--active');
  if (NAV_LIST.classList.contains('nav--active')) {
    Object.assign(document.body.style, {
      overflowY: 'hidden'
    });
    Object.assign(NAV_LIST.style, {
      height: '100vh'
    });
    return;
  }
  Object.assign(NAV_LIST.style, {
    height: 0
  });
  Object.assign(document.body.style, {
    overflowY: null
  });
});

// When navbar link is clicked, reset the active state
NAV_LINKS.forEach(link => {
  link.addEventListener('click', ()=>{
    resetActiveState();
    link.blur();
  })
})

// Handles the hover animation on services section
SERVICE_BOXES.forEach(service => {
  const moveBG = (x, y) => {
    Object.assign(currentServiceBG.style, {
      left: x + 'px',
      top: y + 'px',
    })
  }
  service.addEventListener('mouseenter', (e) => {
    if (currentServiceBG === null) {
      currentServiceBG = service.querySelector('.service-card__bg');
    }
    moveBG(e.clientX, e.clientY);
  });
  service.addEventListener('mousemove', (e) => {
    const LEFT = e.clientX - service.getBoundingClientRect().left;
    const TOP = e.clientY - service.getBoundingClientRect().top;
    moveBG(LEFT, TOP);
  });
  service.addEventListener('mouseleave', () => {
    const IMG_POS = service.querySelector('.service-card__illustration')
    const LEFT = IMG_POS.offsetLeft + currentServiceBG.getBoundingClientRect().width;
    const TOP = IMG_POS.offsetTop + currentServiceBG.getBoundingClientRect().height;

    moveBG(LEFT, TOP);
    currentServiceBG = null;
  });
});

// Handles smooth scrolling
new SweetScroll({
  trigger: '.nav__list-link, .header__resume',
  easing: 'easeOutQuint',
  offset: NAV_BAR.getBoundingClientRect().height - 170
});

// ------------------------------
// Ensure DOM is ready
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // select the nav link that points to #contact
  const contactNavLink = document.querySelector('.nav__list-link[href="#contact"], a[href="#contact"]');

  if (!contactNavLink) return; // nothing to do

  contactNavLink.addEventListener('click', (ev) => {
    // prevent any other handlers (SweetScroll etc.) from jumping first
    ev.preventDefault();
    ev.stopPropagation();

    // close mobile nav if open
    try { resetActiveState(); } catch (e) { /* ignore if not available */ }

    // give any other UI work (nav close animation) a tiny moment, optional
    const DELAY_MS = 80;

    setTimeout(() => {
      // compute the maximum scrollTop we can reach (page bottom)
      const doc = document.documentElement;
      const body = document.body;

      const pageHeight = Math.max(
        body.scrollHeight, body.offsetHeight,
        doc.clientHeight, doc.scrollHeight, doc.offsetHeight
      );

      // target = bottom of page (so contact appears fully visible)
      const target = Math.max(0, pageHeight - window.innerHeight);

      // optionally stop a little before the bottom (uncomment and set px)
      // const target = Math.max(0, pageHeight - window.innerHeight - 120);

      // Smooth scroll
      window.scrollTo({
        top: target,
        left: 0,
        behavior: 'smooth'
      });

      // update active link class manually (so nav highlights Contact)
      try {
        NAV_LINKS.forEach(link => link.classList.remove('active'));
        contactNavLink.classList.add('active');
      } catch (e) { /* ignore */ }

    }, DELAY_MS);

    return false;
  }, { passive: false });
});
