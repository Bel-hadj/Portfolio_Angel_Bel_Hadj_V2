// =======================================================
// Emergent — data.js
// Single source of truth for artists, tracks and playlists.
// No backend: everything here is static demo data, plus
// whatever a visitor has submitted locally via submit.html.
// =======================================================

const GENRES = ["indie", "alt", "pop", "rnb", "rock", "electronic", "hiphop"];

const GENRE_LABELS = {
  indie: "Indie",
  alt: "Alt",
  pop: "Pop",
  rnb: "R&B",
  rock: "Rock",
  electronic: "Electronic",
  hiphop: "Hip-Hop",
};

function genreLabel(g) {
  return GENRE_LABELS[g] || (g ? g[0].toUpperCase() + g.slice(1) : "—");
}

// -----------------------
// Artists
// -----------------------
const ARTISTS = [
  {
    id: "skye-newman",
    name: "Skye Newman",
    genre: "rnb",
    city: "London, UK",
    bio: "R&B and soul songwriter known for intimate, string-laced storytelling.",
    artistImage: "https://images.unsplash.com/photo-1717278919990-0a9c81d27e51",
  },
  {
    id: "english-teacher",
    name: "English Teacher",
    genre: "indie",
    city: "Leeds, UK",
    bio: "Post-punk influenced indie band blending sharp wit with unpredictable arrangements.",
    artistImage: "https://images.unsplash.com/photo-1539017367106-9b247d897964",
  },
  {
    id: "mk-gee",
    name: "Mk.gee",
    genre: "alt",
    city: "",
    bio: "Genre-bending guitarist reshaping alt-R&B with hazy, lo-fi production.",
    artistImage: "https://images.unsplash.com/uploads/1411419601965aa225d37/edbc4ef7",
  },
  {
    id: "the-last-dinner-party",
    name: "The Last Dinner Party",
    genre: "rock",
    city: "London, UK",
    bio: "Theatrical rock band known for baroque arrangements and commanding live shows.",
    artistImage: "https://images.unsplash.com/photo-1701460356742-deecc12da361",
  },
  {
    id: "barry-cant-swim",
    name: "Barry Can't Swim",
    genre: "electronic",
    city: "Edinburgh, UK",
    bio: "Electronic producer blending house grooves with jazz-inflected samples.",
    artistImage: "https://images.unsplash.com/photo-1642177272498-98096a6c98e4",
  },
  {
    id: "nemahsis",
    name: "Nemahsis",
    genre: "pop",
    city: "Toronto, Canada",
    bio: "Alt-pop artist writing candid, identity-driven songs.",
    artistImage: "https://images.unsplash.com/photo-1535119403-61b2d00d6c20",
  },
  {
    id: "sofia-isella",
    name: "SOFIA ISELLA",
    genre: "pop",
    city: "Los Angeles, USA",
    bio: "Genre-fluid songwriter known for theatrical, hyper-detailed production.",
    artistImage: "https://images.unsplash.com/photo-1696946909078-184cd94d3d45",
  },
  {
    id: "cordae",
    name: "Cordae",
    genre: "hiphop",
    city: "",
    bio: "Lyrically driven rapper known for introspective, genre-crossing releases.",
    artistImage: "https://images.unsplash.com/photo-1767474365536-ef81bfa24c8a",
  },
  {
    id: "jack-and-jack",
    name: "Jack & Jack",
    genre: "pop",
    city: "Los Angeles, USA",
    bio: "Pop duo turning everyday moments into hook-driven anthems.",
    artistImage: "https://images.unsplash.com/photo-1758272960128-33a80dca5799",
  },
  {
    id: "michael-marcagi",
    name: "Michael Marcagi",
    genre: "pop",
    city: "",
    bio: "Folk-leaning pop songwriter with warm, anthemic melodies.",
    artistImage: "https://images.unsplash.com/photo-1756310331722-31901b1bafc1",
  },
  {
    id: "assassin-jg",
    name: "Assassin JG",
    genre: "alt",
    city: "",
    bio: "Independent alt artist crafting moody, atmospheric tracks.",
    artistImage: "https://images.unsplash.com/photo-1577733564058-9b46301e7661",
  },
];

// -----------------------
// Tracks (real artists, real Spotify links)
// -----------------------
const spTrack = (id) => ({
  spotifyUrl: `https://open.spotify.com/track/${id}`,
  spotifyEmbed: `https://open.spotify.com/embed/track/${id}`,
});

