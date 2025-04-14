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
            let url = `https://api.api-ninjas.com/v1/cars?`;
            const params = [];
            if (make) params.push(`make=${encodeURIComponent(make)}`);
            if (model) params.push(`model=${encodeURIComponent(model)}`);
            if (year) params.push(`year=${year}`);
            url += params.join('&');
            
            console.log('API URL:', url); // Debugging
            
            const response = await fetch(url, {
                headers: {
                    'X-Api-Key': 'SfCBqFk0H9H7lJnzHrL8Q9wqHwGK34GCwH1CdyKd', // REPLACE THIS
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const cars = await response.json();
            console.log('API Response:', cars); // Debugging
            
            if (!cars || cars.length === 0) {
                resultsContainer.innerHTML = `
                    <p>No cars found matching your criteria.</p>
                    <p>Try a broader search (e.g., just make or make + year)</p>
                `;
                return;
            }
            
            displayResults(cars);
        } catch (error) {
            console.error('Error fetching car data:', error);
            resultsContainer.innerHTML = `
                <p>Error fetching car data: ${error.message}</p>
                <p>Check console for details</p>
            `;
        }
    }
    
    // ... rest of the code remains the same ...
});