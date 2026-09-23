// =======================================================
// Emergent — artists.js (artist directory)
// =======================================================

const state = {
  q: "",
  genre: "all",
  sort: "az",
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

function getFilteredArtists() {
  let list = getArtists();

  const q = state.q.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.city || "").toLowerCase().includes(q),
    );
  }

  if (state.genre !== "all") list = list.filter((a) => a.genre === state.genre);

  if (state.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  if (state.sort === "tracks") list.sort((a, b) => b.trackCount - a.trackCount);

  return list;
}

function render() {
  const list = getFilteredArtists();
  $("#artistGrid").innerHTML = list.map(artistCardHTML).join("");
  $("#emptyState").hidden = list.length !== 0;
}

function bind() {
  $("#artistSearch").addEventListener("input", (e) => {
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
}

function init() {
  populateGenreSelect();
  initI18n(() => render());
  render();
  bind();
}

document.addEventListener("DOMContentLoaded", init);
