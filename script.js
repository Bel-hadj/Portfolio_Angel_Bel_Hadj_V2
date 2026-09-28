const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

// Cards "flip" (section Expériences) : le survol retourne déjà la carte en
// desktop (CSS), mais le tactile n'a pas de vrai :hover — un tap bascule donc
// la classe .is-flipped pour retourner/re-retourner la carte.
document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("is-flipped");
    }
  });
});

// Si le logo distant (CDN) ne charge pas (pas de réseau, bloqueur, etc.),
// on retombe sur une abréviation texte plutôt que de laisser une image cassée.
document.querySelectorAll(".tool-badge img").forEach((img) => {
  img.addEventListener(
    "error",
    () => {
      const badge = img.parentElement;
      const fallback = document.createElement("span");
      fallback.className = "tool-fallback";
      fallback.textContent = badge.dataset.short || img.alt.slice(0, 4).toUpperCase();
      badge.replaceChild(fallback, img);
    },
    { once: true }
  );
});

// Vignette du projet Fandom : filet de sécurité si assets/project-fandom.png venait à
// manquer (fichier renommé/supprimé) — évite une image cassée / zone vide plutôt qu'une
// perte de fonctionnalité silencieuse. Vérifie aussi l'état déjà chargé (img.complete)
// au cas où l'erreur se soit produite avant l'attache de l'écouteur.
document.querySelectorAll(".project-tile-fandom img").forEach((img) => {
  const markMissing = () => img.closest(".project-tile-fandom")?.classList.add("tile-no-image");
  if (img.complete && img.naturalWidth === 0) {
    markMissing();
  } else {
    img.addEventListener("error", markMissing, { once: true });
  }
});

// Lightbox pour les galeries de captures de projet (n'agit que sur les pages qui
// possèdent l'élément #lightbox, ex. projet-indiewave.html).
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  let lastFocusedBeforeLightbox = null;

  const onLightboxKeydown = (e) => {
    if (e.key === "Escape") closeLightbox();
  };

  function openLightbox(src, alt) {
    lastFocusedBeforeLightbox = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
    document.addEventListener("keydown", onLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lightboxImage.src = "";
    document.removeEventListener("keydown", onLightboxKeydown);
    if (lastFocusedBeforeLightbox && typeof lastFocusedBeforeLightbox.focus === "function") {
      lastFocusedBeforeLightbox.focus();
    }
  }

  document.querySelectorAll(".gallery-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(trigger.dataset.lightboxSrc, trigger.dataset.lightboxAlt);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
