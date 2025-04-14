document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    
    // Load favorites on page load
    displayFavorites();
    
    // Search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        
        searchCars(make, model, year);
    });
    
    // Search cars using API-Ninjas
    async function searchCars(make, model, year) {
        try {
            // Show loading state
            resultsContainer.innerHTML = '<p>Loading...</p>';
            
            // Build API URL
            let url = `https://api.api-ninjas.com/v1/cars?`;
            if (make) url += `make=${make}&`;
            if (model) url += `model=${model}&`;
            if (year) url += `year=${year}&`;
            url = url.slice(0, -1); 
            
            const response = await fetch(url, {
                headers: {
                    'X-Api-Key': 'yfwrRsXD+wELc8bjqAymCg==fcFptQoRJGKMcdw7' 
                }
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const cars = await response.json();
            
            if (cars.length === 0) {
                resultsContainer.innerHTML = '<p>No cars found matching your criteria.</p>';
                return;
            }
            
            displayResults(cars);
        } catch (error) {
            console.error('Error fetching car data:', error);
            resultsContainer.innerHTML = `<p>Error fetching car data: ${error.message}</p>`;
        }
    }
    
    // Display search results
    function displayResults(cars) {
        resultsContainer.innerHTML = '';
        
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            
            // Check if car is favorited
            const favorites = JSON.parse(localStorage.getItem('favorites') || [];
            const isFavorited = favorites.some(fav => 
                fav.make === car.make && 
                fav.model === car.model && 
                fav.year === car.year
            );
            
            carCard.innerHTML = `
                <div class="car-image">
                    <p>Image not available</p>
                </div>
                <div class="car-details">
                    <h3 class="car-title">${car.make} ${car.model}</h3>
                    <p class="car-specs">Year: ${car.year}</p>
                    <p class="car-specs">Class: ${car.class || 'N/A'}</p>
                    <p class="car-specs">Cylinders: ${car.cylinders || 'N/A'}</p>
                    <p class="car-specs">MPG: ${car.combination_mpg || 'N/A'}</p>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                            data-make="${car.make}" 
                            data-model="${car.model}" 
                            data-year="${car.year}">
                        ${isFavorited ? '★' : '☆'} Favorite
                    </button>
                </div>
            `;
            
            resultsContainer.appendChild(carCard);
        });
        
        // Add event listeners to favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', toggleFavorite);
        });
    }
    
    // Toggle favorite status
    function toggleFavorite(e) {
        const btn = e.target;
        const make = btn.dataset.make;
        const model = btn.dataset.model;
        const year = btn.dataset.year;
        
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        const carIndex = favorites.findIndex(fav => 
            fav.make === make && 
            fav.model === model && 
            fav.year === year
        );
        
        if (carIndex === -1) {
            // Add to favorites
            favorites.push({ make, model, year });
            btn.classList.add('favorited');
            btn.innerHTML = '★ Favorite';
        } else {
            // Remove from favorites
            favorites.splice(carIndex, 1);
            btn.classList.remove('favorited');
            btn.innerHTML = '☆ Favorite';
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
    
    // Display favorite cars
    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesContainer.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>You have no favorite cars yet.</p>';
            return;
        }
        
        favorites.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            
            carCard.innerHTML = `
                <div class="car-image">
                    <p>Image not available</p>
                </div>
                <div class="car-details">
                    <h3 class="car-title">${car.make} ${car.model}</h3>
                    <p class="car-specs">Year: ${car.year}</p>
                    <button class="favorite-btn favorited" 
                            data-make="${car.make}" 
                            data-model="${car.model}" 
                            data-year="${car.year}">
                        ★ Remove Favorite
                    </button>
                </div>
            `;
            
            favoritesContainer.appendChild(carCard);
        });
        
        // Add event listeners to favorite buttons in favorites section
        document.querySelectorAll('#favoritesContainer .favorite-btn').forEach(btn => {
            btn.addEventListener('click', toggleFavorite);
        });
    }
});