const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navEl = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinksRoot = document.getElementById("primary-nav");

if (navEl && navToggle && navLinksRoot) {
  const setNavOpen = (isOpen) => {
    navEl.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", (event) => {
    event.preventDefault();
    setNavOpen(!navEl.classList.contains("is-open"));
  });

  navLinksRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (!target || target.tagName !== "A") return;

    const dropdownTrigger = target.closest(".nav-item.has-dropdown") && !target.closest(".nav-dropdown");
    if (dropdownTrigger) return;

    setNavOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!navEl.classList.contains("is-open")) return;
    if (navEl.contains(event.target)) return;
    setNavOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setNavOpen(false);
  });
}

const revealGroups = [
  { selector: ".hero .reveal", stagger: 120 },
  { selector: ".hero-highlights div", stagger: 110 },
  { selector: ".hero-card, .hero-panel", stagger: 140 },
  { selector: ".section-title h2, .section-title p", stagger: 90 },
  { selector: ".products-grid article", stagger: 70 },
  { selector: ".industries-grid div", stagger: 70 },
  { selector: ".contact-card, .contact-form", stagger: 120 },
  { selector: ".site-footer strong, .site-footer p", stagger: 90 },
];

revealGroups.forEach(({ selector, stagger }) => {
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${index * stagger}ms`);
  });
});

const revealEls = document.querySelectorAll(".reveal");
let revealObserver = null;

if (revealEls.length) {
  const revealNow = (el) => {
    el.classList.add("is-visible");
  };

  if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealNow(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach(revealNow);
  }
}

const navLinks = document.querySelectorAll(".nav a[href^='#']");
if (navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      const targetReveals = targetEl.querySelectorAll(".reveal");
      targetReveals.forEach((el) => el.classList.remove("is-visible"));

      if (revealObserver) {
        targetReveals.forEach((el) => revealObserver.observe(el));
      } else {
        targetReveals.forEach((el) => el.classList.add("is-visible"));
      }
    });
  });
}

const heroSlides = document.querySelectorAll(".hero-slide");
if (heroSlides.length) {
  const heroImages = [
    encodeURI("assets/Background Images/Fin-backg-ind-img.png"),
    encodeURI("assets/Background Images/Fin-backg-ind-img2.png"),
    encodeURI("assets/Background Images/Fin-backg-ind-img3.jpg"),
  ];

  heroSlides.forEach((slide, index) => {
    const img = heroImages[index % heroImages.length];
    slide.style.backgroundImage = `url("${img}")`;
  });

  let currentIndex = 0;
  let timerId = null;

  const setActiveSlide = (index) => {
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    currentIndex = index;
  };

  const nextSlide = () => {
    setActiveSlide((currentIndex + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((currentIndex - 1 + heroSlides.length) % heroSlides.length);
  };

  const startTimer = () => {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(nextSlide, 5000);
  };

  setActiveSlide(0);
  startTimer();

  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startTimer();
    });
  }
}

const dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");
if (dropdownItems.length) {
  const getDropdownTrigger = (item) => {
    for (const child of item.children) {
      if (child && child.tagName === "A") return child;
    }
    return null;
  };

  const closeAllDropdowns = () => {
    dropdownItems.forEach((item) => {
      item.classList.remove("is-open");
    });
  };

  dropdownItems.forEach((item) => {
    const trigger = getDropdownTrigger(item);
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      const isOpen = item.classList.contains("is-open");
      if (isOpen) return;

      event.preventDefault();
      event.stopPropagation();
      closeAllDropdowns();
      item.classList.add("is-open");
    });

    const menu = item.querySelector(".nav-dropdown");
    if (menu) {
      menu.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.tagName === "A") {
          item.classList.remove("is-open");
        }
      });
    }
  });

  document.addEventListener("click", (event) => {
    dropdownItems.forEach((item) => {
      if (!item.classList.contains("is-open")) return;
      if (item.contains(event.target)) return;
      item.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAllDropdowns();
  });
}
