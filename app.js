    // Load hero banner
    async function loadHero() {
      try {
        const res = await fetch("https://api.jikan.moe/v4/top/anime");
        const data = await res.json();
        const anime = data.data[0];

        document.getElementById("hero").style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;
        document.getElementById("hero-title").innerText = anime.title;
        document.getElementById("hero-desc").innerText = anime.synopsis || "No description";
        document.getElementById("hero-btn").onclick = () => showDetail(anime.mal_id);
      } catch (error) {
        console.error("Error loading hero:", error);
        document.getElementById("hero-title").innerText = "Error loading content";
      }
    }

    // Load carousel
    async function loadCarousel(url, containerId) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        data.data.slice(0, 10).forEach(anime => {
          const card = document.createElement('div');
          card.className = 'anime-card';
          card.onclick = () => showDetail(anime.mal_id);
          card.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <p>${anime.title}</p>
          `;
          container.appendChild(card);
        });
      } catch (error) {
        console.error("Error loading carousel:", error);
      }
    }

    // Search functionality
    const searchBox = document.getElementById("searchBox");
    const searchResults = document.getElementById("searchResults");
    let searchTimeout;

    searchBox.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      
      clearTimeout(searchTimeout);
      
      if (query.length < 3) {
        searchResults.style.display = "none";
        return;
      }
      
      searchTimeout = setTimeout(() => {
        searchAnime(query);
      }, 500);
    });

    async function searchAnime(query) {
      try {
        searchResults.innerHTML = "<div class='search-loading'>Searching...</div>";
        searchResults.style.display = "block";
        
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        
        if (data.data.length === 0) {
          searchResults.innerHTML = "<div class='search-empty'>No results found</div>";
          return;
        }
        
        searchResults.innerHTML = data.data.map(anime => `
          <div class="search-item" onclick="showDetail(${anime.mal_id})">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <div class="search-info">
              <strong>${anime.title}</strong>
              <span>${anime.score ? `⭐ ${anime.score}` : ''}</span>
            </div>
          </div>
        `).join("");
      } catch (error) {
        console.error("Search error:", error);
        searchResults.innerHTML = "<div class='search-empty'>Error searching</div>";
      }
    }

    // Close search results when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = "none";
      }
    });

    // Show anime detail
    async function showDetail(id) {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await res.json();
        const anime = data.data;

        // Hide main content and show detail
        document.querySelector('.hero').style.display = 'none';
        document.querySelectorAll('.carousel').forEach(el => el.style.display = 'none');
        
        // Create or update detail section
        let detailSection = document.getElementById('animeDetail');
        if (!detailSection) {
          detailSection = document.createElement('main');
          detailSection.id = 'animeDetail';
          detailSection.className = 'anime-detail';
          document.body.appendChild(detailSection);
        }
        
        detailSection.style.display = 'grid';
        detailSection.innerHTML = `
          <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
          <div>
            <button onclick="showHome()" style="background: #9b5de5; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 15px;">← Back to Home</button>
            <h2>${anime.title}</h2>
            <p><strong>Episodes:</strong> ${anime.episodes || "?"}</p>
            <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
            <p>${anime.synopsis || "No description"}</p>
            <h3>Trailer</h3>
            ${anime.trailer?.embed_url ? 
              `<iframe width="560" height="315" src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>` 
              : "<p>No trailer available</p>"}
            <div class="episode-list">
              <h3>Episodes</h3>
              ${Array.from({length: Math.min(anime.episodes || 12, 24)}, (_, i) => 
                `<div class="episode">Episode ${i+1}</div>`).join("")}
            </div>
          </div>
        `;
        
        searchResults.style.display = "none";
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error loading detail:", error);
        alert("Error loading anime details");
      }
    }

    // Show home page
    function showHome() {
      document.querySelector('.hero').style.display = 'flex';
      document.querySelectorAll('.carousel').forEach(el => el.style.display = 'block');
      const detailSection = document.getElementById('animeDetail');
      if (detailSection) {
        detailSection.style.display = 'none';
      }
      window.scrollTo(0, 0);
    }

    // Initialize
    loadHero();
    loadCarousel("https://api.jikan.moe/v4/top/anime", "trending");
    loadCarousel("https://api.jikan.moe/v4/top/anime?filter=bypopularity", "top-rated");