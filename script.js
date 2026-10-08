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

// En dessous de 900px, .ranch-projects-grid repasse en une seule colonne
// (voir styles.css) : les cartes "par paire" ne sont plus côte à côte, donc
// forcer leurs blocs à la même hauteur ne ferait qu'ajouter un vide inutile
// en bas de la plus courte. L'égaliseur ci-dessous s'appuie sur ce même
// seuil pour rester "hauteur automatique" en mobile.
const isRanchGridTwoColumns = () => window.matchMedia("(min-width: 901px)").matches;

// Page Club Entrepreneurs : le bas du cadre Livrable/Outils/Compétences des
// cartes 01 et 02 est déjà aligné en CSS pur (.club-card-01, .club-card-02 :
// align-self + margin-top: auto sur .ranch-work, voir styles.css). Il reste
// à égaliser leur hauteur, qui diffère naturellement selon le nombre de
// lignes que prennent les outils/compétences une fois le texte rendu dans
// le navigateur réel (pas reproductible en CSS statique). Une fois la
// hauteur égale, le haut s'aligne aussi automatiquement (même bas + même
// hauteur). Sans effet sur les autres pages.
const club01Work = document.querySelector(".club-card-01 .ranch-work");
const club02Work = document.querySelector(".club-card-02 .ranch-work");
if (club01Work && club02Work) {
  const equalizeClubWork = () => {
    club01Work.style.minHeight = "0px";
    club02Work.style.minHeight = "0px";
    if (!isRanchGridTwoColumns()) return;
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

// Page The Ranch : égalise en direct la hauteur des blocs Livrable/Outils/
// Compétences des cartes 01/02 et 03/04, en mesurant le rendu réel du
// navigateur. Ignoré sur Club Entrepreneurs (présence de .club-detail),
// qui a son propre réglage ci-dessus.
const ranchGrid = document.querySelector(".ranch-projects-grid");
if (ranchGrid && !document.querySelector(".club-detail")) {
  const ranchCards = Array.from(ranchGrid.querySelectorAll(".ranch-project-card"));
  const ranchPairs = [
    [ranchCards[0], ranchCards[1]],
    [ranchCards[2], ranchCards[3]],
  ];
  const equalizeRanchWork = () => {
    ranchPairs.forEach(([cardA, cardB]) => {
      const workA = cardA && cardA.querySelector(".ranch-work");
      const workB = cardB && cardB.querySelector(".ranch-work");
      if (!workA || !workB) return;
      workA.style.minHeight = "0px";
      workB.style.minHeight = "0px";
      if (!isRanchGridTwoColumns()) return;
      const tallest = Math.max(workA.offsetHeight, workB.offsetHeight);
      workA.style.minHeight = tallest + "px";
      workB.style.minHeight = tallest + "px";
    });
  };
  equalizeRanchWork();
  window.addEventListener("resize", equalizeRanchWork);
  window.addEventListener("load", equalizeRanchWork);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(equalizeRanchWork);
  }
  setTimeout(equalizeRanchWork, 400);
}

// Page Escape Game Château Lutenberg : le bouton "Télécharger le PSD" des
// cartes 01 et 02 ne démarrait pas à la même hauteur, car leurs descriptions
// (texte réel, longueur différente) ne font pas le même nombre de lignes
// une fois rendues dans le navigateur. Égalise la hauteur de ces deux
// paragraphes (mesure réelle) pour que tout ce qui suit (bouton PSD) soit
// aligné, sans toucher au texte, aux images ni aux cadres LIVRABLE/OUTILS/
// COMPÉTENCES (déjà alignés séparément ci-dessus).
const escapeGrid = document.querySelector(".escape-detail .ranch-projects-grid");
if (escapeGrid) {
  const escCard1 = escapeGrid.children[0];
  const escCard2 = escapeGrid.children[1];
  const escP1 = escCard1 && escCard1.querySelector(":scope > p");
  const escP2 = escCard2 && escCard2.querySelector(":scope > p");
  if (escP1 && escP2) {
    const equalizeEscapeIntro = () => {
      escP1.style.minHeight = "0px";
      escP2.style.minHeight = "0px";
      if (!isRanchGridTwoColumns()) return;
      const tallest = Math.max(escP1.offsetHeight, escP2.offsetHeight);
      escP1.style.minHeight = tallest + "px";
      escP2.style.minHeight = tallest + "px";
    };
    equalizeEscapeIntro();
    window.addEventListener("resize", equalizeEscapeIntro);
    window.addEventListener("load", equalizeEscapeIntro);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(equalizeEscapeIntro);
    }
    setTimeout(equalizeEscapeIntro, 400);
  }
}

// Page d'accueil : les 4 cartes de compétences ("Ce que je peux apporter")
// n'ont pas la même hauteur naturelle (texte/tags de longueur différente).
// Les tags sont déjà ancrés en bas de chaque carte (margin-top: auto en
// CSS) ; égaliser la hauteur des 4 cartes suffit donc à aligner le reste
// proprement, sans gros trou au milieu. Mesure réelle du navigateur,
// désactivée sous 901px (cartes empilées : hauteur automatique).
const skillCards = document.querySelectorAll(".skills-showcase .skill-card");
if (skillCards.length) {
  const equalizeSkillCards = () => {
    skillCards.forEach((c) => {
      c.style.minHeight = "0px";
    });
    if (!window.matchMedia("(min-width: 901px)").matches) return;
    const tallest = Math.max(...Array.from(skillCards).map((c) => c.offsetHeight));
    skillCards.forEach((c) => {
      c.style.minHeight = tallest + "px";
    });
  };
  equalizeSkillCards();
  window.addEventListener("resize", equalizeSkillCards);
  window.addEventListener("load", equalizeSkillCards);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(equalizeSkillCards);
  }
  setTimeout(equalizeSkillCards, 400);
}
