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

async function fetchDataForChart() {
  const artworks = await fetchData('https://api.artic.edu/api/v1/artworks?limit=100');

  // Create an object to store the artist counts
  const artistCounts = {};

  // Iterate through the artworks and count the occurrences of each artist
  artworks.forEach(artwork => {
    const artist = artwork.artist_title;
    if (artistCounts[artist]) {
      artistCounts[artist]++;
    } else {
      artistCounts[artist] = 1;
    }
  });

  // Convert the object into an array of label-data pairs
  const chartData = Object.entries(artistCounts).map(([label, data]) => ({ label, data }));

  return chartData;
}

function renderChart(chartData) {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.map(item => item.label),
      datasets: [
        {
          label: 'Number of Artworks',
          data: chartData.map(item => item.data),
          backgroundColor: 'rgba(185, 31, 72, 0.6)', // Change the bar color
          borderColor: 'rgba(185, 31, 72, 1)', // Change the border color
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hide the legend
        },
        title: {
          display: true,
          text: 'Artworks by Artist', // Add a title
          font: {
            size: 18 // Adjust the font size
          }
        }
      }
    }
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
    // Fetch data for chart
    const chartData = await fetchDataForChart();

    // Render the chart
    renderChart(chartData);

  // Refresh the page when the header link is clicked
  document.getElementById("headerLink").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior
    location.reload(); // Refresh the page
  });
});
