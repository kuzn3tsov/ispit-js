// DOM elementi
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loader = document.getElementById('loader');

// Timer za odgodu pretrage
let searchTimeout;

// Funkcija za pretragu iTunes API-ja
async function searchITunes(term) {
    // Prikazivanje loadera
    loader.style.display = 'block';
    resultsContainer.innerHTML = '';

    try {
        // Poziv iTunes API-ja
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=20`);

        if (!response.ok) {
            throw new Error(`HTTP greška! Status: ${response.status}`);
        }

        const data = await response.json();

        // Skrivanje loadera
        loader.style.display = 'none';

        // Prikaz rezultata
        displayResults(data.results);

    } catch (error) {
        // Skrivanje loadera i prikaz greške
        loader.style.display = 'none';
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>Došlo je do greške prilikom pretrage: ${error.message}</p>
                <p>Pokušajte ponovno kasnije.</p>
            </div>
        `;
    }
}

// Funkcija za prikaz rezultata
function displayResults(results) {
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>Nema rezultata za vaš upit.</p>
                <p>Pokušajte s drugim pojmom za pretragu.</p>
            </div>
        `;
        return;
    }

    let html = '';

    results.forEach(result => {
        html += `
            <div class="result-item">
                <img src="${result.artworkUrl100 || 'https://via.placeholder.com/100'}"
                     alt="Album art"
                     class="album-art">
                <div class="track-info">
                    <div class="track-name">${result.trackName || 'Nepoznata pjesma'}</div>
                    <div class="artist-name">${result.artistName || 'Nepoznati izvođač'}</div>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = html;
}

// Event listener za unos teksta
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.trim();

    // Brisanje prethodnog timeout-a
    clearTimeout(searchTimeout);

    // Ako je unos prazan, prikaži prazan rezultat
    if (searchTerm === '') {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>Unesite pojam za pretragu kako biste vidjeli rezultate.</p>
            </div>
        `;
        return;
    }

    // Postavljanje novog timeout-a za odgodu pretrage
    searchTimeout = setTimeout(() => {
        searchITunes(searchTerm);
    }, 500); // 500ms odgoda
});

// Inicijalni prikaz poruke
document.addEventListener('DOMContentLoaded', function () {
    resultsContainer.innerHTML = `
        <div class="no-results">
            <p>Unesite pojam za pretragu kako biste vidjeli rezultate.</p>
        </div>
    `;
});