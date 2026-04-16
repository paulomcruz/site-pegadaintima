const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("section[id]");
const revealItems = document.querySelectorAll(".reveal-up, .reveal-left");
const parallaxTargets = document.querySelectorAll(".hero-media, .media-card, .image-panel");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    body.classList.toggle("menu-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

const activateCurrentSection = () => {
  const offset = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");

    if (id && offset >= top && offset < bottom) {
      navLinks.forEach((link) => {
        const target = link.getAttribute("href");
        link.classList.toggle("active", target === `#${id}`);
      });
    }
  });
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item, index) => {
  if (!prefersReducedMotion) {
    item.style.transitionDelay = `${Math.min(index * 60, 220)}ms`;
  }

  revealObserver.observe(item);
});

const parallax = () => {
  if (prefersReducedMotion) return;

  const y = window.scrollY;
  parallaxTargets.forEach((target, idx) => {
    const speed = (idx + 1) * 0.02;
    target.style.transform = `translateY(${y * speed}px)`;
  });
};

window.addEventListener("scroll", () => {
  activateCurrentSection();
  parallax();
});

window.addEventListener("load", () => {
  activateCurrentSection();

  const videos = document.querySelectorAll(".bg-video");
  videos.forEach((video) => {
    const attemptPlay = video.play();
    if (attemptPlay && typeof attemptPlay.catch === "function") {
      attemptPlay.catch(() => {
        video.style.display = "none";
      });
    }
  });
});
