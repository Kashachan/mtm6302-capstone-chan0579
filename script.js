// Variables
const pokemonGallery = document.getElementById('pokemon-gallery');
const loadMoreButton = document.getElementById('load-more');

const modal = document.getElementById('pokemon-modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalTypes = document.getElementById('modal-types');
const modalAbilities = document.getElementById('modal-abilities');
const caughtButton = document.getElementById('caught-button');
const closeModalBtn = document.getElementById('close-modal');

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.custom-search-bar');


let pokemonIndex = 0;
const pokemonPerPage = 20;
let pokemonList = [];

let caughtPokemon = JSON.parse(localStorage.getItem("caughtPokemon")) || [];

// Fetch all Pokémon data
async function fetchData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=40');
        const data = await response.json();
        pokemonList = data.results;
        loadMorePokemon();
    } catch (error) {
        console.error('Error:', error);
    }
}

function parseUrl(url) {
    return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
}

// Display individual Pokémon
function displayPokemon(pokemon) {
    const pokemonId = parseUrl(pokemon.url);
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    if (caughtPokemon.includes(pokemon.name)) {
        card.classList.add('caught'); 
    }

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    img.alt = pokemon.name;
    img.classList.add('pokemon-image');

    const name = document.createElement('h5');
    name.textContent = `#${pokemonId} ${pokemon.name}`;

    card.appendChild(img);
    card.appendChild(name);
    pokemonGallery.appendChild(card);

    card.addEventListener('click', () => showPokemonDetails(pokemon.url, pokemon.name));
}


function loadMorePokemon() {
    const nextPokemonBatch = pokemonList.slice(pokemonIndex, pokemonIndex + pokemonPerPage);
    nextPokemonBatch.forEach(pokemon => displayPokemon(pokemon));
    pokemonIndex += pokemonPerPage;

    if (pokemonIndex >= pokemonList.length) {
        loadMoreButton.style.display = 'none';
        goBackButton.style.display = 'block';
    }
}

// Fetch details and show modal
async function showPokemonDetails(url, name) {
    const response = await fetch(url);
    const data = await response.json();

    modalImg.src = data.sprites.other["official-artwork"].front_default || data.sprites.front_default;
    modalName.textContent = `#${data.id} ${name}`;

    modalTypes.textContent = data.types.map(t => t.type.name).join(', ');
    modalAbilities.textContent = data.abilities.map(a => a.ability.name).join(', ');

    caughtButton.textContent = caughtPokemon.includes(name) ? 'Release' : 'Catch';
    caughtButton.onclick = () => toggleCaught(name);

    modal.style.display = 'flex';
}

// Toggle caught status
function toggleCaught(name) {
    const index = caughtPokemon.indexOf(name);

    if (index > -1) {
        caughtPokemon.splice(index, 1);
        caughtButton.textContent = 'Catch';
    } else {
        caughtPokemon.push(name);
        caughtButton.textContent = 'Release';
    }

    localStorage.setItem("caughtPokemon", JSON.stringify(caughtPokemon));
    modal.style.display = 'none';
    pokemonGallery.innerHTML = '';
    pokemonIndex = 0;
    loadMorePokemon(); 
}

// Close modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Load more
loadMoreButton.addEventListener('click', () => {
    loadMorePokemon();
});

fetchData();

// Navbar 
document.getElementById("nav-pokemon").addEventListener("click", function(e) {
    e.preventDefault();
    alert("Pokémon tab clicked! You're already here.");
});

document.getElementById("nav-details").addEventListener("click", function(e) {
    e.preventDefault();
    alert("Details clicked — but we stay on this page!");
});

document.getElementById("nav-caught").addEventListener("click", function(e) {
    e.preventDefault();
    alert("Caught clicked — no new page, just a section maybe?");
});


// Search form
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        alert('Please type the name or number!');
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok) {
            alert('Pokémon not found!');
            return;
        }

        const data = await response.json();

        modalImg.src = data.sprites.other["official-artwork"].front_default || data.sprites.front_default;
        modalName.textContent = `#${data.id} ${data.name}`;
        modalTypes.textContent = data.types.map(t => t.type.name).join(', ');
        modalAbilities.textContent = data.abilities.map(a => a.ability.name).join(', ');

        caughtButton.textContent = caughtPokemon.includes(data.name) ? 'Release' : 'Catch';
        caughtButton.onclick = () => toggleCaught(data.name);

        modal.style.display = 'flex';

    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        alert('Something went wrong. Try again.');
    }
});
  