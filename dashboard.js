document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('resultsContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    
    // Load favorites on page load
    displayFavorites();
    
    // Search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const make = document.getElementById('make').value.trim();
        const model = document.getElementById('model').value.trim();
        const year = document.getElementById('year').value;
        
        if (!make && !model && !year) {
            resultsContainer.innerHTML = '<p>Please enter at least one search criteria</p>';
            return;
        }
        
        searchCars(make, model, year);
    });
    
    // Search cars using API-Ninjas
    async function searchCars(make, model, year) {
        try {
            // Show loading state
            resultsContainer.innerHTML = '<p>Searching for cars...</p>';
            
            // Build API URL
            let url = 'https://api.api-ninjas.com/v1/cars?';
            const params = [];
            if (make) params.push(`make=${encodeURIComponent(make)}`);
            if (model) params.push(`model=${encodeURIComponent(model)}`);
            if (year) params.push(`year=${year}`);
            url += params.join('&');
            
            console.log('API URL:', url);
            
            const response = await fetch(url, {
                headers: {
                    'X-Api-Key': 'SfCBqFk0H9H7lJnzHrL8Q9wqHwGK34GCwH1CdyKd', // REPLACE THIS
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }
            
            const cars = await response.json();
            console.log('API Response:', cars);
            
            if (!cars || cars.length === 0) {
                resultsContainer.innerHTML = '<p>No cars found matching your criteria.</p><p>Try a broader search (e.g., just make or make + year)</p>';
                return;
            }
            
            displayResults(cars);
        } catch (error) {
            console.error('Error fetching car data:', error);
            resultsContainer.innerHTML = `<p>Error fetching car data: ${error.message}</p><p>Check console for details</p>`;
        }
    }
    
    // Display search results
    function displayResults(cars) {
        resultsContainer.innerHTML = '';
        
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
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
            favorites.push({ make, model, year });
            btn.classList.add('favorited');
            btn.innerHTML = '★ Favorite';
        } else {
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
        
        document.querySelectorAll('#favoritesContainer .favorite-btn').forEach(btn => {
            btn.addEventListener('click', toggleFavorite);
        });
    }
});