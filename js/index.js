function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('active');
  document.getElementById('mobileOverlay').classList.toggle('active');
}
function navigate(url) { window.location.href = url; }
function toggleSubmenu(element) {
  const submenu = element.nextElementSibling;
  submenu.classList.toggle('active');
  const arrow = element.querySelector('.arrow');
  arrow.classList.toggle('open');
}

// Highlight current page for desktop and mobile menus
const currentPage = window.location.pathname.split("/").pop();
function highlightCurrentMenu(menuSelector) {
  const links = document.querySelectorAll(menuSelector + " a");
  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("current");
      const parentMenu = link.closest('.has-submenu');
      if (parentMenu) parentMenu.querySelector('a').classList.add('current');
    }
  });
}
highlightCurrentMenu('.menu');
highlightCurrentMenu('.mobile-menu ul');

// SCROLL PROGRESS
window.addEventListener('scroll', function(){
  const scroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scroll / height) * 100;
  document.getElementById('scrollProgress').style.width = scrolled + '%';
});

document.querySelectorAll(".mobile-submenu a").forEach(link => {
  link.addEventListener("click", function() {

    // remove all glow
    document
      .querySelectorAll(".mobile-menu a")
      .forEach(l => l.classList.remove("current"));

    // glow submenu item
    this.classList.add("current");

    // glow parent menu
    const parentMenu = this.closest(".has-submenu").querySelector("a");
    parentMenu.classList.add("current");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById("scrollTopBtn");

  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  if (scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}