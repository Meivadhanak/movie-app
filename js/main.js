/// Search functionality
const searchInput = document.querySelector('nav input');

if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = 'search.html?q=' + encodeURIComponent(query);
            }
        }
    });
}

// Logo click goes home
const logo = document.querySelector('nav h1');
if (logo) {
    logo.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

const API_KEY = 'd56d8a35a43ccd732c7924b5e8231823';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';
const COMMIT_DATE = new Date().toISOString().slice(0, 10);
const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="#111111"/><text x="50%" y="50%" font-size="20" text-anchor="middle" fill="#ffffff">No Poster</text></svg>');
const FALLBACK_BACKDROP = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="500"><rect width="100%" height="100%" fill="#111111"/><text x="50%" y="50%" font-size="28" text-anchor="middle" fill="#ffffff">No Backdrop</text></svg>');

let heroMovies = [];
let heroIndex = 0;

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function setImageWithFallback(img, path, fallbackUrl) {
    if (!img) return;

    if (path) {
        img.src = path;
    } else {
        img.src = fallbackUrl;
    }

    img.onerror = function() {
        this.onerror = null;
        this.src = fallbackUrl;
    };
}

function createMovieCard(movie, gridId) {
    const posterSrc = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : FALLBACK_IMAGE;
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${posterSrc}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>rating: ${movie.vote_average}</p>
    `;

    const img = card.querySelector('img');
    if (img) {
        img.onload = function() {
            if (!this.naturalWidth || !this.naturalHeight) {
                this.src = FALLBACK_IMAGE;
            }
        };
        img.onerror = function() {
            this.onerror = null;
            this.src = FALLBACK_IMAGE;
        };
    }

    if (gridId === 'movie-grid' || gridId === 'search-results') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            window.location.href = `movie.html?id=${movie.id}`;
        });
    }

    return card;
}

function displayMovies(movies, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';
    movies.forEach(function(movie) {
        const card = createMovieCard(movie, gridId);
        grid.appendChild(card);
    });
}

function displayError(message, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = `<div class="error-message">${message}</div>`;
}

async function getPopularMovies() {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.classList.add('active');

    try {
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Unable to fetch popular movies');
        const data = await res.json();

        heroMovies = data.results || [];
        if (heroMovies.length) {
            displayHero(heroMovies[0]);
        }
        displayMovies(data.results || [], 'movie-grid');
    } catch (error) {
        displayError('Unable to load popular movies. Please refresh the page or try again later.', 'movie-grid');
        console.error('Popular movies fetch failed:', error);
    } finally {
        if (spinner) spinner.classList.remove('active');
    }
}

async function getNowPlaying() {
    try {
        const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Unable to fetch now playing movies');
        const data = await res.json();
        displayMovies(data.results || [], 'now-playing-grid');
    } catch (error) {
        displayError('Unable to load now playing movies right now.', 'now-playing-grid');
        console.error('Now playing fetch failed:', error);
    }
}

async function getTopRated() {
    try {
        const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Unable to fetch top rated movies');
        const data = await res.json();
        displayMovies(data.results || [], 'top-rated-grid');
    } catch (error) {
        displayError('Unable to load top rated movies right now.', 'top-rated-grid');
        console.error('Top rated fetch failed:', error);
    }
}

async function searchMovies(query) {
    const resultsGrid = document.getElementById('search-results');
    const searchTitle = document.getElementById('search-term');

    if (!resultsGrid) return;

    resultsGrid.innerHTML = '<p>Loading...</p>';

    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Unable to fetch search results');
        const data = await res.json();

        if (searchTitle) {
            searchTitle.textContent = `"${query}"`;
        }

        if (!data.results || data.results.length === 0) {
            resultsGrid.innerHTML = '<p>No movies found.</p>';
            return;
        }

        resultsGrid.innerHTML = '';
        data.results.forEach(function(movie) {
            const card = createMovieCard(movie, 'search-results');
            resultsGrid.appendChild(card);
        });
    } catch (error) {
        displayError('Search failed. Please check your connection and try again.', 'search-results');
        console.error('Search fetch failed:', error);
    }
}

function displayHero(movie) {
    if (!movie) return;
    const heroImg = document.getElementById('hero-img');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');

    if (heroImg) {
        const backdropPath = movie.backdrop_path ? BACKDROP_URL + movie.backdrop_path : FALLBACK_BACKDROP;
        setImageWithFallback(heroImg, backdropPath, FALLBACK_BACKDROP);
    }
    if (heroTitle) heroTitle.textContent = movie.title;
    if (heroDesc) heroDesc.textContent = movie.overview;

    const heroWatchBtn = document.getElementById('hero-watch-btn');
    if (heroWatchBtn) {
        heroWatchBtn.disabled = !movie.id;
        heroWatchBtn.onclick = function() {
            if (movie.id) {
                window.location.href = `movie.html?id=${movie.id}`;
            }
        };
    }
}

function setupHeroControls() {
    const prev = document.querySelector('.hero-prev');
    const next = document.querySelector('.hero-next');

    const changeHero = function(delta) {
        if (!heroMovies.length) return;
        heroIndex = (heroIndex + delta + heroMovies.length) % heroMovies.length;
        displayHero(heroMovies[heroIndex]);
    };

    if (prev) {
        prev.addEventListener('click', function() {
            changeHero(-1);
        });
    }

    if (next) {
        next.addEventListener('click', function() {
            changeHero(1);
        });
    }
}

async function loadMovieDetail() {
    const movieId = getQueryParam('id');
    if (!movieId) return;

    let movie;
    try {
        const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        if (!res.ok) throw new Error('Unable to fetch movie details');
        movie = await res.json();
    } catch (error) {
        console.error('Movie detail fetch failed:', error);
        const content = document.querySelector('.movie-detail-content');
        if (content) {
            content.innerHTML = '<p class="error-message">Unable to load movie details. Please refresh or try again later.</p>';
        }
        return;
    }

    const backdrop = document.querySelector('.movie-backdrop img');
    const poster = document.querySelector('.movie-poster img');
    const title = document.querySelector('.movie-info h2');
    const tagline = document.querySelector('.movie-info .tagline');
    const rating = document.querySelector('.movie-info .rating');
    const year = document.querySelector('.movie-info .year');
    const runtime = document.querySelector('.movie-info .runtime');
    const overview = document.querySelector('.movie-info .overview');
    const genres = document.querySelector('.movie-info .genres');

    if (backdrop) {
        const backdropPath = movie.backdrop_path ? BACKDROP_URL + movie.backdrop_path : FALLBACK_BACKDROP;
        setImageWithFallback(backdrop, backdropPath, FALLBACK_BACKDROP);
    }
    if (poster) {
        const posterPath = movie.poster_path ? IMG_URL + movie.poster_path : FALLBACK_IMAGE;
        setImageWithFallback(poster, posterPath, FALLBACK_IMAGE);
    }
    if (title) title.textContent = movie.title;
    if (tagline) tagline.textContent = movie.tagline || movie.status || '';
    if (rating) rating.textContent = `⭐ ${movie.vote_average}`;
    if (year) year.textContent = movie.release_date ? movie.release_date.slice(0, 4) : '';
    if (runtime) runtime.textContent = movie.runtime ? `${movie.runtime}m` : '';
    if (overview) overview.textContent = movie.overview;
    if (genres) {
        genres.innerHTML = '';
        (movie.genres || []).forEach(function(genre) {
            const span = document.createElement('span');
            span.textContent = genre.name;
            genres.appendChild(span);
        });
    }

    setupWatchlistButton(movie);
}

function getWatchlist() {
    try {
        return JSON.parse(localStorage.getItem('movieapp-watchlist') || '[]');
    } catch (err) {
        return [];
    }
}

function saveWatchlist(list) {
    localStorage.setItem('movieapp-watchlist', JSON.stringify(list));
}

function setupWatchlistButton(movie) {
    const button = document.getElementById('watchlist-toggle-btn');
    if (!button || !movie || !movie.id) return;

    const list = getWatchlist();
    const isInWatchlist = list.some(function(item) {
        return item.id === movie.id;
    });

    const updateButton = function(inWatchlist) {
        button.textContent = inWatchlist ? '✔ In Watchlist' : '+ Add to Watchlist';
        button.title = inWatchlist ? 'Remove from watchlist' : 'Add to watchlist';
    };

    updateButton(isInWatchlist);

    button.onclick = function() {
        const currentList = getWatchlist();
        const hasMovie = currentList.some(function(item) {
            return item.id === movie.id;
        });

        if (hasMovie) {
            saveWatchlist(currentList.filter(function(item) {
                return item.id !== movie.id;
            }));
            updateButton(false);
        } else {
            saveWatchlist(currentList.concat([{
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path
            }]));
            updateButton(true);
        }
    };
}

// Commit note helper: injects a small badge showing today's date for quick commits
function getTodayISO() {
    const d = new Date();
    return d.toISOString().slice(0,10);
}

function injectCommitNote() {
    if (!document || !document.body) return;
    const existing = document.getElementById('commit-note');
    if (existing) return;
    const note = document.createElement('div');
    note.id = 'commit-note';
    note.textContent = `Updated today: ${getTodayISO()}`;
    document.body.appendChild(note);
    console.info('Commit note injected:', getTodayISO());
}

// Back-to-top helper: injects a floating button that scrolls smoothly to top
function injectBackToTop() {
    if (!document || !document.body) return;
    if (document.getElementById('back-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.textContent = 'Back to top';
    btn.title = 'Scroll to top';
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    const toggle = function() {
        if (window.scrollY > 200) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggle);
    // initial visibility
    toggle();
}

function init() {
    setupHeroControls();
    injectCommitNote();
    injectBackToTop();

    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.endsWith('dist')) {
        getPopularMovies();
        getNowPlaying();
        getTopRated();
    }

    if (window.location.pathname.endsWith('search.html')) {
        const query = getQueryParam('q') || 'Avengers';
        const searchInput = document.querySelector('nav input');
        if (searchInput) {
            searchInput.value = query;
        }
        searchMovies(query);
    }

    if (window.location.pathname.endsWith('movie.html')) {
        loadMovieDetail();
    }
}

document.addEventListener('DOMContentLoaded', init);