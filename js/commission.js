const GOOGLE_FORM_LINK = "https://forms.gle/NComiSEFEUrrpAvp8";

/* =========================
   GLOBAL STATE
========================= */
let commissionItems = [];
let currentGoogleFormLink = GOOGLE_FORM_LINK;

const clientWorks = [
  { src: "../assets/clientworks/swing.gif", types: ["Integrated"] },
  { src: "../assets/clientworks/teddy.gif", types: ["Pending"] },
  { src: "../assets/clientworks/bobinoor.gif", types: ["Integrated"] },
  { src: "../assets/clientworks/moon.gif", types: ["Pending"] },
  { src: "../assets/clientworks/stateu.gif", types: ["Integrated"] }
];

/* =========================
   MOBILE MENU
========================= */
function toggleMobile() {
  document.getElementById("mobileMenu")?.classList.toggle("active");
  document.getElementById("mobileOverlay")?.classList.toggle("active");
}

function navigate(url) {
  window.location.href = url;
}

function toggleSubmenu(element) {
  const submenu = element.nextElementSibling;
  submenu?.classList.toggle("active");

  const arrow = element.querySelector(".arrow");
  arrow?.classList.toggle("open");
}

/* =========================
   ACTIVE MENU
========================= */
const currentPage = window.location.pathname.split("/").pop();

function highlightCurrentMenu(selector) {
  document.querySelectorAll(selector + " a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("current");

      const parent = link.closest(".has-submenu");
      parent?.querySelector("a")?.classList.add("current");
    }
  });
}

/* =========================
   SCROLL PROGRESS BAR
========================= */
function initScrollProgress() {
  window.addEventListener("scroll", () => {
    const scroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const percent = (scroll / height) * 100;

    const bar = document.getElementById("scrollProgress");
    if (bar) bar.style.width = percent + "%";
  });
}

/* =========================
   LIGHTBOX
========================= */
function initLightbox() {
  const track = document.getElementById("clientCarousel");
  const lightbox = document.getElementById("imageLightbox");
  const img = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");

  if (!track || !lightbox) return;

  track.addEventListener("click", (e) => {
    const target = e.target.closest(".clickable-work");
    if (!target) return;

    img.src = target.src;
    lightbox.classList.add("active");
  });

  function close() {
    lightbox.classList.remove("active");
  }

  closeBtn?.addEventListener("click", close);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* =========================
   POPUP
========================= */
function openPopup(image, name, link) {
  const overlay = document.getElementById("popupOverlay");
  const img = document.getElementById("popupImg");
  const title = document.getElementById("popupCardName");

  if (!overlay) return;

  img.src = image;
  title.textContent = name;

  currentGoogleFormLink = link || GOOGLE_FORM_LINK;
  overlay.style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

/* =========================
   COMMISSION GRID
========================= */
function renderCommissionGrid() {
  const grid = document.getElementById("commissionGrid");
  if (!grid) return;

  grid.innerHTML = "";

  commissionItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
  <div class="card-image-wrap">

    <img src="${item.image}" alt="${item.name}">

    ${item.types ? `
      <div class="card-type-overlay">
        ${item.types.map(type => `
          <div class="type-badge ${type.toLowerCase()}">
            ${type}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <div class="card-price-overlay">
      <span>${item.price}</span>
    </div>

  </div>

  <div class="card-title">${item.name}</div>
`;

    card.onclick = () =>
      openPopup(item.image, item.name, GOOGLE_FORM_LINK);

    grid.appendChild(card);
  });
}

async function loadCommission() {
  try {
    const res = await fetch("/json/commission.json");
    const data = await res.json();

    commissionItems = data.items || [];
    renderCommissionGrid();
  } catch (err) {
    console.error("Commission load failed:", err);
  }
}

/* =========================
   CAROUSEL (SMOOTH LOOP)
========================= */
function initCarousel() {
  const track = document.getElementById("clientCarousel");
  if (!track) return;

  let position = 0;
  const speed = 0.6;

  // IMPORTANT: duplicate content once (needed for seamless loop)
  const original = track.innerHTML;
  track.innerHTML = original + original;

  const getWidth = () => track.scrollWidth / 2;

  function animate() {
    position -= speed;

    if (Math.abs(position) >= getWidth()) {
      position = 0;
    }

    track.style.transform = `translate3d(${position}px,0,0)`;

    requestAnimationFrame(animate);
  }

  animate();
}

function buildCarousel() {
  const track = document.getElementById("clientCarousel");
  if (!track) return;

  track.innerHTML = clientWorks.map(item => `
    <div class="carousel-card">

      <div class="card-type-overlay">
        ${item.types.map(type => `
          <div class="type-badge ${type.toLowerCase()}">
            ${type}
          </div>
        `).join("")}
      </div>

      <img src="${item.src}" class="carousel-item clickable-work">

    </div>
  `).join("");
}

/* =========================
   SCROLL TO TOP (FULL RESTORED)
========================= */
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* Optional global fallback (kept from your version) */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   INIT EVERYTHING (SAFE ORDER)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  highlightCurrentMenu(".menu");
  highlightCurrentMenu(".mobile-menu ul");

  initScrollProgress();
  initLightbox();
  buildCarousel();
  initCarousel();
  initScrollTop()

  loadCommission();

  document
    .getElementById("popupBuyBtn")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      window.open(currentGoogleFormLink, "_blank");
    });
});