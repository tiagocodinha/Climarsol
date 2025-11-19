document.addEventListener("DOMContentLoaded", () => {

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectsGrid = document.getElementById("projectsGrid");
  const projectsEmpty = document.getElementById("projectsEmpty");

  const recentGrid =
    document.getElementById("recentProjectsGrid") ||
    document.getElementById("projectsGridHome");

  let allProjects = [];

  /* ============================
     1 — Carregar JSON
  ============================ */
  fetch("/data/projects.json")
    .then((res) => res.json())
    .then((data) => {
      allProjects = Array.isArray(data) ? data : (data.projects || []);

      if (projectsGrid) renderProjects("todos");
      if (recentGrid) renderRecentProjects();
    })
    .catch((err) => {
      console.error("Erro:", err);
      if (projectsEmpty) {
        projectsEmpty.style.display = "block";
        projectsEmpty.textContent = "Erro ao carregar projetos.";
      }
    });

  /* ============================
     2 — Filtros
  ============================ */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      renderProjects(category);
    });
  });

  /* ============================
     3 — Preparar galeria (IMAGEM + VÍDEO)
  ============================ */
  function getGallery(project) {
    const list = [];

    // 1 — sempre imagem principal
    if (project.image) {
      list.push({ type: "image", src: project.image });
    }

    // 2 — conteúdos adicionais
    const extra = Array.isArray(project.gallery) ? project.gallery : [];

    extra.forEach((item) => {
      if (!item) return;

      // compatibilidade com versões antigas (strings)
      if (typeof item === "string") {
        list.push({ type: "image", src: item });
        return;
      }

      if (item.image) {
        list.push({ type: "image", src: item.image });
        return;
      }

      if (item.file) {
        list.push({
          type: item.type === "video" ? "video" : "image",
          src: item.file
        });
      }
    });

    return list;
  }

  /* ============================
     4 — Renderizar Portfólio
  ============================ */
  function renderProjects(category) {
    if (!projectsGrid) return;

    projectsGrid.innerHTML = "";

    let filtered = category === "todos"
      ? allProjects
      : allProjects.filter((p) => p.category === category);

    if (!filtered.length) {
      projectsEmpty.style.display = "block";
      return;
    }

    projectsEmpty.style.display = "none";

    filtered.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.dataset.projectIndex = allProjects.indexOf(project);

      card.innerHTML = `
        <div class="project-image" style="background-image: url('${project.image}')"></div>
        <div class="project-info"><h3>${project.title}</h3></div>
        <div class="project-overlay"><div class="project-overlay-icon">+</div></div>
      `;

      card.addEventListener("click", onProjectCardClick);
      projectsGrid.appendChild(card);
    });
  }

  /* ============================
     5 — Renderizar Home (6 recentes)
  ============================ */
  function renderRecentProjects() {
    if (!recentGrid) return;

    recentGrid.innerHTML = "";
    const latest = [...allProjects].slice(-6).reverse();

    latest.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.dataset.projectIndex = allProjects.indexOf(project);

      card.innerHTML = `
        <div class="project-image" style="background-image: url('${project.image}')"></div>
        <div class="project-info"><h3>${project.title}</h3></div>
        <div class="project-overlay"><div class="project-overlay-icon">+</div></div>
      `;

      card.addEventListener("click", onProjectCardClick);
      recentGrid.appendChild(card);
    });
  }

  /* ============================
     6 — Modal
  ============================ */
  const modal = document.getElementById("projectModal");
  const modalMedia = document.getElementById("projectModalMedia");
  const modalClose = modal?.querySelector(".project-modal-close");
  const modalPrev = modal?.querySelector(".project-modal-arrow.prev");
  const modalNext = modal?.querySelector(".project-modal-arrow.next");

  let currentProjectIndex = null;
  let currentImageIndex = 0;

  function onProjectCardClick(e) {
    const idx = parseInt(e.currentTarget.dataset.projectIndex, 10);
    openProjectModal(idx);
  }

  function openProjectModal(index) {
    const project = allProjects[index];
    if (!project) return;

    currentProjectIndex = index;
    currentImageIndex = 0;

    updateModalContent();

    const gallery = getGallery(project);
    const multiple = gallery.length > 1;

    modalPrev.classList.toggle("hidden", !multiple);
    modalNext.classList.toggle("hidden", !multiple);

    modal.classList.add("show");
  }

  /* ============================
     7 — Atualizar conteúdo do pop-up
  ============================ */
  function updateModalContent() {
    const project = allProjects[currentProjectIndex];
    const gallery = getGallery(project);

    const item = gallery[currentImageIndex];

    if (item.type === "video") {
      modalMedia.innerHTML = `
        <video controls autoplay style="width:100%;max-height:85vh;object-fit:contain;background:#000;">
          <source src="${item.src}" type="video/mp4">
        </video>
      `;
    } else {
      modalMedia.innerHTML = `
        <img src="${item.src}" style="width:100%;max-height:85vh;object-fit:contain;background:#000;">
      `;
    }
  }

  /* ============================
     8 — Navegação (loop)
  ============================ */
  function showPrev() {
    const gallery = getGallery(allProjects[currentProjectIndex]);
    currentImageIndex = (currentImageIndex - 1 + gallery.length) % gallery.length;
    updateModalContent();
  }

  function showNext() {
    const gallery = getGallery(allProjects[currentProjectIndex]);
    currentImageIndex = (currentImageIndex + 1) % gallery.length;
    updateModalContent();
  }

  modalPrev?.addEventListener("click", showPrev);
  modalNext?.addEventListener("click", showNext);
  modalClose?.addEventListener("click", () => modal.classList.remove("show"));

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("show");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("show");
  });
});
