// Fetch data from the API
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
}
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
    titleElement.textContent = title;
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

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  // Check if the current page is artworks.html
  if (window.location.pathname.includes("/artworks.html")) {
    const artworks = await fetchData(
      "https://api.artic.edu/api/v1/artworks?limit=100"
    );

    // Render all artworks initially
    renderArtworks(artworks);
  }

  // Refresh the page when the header link is clicked
  document.getElementById("headerLink").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior
    location.reload(); // Refresh the page
  });
});
