const path = window.location.pathname;

document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  setupSearch();

  if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
    loadPopularMovies();
    loadTopRatedMovies();
  } else if (path.includes('movie.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) loadMovieDetails(movieId);
  } else if (path.includes('favorites.html')) {
    loadFavorites();
  }
});

function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const authLinks = document.getElementById('authLinks');
  if (!authLinks) return;

  if (token) {
    authLinks.innerHTML = `<a href="#" onclick="logout()">Sign Out</a>`;
  } else {
    authLinks.innerHTML = `<a href="login.html" class="btn-login">Sign In</a>`;
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}

function setupSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value;
      if (query) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
}

function renderMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="viewMovieDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-rating">
                    <span class="star-icon">★</span>
                    <span>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function viewMovieDetails(id) {
  window.location.href = `movie.html?id=${id}`;
}

async function loadPopularMovies() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  if (searchQuery) {
    // UI fixes for search
    const sectionHeaders = document.querySelectorAll('.section-header');
    if (sectionHeaders[0]) sectionHeaders[0].querySelector('h2').textContent = `Search Results for "${searchQuery}"`;
    if (sectionHeaders[1]) sectionHeaders[1].style.display = 'none';

    const topRatedGrid = document.getElementById('topRatedMovies');
    if (topRatedGrid) topRatedGrid.style.display = 'none';

    try {
      const response = await api.get(`/movies/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.data && response.data.results) {
        renderMovies(response.data.results, 'popularMovies');
        if (response.data.results.length === 0) {
          document.getElementById('popularMovies').innerHTML = '<p style="padding: 20px;">No movies found.</p>';
        }
      }
    } catch (error) {
      // Search error
    }
    return;
  }

  try {
    const response = await api.get('/movies/popular');
    if (response.data && response.data.results) {
      renderMovies(response.data.results, 'popularMovies');
    }
  } catch (error) {
    // Popular load error
  }
}

async function loadTopRatedMovies() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('search')) return;

  try {
    const response = await api.get('/movies/top_rated');
    renderMovies(response.data.results, 'topRatedMovies');
  } catch (error) {
    // Top rated load error
  }
}

async function loadMovieDetails(id) {
  try {
    const response = await api.get(`/movies/${id}`);
    const movie = response.data;
    const container = document.getElementById('movieDetails');

    const findTrailer = (videos) => {
      if (!videos || !videos.results || videos.results.length === 0) return null;

      return videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.results.find(v => v.site === 'YouTube' && v.type === 'Teaser') ||
        videos.results.find(v => v.site === 'YouTube');
    };

    const trailer = findTrailer(movie.videos);
    const trailerEmbed = trailer
      ? `<div onclick="window.embedTrailer('${trailer.key}')" class="youtube-link-card" 
            style="background-image: url('https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg'); width:100%; height:100%; display:block; border-radius: 12px; cursor:pointer; position:relative;">
            <div class="play-button-overlay" style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(0,0,0,0.3); border-radius: 12px;">
                <div class="play-icon" style="width:70px; height:70px; background:var(--app-accent, #f5c518); border-radius:50%; display:flex; align-items:center; justify-content:center; color:black; font-size:30px; margin-bottom:10px;">▶</div>
                <div class="play-text" style="color:white; font-weight:bold; text-transform:uppercase; letter-spacing:1px; text-shadow:0 2px 4px rgba(0,0,0,0.5);">Watch Trailer</div>
            </div>
         </div>`
      : `<div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); border: 1px dashed #444; border-radius: 12px; color: #888;">
            <p style="font-size: 40px; margin-bottom: 10px;">📽️</p>
            <h3>No Trailer Available</h3>
         </div>`;

    document.getElementById('videoContainer').innerHTML = trailerEmbed;

    // Defined globally for the onclick handler
    window.embedTrailer = function (videoId) {
      const container = document.getElementById('videoContainer');
      if (container) {
        container.innerHTML = `
                <iframe 
                    src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%; border-radius: 12px;">
                </iframe>
            `;
      }
    };

    if (movie.backdrop_path) {
      const hero = document.getElementById('movieHero');
      hero.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
    }

    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A';
    const runtime = movie.runtime || 'N/A';

    container.innerHTML = `
            <div class="movie-header">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster-large">
                <div class="movie-info-detailed">
                    <h1 class="movie-title-large">${movie.title}</h1>
                    <div class="movie-meta">
                        <span>📅 ${releaseYear}</span>
                        <span>⏱️ ${runtime} min</span>
                        <span>🏷️ ${genres}</span>
                        <span>⭐ ${movie.vote_average.toFixed(1)}/10</span>
                    </div>
                    <p class="movie-overview">${movie.overview}</p>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="addToWatchlist(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.poster_path}')">
                            + Add to Watchlist
                        </button>
                    </div>
                </div>
            </div>
        `;

  } catch (error) {
    document.getElementById('movieDetails').innerHTML = '<p class="error">Failed to load movie details</p>';
  }
}

async function addToWatchlist(movieId, title, posterPath) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign in to add to your watchlist.');
    window.location.href = 'login.html';
    return;
  }

  try {
    await api.post('/favorites', {
      movieId,
      title,
      poster: posterPath
    }, token);
    alert('Added to Watchlist!');
  } catch (error) {
    alert(error.message || 'Failed to add to watchlist');
  }
}

async function loadFavorites() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await api.get('/favorites', token);
    const favorites = response.data.favorites;
    const container = document.getElementById('watchlistMovies');

    if (!favorites || favorites.length === 0) {
      container.innerHTML = '<p style="padding: 20px; color: var(--text-secondary);">Your watchlist is empty.</p>';
      return;
    }

    container.innerHTML = favorites.map(fav => `
            <div class="movie-card" onclick="viewMovieDetails(${fav.movieId})">
                <img src="https://image.tmdb.org/t/p/w500${fav.poster}" alt="${fav.title}" class="movie-poster">
                <div class="movie-info">
                    <div class="movie-title">${fav.title}</div>
                    <div class="movie-rating">
                        <span style="color: var(--app-gold); font-size: 14px;">${fav.status || 'Planned'}</span>
                    </div>
                </div>
            </div>
        `).join('');
  } catch (error) {
    document.getElementById('watchlistMovies').innerHTML = '<p class="error">Failed to load watchlist</p>';
  }
}