const TRACKS = [
  { id: 1, artistId: "skye-newman", artist: "Skye Newman", title: "Hairdresser", genre: "rnb", year: 2025, hot: 97, ...spTrack("1JxfIqe0QDrb768Jg2S7TU") },
  { id: 2, artistId: "skye-newman", artist: "Skye Newman", title: "Family Matters", genre: "rnb", year: 2025, hot: 95, ...spTrack("68STxEDIhToladxl3oGG2x") },

  { id: 3, artistId: "english-teacher", artist: "English Teacher", title: "R&B", genre: "indie", year: 2021, hot: 88, ...spTrack("6yRsDLeo8qszcOS2u11ZDn") },
  { id: 4, artistId: "english-teacher", artist: "English Teacher", title: "Nearly Daffodils", genre: "indie", year: 2024, hot: 86, ...spTrack("4KhdTlYqU38JPjtonY424N") },
  { id: 5, artistId: "english-teacher", artist: "English Teacher", title: "Wallace", genre: "indie", year: 2021, hot: 84, ...spTrack("7edPcqtaDkl0X47fNcXuUS") },
  { id: 6, artistId: "english-teacher", artist: "English Teacher", title: "Mastermind Specialism", genre: "indie", year: 2024, hot: 85, ...spTrack("0eXnPchN00pvqRfIIDBEoG") },
  { id: 7, artistId: "english-teacher", artist: "English Teacher", title: "The World's Biggest Paving Slab", genre: "indie", year: 2024, hot: 85, ...spTrack("1Zp2EOKAVzGKTz1xMECHZx") },
  { id: 8, artistId: "english-teacher", artist: "English Teacher", title: "Albatross", genre: "indie", year: 2024, hot: 83, ...spTrack("60sDbx6WosEmzOy2EwdzkI") },
  { id: 9, artistId: "english-teacher", artist: "English Teacher", title: "A55", genre: "indie", year: 2021, hot: 82, ...spTrack("1959e47Ws10YM8EdJXFxgy") },
  { id: 10, artistId: "english-teacher", artist: "English Teacher", title: "Mental Maths", genre: "indie", year: 2024, hot: 83, ...spTrack("6tm5RtkfaAV8jiyXFnT9cX") },
  { id: 11, artistId: "english-teacher", artist: "English Teacher, Max Cooper", title: "R&B (Max Cooper Remix)", genre: "electronic", year: 2025, hot: 84, ...spTrack("5bJhUslw5TQhLFHb3tcB4h") },
  { id: 17, artistId: "english-teacher", artist: "English Teacher", title: "Movies (English Teacher Rework)", genre: "indie", year: 2025, hot: 80, ...spTrack("68wlIdvNHCvZxhImsJgfXA") },
  { id: 18, artistId: "english-teacher", artist: "English Teacher", title: "R&B (Theo Verney Version)", genre: "indie", year: 2021, hot: 78, ...spTrack("2KfWJbQ7k0xqX7bVtP8f7N") },

  { id: 12, artistId: "mk-gee", artist: "Mk.gee", title: "Alesis", genre: "alt", year: 2024, hot: 89, ...spTrack("4u7vj352S98d9iA7ac1EVG") },
  { id: 13, artistId: "the-last-dinner-party", artist: "The Last Dinner Party", title: "The Feminine Urge", genre: "rock", year: 2024, hot: 94, ...spTrack("1gRK6QnBOpNtEDjYKftzTc") },
  { id: 14, artistId: "barry-cant-swim", artist: "Barry Can't Swim", title: "Different", genre: "electronic", year: 2024, hot: 91, ...spTrack("3n0rRWoWgo5u4CM1UPowlO") },
  { id: 15, artistId: "nemahsis", artist: "Nemahsis", title: "coloured concrete", genre: "pop", year: 2024, hot: 90, ...spTrack("2lmT9NiqohWoRf9yAxt4Ru") },
  { id: 16, artistId: "sofia-isella", artist: "SOFIA ISELLA", title: "The Doll People", genre: "pop", year: 2024, hot: 92, ...spTrack("0UueyZtX0ogyXQWhg6Xkpz") },
  { id: 19, artistId: "cordae", artist: "Cordae", title: "Locationships", genre: "hiphop", year: 2019, hot: 76, ...spTrack("23e2QxGdVlx5m5AO1IggAY") },
  { id: 20, artistId: "jack-and-jack", artist: "Jack & Jack", title: "No One Compares To You", genre: "pop", year: 2020, hot: 75, ...spTrack("64BaRhWnVXHSnSWfHG63Lp") },
  { id: 21, artistId: "michael-marcagi", artist: "Michael Marcagi", title: "Keep Me Honest", genre: "pop", year: 2025, hot: 78, ...spTrack("298Mp5Pq9nT6YYbMg3lEiw") },
  { id: 22, artistId: "assassin-jg", artist: "Assassin JG", title: "Downtown", genre: "alt", year: 2024, hot: 74, ...spTrack("1PkK8eDNd3d78K35ATt0Eq") },
];

