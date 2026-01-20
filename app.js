const defaultMovies = [
  {
    Title: "Guardians of the Galaxy Vol. 2",
    Poster: "assets/movie1.jpg",
    Year: "136m",
    Type: "4.5",
    Language: "English",
  },
  {
    Title: "The Avengers",
    Poster: "assets/movie2.jpg",
    Year: "136m",
    Type: "4.5",
    Language: "English",
  },
  {
    Title: "Spider-man: Homecoming",
    Poster: "assets/movie3.jpg",
    Year: "136m",
    Type: "4.5",
    Language: "English",
  },
  {
    Title: "Minions: Rise of Gru",
    Poster: "assets/movie4.jpg",
    Year: "136m",
    Type: "4.5",
    Language: "English",
  },
  {
    Title: "Spider-Man: Into the Spider-Verse",
    Poster: "assets/movie5.jpg",
    Year: "136m",
    Type: "4.5",
    Language: "English",
  },
  {
    Title: "Nope",
    Poster: "assets/movie6.jpg",
    Year: "136m",
    Type: "4.5",
    Language: "English",
  },
];

async function fetchMovies(searchTerm) {
  try {
    const url = `https://www.omdbapi.com/?apikey=4525bdf1&s=${searchTerm}`;
    console.log("Fetching from:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("API Response:", data);

    return data.Search || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function renderDefaultMovies() {
  const movieList = document.querySelector("#movie__list");
  const searchResultText = document.querySelector(".movies__search__result");
  const searchTitle = document.querySelector(".movies__title__top");

    movieList.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    await new Promise(resolve => setTimeout(resolve, 200));

  // Generate HTML for default movies
  const moviesHTML = defaultMovies
    .map((movie) => {
      return `<div class="movie">
                  <figure class="movie__image__wrapper">
                      <img src="${movie.Poster}" alt="${movie.Title}" class="movie__image">
                      <h3 class="movie__info__title">${movie.Title}</h3>
                      <div class="movie__info__list">
                          <div class="movie__info movie__info1">
                              <i class="fa-solid fa-clock movie__info__icon"></i>
                              <p class="movie__info__text">${movie.Year}</p>
                          </div>
                          <div class="movie__info movie__info2">
                              <i class="fa-solid fa-star movie__info__icon"></i>
                              <p class="movie__info__text">${movie.Type}</p>
                          </div>
                          <div class="movie__info movie__info3">
                              <i class="fa-solid fa-earth-americas movie__info__icon"></i>
                              <p class="movie__info__text">${movie.Language}</p>
                          </div>
                      </div>
                  </figure>
                  <h4 class="movie__title">${movie.Title}</h4>
              </div>`;
    })
    .join("");

  movieList.innerHTML = moviesHTML;
}

async function renderMovie(searchTerm = "") {
  try {
    const movieList = document.querySelector("#movie__list");
    const movieSearchInput = document.querySelector("#movie__search");
    const searchResultText = document.querySelector(".movies__search__result");
    const searchTitle = document.querySelector(".movies__title__top");

    // Get search term from input if not provided
    let finalSearchTerm = searchTerm;
    if (!finalSearchTerm && movieSearchInput) {
      finalSearchTerm = movieSearchInput.value.trim();
    }

    movieList.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; color: white;"></i>`;

    const movies = await fetchMovies(finalSearchTerm);

    // Show search result text
    if (searchResultText) {
      searchResultText.textContent = `"${finalSearchTerm}"`;
      searchResultText.style.display = "block";
    }
    if (searchTitle) {
      searchTitle.style.display = "block";
    }

    const limitedMovies = movies.slice(0, 6);

    // Generate HTML for each movie
    const moviesHTML = limitedMovies
      .map((movie) => {
        if (!movie || !movie.Title) {
          console.warn("Invalid movie object:", movie);
          return "";
        }

        return `<div class="movie">
                    <figure class="movie__image__wrapper">
                        <img src="${movie.Poster}" 
                             alt="${movie.Title}" 
                             class="movie__image">
                        <h3 class="movie__info__title">${movie.Title}</h3>
                        <div class="movie__info__list">
                          <div class="movie__info movie__info1">
                              <i class="fa-solid fa-clock movie__info__icon"></i>
                              <p class="movie__info__text">${movie.Year}</p>
                          </div>
                          <div class="movie__info movie__info2">
                              <i class="fa-solid fa-star movie__info__icon"></i>
                              <p class="movie__info__text">${movie.Type}</p>
                          </div>
                          <div class="movie__info movie__info3">
                              <i class="fa-solid fa-earth-americas movie__info__icon"></i>
                              <p class="movie__info__text">${movie.Language}</p>
                          </div>
                      </div>
                  </figure>
                  <h4 class="movie__title">${movie.Title}</h4>
              </div>`;
      })
      .filter((html) => html !== "")
      .join("");

    movieList.innerHTML =
      moviesHTML || '<p style="color: white;">No valid movies to display</p>';
  } catch (error) {
    console.error("Error in renderMovie:", error);
    const movieList = document.querySelector("#movie__list");
    if (movieList) {
      movieList.innerHTML = `<p style="color: white; font-size: 24px; text-align: center; width: 100%; padding: 40px;">Error loading movies: ${error.message}</p>`;
    }
  }
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing search...");

  const searchInput = document.querySelector("#movie__search");
  const searchIcon = document.querySelector(".movie__background__search");
  const navSearchInput = document.querySelector(".nav__input__text");
  const navSearchIcon = document.querySelector(".nav__search");


  renderDefaultMovies();

  // Search when user presses Enter
  if (navSearchIcon && navSearchInput) {
    navSearchIcon.addEventListener('click', function() {
      navSearchInput.classList.toggle('active');
      
      // Focus the input when it opens
      if (navSearchInput.classList.contains('active')) {
        navSearchInput.focus();
      }
    });
    
    // Search when Enter is pressed in nav input
    navSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && navSearchInput.value.trim()) {
        // Copy the search to main input and trigger search
        searchInput.value = navSearchInput.value;
        renderMovie();
      }
    });
    
    // Close nav search when clicking outside
    document.addEventListener('click', function(e) {
      if (!navSearchInput.contains(e.target) && !navSearchIcon.contains(e.target)) {
        navSearchInput.classList.remove('active');
      }
    });
  }
  

  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        console.log("Enter pressed, searching...");
        renderMovie();
      }
    });
  }
  
  // Search when user clicks the main search icon
  if (searchIcon) {
    searchIcon.addEventListener('click', function() {
      console.log("Search icon clicked");
      renderMovie();
    });
  }
});
