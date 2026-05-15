/* ====================================================
   DADOS DOS PROJETOS
   ==================================================== */
const PROJECTS = [
  {
    label: 'Projeto 01',
    title: 'Lumina Dashboard',
    desc: 'Painel de analytics em tempo real desenvolvido do zero com JavaScript puro e Canvas API. Apresenta graficos de linha, barras e pizza com atualizacoes dinamicas, filtros por periodo, exportacao de dados em CSV e suporte a temas claro/escuro. O objetivo foi demonstrar que e possivel construir visualizacoes complexas sem depender de bibliotecas externas.',
    tags: ['HTML5', 'CSS Grid', 'JavaScript ES6+', 'Canvas API', 'LocalStorage'],
    demoUrl: 'https://exemplo.com/lumina-demo',
    codeUrl: 'https://github.com/pedrohs-cdc/lumina-dashboard',
  },
  {
    label: 'Projeto 02',
    title: 'EcoTrack',
    desc: 'Aplicativo PWA de monitoramento da pegada de carbono pessoal. O usuario registra atividades do dia a dia (transporte, alimentacao, consumo de energia) e recebe um relatorio semanal com dicas de reducao personalizadas. Funciona offline gracas ao Service Worker e salva os dados localmente com IndexedDB.',
    tags: ['HTML5', 'CSS Variables', 'JavaScript', 'Service Worker', 'IndexedDB'],
    demoUrl: 'https://exemplo.com/ecotrack-demo',
    codeUrl: 'https://github.com/pedrohs-cdc/ecotrack',
  },
  {
    label: 'Projeto 03',
    title: 'DevNotes',
    desc: 'Editor de notas colaborativo para desenvolvedores com suporte a Markdown, highlight de sintaxe com regex, busca em tempo real com debounce e sincronizacao com API REST. Conta com sistema de tags, atalhos de teclado e exportacao em formato .md. Construido sem frameworks, focado em performance e acessibilidade.',
    tags: ['JavaScript', 'Markdown', 'REST API', 'Node.js', 'Regex'],
    demoUrl: 'https://exemplo.com/devnotes-demo',
    codeUrl: 'https://github.com/pedrohs-cdc/devnotes',
  },
];

/* ====================================================
   UTILITARIOS
   ==================================================== */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

/* ====================================================
   HEADER COM SCROLL
   ==================================================== */
const header = $('.site-header');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ====================================================
   MENU MOBILE
   ==================================================== */
const menuToggle = $('#menu-toggle');
const navList    = $('#nav-list');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.classList.toggle('open');
  navList.classList.toggle('open');
});

// Fecha o menu ao clicar em um link
$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('open');
    navList.classList.remove('open');
  });
});

/* ====================================================
   SCROLL SUAVE PARA ANCORAS
   ==================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ====================================================
   LINK ATIVO NA NAVEGACAO (INTERSECTIONOBSERVER)
   ==================================================== */
const SECTIONS   = ['sobre', 'habilidades', 'projetos', 'contato'];
const navLinks   = $$('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  {
    rootMargin: `-${header.offsetHeight + 20}px 0px -60% 0px`,
    threshold: 0,
  }
);

SECTIONS.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ====================================================
   ANIMACAO DE ENTRADA (REVEAL)
   ==================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger em filhos diretos
        $$('.skill-card, .project-card', entry.target).forEach((child, i) => {
          child.style.transitionDelay = `${i * 60}ms`;
        });
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ====================================================
   MODAL DE PROJETO
   ==================================================== */
const overlay     = $('#modal-overlay');
const modal       = $('#modal');
const modalClose  = $('#modal-close');
const modalLabel  = $('#modal-label');
const modalTitle  = $('#modal-title');
const modalDesc   = $('#modal-desc');
const modalTech   = $('#modal-tech');
const modalDemo   = $('#modal-link-demo');
const modalCode   = $('#modal-link-code');

function openModal(projectIndex) {
  const p = PROJECTS[projectIndex];
  if (!p) return;

  modalLabel.textContent = p.label;
  modalTitle.textContent = p.title;
  modalDesc.textContent  = p.desc;

  modalTech.innerHTML = p.tags
    .map(tag => `<li>${tag}</li>`)
    .join('');

  modalDemo.href = p.demoUrl;
  modalCode.href = p.codeUrl;

  overlay.removeAttribute('hidden');
  // Forca reflow para ativar a transicao CSS
  overlay.getBoundingClientRect();
  overlay.classList.add('visible');

  // Foco acessivel no botao de fechar
  modalClose.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('visible');
  overlay.addEventListener('transitionend', () => {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }, { once: true });
}

// Botoes "Ver mais"
$$('.project-ver-mais').forEach(btn => {
  btn.addEventListener('click', () => {
    const index = Number(btn.dataset.project);
    openModal(index);
  });
});

// Fechar pelo botao X
modalClose.addEventListener('click', closeModal);

// Fechar pelo overlay (fora do modal)
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Fechar pelo Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
    closeModal();
  }
});

/* ====================================================
   TRAP DE FOCO NO MODAL (ACESSIBILIDADE)
   ==================================================== */
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const focusable = $$('button, a, [tabindex]:not([tabindex="-1"])', modal);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