// -----------------------
// Curated Spotify playlists (editorial "Fresh Finds" series)
// Secondary discovery content — NOT counted in artist/track stats.
// -----------------------
const spPlaylist = (id) => ({
  spotifyUrl: `https://open.spotify.com/playlist/${id}`,
  spotifyEmbed: `https://open.spotify.com/embed/playlist/${id}`,
});

const PLAYLISTS = [
  { id: "pl-1", title: "Fresh Finds", curator: "Spotify", genre: "indie", ...spPlaylist("37i9dQZF1DWWjGdmeTyeJ6") },
  { id: "pl-2", title: "Fresh Finds Indie", curator: "Spotify", genre: "indie", ...spPlaylist("37i9dQZF1DWT0upuUFtT7o") },
  { id: "pl-3", title: "Fresh Finds Pop", curator: "Spotify", genre: "pop", ...spPlaylist("37i9dQZF1DX3u9TSHqpdJC") },
  { id: "pl-4", title: "Fresh Finds R&B", curator: "Spotify", genre: "rnb", ...spPlaylist("37i9dQZF1DWUFAJPVM3HTX") },
  { id: "pl-5", title: "Fresh Finds Heavy", curator: "Spotify", genre: "rock", ...spPlaylist("37i9dQZF1DX2wnPyeao7oY") },
  { id: "pl-6", title: "Fresh Finds Experimental", curator: "Spotify", genre: "alt", ...spPlaylist("37i9dQZF1DX8C585qnMYHP") },
  { id: "pl-7", title: "Fresh Finds Electronic", curator: "Community", genre: "electronic", ...spPlaylist("1PLGMZxRLR6fUsVie5m82x") },
  { id: "pl-8", title: "10 Years of Fresh Finds", curator: "Spotify", genre: "indie", ...spPlaylist("37i9dQZF1DXcRvrGIEgliU") },
];

// -----------------------
// Local (visitor) submissions — demo persistence via localStorage
// -----------------------
const SUBMISSIONS_KEY = "emergent:submissions";

function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

function addSubmission(entry) {
  const list = getSubmissions();
  const id = 100000 + list.length;

  // Reuse the same artistId for repeated submissions under the same name,
  // but never collide with a curated artist's id/profile.
  let artistId = slugify(entry.artist);
  if (ARTISTS.some((a) => a.id === artistId)) artistId += "-submitted";

  const record = {
    id,
    artistId,
    artist: entry.artist,
    title: entry.title,
    genre: entry.genre,
    city: entry.city || "",
    year: entry.year,
    description: entry.description || "",
    spotifyUrl: entry.spotifyUrl || "",
    spotifyEmbed: entry.spotifyEmbed || "",
    hot: 60,
    isSubmission: true,
  };
  list.push(record);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  return record;
}

// Parses a public Spotify track/playlist URL into an embeddable URL.
function spotifyUrlToEmbed(url) {
  const match = String(url || "").match(
    /open\.spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/,
  );
  if (!match) return "";
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
}

// -----------------------
// Derived accessors
// -----------------------
function getAllTracks() {
  return [...TRACKS, ...getSubmissions()];
}

function getArtists() {
  const tracks = getAllTracks();
  return ARTISTS.map((a) => ({
    ...a,
    trackCount: tracks.filter((tr) => tr.artistId === a.id).length,
  })).concat(getSubmittedArtists(tracks));
}

// Visitor-submitted tracks get a lightweight synthetic artist entry so they
// still show up in the directory and have a profile page of their own.
function getSubmittedArtists(tracks) {
  const seen = new Map();
  tracks
    .filter((t) => t.isSubmission)
    .forEach((t) => {
      if (!seen.has(t.artistId)) {
        seen.set(t.artistId, {
          id: t.artistId,
          name: t.artist,
          genre: t.genre,
          city: t.city || "",
          bio: t.description || "",
          trackCount: 0,
          isSubmission: true,
        });
      }
      seen.get(t.artistId).trackCount += 1;
    });
  return [...seen.values()];
}

function getArtistById(id) {
  return getArtists().find((a) => a.id === id) || null;
}

function getTracksByArtist(id) {
  return getAllTracks().filter((t) => t.artistId === id);
}

function getTrackById(id) {
  return getAllTracks().find((t) => t.id === Number(id)) || null;
}
