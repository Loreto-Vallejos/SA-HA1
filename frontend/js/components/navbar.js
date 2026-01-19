function initNavbarScrollColor() {
  const nav = document.querySelector(".navbar-eternia");
  if (!nav) return;

  // Forzar estilo scrolled en páginas de producto
  const isProductPage = document.querySelector('.product-page');
  if (isProductPage) {
    nav.classList.add("is-scrolled");
    return; // No agregar listener de scroll en páginas de producto
  }

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  onScroll(); // para estado inicial
  window.addEventListener("scroll", onScroll, { passive: true });
}
document.addEventListener("DOMContentLoaded", initNavbarScrollColor);