const pokemonGallery = document.getElementById("pokemon-gallery");
const loadMoreButton = document.getElementById("load-more");
const carouselInner = document.getElementById("carousel-inner");
let offset = 0; 

const loadPokemons = async (offset) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;  
    const response = await fetch(url);
    const data = await response.json();
    
    // Create a new carousel item for the next set of Pokemon
    const newSlide = document.createElement("div");
    newSlide.classList.add("carousel-item");
    
    
    if (offset === 0) {
        newSlide.classList.add("active");
    }
    
    const newSlideContent = `
        <picture>
            <source srcset="images/bg-10428_x_6060.png" media="(min-width: 1300px)">
            <source srcset="images/bg-1442_x_838.png" media="(min-width: 768px)">
            <source srcset="images/bg-1300_x_756.png" media="(min-width: 320px)">
            <img src="images/bg-1442_x_838.png" alt="background images" class="transparent-img">
        </picture>
        <div class="carousel-caption">
            <section class="pokemon-gallery">
                <!-- Pokemon items will go here -->
            </section>
            <div class="text-center">
                <button id="load-more" class="btn btn-warning mt-3">Load More</button>
            </div>
        </div>
    `;
    
    newSlide.innerHTML = newSlideContent;

    // Add Pokemon to the gallery
    const pokemonGallery = newSlide.querySelector('.pokemon-gallery');
    data.results.forEach(pokemon => {
        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-item");
        pokemonCard.innerHTML = `
            <h4>${pokemon.name}</h4>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png" alt="${pokemon.name}">
        `;
        pokemonGallery.appendChild(pokemonCard);
    });

    // New slide to the carousel
    carouselInner.appendChild(newSlide);
};

// Initial load of the first 20 Pokemon
loadPokemons(offset);

// Button click to next set of Pokemon
loadMoreButton.addEventListener("click", () => {
    offset += 20; // 
    loadPokemons(offset);
});
