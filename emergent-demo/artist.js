// =======================================================
// Emergent — artist.js (single artist profile)
// Reads ?id=<artistId> from the URL, no backend involved.
// =======================================================

function getArtistIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function renderNotFound() {
  $("#artistContent").innerHTML = `
    <div class="empty">
      <div class="empty__title" data-i18n="artist_not_found">Artist not found.</div>
      <a class="btn btn--ghost" href="./artists.html" style="margin-top:14px; display:inline-flex;" data-i18n="back">← Back</a>
    </div>`;
  applyI18n();
}

function trackRow(track) {
  const fav = isFavorite(track.id);
  return `
    <div class="track-row">
      <div style="display:flex; align-items:center; gap:12px; min-width:0;">
        ${coverHTML(`${track.artist}::${track.title}`, "sm")}
        <div style="min-width:0;">
          <div class="track-row__title">${escapeHTML(track.title)}</div>
          <div class="track-row__meta">${genreLabel(track.genre)} • ${track.year}</div>
        </div>
      </div>
      <div class="track-row__actions">
        <button class="small-btn" data-fav="${track.id}" aria-pressed="${fav}" aria-label="Toggle favorite" title="Favorite">${fav ? "💜" : "🤍"}</button>
        ${
          track.spotifyUrl
            ? `<a class="btn btn--ghost btn--sm btn--spotify" href="${escapeHTML(track.spotifyUrl)}" target="_blank" rel="noreferrer">${t("open_spotify")}</a>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderArtist(artist) {
  const cityLine = artist.city ? ` • ${escapeHTML(artist.city)}` : "";
  $("#artistContent").innerHTML = `
    <div class="artist-header">
      ${artistMediaHTML(artist, { size: "hero", eager: true })}
      <div class="artist-header__info">
        <h1>${escapeHTML(artist.name)}</h1>
        <div class="artist-header__meta">
          <span class="badge" data-i18n="spot_badge">Emerging Artist</span>
          <span class="pill2">${genreLabel(artist.genre)}${cityLine}</span>
        </div>
        <p class="artist-header__bio">${escapeHTML(artist.bio || t("submission_bio_fallback"))}</p>
      </div>
    </div>
  `;
  applyI18n();

  const tracks = getTracksByArtist(artist.id).sort((a, b) => b.hot - a.hot);
  $("#tracksSection").hidden = tracks.length === 0;
  $("#trackList").innerHTML = tracks.map(trackRow).join("");
}

function bind() {
  document.body.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (!favBtn) return;
    toggleFavorite(favBtn.dataset.fav);
    const artist = getArtistById(getArtistIdFromUrl());
    if (artist) renderArtist(artist);
  });
}

function init() {
  const id = getArtistIdFromUrl();
  const artist = id ? getArtistById(id) : null;

  initI18n(() => {
    if (artist) renderArtist(artist);
  });

  if (!artist) {
    renderNotFound();
    return;
  }

  document.title = `Emergent — ${artist.name}`;
  renderArtist(artist);
  bind();
}

document.addEventListener("DOMContentLoaded", init);
