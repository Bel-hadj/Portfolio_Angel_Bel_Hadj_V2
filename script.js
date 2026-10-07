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

// Lightbox pour les galeries de captures de projet (n'agit que sur les pages qui
// possèdent l'élément #lightbox, ex. projet-indiewave.html). Prend aussi en charge
// une navigation précédent/suivant optionnelle quand les déclencheurs partagent un
// data-lightbox-group commun (ex. la galerie "10 photos" de The Ranch) ; sans ce
// groupe, ou sur les pages sans boutons #lightboxPrev/#lightboxNext, le
// comportement reste identique à une simple ouverture/fermeture d'image.
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxDownload = document.getElementById("lightboxDownload");
  const lightboxVideo = document.getElementById("lightboxVideo");
  let lastFocusedBeforeLightbox = null;
  let currentGroup = null;
  let currentIndex = -1;

  // Bascule image/vidéo dans le viewer : affiche le bon élément (contain,
  // jamais rogné) et met en pause/réinitialise l'autre. N'a d'effet que sur
  // les pages dont le lightbox inclut #lightboxVideo.
  function setMedia(src, alt, type) {
    if (type === "video" && lightboxVideo) {
      lightboxImage.hidden = true;
      lightboxImage.src = "";
      lightboxVideo.hidden = false;
      lightboxVideo.src = src;
    } else {
      if (lightboxVideo) {
        lightboxVideo.hidden = true;
        lightboxVideo.pause();
        lightboxVideo.src = "";
      }
      lightboxImage.hidden = false;
      lightboxImage.src = src;
      lightboxImage.alt = alt || "";
    }
    if (lightboxDownload) lightboxDownload.href = src;
  }

  function getGroupItems(groupName) {
    const items = Array.from(document.querySelectorAll('[data-lightbox-group="' + groupName + '"]')).map((el) => ({
      src: el.dataset.lightboxSrc,
      alt: el.dataset.lightboxAlt || "",
      type: el.dataset.lightboxType || "image",
    }));
    // Déduplique par src : un bouton "voir toutes les photos" peut partager la
    // même image qu'une vignette déjà affichée (il sert juste de point d'entrée
    // dans le groupe, pas d'une photo supplémentaire).
    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.src)) return false;
      seen.add(item.src);
      return true;
    });
  }

  function updateNavVisibility() {
    const show = !!(currentGroup && currentGroup.length > 1);
    if (lightboxPrev) lightboxPrev.hidden = !show;
    if (lightboxNext) lightboxNext.hidden = !show;
  }

  function showAt(index) {
    if (!currentGroup || !currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const item = currentGroup[currentIndex];
    setMedia(item.src, item.alt, item.type);
  }

  const onLightboxKeydown = (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showAt(currentIndex - 1);
    if (e.key === "ArrowRight") showAt(currentIndex + 1);
  };

  function openLightbox(src, alt, groupName, type) {
    lastFocusedBeforeLightbox = document.activeElement;
    if (groupName) {
      currentGroup = getGroupItems(groupName);
      const foundIndex = currentGroup.findIndex((item) => item.src === src);
      currentIndex = foundIndex === -1 ? 0 : foundIndex;
      showAt(currentIndex);
    } else {
      currentGroup = null;
      currentIndex = -1;
      setMedia(src, alt, type);
    }
    updateNavVisibility();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
    document.addEventListener("keydown", onLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lightboxImage.src = "";
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = "";
    }
    currentGroup = null;
    currentIndex = -1;
    document.removeEventListener("keydown", onLightboxKeydown);
    if (lastFocusedBeforeLightbox && typeof lastFocusedBeforeLightbox.focus === "function") {
      lastFocusedBeforeLightbox.focus();
    }
  }

  document.querySelectorAll(".gallery-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(trigger.dataset.lightboxSrc, trigger.dataset.lightboxAlt, trigger.dataset.lightboxGroup, trigger.dataset.lightboxType);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => showAt(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => showAt(currentIndex + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Page Club Entrepreneurs : égalise en direct la hauteur des blocs
// Livrable/Outils/Compétences des cartes 01 et 02, en mesurant le rendu
// réel du navigateur plutôt qu'une valeur fixe (fiable quelle que soit la
// police ou l'affichage). Sans effet sur les autres pages.
const club01Work = document.querySelector(".club-card-01 .ranch-work");
const club02Work = document.querySelector(".club-card-02 .ranch-work");
if (club01Work && club02Work) {
  const equalizeClubWork = () => {
    club01Work.style.minHeight = "0px";
    club02Work.style.minHeight = "0px";
    const tallest = Math.max(club01Work.offsetHeight, club02Work.offsetHeight);
    club01Work.style.minHeight = tallest + "px";
    club02Work.style.minHeight = tallest + "px";
  };
  equalizeClubWork();
  window.addEventListener("resize", equalizeClubWork);
  window.addEventListener("load", equalizeClubWork);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(equalizeClubWork);
  }
  setTimeout(equalizeClubWork, 400);
}
