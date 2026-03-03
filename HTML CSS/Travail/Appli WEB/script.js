// Données simulées de formations
const formations = [
  {
    id: 1,
    titre: "Licence Sciences de la Vie",
    universite: "Université de Paris",
    region: "ile-de-france",
    domaine: "sciences",
    niveau: "bac",
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: 2,
    titre: "Licence Lettres et Langues",
    universite: "Université de Lyon",
    region: "grand-est",
    domaine: "lettres",
    niveau: "bac",
    lat: 45.7597,
    lng: 4.8357
  },
  {
    id: 3,
    titre: "Licence Arts Plastiques",
    universite: "Université de Toulouse",
    region: "grand-est",
    domaine: "arts",
    niveau: "bac",
    lat: 43.6046,
    lng: 1.4442
  },
  {
    id: 4,
    titre: "Licence Sciences Informatiques",
    universite: "Université de Rennes",
    region: "ile-de-france",
    domaine: "sciences",
    niveau: "bac",
    lat: 48.1172,
    lng: -1.6777
  },
  {
    id: 5,
    titre: "Master Management",
    universite: "Université de Strasbourg",
    region: "grand-est",
    domaine: "lettres",
    niveau: "bac+2",
    lat: 48.5841,
    lng: 7.7474
  },
  {
    id: 6,
    titre: "Licence Droit",
    universite: "Université de Montpellier",
    region: "ile-de-france",
    domaine: "lettres",
    niveau: "bac",
    lat: 43.6106,
    lng: 3.8767
  }
];

// Données des vœux
let voeux = JSON.parse(localStorage.getItem("voeux")) || [];

// Récupération des éléments
const domaineFilter = document.getElementById("domaine");
const regionFilter = document.getElementById("region");
const niveauFilter = document.getElementById("niveau");
const searchFilter = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("resultsContainer");
const toast = document.getElementById("toast");
const modal = document.getElementById("voeuxModal");
const modalContent = document.querySelector(".modal-content");
const closeBtn = document.querySelector(".close");
const voeuxList = document.getElementById("voeuxList");
const clearVoeuxBtn = document.getElementById("clearVoeux");

// Fonction pour afficher un toast
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.style.backgroundColor = type === "success" ? "#28a745" : "#dc3545";
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// Fonction pour filtrer les formations
function filtrerFormations() {
  const domaine = domaineFilter.value;
  const region = regionFilter.value;
  const niveau = niveauFilter.value;
  const search = searchFilter.value.toLowerCase().trim();

  // Filtrer les formations
  const filtered = formations.filter(f => {
    const matchDomaine = !domaine || f.domaine === domaine;
    const matchRegion = !region || f.region === region;
    const matchNiveau = !niveau || f.niveau === niveau;
    const matchSearch = !search || f.titre.toLowerCase().includes(search) || f.universite.toLowerCase().includes(search);
    return matchDomaine && matchRegion && matchNiveau && matchSearch;
  });

  // Afficher les résultats
  if (filtered.length === 0) {
    resultsContainer.innerHTML = '<p>Aucune formation trouvée.</p>';
    return;
  }

  resultsContainer.innerHTML = filtered.map(f => {
    const isVoeu = voeux.includes(f.id);
    const icon = isVoeu ? "fas fa-heart" : "far fa-heart";
    const color = isVoeu ? "var(--danger)" : "var(--text)";
    return `
      <div class="result-card">
        <h3 class="result-title">${f.titre} <i class="${icon}" style="color: ${color}; cursor: pointer;" data-id="${f.id}"></i></h3>
        <div class="result-details">
          <p><i class="fas fa-graduation-cap"></i> ${f.universite} - ${f.region === "ile-de-france" ? "Île-de-France" : "Grand Est"}</p>
          <p><i class="fas fa-book"></i> Domaine : ${f.domaine === "sciences" ? "Sciences" : f.domaine === "lettres" ? "Lettres" : "Arts"}</p>
          <p><i class="fas fa-clipboard-list"></i> Niveau : ${f.niveau === "bac" ? "Bac" : f.niveau === "bac+2" ? "Bac+2" : "Bac+3"}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Ajouter les événements
domaineFilter.addEventListener("change", filtrerFormations);
regionFilter.addEventListener("change", filtrerFormations);
niveauFilter.addEventListener("change", filtrerFormations);
searchFilter.addEventListener("input", filtrerFormations);
searchBtn.addEventListener("click", filtrerFormations);

// Gestion des vœux
resultsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-heart")) {
    const id = parseInt(e.target.dataset.id);
    const isVoeu = voeux.includes(id);
    if (isVoeu) {
      voeux = voeux.filter(v => v !== id);
      e.target.classList.remove("fas");
      e.target.classList.add("far");
      e.target.style.color = "var(--text)";
      showToast("Formation retirée de vos vœux.", "warning");
    } else {
      voeux.push(id);
      e.target.classList.remove("far");
      e.target.classList.add("fas");
      e.target.style.color = "var(--danger)";
      showToast("Formation ajoutée à vos vœux.", "success");
    }
    localStorage.setItem("voeux", JSON.stringify(voeux));
  }
});

// Afficher les vœux
function afficherVoeux() {
  if (voeux.length === 0) {
    voeuxList.innerHTML = '<p>Aucun vœu enregistré.</p>';
    return;
  }
  voeuxList.innerHTML = voeux.map(id => {
    const f = formations.find(f => f.id === id);
    return `
      <div class="result-card">
        <h3 class="result-title">${f.titre}</h3>
        <div class="result-details">
          <p><i class="fas fa-graduation-cap"></i> ${f.universite} - ${f.region === "ile-de-france" ? "Île-de-France" : "Grand Est"}</p>
          <p><i class="fas fa-book"></i> Domaine : ${f.domaine === "sciences" ? "Sciences" : f.domaine === "lettres" ? "Lettres" : "Arts"}</p>
          <p><i class="fas fa-clipboard-list"></i> Niveau : ${f.niveau === "bac" ? "Bac" : f.niveau === "bac+2" ? "Bac+2" : "Bac+3"}</p>
        </div>
      </div>
    `;
  }).join('');
}

// Gérer le modal
document.querySelector("a[href='#voeux']").addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "block";
  afficherVoeux();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

clearVoeuxBtn.addEventListener("click", () => {
  voeux = [];
  localStorage.setItem("voeux", JSON.stringify(voeux));
  afficherVoeux();
  showToast("Tous vos vœux ont été effacés.", "warning");
  modal.style.display = "none";
});

// Fermer le modal en cliquant en dehors
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Lancer le filtrage au chargement
filtrerFormations();