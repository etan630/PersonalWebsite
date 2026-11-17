// Map the original landing page's section links to their journal chapters.
const legacyChapters = new Map([
    ['#about', '/about'],
    ['#resume', '/resume'],
    ['#contact', '/contact']
]);

if (location.pathname === '/' && legacyChapters.has(location.hash)) {
    location.replace(legacyChapters.get(location.hash));
}

const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
if (motion.matches && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-revealed');
            reveal.unobserve(entry.target);
        }
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal], .project-item').forEach(item => reveal.observe(item));
}

const projects = document.querySelectorAll('.project-item');
for (const project of projects) {
    const close = project.querySelector('.project-close');
    close.hidden = false;
    close.addEventListener('click', () => {
        project.open = false;
        project.querySelector('summary').focus();
    });
    project.addEventListener('toggle', () => {
        if (!project.open) {
            project.querySelectorAll('video').forEach(video => video.pause());
        }
    });
}

function openLinkedProject() {
    const project = document.getElementById(location.hash.slice(1));
    if (project?.classList.contains('project-item')) project.open = true;
}

if (projects.length) {
    openLinkedProject();
    window.addEventListener('hashchange', openLinkedProject);
}

const spotifyDemo = document.getElementById('spotifyVideo');
spotifyDemo?.addEventListener('volumechange', () => {
    if (!spotifyDemo.muted) spotifyDemo.muted = true;
});

const viewer = document.querySelector('[data-photo-viewer]');
if (typeof viewer?.showModal === 'function') {
    const photos = [...document.querySelectorAll('[data-photo]')];
    const image = viewer.querySelector('img');
    const caption = viewer.querySelector('figcaption');
    const count = viewer.querySelector('.viewer-count');
    let current = 0;
    let opener;

    function showPhoto(index) {
        current = (index + photos.length) % photos.length;
        const link = photos[current];
        image.src = link.href;
        image.alt = link.querySelector('img').alt;
        caption.textContent = link.closest('figure').querySelector('figcaption').textContent;
        count.textContent = `${current + 1} / ${photos.length}`;
    }

    for (const photo of photos) {
        photo.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            opener = photo;
            showPhoto(Number(photo.dataset.photo));
            viewer.showModal();
        });
    }

    for (const button of viewer.querySelectorAll('[data-photo-step]')) {
        button.addEventListener('click', () => showPhoto(current + Number(button.dataset.photoStep)));
    }

    viewer.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        showPhoto(current + (event.key === 'ArrowLeft' ? -1 : 1));
    });

    viewer.addEventListener('click', event => {
        if (event.target !== viewer) return;
        const { left, right, top, bottom } = viewer.getBoundingClientRect();
        if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
            viewer.close();
        }
    });

    viewer.addEventListener('close', () => opener?.focus());
}
