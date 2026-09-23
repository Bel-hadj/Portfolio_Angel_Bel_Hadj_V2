// =======================================================
// Emergent — app.js (homepage)
// Relies on data.js (catalog) and shared.js (theme/i18n/favorites).
// =======================================================

const state = {
  tab: "discover",
  q: "",
  genre: "all",
  sort: "hot",
};

function populateGenreSelect() {
  const select = $("#genreSelect");
  if (!select) return;
  GENRES.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = genreLabel(g);
    select.appendChild(opt);
  });
}

function calcStats(list) {
  $("#statTracks").textContent = list.length;
  $("#statArtists").textContent = getArtists().length;
  $("#statFav").textContent = getFavorites().size;
}

function getFilteredList() {
  let list = getAllTracks();

  if (state.tab === "new") list = list.filter((x) => x.year >= 2024 || x.isSubmission);
  if (state.tab === "favorites") {
    const favs = getFavorites();
    list = list.filter((x) => favs.has(Number(x.id)));
  }

  const q = state.q.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (x) =>
        x.artist.toLowerCase().includes(q) ||
        x.title.toLowerCase().includes(q) ||
        x.genre.toLowerCase().includes(q),
    );
  }

  if (state.genre !== "all") list = list.filter((x) => x.genre === state.genre);

  if (state.sort === "hot") list.sort((a, b) => b.hot - a.hot);
  if (state.sort === "new") list.sort((a, b) => b.year - a.year);
  if (state.sort === "az") list.sort((a, b) => (a.artist + a.title).localeCompare(b.artist + b.title));

  return list;
}

function trackCard(x) {
  const fav = isFavorite(x.id);
  return `
    <article class="card">
      <div class="card__top">
        ${coverHTML(`${x.artist}::${x.title}`, "sm")}
        <div style="flex:1; min-width:0;">
          <div class="card__title">${escapeHTML(x.title)}</div>
          <div class="card__meta">
            <a href="./artist.html?id=${encodeURIComponent(x.artistId)}">${escapeHTML(x.artist)}</a>
            • ${genreLabel(x.genre)} • ${x.year}
          </div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="small-btn" data-fav="${x.id}" aria-pressed="${fav}" aria-label="Toggle favorite" title="Favorite">${fav ? "💜" : "🤍"}</button>
          <button class="small-btn" data-play="${x.id}" aria-label="Play" title="Play">▶</button>
        </div>
      </div>

      <div class="card__bottom">
        <div class="pill2">${genreLabel(x.genre)}</div>
        <div class="hot">${t("sort_hot")}: ${x.hot}</div>
      </div>
    </article>
  `;
}

function render() {
  const list = getFilteredList();

  $("#grid").innerHTML = list.map(trackCard).join("");
  $("#emptyState").hidden = list.length !== 0;
  $("#resultInfo").textContent = tf("results_count", list.length);

  $$(".chip[data-tab]").forEach((btn) => {
    btn.classList.toggle("chip--active", btn.dataset.tab === state.tab);
  });

  calcStats(getAllTracks());
}

const FEATURED_ARTIST_IDS = ["skye-newman", "the-last-dinner-party", "barry-cant-swim", "jack-and-jack"];

function renderFeaturedArtists() {
  const artists = FEATURED_ARTIST_IDS.map(getArtistById).filter(Boolean);
  $("#featuredArtistGrid").innerHTML = artists.map(artistCardHTML).join("");
}

function renderNewGrid() {
  const list = [...getAllTracks()]
    .filter((x) => x.year >= 2024 || x.isSubmission)
    .sort((a, b) => (b.year - a.year) || (b.hot - a.hot))
    .slice(0, 6);
  $("#newGrid").innerHTML = list.map(trackCard).join("");
}

let currentSpotlight = null;

