// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  weights: {
    imdb: 40,
    rt: 30,
    meta: 20,
    audience: 10,
  },
  logs: [],
  currentFilter: "all",
  currentSort: "score",
  selectedMovie: null,
};

// ============================================
// MOVIE DATA
// ============================================
const movies = [
  {
    id: 1,
    title: "Inception",
    genre: "scifi",
    year: 2010,
    director: "Christopher Nolan",
    poster: "🎥",
    scores: { imdb: 8.8, rt: 87, meta: 74, audience: 91 },
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    genre: "drama",
    year: 1994,
    director: "Frank Darabont",
    poster: "🎭",
    scores: { imdb: 9.3, rt: 91, meta: 82, audience: 98 },
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "action",
    year: 2008,
    director: "Christopher Nolan",
    poster: "🦇",
    scores: { imdb: 9.0, rt: 94, meta: 84, audience: 94 },
  },
  {
    id: 4,
    title: "Pulp Fiction",
    genre: "thriller",
    year: 1994,
    director: "Quentin Tarantino",
    poster: "💼",
    scores: { imdb: 8.9, rt: 92, meta: 95, audience: 96 },
  },
  {
    id: 5,
    title: "Forrest Gump",
    genre: "drama",
    year: 1994,
    director: "Robert Zemeckis",
    poster: "🏃",
    scores: { imdb: 8.8, rt: 71, meta: 82, audience: 95 },
  },
  {
    id: 6,
    title: "The Matrix",
    genre: "scifi",
    year: 1999,
    director: "Wachowskis",
    poster: "🔴",
    scores: { imdb: 8.7, rt: 88, meta: 73, audience: 85 },
  },
  {
    id: 7,
    title: "Goodfellas",
    genre: "thriller",
    year: 1990,
    director: "Martin Scorsese",
    poster: "🔫",
    scores: { imdb: 8.7, rt: 96, meta: 91, audience: 97 },
  },
  {
    id: 8,
    title: "Interstellar",
    genre: "scifi",
    year: 2014,
    director: "Christopher Nolan",
    poster: "🚀",
    scores: { imdb: 8.6, rt: 72, meta: 74, audience: 86 },
  },
  {
    id: 9,
    title: "The Hangover",
    genre: "comedy",
    year: 2009,
    director: "Todd Phillips",
    poster: "😂",
    scores: { imdb: 7.7, rt: 79, meta: 73, audience: 84 },
  },
  {
    id: 10,
    title: "Superbad",
    genre: "comedy",
    year: 2007,
    director: "Greg Mottola",
    poster: "🎉",
    scores: { imdb: 7.6, rt: 88, meta: 76, audience: 86 },
  },
  {
    id: 11,
    title: "Mad Max: Fury Road",
    genre: "action",
    year: 2015,
    director: "George Miller",
    poster: "🔥",
    scores: { imdb: 8.1, rt: 97, meta: 90, audience: 86 },
  },
  {
    id: 12,
    title: "John Wick",
    genre: "action",
    year: 2014,
    director: "Chad Stahelski",
    poster: "🐕",
    scores: { imdb: 7.4, rt: 86, meta: 68, audience: 83 },
  },
];

// ============================================
// HIGHER ORDER FUNCTIONS - THE CORE!
// ============================================

// 1. CURRYING: Function returns function
const createWeightFunction = (weight) => {
  return (score) => {
    return score * (weight / 100);
  };
};

// 2. FUNCTION TAKES FUNCTION: Compose scorer
const calculateScore = (movie, weightFunctions) => {
  const normalizedScores = normalizeScores(movie.scores);

  const weightedImdb = weightFunctions.imdb(normalizedScores.imdb);
  const weightedRt = weightFunctions.rt(normalizedScores.rt);
  const weightedMeta = weightFunctions.meta(normalizedScores.meta);
  const weightedAudience = weightFunctions.audience(normalizedScores.audience);

  return weightedImdb + weightedRt + weightedMeta + weightedAudience;
};

// 3. NORMALIZE: Convert all scores to 0-100 scale
const normalizeScores = (scores) => {
  return {
    imdb: scores.imdb * 10, // 8.8 -> 88
    rt: scores.rt, // Already 0-100
    meta: scores.meta, // Already 0-100
    audience: scores.audience, // Already 0-100
  };
};

