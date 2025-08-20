
// --- Variables globales ---
let allData = {};
let currentTier = 'all';
let fuse;

// --- Icônes par tier ---
const tierIcons = {
  "Greatest players in YBA history": '<i class="fa-solid fa-crown"></i>',
  "SSS (The Apex Predators)": '<i class="fa-solid fa-fire"></i>',
  "SS": '<i class="fa-solid fa-star"></i>',
  "S+": '<i class="fa-solid fa-bolt"></i>',
  "S": '<i class="fa-solid fa-tint"></i>',
  "A+": '<i class="fa-regular fa-gem"></i>',
  "A": '<i class="fa-solid fa-gem"></i>',
  "B": '<i class="fa-solid fa-seedling"></i>',
  "C": '<i class="fa-solid fa-feather"></i>',
  "D": '<i class="fa-solid fa-mountain"></i>'
};

// --- Rendu de la tierlist ---
function renderTierList(data, search = "", tierFilter = "all") {
  const container = document.getElementById("tierlist");
  container.innerHTML = "";
  let filteredData = {};

  // Filtrage par tier
  if (tierFilter !== "all") {
    if (data[tierFilter]) filteredData[tierFilter] = data[tierFilter];
  } else {
    filteredData = { ...data };
  }

  // Recherche avancée
  if (search && search.length > 0 && fuse) {
    const results = fuse.search(search);
    // Regroupe les résultats par tier
    let found = {};
    results.forEach(r => {
      if (!found[r.item.tier]) found[r.item.tier] = [];
      found[r.item.tier].push(r.item.name);
    });
    filteredData = found;
  }

  // Affichage des tiers
  for (const tier in filteredData) {
    const tierDiv = document.createElement("div");
    tierDiv.classList.add("tier");
    // Ajoute la classe couleur
    let tierClass = "";
    switch (tier) {
      case "Greatest players in YBA history": tierClass = "tier-greatest"; break;
      case "SSS (The Apex Predators)": tierClass = "tier-sss"; break;
      case "SS": tierClass = "tier-ss"; break;
      case "S+": tierClass = "tier-splus"; break;
      case "S": tierClass = "tier-s"; break;
      case "A+": tierClass = "tier-aplus"; break;
      case "A": tierClass = "tier-a"; break;
      case "B": tierClass = "tier-b"; break;
      case "C": tierClass = "tier-c"; break;
      case "D": tierClass = "tier-d"; break;
      default: tierClass = "tier";
    }
    tierDiv.classList.add(tierClass);
    tierDiv.setAttribute('data-aos', 'fade-up');

    // Titre du tier avec icône et compteur
    const title = document.createElement("h2");
    title.innerHTML = `${tierIcons[tier] || ''} ${tier} <span style="font-size:1rem;opacity:0.7;">(${filteredData[tier].length} players)</span>`;
    tierDiv.appendChild(title);

    // Joueurs
    const playersDiv = document.createElement("div");
    playersDiv.classList.add("players");

    filteredData[tier].forEach(name => {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add("player", "hvr-grow");
      playerDiv.innerText = name;
      playersDiv.appendChild(playerDiv);
    });

    tierDiv.appendChild(playersDiv);
    container.appendChild(tierDiv);
  }
}

// --- Initialisation Fuse.js ---
function initFuse(data) {
  let list = [];
  for (const tier in data) {
    data[tier].forEach(name => list.push({ name, tier }));
  }
  fuse = new Fuse(list, { keys: ['name'], threshold: 0.3 });
}

// --- Chart.js ---
function renderChart(data) {
  const ctx = document.getElementById('tierChart').getContext('2d');
  const labels = Object.keys(data);
  const values = labels.map(tier => data[tier].length);
  if (window.tierChartInstance) window.tierChartInstance.destroy();
  window.tierChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Players per Tier',
        data: values,
        backgroundColor: '#ffcc00',
        borderColor: '#232526',
        borderWidth: 2
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// --- Dark/Light mode ---
function setupThemeToggle() {
  const btn = document.createElement('button');
  btn.id = 'toggleTheme';
  btn.className = 'btn btn-light position-fixed top-0 end-0 m-3';
  btn.innerHTML = '🌙/☀️';
  document.body.appendChild(btn);
  btn.onclick = () => {
    document.body.classList.toggle('light-mode');
  };
}

// --- Main ---
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    allData = data;
    initFuse(data);
    renderTierList(data);
    renderChart(data);
    setupThemeToggle();

    // --- Recherche ---
    document.getElementById('searchInput').addEventListener('input', e => {
      renderTierList(allData, e.target.value, currentTier);
    });

    // --- Filtres ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTier = this.getAttribute('data-tier');
        renderTierList(allData, document.getElementById('searchInput').value, currentTier);
      });
    });
  });

// --- Audio effet sur hover joueur (optionnel, nécessite hover.mp3) ---
// const audio = new Audio('hover.mp3');
// document.addEventListener('mouseover', function(e) {
//   if (e.target.classList.contains('player')) audio.play();
// });
