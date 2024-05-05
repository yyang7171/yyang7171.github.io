import gsap from 'gsap';
import TextPlugin from 'gsap-text-plugin';

gsap.registerPlugin(TextPlugin);

// Fetch data from the API
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
}

// Render the artworks to the page
function renderArtworks(artworks) {
  const resultsContainer = document.getElementById("results");

  artworks.forEach((artwork) => {
    const artworkElement = document.createElement("div");
    artworkElement.classList.add("artwork-item");
    let title = artwork.title.replace(" from Human_3.0 Reading List", "");
    let artistTitle = artwork.artist_title
      ? artwork.artist_title.replace(" from Human_3.0 Reading List", "")
      : "";

    const titleElement = document.createElement("h3");
    const scrambleAnimation = gsap.fromTo(
      titleElement,
      { text: title },
      {
        duration: 2,
        scrambleText: {
          text: title,
          chars: "abcdefghijklmnopqrstuvwxyz0123456789",
          revealDelay: 0.5,
          speed: 0.3,
        },
      }
    );

    artworkElement.appendChild(titleElement);
    if (artistTitle) {
      const artistTitleElement = document.createElement("p");
      artistTitleElement.textContent = artistTitle;
      artworkElement.appendChild(artistTitleElement);
    }

    if (artwork.image_id) {
      const imageElement = document.createElement("img");
      imageElement.src = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
      imageElement.alt = title;
      artworkElement.appendChild(imageElement);
    }

    resultsContainer.appendChild(artworkElement);
    scrambleAnimation.play();
  });
}

// Filter artworks based on user input
function filterArtworks(artworks, searchQuery) {
  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artwork.artist_title &&
        artwork.artist_title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  return filteredArtworks;
}

let allArtworks = [];
let currentIndex = 0;
const batchSize = 20;

async function fetchAndRenderArtworks() {
  if (currentIndex >= allArtworks.length) {
    const newArtworks = await fetchData(
      `https://api.artic.edu/api/v1/artworks?limit=100&page=${Math.floor(allArtworks.length / 100) + 1}`
    );
    allArtworks = [...allArtworks, ...newArtworks];
  }

  const batchedArtworks = allArtworks.slice(currentIndex, currentIndex + batchSize);
  const resultsContainer = document.getElementById("results");
  renderArtworks(batchedArtworks);
  currentIndex += batchSize;
}

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  // Check if the current page is artworks.html
  if (window.location.pathname.includes("/artworks.html")) {
    // Fetch the initial batch of artworks
    allArtworks = await fetchData("https://api.artic.edu/api/v1/artworks?limit=100");
    fetchAndRenderArtworks();

    // Set up the Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchAndRenderArtworks();
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    // Observe the footer element
    const footer = document.getElementById("footer");
    observer.observe(footer);
  }

  // Refresh the page when the header link is clicked
  document.getElementById("headerLink").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior
    location.reload(); // Refresh the page
  });
});