// 4. COMPOSE: Combine multiple functions
const compose = (...functions) => {
  return (value) => {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
};

// 5. FILTER CREATOR: Partial application
const createFilter = (predicate) => {
  return (items) => {
    return items.filter(predicate);
  };
};

// 6. MAP TRANSFORM: Apply function to all
const mapWithScore = (scoringFunction) => {
  return (movies) => {
    return movies.map((movie) => ({
      ...movie,
      finalScore: scoringFunction(movie),
    }));
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function addLog(message, type) {
  const timestamp = new Date().toLocaleTimeString();
  state.logs.push({ message, type, timestamp, id: Date.now() });

  if (state.logs.length > 30) {
    state.logs.shift();
  }

  updateLogDisplay();
}

function updateLogDisplay() {
  const container = document.getElementById("log-container");

  if (state.logs.length === 0) {
    container.innerHTML =
      '<div class="log-empty">Adjust weights or click demo buttons...</div>';
    return;
  }

  container.innerHTML = state.logs
    .map(
      (log) =>
        `<div class="log-entry log-${log.type}">
            <span class="log-timestamp">[${log.timestamp}]</span> ${log.message}
        </div>`
    )
    .join("");

  container.scrollTop = container.scrollHeight;
}

// ============================================
// WEIGHT MANAGEMENT
// ============================================
function updateWeight(source, value) {
  state.weights[source] = parseInt(value);
  document.getElementById(`${source}-weight-value`).textContent = value + "%";

  updateTotalWeight();
  updateAlgorithmFormula();
  recalculateAllScores();

  addLog(`Weight adjusted: ${source.toUpperCase()} = ${value}%`, "weight");
  addLog(`HOF: createWeightFunction(${value}) returns new scorer`, "hof");
}

function updateTotalWeight() {
  const total = Object.values(state.weights).reduce((sum, w) => sum + w, 0);
  const totalEl = document.getElementById("total-weight");
  const warningEl = document.getElementById("weight-warning");

  totalEl.textContent = total + "%";

  if (total === 100) {
    totalEl.classList.remove("warning");
    warningEl.style.display = "none";
  } else {
    totalEl.classList.add("warning");
    warningEl.style.display = "inline";
  }
}

function updateAlgorithmFormula() {
  const formula = `score = (imdb × ${state.weights.imdb}%) + (rt × ${state.weights.rt}%) + (meta × ${state.weights.meta}%) + (audience × ${state.weights.audience}%)`;
  document.getElementById(
    "algorithm-formula"
  ).innerHTML = `<code>${formula}</code>`;
}

// ============================================
// PRESET ALGORITHMS
// ============================================
const presets = {
  balanced: { imdb: 25, rt: 25, meta: 25, audience: 25 },
  critics: { imdb: 25, rt: 50, meta: 25, audience: 0 },
  audience: { imdb: 20, rt: 10, meta: 10, audience: 60 },
  imdb: { imdb: 70, rt: 10, meta: 10, audience: 10 },
};

function applyPreset(presetName) {
  const preset = presets[presetName];

  Object.keys(preset).forEach((source) => {
    state.weights[source] = preset[source];
    document.getElementById(`${source}-weight`).value = preset[source];
    document.getElementById(`${source}-weight-value`).textContent =
      preset[source] + "%";
  });

  updateTotalWeight();
  updateAlgorithmFormula();
  recalculateAllScores();

  addLog(`Applied preset: ${presetName.toUpperCase()}`, "hof");
  addLog(`HOF: Partial application with preset weights`, "info");
}

function resetWeights() {
  applyPreset("balanced");
  addLog("Weights reset to balanced (25% each)", "info");
}

// ============================================
// SCORE CALCULATION
// ============================================
function recalculateAllScores() {
  const weightFunctions = {
    imdb: createWeightFunction(state.weights.imdb),
    rt: createWeightFunction(state.weights.rt),
    meta: createWeightFunction(state.weights.meta),
    audience: createWeightFunction(state.weights.audience),
  };

  movies.forEach((movie) => {
    movie.finalScore = calculateScore(movie, weightFunctions);
  });

  displayMovies();
  updateStatistics();

  if (state.selectedMovie) {
    const updatedMovie = movies.find((m) => m.id === state.selectedMovie.id);
    if (updatedMovie) {
      selectMovie(updatedMovie);
    }
  }
}

// ============================================
// MOVIE DISPLAY
// ============================================
function displayMovies() {
  let moviesToShow = [...movies];

  if (state.currentFilter !== "all") {
    const genreFilter = createFilter((m) => m.genre === state.currentFilter);
    moviesToShow = genreFilter(moviesToShow);
  }

  if (state.currentSort === "score") {
    moviesToShow.sort((a, b) => b.finalScore - a.finalScore);
  } else if (state.currentSort === "year") {
    moviesToShow.sort((a, b) => b.year - a.year);
  } else if (state.currentSort === "title") {
    moviesToShow.sort((a, b) => a.title.localeCompare(b.title));
  }

  const grid = document.getElementById("movie-grid");
  grid.innerHTML = moviesToShow
    .map(
      (movie) => `
        <div class="movie-card ${
          state.selectedMovie?.id === movie.id ? "selected" : ""
        }" 
             onclick="selectMovie(${JSON.stringify(movie).replace(
               /"/g,
               "&quot;"
             )})">
            <div class="movie-header">
                <div class="movie-poster">${movie.poster}</div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-meta">${movie.year} • ${
        movie.director
      }</div>
                </div>
            </div>
            <div class="movie-scores">
                <div class="score-item">
                    <span class="score-label">⭐ IMDb</span>
                    <span class="score-value">${movie.scores.imdb}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">🍅 RT</span>
                    <span class="score-value">${movie.scores.rt}%</span>
                </div>
                <div class="score-item">
                    <span class="score-label">📊 Meta</span>
                    <span class="score-value">${movie.scores.meta}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">👥 Aud</span>
                    <span class="score-value">${movie.scores.audience}%</span>
                </div>
            </div>
            <div class="movie-final-score">
                <div class="final-score-label">Weighted Score</div>
                <div class="final-score-value">${movie.finalScore.toFixed(
                  1
                )}</div>
            </div>
        </div>
    `
    )
    .join("");

  document.getElementById(
    "movie-count"
  ).textContent = `(${moviesToShow.length})`;
  document.getElementById("movies-shown").textContent = moviesToShow.length;
}

function selectMovie(movie) {
  state.selectedMovie = movie;
  displayMovies();
  showScoreBreakdown(movie);
  addLog(`Selected: ${movie.title}`, "info");
}

function showScoreBreakdown(movie) {
  const normalized = normalizeScores(movie.scores);

  const breakdown = [
    {
      label: "⭐ IMDb",
      score: normalized.imdb,
      weight: state.weights.imdb,
      value: normalized.imdb * (state.weights.imdb / 100),
    },
    {
      label: "🍅 RT",
      score: normalized.rt,
      weight: state.weights.rt,
      value: normalized.rt * (state.weights.rt / 100),
    },
    {
      label: "📊 Meta",
      score: normalized.meta,
      weight: state.weights.meta,
      value: normalized.meta * (state.weights.meta / 100),
    },
    {
      label: "👥 Audience",
      score: normalized.audience,
      weight: state.weights.audience,
      value: normalized.audience * (state.weights.audience / 100),
    },
  ];

  const breakdownHTML = `
        <h3 style="margin-bottom: 15px; color: #1f2937;">${movie.poster} ${
    movie.title
  }</h3>
        ${breakdown
          .map(
            (item) => `
            <div class="breakdown-item">
                <div>
                    <div class="breakdown-label">${item.label}</div>
                    <div style="font-size: 0.85rem; color: #6b7280;">
                        ${item.score.toFixed(1)} × ${
              item.weight
            }% = ${item.value.toFixed(2)}
                    </div>
                </div>
                <div class="breakdown-value">${item.value.toFixed(1)}</div>
            </div>
            <div class="breakdown-bar">
                <div class="breakdown-bar-fill" style="width: ${
                  (item.value / movie.finalScore) * 100
                }%"></div>
            </div>
        `
          )
          .join("")}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem;">
                <strong>Final Score:</strong>
                <strong style="color: #f59e0b;">${movie.finalScore.toFixed(
                  1
                )}</strong>
            </div>
        </div>
    `;

  document.getElementById("breakdown-content").innerHTML = breakdownHTML;
}

// ============================================
// STATISTICS
// ============================================
function updateStatistics() {
  const scores = movies.map((m) => m.finalScore);
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const highest = movies.reduce((max, movie) =>
    movie.finalScore > max.finalScore ? movie : max
  );

  const lowest = movies.reduce((min, movie) =>
    movie.finalScore < min.finalScore ? movie : min
  );

  document.getElementById("avg-score").textContent = avg.toFixed(1);
  document.getElementById("highest-rated").textContent = `${
    highest.title
  } (${highest.finalScore.toFixed(1)})`;
  document.getElementById("lowest-rated").textContent = `${
    lowest.title
  } (${lowest.finalScore.toFixed(1)})`;
}

// ============================================
// FILTER & SORT
// ============================================
function filterMovies(genre) {
  state.currentFilter = genre;

  document.querySelectorAll(".btn-filter").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  displayMovies();

  addLog(`Filtered by: ${genre.toUpperCase()}`, "filter");
  addLog(`HOF: createFilter(genre === '${genre}') applied`, "hof");
}

function sortMovies(sortBy) {
  state.currentSort = sortBy;
  displayMovies();

  addLog(`Sorted by: ${sortBy.toUpperCase()}`, "filter");
  addLog(`HOF: Array.sort() with custom comparator`, "hof");
}

// ============================================
// HOF DEMONSTRATIONS
// ============================================
function demoCreateWeight() {
  addLog("🔧 DEMO: Creating Weight Function (Currying)", "demo");
  addLog("const createWeight = (w) => (score) => score * (w/100)", "hof");
  addLog("const weight40 = createWeight(40) // Returns function!", "info");
  addLog("weight40(88) = 35.2 // Apply to IMDb score", "calculate");
  addLog("This is CURRYING: Function returns specialized function", "success");
}

function demoFilterGenre() {
  addLog("🎭 DEMO: Filter by Genre (Partial Application)", "demo");
  addLog("const createFilter = (pred) => (items) => items.filter(pred)", "hof");
  addLog(
    'const actionFilter = createFilter(m => m.genre === "action")',
    "info"
  );

  const actionMovies = movies.filter((m) => m.genre === "action");
  addLog(
    `Found ${actionMovies.length} action movies: ${actionMovies
      .map((m) => m.title)
      .join(", ")}`,
    "success"
  );
}

function demoCompose() {
  addLog("🔗 DEMO: Function Composition", "demo");
  addLog(
    "const compose = (...fns) => val => fns.reduceRight((acc, fn) => fn(acc), val)",
    "hof"
  );
  addLog("const scorer = compose(round, normalize, weight, extract)", "info");
  addLog("Each function transforms output of previous", "calculate");
  addLog(
    "Pipeline: raw scores → normalized → weighted → summed → rounded",
    "success"
  );
}

function demoMap() {
  addLog("🔄 DEMO: Map Transform", "demo");
  addLog("movies.map(m => ({ ...m, finalScore: calculate(m) }))", "hof");
  const scores = movies.map((m) => `${m.title}: ${m.finalScore.toFixed(1)}`);
  addLog(
    `Transformed all ${movies.length} movies with new scores`,
    "calculate"
  );
  addLog("Map creates NEW array with transformed values", "success");
}

function demoReduce() {
  addLog("📊 DEMO: Reduce Aggregate", "demo");
  addLog("movies.reduce((sum, m) => sum + m.finalScore, 0)", "hof");
  const total = movies.reduce((sum, m) => sum + m.finalScore, 0);
  const avg = total / movies.length;
  addLog(`Total: ${total.toFixed(1)}, Average: ${avg.toFixed(1)}`, "calculate");
  addLog("Reduce combines all values into single result", "success");
}

function demoCurry() {
  addLog("🎯 DEMO: Currying Pattern", "demo");
  addLog("const multiply = (a) => (b) => a * b", "hof");
  addLog("const double = multiply(2) // Partial application", "info");
  addLog("double(5) = 10 // Apply remaining argument", "calculate");
  addLog("Currying: Transform f(a,b) into f(a)(b)", "success");
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  recalculateAllScores();
  updateTotalWeight();
  updateAlgorithmFormula();
  addLog("🎬 Movie Rating Aggregator initialized", "success");
  addLog("Adjust weight sliders to see HOFs in action!", "info");
}

// Run on page load
init();
