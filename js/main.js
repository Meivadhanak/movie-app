// Logo click goes home
const logo = document.querySelector('nav h1');
logo.addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Search functionality
const searchInput = document.querySelector('nav input');
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = 'search.html?q=' + query;
        }
    }
});

const API_KEY = 'd56d8a35a43ccd732c7924b5e8231823';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let heroMovies = [];
let heroIndex = 0;

function displayHero(movie) {
    document.getElementById('hero-img').src = 'https://image.tmdb.org/t/p/original' + movie.backdrop_path;
    document.getElementById('hero-title').textContent = movie.title;
    document.getElementById('hero-desc').textContent = movie.overview;
}

function displayMoviesInGrid(movies, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    movies.forEach(function(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = '<img src="' + IMG_URL + movie.poster_path + '" alt="' + movie.title + '"><h3>' + movie.title + '</h3><p>rating: ' + movie.vote_average + '</p>';
        card.addEventListener('click',