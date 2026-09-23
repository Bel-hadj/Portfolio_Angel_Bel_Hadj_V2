// =======================================================
// Emergent — shared.js
// Theme, language, favorites, toasts, avatars, mobile nav.
// Loaded on every page, before the page's own script.
// =======================================================

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Escapes user-supplied text before it is inserted via innerHTML template
// strings (submissions are stored in localStorage as plain text, never HTML).
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// -----------------------
// Toast
// -----------------------
function toast(msg) {
  const node = $("#toast");
  if (!node) return;
  node.textContent = msg;
  node.classList.add("show");
  clearTimeout(node._timeout);
  node._timeout = setTimeout(() => node.classList.remove("show"), 1600);
}

// -----------------------
// Theme (dark / light)
// -----------------------
const THEME_KEY = "emergent:theme";

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function preferredTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  $$("[data-theme-btn]").forEach((btn) => {
    btn.textContent = theme === "dark" ? "🌙" : "☀️";
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  });
}

function initTheme() {
  setTheme(preferredTheme());
  $$("[data-theme-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  });
}

// -----------------------
// i18n (FR / EN / BG)
// -----------------------
const LANG_KEY = "emergent:lang";

const I18N = {
  fr: {
    nav_discover: "Découvrir",
    nav_artists: "Artistes",
    nav_new: "Nouveautés",
    nav_favorites: "Favoris",
    nav_submit: "Proposer un titre",
    brand_tag: "Découvre le son de demain.",

    kicker: "✨ Découverte d'artistes émergents",
    hero_title: "Découvre le <span class=\"grad\">son</span> de demain.",
    hero_sub: "Emergent met en avant des artistes indépendants à travers une sélection équitable — pas seulement les plus streamés.",
    hero_cta_artists: "Explorer les artistes",
    hero_cta_tracks: "Découvrir des titres",

    search_placeholder: "Artiste, titre, genre…",
    surprise_btn: "🎲 Surprise",
    filter_genre: "Genre",
    genre_all: "Tous",
    filter_sort: "Tri",
    sort_hot: "Score",
    sort_new: "Plus récent",
    sort_az: "A → Z",

    stat_tracks: "Titres",
    stat_artists: "Artistes",
    stat_fav: "Favoris",

    spotlight_title: "À l'affiche",
    spot_badge: "Artiste émergent",
    spot_sub: "Choisis un titre pour l'écouter",
    spot_open: "Ouvrir sur Spotify",
    spot_choose: "Choisis un titre",
    spot_placeholder: "Le lecteur Spotify apparaîtra ici",
    spot_hint: "Écoute intégrée via Spotify — aucune inscription requise.",

    section_featured_title: "Artistes en vedette",
    section_featured_sub: "Un premier aperçu des artistes sur Emergent",
    section_new_title: "Nouveautés",
    section_new_sub: "Les derniers titres ajoutés au catalogue",
    section_catalog_title: "Catalogue",
    section_playlists_title: "Playlists à explorer",
    section_playlists_sub: "Sélections éditoriales Spotify pour aller plus loin",

    empty_title: "Aucun résultat",
    empty_text: "Change la recherche ou les filtres.",

    toast_added: "Ajouté aux favoris 💜",
    toast_removed: "Retiré des favoris",
    toast_no_results: "Aucun résultat",
    toast_surprise: "Découverte aléatoire",
    open_spotify: "Spotify",
    view_artist: "Voir l'artiste",
    tracks_count: (n) => `${n} titre${n === 1 ? "" : "s"}`,
    results_count: (n) => `${n} résultat${n === 1 ? "" : "s"}`,

    footer_tag: "Découvre des talents indépendants.",
    footer_student: "Projet étudiant — Varna University of Management, 2026",
    footer_erasmus: "Conçu et développé dans le cadre d'un projet académique Erasmus.",

    artists_title: "Découvrir des artistes",
    artists_sub: "Des voix indépendantes. De nouveaux sons. Pas de course à la popularité.",
    artist_search_placeholder: "Chercher un artiste…",
    sort_alpha: "A → Z",

    back: "Retour",
    submit_title: "Proposer ton titre",
    submit_sub: "Une démo simple pour présenter ta musique — les données restent dans ton navigateur.",
    submit_demo_note: "Démo — les données sont stockées localement dans votre navigateur.",
    label_artist: "Nom d'artiste",
    label_track: "Titre du morceau",
    label_genre: "Genre",
    label_city: "Ville (optionnel)",
    label_year: "Année",
    label_spotify: "Lien Spotify (optionnel)",
    label_desc: "Courte description (optionnel)",
    submit_btn: "Envoyer",
    submit_success: "Titre ajouté au catalogue local 🎉",
    error_required: "Ce champ est requis.",
    error_spotify: "Le lien doit être une URL Spotify valide (open.spotify.com).",
    error_year: "Merci d'indiquer une année valide.",
    view_in_catalog: "Voir dans le catalogue",

    artist_not_found: "Artiste introuvable.",
    artist_tracks_title: "Titres disponibles",
    submission_bio_fallback: "Artiste indépendant, proposé par un auditeur.",
  },
  en: {
    nav_discover: "Discover",
    nav_artists: "Artists",
    nav_new: "New Releases",
    nav_favorites: "Favorites",
    nav_submit: "Submit Music",
    brand_tag: "Discover the next sound.",

    kicker: "✨ Emerging artist discovery",
    hero_title: "Discover the next <span class=\"grad\">sound</span>.",
    hero_sub: "Emergent surfaces independent artists through a fair, curated discovery experience — not just the most streamed.",
    hero_cta_artists: "Explore artists",
    hero_cta_tracks: "Discover tracks",

    search_placeholder: "Artist, track, genre…",
    surprise_btn: "🎲 Surprise",
    filter_genre: "Genre",
    genre_all: "All",
    filter_sort: "Sort",
    sort_hot: "Score",
    sort_new: "Newest",
    sort_az: "A → Z",

    stat_tracks: "Tracks",
    stat_artists: "Artists",
    stat_fav: "Favorites",

    spotlight_title: "Spotlight",
    spot_badge: "Emerging Artist",
    spot_sub: "Pick a track to listen",
    spot_open: "Open on Spotify",
    spot_choose: "Pick a track",
    spot_placeholder: "The Spotify player will appear here",
    spot_hint: "Listen instantly via Spotify — no sign-up required.",

    section_featured_title: "Featured Artists",
    section_featured_sub: "A first look at who's on Emergent",
    section_new_title: "New Releases",
    section_new_sub: "The latest tracks added to the catalog",
    section_catalog_title: "Catalog",
    section_playlists_title: "Playlists to explore",
    section_playlists_sub: "Editorial Spotify picks to dig deeper",

    empty_title: "No results",
    empty_text: "Try a different search or filter.",

    toast_added: "Added to favorites 💜",
    toast_removed: "Removed from favorites",
    toast_no_results: "No results",
    toast_surprise: "Random discovery",
    open_spotify: "Spotify",
    view_artist: "View artist",
    tracks_count: (n) => `${n} track${n === 1 ? "" : "s"}`,
    results_count: (n) => `${n} result${n === 1 ? "" : "s"}`,

    footer_tag: "Discover emerging talent.",
    footer_student: "Student project — Varna University of Management, 2026",
    footer_erasmus: "Designed and developed as part of an Erasmus academic project.",

    artists_title: "Discover Artists",
    artists_sub: "Independent voices. New sounds. No popularity contest.",
    artist_search_placeholder: "Search an artist…",
    sort_alpha: "A → Z",

    back: "Back",
    submit_title: "Submit your music",
    submit_sub: "A simple demo to showcase your music — data stays in your browser.",
    submit_demo_note: "Demo submission — data stored locally in your browser.",
    label_artist: "Artist name",
    label_track: "Track title",
    label_genre: "Genre",
    label_city: "City (optional)",
    label_year: "Release year",
    label_spotify: "Spotify link (optional)",
    label_desc: "Short description (optional)",
    submit_btn: "Submit",
    submit_success: "Track added to the local catalog 🎉",
    error_required: "This field is required.",
    error_spotify: "The link must be a valid Spotify URL (open.spotify.com).",
    error_year: "Please enter a valid year.",
    view_in_catalog: "View in catalog",

    artist_not_found: "Artist not found.",
    artist_tracks_title: "Available tracks",
    submission_bio_fallback: "Independent artist, submitted by a listener.",
  },
  bg: {
    nav_discover: "Открий",
    nav_artists: "Артисти",
    nav_new: "Нови",
    nav_favorites: "Любими",
    nav_submit: "Изпрати музика",
    brand_tag: "Открий звука на бъдещето.",

    kicker: "✨ Открий нови артисти",
    hero_title: "Открий звука на <span class=\"grad\">бъдещето</span>.",
    hero_sub: "Emergent показва независими артисти чрез справедливо, кураторско откриване — не само най-слушаните.",
    hero_cta_artists: "Разгледай артисти",
    hero_cta_tracks: "Открий песни",

    search_placeholder: "Артист, песен, жанр…",
    surprise_btn: "🎲 Изненада",
    filter_genre: "Жанр",
    genre_all: "Всички",
    filter_sort: "Сортиране",
    sort_hot: "Резултат",
    sort_new: "Най-нови",
    sort_az: "A → Z",

    stat_tracks: "Песни",
    stat_artists: "Артисти",
    stat_fav: "Любими",

    spotlight_title: "На фокус",
    spot_badge: "Нов артист",
    spot_sub: "Избери песен, за да слушаш",
    spot_open: "Отвори в Spotify",
    spot_choose: "Избери песен",
    spot_placeholder: "Spotify плейърът ще се появи тук",
    spot_hint: "Слушане веднага през Spotify — без регистрация.",

    section_featured_title: "Препоръчани артисти",
    section_featured_sub: "Първи поглед към артистите в Emergent",
    section_new_title: "Нови песни",
    section_new_sub: "Последно добавени песни в каталога",
    section_catalog_title: "Каталог",
    section_playlists_title: "Плейлисти за откриване",
    section_playlists_sub: "Редакторски Spotify селекции",

    empty_title: "Няма резултати",
    empty_text: "Промени търсенето или филтрите.",

    toast_added: "Добавено в любими 💜",
    toast_removed: "Премахнато от любими",
    toast_no_results: "Няма резултати",
    toast_surprise: "Случайно откритие",
    open_spotify: "Spotify",
    view_artist: "Виж артиста",
    tracks_count: (n) => `${n} песен(и)`,
    results_count: (n) => `${n} резултат(и)`,

    footer_tag: "Открий нови таланти.",
    footer_student: "Студентски проект — Varna University of Management, 2026",
    footer_erasmus: "Проектиран и разработен като част от академичен Erasmus проект.",

    artists_title: "Открий артисти",
    artists_sub: "Независими гласове. Нови звуци. Без надпревара за популярност.",
    artist_search_placeholder: "Търси артист…",
    sort_alpha: "A → Z",

    back: "Назад",
    submit_title: "Изпрати своя музика",
    submit_sub: "Проста демонстрация — данните остават в твоя браузър.",
    submit_demo_note: "Демо — данните се съхраняват локално в браузъра ви.",
    label_artist: "Име на артист",
    label_track: "Заглавие на песен",
    label_genre: "Жанр",
    label_city: "Град (по избор)",
    label_year: "Година на издаване",
    label_spotify: "Spotify линк (по избор)",
    label_desc: "Кратко описание (по избор)",
    submit_btn: "Изпрати",
    submit_success: "Песента е добавена в локалния каталог 🎉",
    error_required: "Това поле е задължително.",
    error_spotify: "Линкът трябва да е валиден Spotify URL (open.spotify.com).",
    error_year: "Моля, въведи валидна година.",
    view_in_catalog: "Виж в каталога",

    artist_not_found: "Артистът не е намерен.",
    artist_tracks_title: "Налични песни",
    submission_bio_fallback: "Независим артист, предложен от слушател.",
  },
};

function getLang() {
  return localStorage.getItem(LANG_KEY) || "en";
}

function t(key) {
  const pack = I18N[getLang()] || I18N.en;
  return pack[key] ?? I18N.en[key] ?? "";
}

function tf(key, ...args) {
  const pack = I18N[getLang()] || I18N.en;
  const v = pack[key] ?? I18N.en[key];
  return typeof v === "function" ? v(...args) : v ?? "";
}

function applyI18n() {
  const lang = getLang();
  const pack = I18N[lang] || I18N.en;

  $$("[data-i18n]").forEach((el) => {
    const val = pack[el.getAttribute("data-i18n")];
    if (val == null) return;
    if (String(val).includes("<")) el.innerHTML = val;
    else el.textContent = val;
  });

  $$("[data-i18n-placeholder]").forEach((el) => {
    const val = pack[el.getAttribute("data-i18n-placeholder")];
    if (val != null) el.setAttribute("placeholder", val);
  });

  document.documentElement.setAttribute("lang", lang);
}

// Applies the current language immediately. `onLanguageChange` (optional)
// re-renders any dynamic content (built from JS, not data-i18n) whenever the
// visitor switches language afterwards — it is not called on initial load.
function initI18n(onLanguageChange) {
  const select = $("#langSelect");
  const saved = getLang();
  if (select) select.value = saved;
  applyI18n();

  if (select) {
    select.addEventListener("change", (e) => {
      localStorage.setItem(LANG_KEY, e.target.value);
      applyI18n();
      if (typeof onLanguageChange === "function") onLanguageChange(e.target.value);
    });
  }
}

// -----------------------
// Favorites
// -----------------------
const FAV_KEY = "emergent:favorites";

function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function isFavorite(id) {
  return getFavorites().has(Number(id));
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const key = Number(id);
  let added;
  if (favs.has(key)) {
    favs.delete(key);
    added = false;
  } else {
    favs.add(key);
    added = true;
  }
  localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  toast(added ? t("toast_added") : t("toast_removed"));
  return added;
}

// -----------------------
// Generated cover art
// Deterministic abstract SVG artwork, seeded from a string (artist name,
// or "artist::title" for a specific track). No external images: nothing
// to hotlink, nothing that can break or raise image-rights questions.
// -----------------------
const COVER_GRADIENTS = [
  ["#7C3AED", "#06B6D4"],
  ["#06B6D4", "#7C3AED"],
  ["#5B21B6", "#7C3AED"],
  ["#06B6D4", "#0EA5E9"],
  ["#4C1D95", "#06B6D4"],
  ["#7C3AED", "#0EA5E9"],
];

const COVER_SIZES = { sm: 48, md: 64, lg: 120 };

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function slugify(str) {
  return (
    String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "artist"
  );
}

// Builds 2-3 soft translucent shapes, positioned and sized from the seed
// so the same seed always renders the same artwork.
function coverShapes(seed) {
  return [0, 1, 2]
    .map((i) => {
      const h = hashString(`${seed}::shape${i}`);
      const cx = 15 + (h % 70);
      const cy = 15 + ((h >> 4) % 70);
      const r = 16 + ((h >> 8) % 24);
      const opacity = (0.08 + ((h >> 12) % 12) / 100).toFixed(2);

      if (h % 2 === 0) {
        const rot = (h >> 16) % 360;
        return `<rect x="${cx - r / 2}" y="${cy - r / 2}" width="${r}" height="${r}" rx="${r * 0.22}" fill="#fff" opacity="${opacity}" transform="rotate(${rot} ${cx} ${cy})"/>`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="${opacity}"/>`;
    })
    .join("");
}

function coverArtSVG(seed, px) {
  const h = hashString(seed);
  const [from, to] = COVER_GRADIENTS[h % COVER_GRADIENTS.length];
  const gradId = `cg-${h}`;

  return `<svg viewBox="0 0 100 100" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#${gradId})"/>
    ${coverShapes(seed)}
  </svg>`;
}

function coverHTML(seed, size = "md") {
  const px = COVER_SIZES[size] || COVER_SIZES.md;
  return `<div class="cover cover--${size}" aria-hidden="true">${coverArtSVG(String(seed), px)}</div>`;
}

// -----------------------
// Artist photos
// Real, verified, stable stock photography (Unsplash) used as an
// illustrative visual per artist — never claimed as a literal likeness.
// Falls back to the generated cover art above if a photo is missing or
// fails to load, so every artist always shows *something* on-brand.
// -----------------------
const MEDIA_DIMENSIONS = {
  card: { w: 480, h: 600 },
  hero: { w: 640, h: 800 },
  sm: { w: 160, h: 160 },
  spot: { w: 220, h: 220 },
};

function unsplashUrl(base, w, h) {
  return `${base}?w=${w}&h=${h}&fit=crop&crop=faces&q=80&auto=format`;
}

// Called via the inline onerror handler on <img class="media__img">.
function handleMediaError(img) {
  const wrapper = img.closest(".media");
  if (!wrapper) return;
  const seed = img.dataset.fallbackSeed || "?";
  const px = Math.max(wrapper.clientWidth, wrapper.clientHeight) || 160;
  wrapper.innerHTML = coverArtSVG(seed, px);
}

// artist: an artist record (curated or visitor-submitted).
// size: "card" | "hero" | "sm" — controls both the requested photo crop and
// the aspect-ratio class applied via CSS.
// eager: pass true only for images visible immediately on page load
// (hero, spotlight) — everything else lazy-loads.
function artistMediaHTML(artist, { size = "card", eager = false } = {}) {
  const name = escapeHTML(artist.name);
  const dim = MEDIA_DIMENSIONS[size] || MEDIA_DIMENSIONS.card;

  if (artist.artistImage) {
    const src = unsplashUrl(artist.artistImage, dim.w, dim.h);
    return `<div class="media media--${size}">
      <img class="media__img" src="${src}" alt="Visual representing ${name}"
        loading="${eager ? "eager" : "lazy"}" data-fallback-seed="${name}"
        onerror="handleMediaError(this)" />
    </div>`;
  }

  return `<div class="media media--${size}" aria-hidden="true">${coverArtSVG(artist.name, Math.max(dim.w, dim.h))}</div>`;
}

// Image-first artist card, shared by the Artists directory and the
// homepage "Featured Artists" section.
function artistCardHTML(artist) {
  const cityLine = artist.city ? ` • ${escapeHTML(artist.city)}` : "";
  return `
    <article class="artist-card">
      ${artistMediaHTML(artist, { size: "card" })}
      <div class="artist-card__body">
        <div class="artist-card__name">${escapeHTML(artist.name)}</div>
        <div class="artist-card__meta">${genreLabel(artist.genre)}${cityLine}</div>
        <div class="artist-card__footer">
          <div class="pill2">${tf("tracks_count", artist.trackCount)}</div>
          <a class="btn btn--ghost btn--sm" href="./artist.html?id=${encodeURIComponent(artist.id)}" data-i18n="view_artist">View artist</a>
        </div>
      </div>
    </article>
  `;
}

// -----------------------
// Mobile nav
// -----------------------
function initMobileNav() {
  const toggle = $("#navToggle");
  const nav = $("#primaryNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  $$("#primaryNav a, #primaryNav button[data-tab]").forEach((el) => {
    el.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// -----------------------
// Footer year
// -----------------------
function initFooterYear() {
  const el = $("#footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

// -----------------------
// Boot: things every page needs immediately
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initFooterYear();
});
