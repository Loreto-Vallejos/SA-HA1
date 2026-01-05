function initNavbarScrollColor() {
  const nav = document.querySelector(".navbar-eternia");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  onScroll(); // para estado inicial
  window.addEventListener("scroll", onScroll, { passive: true });
}
document.addEventListener("DOMContentLoaded", initNavbarScrollColor);