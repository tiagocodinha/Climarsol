document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectsGrid = document.getElementById("projectsGrid");
  const projectsEmpty = document.getElementById("projectsEmpty");

  // homepage (6 mais recentes)
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

    // 1 — imagem principal
    if (project.image) {
      list.push({ type: "image", src: project.image });
    }

    // 2 — conteúdos adicionais
    const extraRaw = Array.isArray(project.gallery) ? project.gallery : [];

    extraRaw.forEach((item) => {
      if (!item) return;

      // compatibilidade com formato antigo: ["img1.jpg", "img2.jpg"]
      if (typeof item === "string") {
        list.push({ type: "image", src: item });
        return;
      }

      // tipo definido no CMS (image / video)
      const type = item.type || "image";

      if (type === "video") {
        const src = item.video_url || item.url || item.file;
        if (src) {
          list.push({ type: "video", src });
        }
      } else {
        // imagem extra: pode vir de item.image (upload) ou item.url (se algum dia usares URL)
        const src = item.image || item.url || item.file;
        if (src) {
          list.push({ type: "image", src });
        }
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

    let filtered =
      !category || category === "todos"
        ? allProjects
        : allProjects.filter((p) => {
            if (!p.category) return false;

            // Se for múltipla escolha (array)
            if (Array.isArray(p.category)) {
              return p.category.includes(category);
            }

            // Compatibilidade com projetos antigos (string única)
            return p.category === category;
          });

    if (!filtered.length) {
      if (projectsEmpty) projectsEmpty.style.display = "block";
      return;
    }

    if (projectsEmpty) projectsEmpty.style.display = "none";

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
  const modalClose = modal ? modal.querySelector(".project-modal-close") : null;
  const modalPrev = modal ? modal.querySelector(".project-modal-arrow.prev") : null;
  const modalNext = modal ? modal.querySelector(".project-modal-arrow.next") : null;

  let currentProjectIndex = null;
  let currentImageIndex = 0;

  function onProjectCardClick(e) {
    const idx = parseInt(e.currentTarget.dataset.projectIndex, 10);
    openProjectModal(idx);
  }

  function openProjectModal(index) {
    if (!modal) return; // se a página não tiver modal (falha de markup), aborta

    const project = allProjects[index];
    if (!project) return;

    currentProjectIndex = index;
    currentImageIndex = 0;

    updateModalContent();

    const gallery = getGallery(project);
    const multiple = gallery.length > 1;

    if (modalPrev && modalNext) {
      modalPrev.classList.toggle("hidden", !multiple);
      modalNext.classList.toggle("hidden", !multiple);
    }

    modal.classList.add("show");
  }

  /* ============================
    7 — Atualizar conteúdo do pop-up
  ============================ */
  function updateModalContent() {
    if (!modalMedia) return;

    const project = allProjects[currentProjectIndex];
    if (!project) return;

    const gallery = getGallery(project);
    if (!gallery.length) return;

    const item = gallery[currentImageIndex];

    if (item.type === "video") {
      modalMedia.innerHTML = `
        <video id="projectModalVideo"
              autoplay
              loop
              muted
              playsinline
              style="width:100%;max-height:85vh;object-fit:contain;background:#000;cursor:pointer;">
          <source src="${item.src}" type="video/mp4">
        </video>
      `;

      const videoEl = modalMedia.querySelector("#projectModalVideo");

      // Clique pausa/retoma (opcional — posso remover se quiseres)
      videoEl.addEventListener("click", () => {
        if (videoEl.paused) {
          videoEl.play();
        } else {
          videoEl.pause();
        }
      });

    } else {
      modalMedia.innerHTML = `
        <img src="${item.src}" 
            style="width:100%;max-height:85vh;object-fit:contain;background:#000;">
      `;
    }
  }


  /* ============================
     8 — Navegação (loop)
  ============================ */
  function showPrev() {
    const project = allProjects[currentProjectIndex];
    if (!project) return;

    const gallery = getGallery(project);
    if (!gallery.length) return;

    currentImageIndex = (currentImageIndex - 1 + gallery.length) % gallery.length;
    updateModalContent();
  }

  function showNext() {
    const project = allProjects[currentProjectIndex];
    if (!project) return;

    const gallery = getGallery(project);
    if (!gallery.length) return;

    currentImageIndex = (currentImageIndex + 1) % gallery.length;
    updateModalContent();
  }

  if (modalPrev) modalPrev.addEventListener("click", showPrev);
  if (modalNext) modalNext.addEventListener("click", showNext);
  if (modalClose) modalClose.addEventListener("click", () => modal.classList.remove("show"));

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("project-modal-backdrop")) {
        modal.classList.remove("show");
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal) {
      modal.classList.remove("show");
    }
  });
});


