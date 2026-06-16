const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const pageName = document.body.dataset.page;

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors on restricted local previews.
    }
  },
};

const requestedTheme = new URLSearchParams(window.location.search).get("theme");
const savedTheme =
  requestedTheme === "light" || requestedTheme === "dark"
    ? requestedTheme
    : storage.get("theme");

if (requestedTheme === "light" || requestedTheme === "dark") {
  storage.set("theme", requestedTheme);
}

const setThemeLabel = () => {
  if (!themeLabel) return;
  themeLabel.textContent = document.body.classList.contains("light-mode")
    ? "Mode sombre"
    : "Mode clair";
};

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

setThemeLabel();

themeToggle?.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  storage.set("theme", isLight ? "light" : "dark");
  setThemeLabel();
});

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.classList.toggle("active", link.dataset.pageLink === pageName);
});

const updateHeader = () => {
  header?.classList.toggle("is-compact", window.scrollY > 28);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

let lastFocusedElement = null;

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
};

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("[data-modal-close]")?.focus();
};

document.querySelectorAll(".modal").forEach((modal) => {
  modal.setAttribute("aria-hidden", "true");
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.modalOpen));
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest(".modal")));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal.active").forEach(closeModal);
});
