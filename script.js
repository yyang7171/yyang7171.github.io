// Fetch data from the API
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
}

// Creates the artwork results
function renderArtworks(artworks) {
  const resultsContainer = document.getElementById("results");

  artworks.forEach((artwork) => {
    const artworkElement = document.createElement("div");
    artworkElement.classList.add("artwork-item");

    // In case the API gets artwork from the reading list
    let title = artwork.title.replace(" from Human_3.0 Reading List", "");
    let artistTitle = artwork.artist_title
      ? artwork.artist_title.replace(" from Human_3.0 Reading List", "")
      : "";

    // Creating the titles
    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    artworkElement.appendChild(titleElement);

    // And artist name
    if (artistTitle) {
      const artistTitleElement = document.createElement("p");
      artistTitleElement.textContent = artistTitle;
      artworkElement.appendChild(artistTitleElement);
    }

    // Getting the image from the API using the provided URL with image ID
    if (artwork.image_id) {
      const imageElement = document.createElement("img");
      imageElement.src = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
      imageElement.alt = title;
      artworkElement.appendChild(imageElement);
    }

    // Writing to the container
    resultsContainer.appendChild(artworkElement);
  });
}

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  // Check if the current page is artworks.html, then fetching from API
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
