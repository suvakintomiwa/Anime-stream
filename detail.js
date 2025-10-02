const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

async function loadAnimeDetail() {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
  const data = await res.json();
  const anime = data.data;

  const detail = document.getElementById("animeDetail");
  detail.innerHTML = `
    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
    <div>
      <h2>${anime.title}</h2>
      <p><strong>Episodes:</strong> ${anime.episodes || "?"}</p>
      <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
      <p>${anime.synopsis || "No description"}</p>
      <h3>Trailer</h3>
      ${anime.trailer?.embed_url ? 
        `<iframe width="560" height="315" src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>` 
        : "No trailer available"}
      <div class="episode-list">
        <h3>Episodes</h3>
        ${Array.from({length: anime.episodes || 12}, (_, i) => 
          `<div class="episode">Episode ${i+1}</div>`).join("")}
      </div>
    </div>
  `;
}

loadAnimeDetail();
