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
let allItems = [];

console.log("pixelsugc.js loaded");

// FIX: correct JSON path (it is NOT inside js/ folder unless you explicitly put it there)
fetch("json/pixelsugc.json")
  .then(res => {
    if (!res.ok) throw new Error("JSON not found: " + res.status);
    return res.json();
  })
  .then(data => {
    console.log("DATA LOADED:", data);

    allItems = data.items || [];
    renderGrids();
  })
  .catch(err => console.error("LOAD ERROR:", err));

function renderGrids() {
  renderGrid("pixelsugcGrid", "Pixels UGC");
  renderGrid("walldecorGrid", "Wall Decor Pixels UGC");
  renderGrid("metaheadverseGrid", "MetaHeadverse Pixels UGC");
  renderGrid("bundlesGrid", "Bundles UGC");
  renderGrid("bobverseGrid", "Bobverse UGC");
}

function renderGrid(gridId, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = allItems.filter(item =>
    item.types && item.types.includes(type)
  );

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const badges = (item.types || [])
  .map(t => {
    const style = typeStyles[t] || {
      color: "#fff",
      glow: "none"
    };

    return `
      <span class="type-badge"
        style="
          background:${style.color};
          box-shadow:${style.glow};
        ">
        ${t}
      </span>
    `;
  })
  .join("");

card.innerHTML = `
  <div class="card-type-overlay">${badges}</div>

<div class="card-image-wrap">
  <img src="${item.image}" alt="${item.name}">

  <div class="card-price-overlay">
    <img src="assets/pixel.png">
    <span>${item.price}</span>
  </div>
</div>

  <div class="card-content">
    <div class="card-title">${item.name}</div>
  </div>
`;

    card.onclick = () => openPopup(item);
    grid.appendChild(card);
  });
}

const typeStyles = {
  "Pixels UGC": {
    color: "#1aa7c9",           // muted cyan
    glow: "0 0 8px rgba(26,167,201,0.35)",
    gradient: "linear-gradient(135deg, #1aa7c9, #2b6cff)"
  },
  "Wall Decor Pixels UGC": {
    color: "#c9a227",           // muted gold
    glow: "0 0 8px rgba(201,162,39,0.35)",
    gradient: "linear-gradient(135deg, #c9a227, #8a6b12)"
  },
  "MetaHeadverse Pixels UGC": {
    color: "#7b4dff",           // softened violet
    glow: "0 0 8px rgba(123,77,255,0.35)",
    gradient: "linear-gradient(135deg, #7b4dff, #3a1c99)"
  },
  "Bundles UGC": {
    color: "#d4af37", /* refined gold */
    glow: "0 0 10px rgba(212,175,55,0.45)",
    gradient: "linear-gradient(135deg, #d4af37, #a67c00)"
  },

  "Bobverse UGC": {
    color: "#2ecc71", /* soft green */
    glow: "0 0 10px rgba(46,204,113,0.35)",
    gradient: "linear-gradient(135deg, #2ecc71, #1e7a45)"
  },

  "Upcoming": {
  color: "#6b7280", // neutral gray
  glow: "0 0 6px rgba(107,114,128,0.25)",
  gradient: "linear-gradient(135deg, #6b7280, #374151)"
}
};

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
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {

    const actionOpen =
      document.getElementById("actionOverlay").style.display === "flex";

    const popupOpen =
      document.getElementById("popupOverlay").style.display === "flex";

    if (actionOpen) {
      closeActionPopup();
      return;
    }

    if (popupOpen) {
      closePopup();
    }
  }
});

function openPopup(item) {
  const overlay = document.getElementById("popupOverlay");
  const inner = document.getElementById("popupCardInner");
  const name = document.getElementById("popupCardName");
  const buyBtn = document.getElementById("popupBuyNow");

  if (!overlay || !inner || !name) return;

  inner.innerHTML = `
    <div class="popup-media-frame">
      <img src="${item.gif}" alt="${item.name}">
    </div>
  `;

  name.textContent = item.name;

  // BUY LINK (from JSON)
  if (buyBtn) {
    buyBtn.onclick = (e) => {
  e.preventDefault();
  openActionPopup();
};
  }

  overlay.style.display = "flex";
}

function openActionPopup() {
  document.getElementById("actionOverlay").style.display = "flex";
}

function closeActionPopup() {
  document.getElementById("actionOverlay").style.display = "none";
}

function openGoogleForm() {
  window.open("https://forms.gle/NComiSEFEUrrpAvp8", "_blank");
}

function openDiscord() {
  window.open("https://discord.gg/x8SvPAWNCn", "_blank");
}

document.getElementById("actionOverlay").onclick = closeActionPopup;

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

document.getElementById("popupOverlay").onclick = function() {
  closePopup();
};

document.getElementById("popupDescription").innerHTML = `
<p class="bundle-title">Buy more UGC, unlock guaranteed rewards instantly:</p>

<div class="bundle-row">
  <span class="bundle-count">5 UGC</span>
  <span class="bundle-text">1 FREE UGC Random Spin</span>
</div>

<div class="bundle-row">
  <span class="bundle-count">10 UGC</span>
  <span class="bundle-text">1 FREE Random Spin + 1 UGC of Your Choice</span>
</div>

<div class="bundle-row">
  <span class="bundle-count">20 UGC</span>
  <span class="bundle-text">2 FREE Random Spins + 2 UGC of Your Choice</span>
</div>

<div class="bundle-row">
  <span class="bundle-count">30 UGC</span>
  <span class="bundle-text">3 FREE Random Spins + 3 UGC of Your Choice</span>
</div>
`;