function setSpotlight(x) {
  currentSpotlight = x;
  const artist = getArtistById(x.artistId);
  $("#spotCover").innerHTML = artist
    ? artistMediaHTML(artist, { size: "spot", eager: true })
    : `<div class="media media--spot" aria-hidden="true">${coverArtSVG(`${x.artist}::${x.title}`, 220)}</div>`;
  $("#spotBadge").textContent = t("spot_badge");
  $("#spotHot").textContent = `${t("sort_hot")}: ${x.hot}`;
  $("#spotTrack").textContent = x.title;
  $("#spotArtist").textContent = `${x.artist} • ${genreLabel(x.genre)} • ${x.year}`;
  $("#spotSub").textContent = t("spot_sub");

  const openBtn = $("#spotOpen");
  if (x.spotifyUrl) {
    openBtn.href = x.spotifyUrl;
    openBtn.style.display = "";
  } else {
    openBtn.style.display = "none";
  }

  const embed = $("#spotEmbed");
  if (x.spotifyEmbed) {
    embed.innerHTML = `
      <iframe
        src="${x.spotifyEmbed}"
        width="100%" height="152"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy" title="Spotify player — ${x.title}">
      </iframe>`;
  } else {
    embed.innerHTML = `
      <div class="embed__placeholder">
        <div class="big" aria-hidden="true">🎧</div>
        <div class="muted">${t("spot_placeholder")}</div>
      </div>`;
  }
}

function renderPlaylists() {
  const openLabel = t("open_spotify");
  $("#embeds").innerHTML = PLAYLISTS.map(
    (x) => `
    <div class="embed-card">
      <div class="embed-top" style="display:flex; gap:12px; align-items:center;">
        ${coverHTML(x.title, "sm")}
        <div>
          <div class="embed-title">${escapeHTML(x.title)}</div>
          <div class="embed-sub muted">
            ${escapeHTML(x.curator)} • ${genreLabel(x.genre)} •
            <a href="${x.spotifyUrl}" target="_blank" rel="noreferrer">${openLabel}</a>
          </div>
        </div>
      </div>
      <iframe
        src="${x.spotifyEmbed}"
        width="100%" height="152"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy" title="Spotify playlist — ${x.title}">
      </iframe>
    </div>`,
  ).join("");
}

function bind() {
  $$(".chip[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.tab;
      render();
    });
  });

  $("#ctaTracks").addEventListener("click", () => {
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  });

  $("#searchInput").addEventListener("input", (e) => {
    state.q = e.target.value;
    render();
  });

  $("#genreSelect").addEventListener("change", (e) => {
    state.genre = e.target.value;
    render();
  });

  $("#sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  $("#randomBtn").addEventListener("click", () => {
    const list = getFilteredList();
    if (!list.length) return toast(t("toast_no_results"));
    const pick = list[Math.floor(Math.random() * list.length)];
    setSpotlight(pick);
    toast(t("toast_surprise"));
  });

  document.body.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
      toggleFavorite(favBtn.dataset.fav);
      render();
      renderNewGrid();
      return;
    }

    const playBtn = e.target.closest("[data-play]");
    if (playBtn) {
      const x = getTrackById(playBtn.dataset.play);
      if (x) {
        setSpotlight(x);
        document.querySelector(".spotlight").scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

function initReveal() {
  const targets = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  targets.forEach((el) => io.observe(el));
}

function applyTabFromUrl() {
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "new" || tab === "favorites" || tab === "discover") state.tab = tab;
}

function init() {
  applyTabFromUrl();
  populateGenreSelect();
  initI18n(() => {
    render();
    renderNewGrid();
    renderPlaylists();
    renderFeaturedArtists();
    if (currentSpotlight) setSpotlight(currentSpotlight);
  });

  renderFeaturedArtists();
  renderNewGrid();
  renderPlaylists();
  render();
  bind();
  initReveal();

  const first = [...getAllTracks()].sort((a, b) => b.hot - a.hot)[0];
  if (first) setSpotlight(first);
}

document.addEventListener("DOMContentLoaded", init);
