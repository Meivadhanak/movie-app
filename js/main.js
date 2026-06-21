/// Search functionality
const searchInput = document.querySelector('nav input');

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = 'search.html?q=' + query;
        }
    }
});

// Logo click goes home
const logo = document.querySelector('nav h1');
logo.addEventListener('click', function() {
    window.location.href = 'index.html';
});

const API_KEY = 'd56d8a35a43ccd732c7924b5e8231823';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function getPopularMovies() {
    const res = await fetch(BASE_URL + '/movie/popular?api_key=' + API_KEY);
    const data = await res.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    const grid = document.querySelector('.movie-grid');
    grid.innerHTML = '';

    movies.forEach(function(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = '<img src="' + IMG_URL + movie.poster_path + '" alt="' + movie.title + '"><h3>' + movie.title + '</h3><p>rating: ' + movie.vote_average + '</p>';
        grid.appendChild(card);
    });
}

getPopularMovies();

async function getPopularMovies() {
    const res = await fetch(BASE_URL + '/movie/popular?api_key=' + API_KEY);
    const data = await res.json();
    heroMovies = data.results;
    displayHero(heroMovies[0]);
    displayMovies(data.results);
}

function displayHero(movie) {
    const hero = document.querySelector('.hero img');
    const heroTitle = document.querySelector('.hero-info h2');
    const heroDesc = document.querySelector('.hero-info p');

    hero.src = 'https://image.tmdb.org/t/p/original' + movie.backdrop_path;
    heroTitle.textContent = movie.title;
    heroDesc.textContent = movie.overview;
}


let heroMovies = [];
let heroIndex = 0;

function displayHero(movie) {
    document.getElementById('hero-img').src = 'https://image.tmdb.org/t/p/original' + movie.backdrop_path;
    document.getElementById('hero-title').textContent = movie.title;
    document.getElementById('hero-desc').textContent = movie.overview;
}

document.querySelector('.hero-prev').addEventListener('click', function() {
    heroIndex = (heroIndex - 1 + heroMovies.length) % heroMovies.length;
    displayHero(heroMovies[heroIndex]);
});

document.querySelector('.hero-next').addEventListener('click', function() {
    heroIndex = (heroIndex + 1) % heroMovies.length;
    displayHero(heroMovies[heroIndex]);
});