// --- Navbar básica (sem smooth scroll entre secções) ---
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });
}

// --- Filtros + carregamento de projetos a partir de JSON ---

const filterButtons = document.querySelectorAll(".filter-btn");
const projectsGrid = document.getElementById("projectsGrid");
const projectsEmpty = document.getElementById("projectsEmpty");

let allProjects = [];

// 1) Carregar projetos do ficheiro JSON
//    Coloca o ficheiro em: /data/projects.json (na raiz do site)
fetch("../data/projects.json")
  .then((res) => res.json())
  .then((data) => {
    allProjects = data;
    renderProjects("todos");
  })
  .catch((err) => {
    console.error("Erro a carregar projects.json", err);
    projectsEmpty.style.display = "block";
    projectsEmpty.textContent = "Não foi possível carregar os projetos neste momento.";
  });

// 2) Listener dos filtros
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-filter");
    renderProjects(category);
  });
});

// 3) Função que desenha os cards
function renderProjects(category) {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";

  let filtered = allProjects;
  if (category !== "todos") {
    filtered = allProjects.filter((proj) => proj.category === category);
  }

  if (!filtered.length) {
    projectsEmpty.style.display = "block";
    return;
  } else {
    projectsEmpty.style.display = "none";
  }

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    card.innerHTML = `
      <div class="project-image" style="background-image: url('${project.image}')">
        <span class="placeholder-text">${project.badge || ""}</span>
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <div class="project-overlay">
        <span>${project.cta || "Ver detalhes do projeto"}</span>
      </div>
    `;

    projectsGrid.appendChild(card);
  });
}
