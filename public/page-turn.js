const corner = document.querySelector('.page-corner');
const book = document.querySelector('#journal');
const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');

let gesture;
let suppressClick = false;
let spread;
let leaf;
let angle = 0;
let animation;

function createTurn() {
    const bounds = book.getBoundingClientRect();
    const top = Math.max(0, bounds.top);
    const height = Math.min(window.innerHeight, bounds.bottom) - top;
    if (height <= 0) return;

    const seam = book.querySelector('.spread > .sheet:last-child')?.getBoundingClientRect().left;
    const left = seam > bounds.left ? seam : bounds.left + bounds.width / 2;

    spread = document.createElement('div');
    spread.className = 'turning-spread';
    spread.inert = true;
    spread.setAttribute('aria-hidden', 'true');
    Object.assign(spread.style, {
        top: `${top}px`,
        left: `${left}px`,
        width: `${bounds.right - left}px`,
        height: `${height}px`
    });

    leaf = document.createElement('div');
    leaf.className = 'turning-leaf';
    const front = document.createElement('div');
    front.className = 'turning-face';
    const back = document.createElement('div');
    back.className = 'turning-face turning-face--back';

    const copy = book.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    copy.querySelectorAll('details[name]').forEach(node => node.removeAttribute('name'));
    copy.querySelectorAll('.is-revealed').forEach(node => node.classList.remove('is-revealed'));
    copy.querySelector('dialog')?.remove();
    copy.classList.add('turning-copy');
    Object.assign(copy.style, {
        left: `${bounds.left - left}px`,
        top: `${bounds.top - top}px`,
        width: `${bounds.width}px`
    });

    front.append(copy);
    leaf.append(front, back);
    spread.append(leaf);
    document.body.append(spread);
}

function rotation(degrees) {
    return `perspective(1400px) rotateY(${-degrees}deg)`;
}

function clearTurn() {
    animation?.cancel();
    spread?.remove();
    spread = leaf = animation = undefined;
    angle = 0;
}

function finishTurn(advance) {
    if (advance && motion.matches && !leaf) createTurn();

    if (!leaf?.animate || !motion.matches) {
        clearTurn();
        if (advance) location.assign(corner.href);
        return;
    }

    animation = leaf.animate(
        [{ transform: rotation(angle) }, { transform: rotation(advance ? 180 : 0) }],
        { duration: advance ? Math.max(220, 540 * (1 - angle / 180)) : 230, easing: 'ease-in-out', fill: 'forwards' }
    );
    animation.finished.then(() => {
        if (advance) location.assign(corner.href);
        else clearTurn();
    }, clearTurn);
}

corner.addEventListener('pointerdown', event => {
    suppressClick = false;
    if (event.button !== 0 || !event.isPrimary || animation) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
    corner.setPointerCapture(event.pointerId);
});

corner.addEventListener('pointermove', event => {
    if (gesture?.id !== event.pointerId) return;
    const distance = gesture.x - event.clientX;
    if (!gesture.dragging && Math.hypot(distance, event.clientY - gesture.y) < 8) return;
    gesture.dragging = true;

    if (distance <= 0 && !leaf) return;
    if (!leaf) createTurn();
    if (!leaf) return;

    const limit = motion.matches ? 152 : 38;
    angle = Math.min(limit, Math.max(0, distance / (book.offsetWidth * .55) * 180));
    leaf.style.transform = rotation(angle);
});

corner.addEventListener('pointerup', event => {
    if (gesture?.id !== event.pointerId) return;
    const { x, dragging } = gesture;
    gesture = undefined;
    if (!dragging) return;

    suppressClick = true;
    const threshold = Math.min(100, book.offsetWidth * .17);
    finishTurn(x - event.clientX >= threshold);
});

function cancelGesture(event) {
    if (gesture?.id !== event.pointerId) return;
    gesture = undefined;
    finishTurn(false);
}

corner.addEventListener('pointercancel', cancelGesture);
corner.addEventListener('lostpointercapture', cancelGesture);

for (const link of document.querySelectorAll('[data-page-turn]')) {
    link.addEventListener('click', event => {
        if ((link === corner && suppressClick && event.detail > 0) || animation) {
            event.preventDefault();
            return;
        }
        if (!motion.matches || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

        event.preventDefault();
        finishTurn(true);
    });
}

window.addEventListener('pagehide', () => {
    gesture = undefined;
    suppressClick = false;
    clearTurn();
});
