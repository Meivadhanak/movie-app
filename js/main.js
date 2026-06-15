/ js/main.js

// Search functionality
const searchInput = document.querySelector('nav input');

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${query}`;
        }
    }
});