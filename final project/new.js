const apiKey = '75bc7ca8'; // Replace with your OMDB API key
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resetButton = document.getElementById('reset-button');
const moviesContainer = document.getElementById('movies-container');
const errorMessage = document.getElementById('error-message');

async function fetchMovies(query) {
  moviesContainer.innerHTML = '';
  errorMessage.hidden = true;
  searchButton.disabled = true;
  searchButton.textContent = 'Searching...';

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (data.Response === 'True') {
      renderMovies(data.Search);
    } else {
      showError(data.Error || 'No movies found.');
    }
  } catch (error) {
    showError('Error fetching movies. Try again later.');
  }

  searchButton.disabled = false;
  searchButton.textContent = 'Search';
}

function renderMovies(movies) {
  moviesContainer.innerHTML = movies
    .map((movie) => {
      const poster =
        movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
      return (`
        <article class="movie-card" tabindex="0" aria-label="${movie.Title} (${movie.Year})">
          <img
            class="movie-poster"
            src="${poster}"
            alt="Poster of ${movie.Title}"
            loading="lazy"
          />
          <div class="movie-info">
            <h2 class="movie-title">${movie.Title}</h2>
            <p class="movie-year">${movie.Year}</p>
          </div>
        </article>
      `);
    })
    .join('');
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) fetchMovies(query);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
  }
});

resetButton.addEventListener('click', () => {
  searchInput.value = '';
  moviesContainer.innerHTML = '';
  errorMessage.hidden = true;
  searchInput.focus();
});
