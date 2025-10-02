// Load hero banner
async function loadHero() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await res.json();
  const anime = data.data[0]; // first anime

  document.getElementById("hero").style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;
  document.getElementById("hero-title").innerText = anime.title;
  document.getElementById("hero-desc").innerText = anime.synopsis || "No description";
  document.getElementById("hero-btn").href = `anime.html?id=${anime.mal_id}`;
}

// Load carousel
async function loadCarousel(url, containerId) {
  const res = await fetch(url);
  const data = await res.json();
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  data.data.slice(0, 10).forEach(anime => {
    container.innerHTML += `
      <div class="anime-card" onclick="goToDetail(${anime.mal_id})">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <p>${anime.title}</p>
      </div>
    `;
  });
}

function goToDetail(id) {
  window.location.href = `anime.html?id=${id}`;
}

loadHero();
loadCarousel("https://api.jikan.moe/v4/top/anime", "trending");
loadCarousel("https://api.jikan.moe/v4/top/anime?filter=bypopularity", "top-rated");
