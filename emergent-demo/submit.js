// =======================================================
// Emergent — submit.js
// Frontend-only demo: validates the form and stores the
// submission in localStorage so it appears in the catalog.
// =======================================================

function populateGenreSelect() {
  const select = $("#genre");
  GENRES.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = genreLabel(g);
    select.appendChild(opt);
  });
}

function setFieldError(name, hasError) {
  const field = document.querySelector(`[data-field="${name}"]`);
  if (field) field.classList.toggle("has-error", hasError);
}

function isValidSpotifyUrl(url) {
  if (!url) return true; // optional
  return /^https:\/\/open\.spotify\.com\/(track|playlist|album)\/[a-zA-Z0-9]+(\?[a-zA-Z0-9=_-]*)?$/.test(url);
}

function validate(form) {
  let valid = true;

  const artist = form.artist.value.trim();
  setFieldError("artist", !artist);
  if (!artist) valid = false;

  const title = form.title.value.trim();
  setFieldError("title", !title);
  if (!title) valid = false;

  const year = Number(form.year.value);
  const yearInvalid = !year || year < 1900 || year > 2100;
  setFieldError("year", yearInvalid);
  if (yearInvalid) valid = false;

  const spotifyUrl = form.spotifyUrl.value.trim();
  const spotifyInvalid = !isValidSpotifyUrl(spotifyUrl);
  setFieldError("spotifyUrl", spotifyInvalid);
  if (spotifyInvalid) valid = false;

  return valid;
}

function bind() {
  const form = $("#submitForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate(form)) return;

    const spotifyUrl = form.spotifyUrl.value.trim();
    addSubmission({
      artist: form.artist.value.trim(),
      title: form.title.value.trim(),
      genre: form.genre.value,
      city: form.city.value.trim(),
      year: Number(form.year.value),
      description: form.description.value.trim(),
      spotifyUrl,
      spotifyEmbed: spotifyUrlToEmbed(spotifyUrl),
    });

    form.reset();
    form.year.value = 2026;
    $("#successBox").classList.add("show");
    toast(t("submit_success"));
  });

  form.querySelectorAll(".input").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.closest("[data-field]");
      if (field) field.classList.remove("has-error");
    });
  });
}

function init() {
  populateGenreSelect();
  initI18n();
  bind();
}

document.addEventListener("DOMContentLoaded", init);
