// Fetch data from the API
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  }
  
  // Render the artworks to the page
  function renderArtworks(artworks) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";
  
    if (artworks.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }
  
    artworks.forEach((artwork) => {
      const artworkElement = document.createElement("div");
      artworkElement.classList.add("artwork-item");
      let title = artwork.title.replace(" from Human_3.0 Reading List", "");
      let artistTitle = artwork.artist_title
        ? artwork.artist_title.replace(" from Human_3.0 Reading List", "")
        : "";
  
      artworkElement.innerHTML = `
        <h3>${title}</h3>
        ${artistTitle ? `<p>${artistTitle}</p>` : ""}
        <img src="${
          artwork.image_id
            ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
            : ""
        }" alt="${title}" />
      `;
  
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
  
  const gsap = require("gsap");
  const ScrambleTextPlugin = require("https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/ScrambleTextPlugin.min.js");
  
  // Register the TextPlugin
  gsap.registerPlugin(ScrambleTextPlugin) 

  // Select the title element
  const titleElement = document.querySelector(".title");
  
  // Create a ScrambleText animation
  const animation = gsap.fromTo(
    titleElement,
    {
      text: "Art Institute of Chicago",
    },
    {
      duration: 3,
      scrambleText: {
        text: "Explore the Art Institute",
        chars: "abcdefghijklmnopqrstuvwxyz0123456789",
        revealDelay: 0.5,
        speed: 0.3,
      },
    }
  );
  
  // Trigger the animation on page load
  window.addEventListener("load", () => {
    animation.play();
  });
  
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