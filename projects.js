document.addEventListener("DOMContentLoaded", () => {
  // --- Filtros + carregamento de projetos a partir de JSON ---

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectsGrid = document.getElementById("projectsGrid");
  const projectsEmpty = document.getElementById("projectsEmpty");

  // homepage (6 mais recentes)
  const recentGrid = document.getElementById("recentProjectsGrid");

  let allProjects = [];

  // 1) Carregar projetos do ficheiro JSON (suporta array ou { projects: [] })
  fetch("/data/projects.json")
    .then((res) => res.json())
    .then((data) => {
      allProjects = Array.isArray(data) ? data : (data.projects || []);

      // página Portfólio
      if (projectsGrid) {
        renderProjects("todos");
      }

      // homepage: últimos 6
      if (recentGrid) {
        renderRecentProjects();
      }
    })
    .catch((err) => {
      console.error("Erro a carregar projects.json", err);
      if (projectsEmpty) {
        projectsEmpty.style.display = "block";
        projectsEmpty.textContent =
          "Não foi possível carregar os projetos neste momento.";
      }
    });

  // 2) Listener dos filtros (apenas se existirem na página)
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      renderProjects(category);
    });
  });

  // --------- Funções de apoio ---------

  // Garante que a galeria funciona se vier:
  //  - como array de strings: ["img1.jpg","img2.jpg"]
  //  - ou array de objetos: [{image:"img1.jpg"}, {image:"img2.jpg"}]
  function getGallery(project) {
    const extraRaw = Array.isArray(project.gallery) ? project.gallery : [];

    const extra = extraRaw
      .map((item) =>
        typeof item === "string" ? item : item && item.image ? item.image : null
      )
      .filter(Boolean);

    return [project.image, ...extra].filter(Boolean);
  }

  // 3) Função que desenha os cards do Portfólio
  function renderProjects(category) {
    if (!projectsGrid) return;

    projectsGrid.innerHTML = "";

    let filtered = allProjects;
    if (category && category !== "todos") {
      filtered = allProjects.filter((proj) => proj.category === category);
    }

    if (!filtered.length) {
      if (projectsEmpty) projectsEmpty.style.display = "block";
      return;
    } else {
      if (projectsEmpty) projectsEmpty.style.display = "none";
    }

    filtered.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.dataset.projectIndex = allProjects.indexOf(project);

      card.innerHTML = `
        <div class="project-image" style="background-image: url('${project.image}')">
          <span class="placeholder-text"></span>
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
        </div>
        <div class="project-overlay">
          <div class="project-overlay-icon">+</div>
        </div>
      `;

      card.addEventListener("click", onProjectCardClick);
      projectsGrid.appendChild(card);
    });
  }

  // 4) Homepage – últimos 6 projetos (também sem descrição)
  function renderRecentProjects() {
    if (!recentGrid || !allProjects.length) return;

    recentGrid.innerHTML = "";

    const latest = [...allProjects].slice(-6).reverse();

    latest.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.dataset.projectIndex = allProjects.indexOf(project);

      card.innerHTML = `
        <div class="project-image" style="background-image: url('${project.image}')">
          <span class="placeholder-text"></span>
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
        </div>
        <div class="project-overlay">
          <div class="project-overlay-icon">+</div>
        </div>
      `;

      card.addEventListener("click", onProjectCardClick);
      recentGrid.appendChild(card);
    });
  }

  /* ===== Modal de galeria ===== */

  const modal = document.getElementById("projectModal");
  const modalImg = document.getElementById("projectModalImage");
  const modalClose = modal ? modal.querySelector(".project-modal-close") : null;
  const modalPrev = modal ? modal.querySelector(".project-modal-arrow.prev") : null;
  const modalNext = modal ? modal.querySelector(".project-modal-arrow.next") : null;

  let currentProjectIndex = null;
  let currentImageIndex = 0;

  function onProjectCardClick(e) {
    const card = e.currentTarget;
    const idx = parseInt(card.dataset.projectIndex, 10);
    openProjectModal(idx);
  }

  function openProjectModal(projectIndex) {
    if (!modal) return;

    const project = allProjects[projectIndex];
    if (!project) return;

    const gallery = getGallery(project);
    if (!gallery.length) return;

    currentProjectIndex = projectIndex;
    currentImageIndex = 0;

    updateModalImage();

    if (gallery.length <= 1) {
      modalPrev && modalPrev.classList.add("hidden");
      modalNext && modalNext.classList.add("hidden");
    } else {
      modalPrev && modalPrev.classList.remove("hidden");
      modalNext && modalNext.classList.remove("hidden");
    }

    modal.classList.add("show");
  }

  function updateModalImage() {
    const project = allProjects[currentProjectIndex];
    if (!project) return;

    const gallery = getGallery(project);
    if (!gallery.length) return;

    if (modalImg) {
      modalImg.src = gallery[currentImageIndex];
    }
  }

  function closeProjectModal() {
    if (modal) modal.classList.remove("show");
  }

  function showPrevImage() {
    const project = allProjects[currentProjectIndex];
    const gallery = getGallery(project);
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateModalImage();
      if (gallery.length <= 1) {
        modalPrev && modalPrev.classList.add("hidden");
        modalNext && modalNext.classList.add("hidden");
      }
    }
  }

  function showNextImage() {
    const project = allProjects[currentProjectIndex];
    const gallery = getGallery(project);
    if (currentImageIndex < gallery.length - 1) {
      currentImageIndex++;
      updateModalImage();
    }
  }

  if (modalClose) modalClose.addEventListener("click", closeProjectModal);
  if (modalPrev) modalPrev.addEventListener("click", showPrevImage);
  if (modalNext) modalNext.addEventListener("click", showNextImage);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("project-modal-backdrop")) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
});
