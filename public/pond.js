const circle = 2 * Math.PI;
const markings = new Path2D(
    'M 27 -13 C 33 -8 30 -3 24 -2 S 19 4 14 2 S 8 -7 12 -12 Z ' +
    'M 3 -11 C 9 -7 6 -3 2 0 S 9 12 1 15 S -13 11 -12 4 S -11 -10 -4 -12 Z ' +
    'M -19 6 C -23 1 -18 -4 -24 -7 S -34 -5 -33 0 S -27 9 -19 6 Z'
);

const koiColors = {
    ivory: { back: '#e6d8b2', belly: '#a69d78', patches: '#74664e', fins: '#ddd3af' },
    gold: { back: '#dec58b', belly: '#9b875d', patches: '#a2854e', fins: '#d2c093' },
    sage: { back: '#aebb87', belly: '#677452', patches: '#596b49', fins: '#adbc8b' }
};

function ellipse(context, x, y, width, height, rotation = 0) {
    context.beginPath();
    context.ellipse(x, y, width, height, rotation, 0, circle);
}

function drawKoi(context, fish, time) {
    const { x, y, angle, scale, colors } = fish;
    const sway = Math.sin(time * 4.2 + fish.start);
    const tail = sway * 8;

    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(scale, scale);

    ellipse(context, -7, 6, 49, 12);
    context.fillStyle = '#11130b4a';
    context.fill();

    // The fins bend independently of the body as the koi swims.
    context.fillStyle = colors.fins + 'ac';
    context.beginPath();
    context.moveTo(-35, tail * .55);
    context.quadraticCurveTo(-49, tail - 8, -65, tail - 12);
    context.quadraticCurveTo(-62, tail + 1, -54, tail + 2);
    context.quadraticCurveTo(-61, tail + 4, -65, tail + 13);
    context.quadraticCurveTo(-47, tail + 10, -35, tail * .55 + 3);
    context.fill();

    for (const side of [-1, 1]) {
        const finTip = side * 22 + sway * 2;
        context.beginPath();
        context.moveTo(14, side * 7);
        context.quadraticCurveTo(16, side * 15, -8, finTip);
        context.quadraticCurveTo(-11, side * 13, 2, side * 8);
        context.fill();
    }

    const body = new Path2D();
    body.moveTo(34, 0);
    body.bezierCurveTo(34, -9, 21, -14, 8, -12);
    body.bezierCurveTo(-11, -13, -24, -7, -40, tail * .6 - 2);
    body.quadraticCurveTo(-44, tail * .72, -40, tail * .6 + 3);
    body.bezierCurveTo(-23, 7, -10, 13, 9, 12);
    body.bezierCurveTo(23, 13, 35, 7, 34, 0);

    const skin = context.createLinearGradient(0, -13, 0, 14);
    skin.addColorStop(0, colors.belly);
    skin.addColorStop(.48, colors.back);
    skin.addColorStop(1, colors.belly);
    context.fillStyle = skin;
    context.fill(body);

    context.save();
    context.clip(body);
    context.fillStyle = colors.patches;
    context.globalAlpha = .8;
    context.translate(fish.markOffset, 0);
    context.fill(markings);
    context.restore();

    context.strokeStyle = '#fcf0cd50';
    context.lineWidth = 1.2;
    context.beginPath();
    context.moveTo(20, -2);
    context.bezierCurveTo(7, -5, -11, -3, -30, tail * .32);
    context.stroke();

    context.fillStyle = '#342f23';
    for (const side of [-1, 1]) {
        ellipse(context, 25, side * 6, 1.65, 1.2);
        context.fill();
    }
    context.restore();
}

function drawLily(context, x, y, radius, rotation, bloom) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);

    ellipse(context, 2, 4, radius * 1.04, radius * .91);
    context.fillStyle = '#17180c61';
    context.fill();

    const leaf = context.createLinearGradient(-radius, -radius, radius, radius);
    leaf.addColorStop(0, '#87946a');
    leaf.addColorStop(.7, '#536343');
    leaf.addColorStop(1, '#3b4932');
    context.beginPath();
    context.arc(0, 0, radius, .24, circle - .26);
    context.lineTo(-radius * .13, 0);
    context.closePath();
    context.fillStyle = leaf;
    context.fill();
    context.strokeStyle = '#a4b18066';
    context.lineWidth = .85;
    context.stroke();

    context.strokeStyle = '#c6cd9840';
    for (const angle of [.65, 1.45, 2.2, 3.4, 4.3, 5.45]) {
        context.beginPath();
        context.moveTo(-radius * .12, 0);
        context.quadraticCurveTo(
            Math.cos(angle + .22) * radius * .49, Math.sin(angle + .22) * radius * .49,
            Math.cos(angle) * radius * .88, Math.sin(angle) * radius * .88
        );
        context.stroke();
    }

    if (bloom) {
        context.translate(-radius * .36, radius * .34);
        for (let petal = 0; petal < 8; petal++) {
            context.rotate(circle / 8);
            ellipse(context, radius * .25, 0, radius * .29, radius * .115);
            context.fillStyle = petal % 2 ? '#ded6ac' : '#eee7cf';
            context.fill();
        }
        ellipse(context, 0, 0, radius * .14, radius * .14);
        context.fillStyle = '#bca05c';
        context.fill();
    }

    context.restore();
}

function startPond(canvas, button, book) {
    const context = canvas.getContext('2d');
    if (!context) return;

    const cover = document.body.classList.contains('chapter-index');
    let paused = false;

    const fish = [
        { lane: 0, start: .3, speed: .31, size: .95, markOffset: 0, colors: koiColors.ivory },
        { lane: 0, start: 2.65, speed: .24, size: .73, markOffset: 5, colors: koiColors.gold },
        { lane: 1, start: 3.8, speed: .29, size: 1, markOffset: -5, colors: koiColors.gold },
        { lane: 1, start: 1.1, speed: .36, size: .75, markOffset: 1, colors: koiColors.sage },
        { lane: 2, start: 2.67, speed: .27, size: .87, markOffset: -2, colors: koiColors.sage },
        { lane: 3, start: 4.28, speed: .24, size: .78, markOffset: 4, colors: koiColors.ivory }
    ].map(config => ({ ...config, phase: config.start, driftX: 0, driftY: 0 }));

    let width, height, lanes, lilies, mobile;
    let tap = null;
    let hover = null;
    let lastHoverRipple = null;
    const ripples = [];
    let time = 0;
    let lastFrame;
    let frame = 0;

    function layout() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        mobile = width <= 650;
        const gutter = (width - book.offsetWidth) / 2;
        const sideX = Math.max(22, gutter * .51);
        const topY = mobile ? (cover ? 123 : 91) : (cover ? 103 : 84);
        const sideY = height * .47;
        lanes = [
            [sideX, sideY, Math.min(42, gutter * .23), height * .28],
            [width - sideX, sideY, Math.min(42, gutter * .23), height * .26],
            [width * .46, topY, width * .28, mobile ? 20 : 15],
            [width * .54, height - 31, width * .35, 17]
        ];

        const padSize = Math.min(29, Math.max(17, gutter * .19));
        lilies = mobile ? [
            [width * .13, topY + 25, 19, 1.1, true],
            [width * .21, topY + 47, 10, 2.7],
            [width * .91, topY - 8, 23, 4.6],
            [width * .83, topY - 21, 13, 2.3, true],
            [width * .17, height - 17, 15, 3.1]
        ] : [
            [sideX * .64, height * .17, padSize, 1.1, true],
            [sideX * 1.2, height * .11, padSize * .61, 2.7],
            [sideX * .62, height * .79, padSize, 3.2],
            [sideX * 1.28, height * .87, padSize * .58, 4.3, true],
            [width - sideX * .66, height * .17, padSize * .86, 5.3],
            [width - sideX * 1.22, height * .23, padSize * .60, 1.9, true],
            [width - sideX * .70, height * .73, padSize * .94, 2.6, true],
            [width - sideX * 1.38, height * .81, padSize * .61, 4.9]
        ];

        for (const koi of fish) {
            koi.angle = undefined;
            koi.driftX = 0;
            koi.driftY = 0;
            koi.scale = koi.size * (mobile ? (cover ? .72 : .52) : Math.min(1, Math.max(.6, gutter / 130)));
        }
        draw();
    }

    function drawWater() {
        context.lineWidth = 1;
        for (let index = 0; index < 18; index++) {
            const x = width * ((index * .37 + .021) % 1);
            const y = height * ((index * .63 + .127) % 1);
            const glow = .12 + .06 * Math.sin(index + time * .6);
            context.strokeStyle = `rgba(218, 223, 177, ${glow})`;
            context.beginPath();
            context.ellipse(x, y, 13 + index % 5 * 5, 10 + index % 4 * 4, -.2, .12, 1.55);
            context.stroke();
        }

        for (const ring of ripples) {
            const age = time - ring.start;
            for (let band = 0; band < 3; band++) {
                const progress = (age - .12 * band) / 1.25;
                if (progress < 0 || progress > 1) continue;
                const radius = 5 + progress * ring.radius;
                ellipse(context, ring.x, ring.y, radius, radius * .88);
                context.strokeStyle = `rgba(231, 234, 190, ${(1 - progress) * ring.opacity})`;
                context.stroke();
            }
        }
    }

    function draw(step = 0) {
        context.clearRect(0, 0, width, height);
        drawWater();

        const target = tap ?? hover;
        const strength = tap ? .95 : .48;
        for (const [index, koi] of fish.entries()) {
            if (mobile && ![0, 2, 4, 5].includes(index)) continue;
            const laneIndex = mobile && index < 5 ? 2 : koi.lane;
            const [centerX, centerY, radiusX, radiusY] = lanes[laneIndex];
            koi.phase += step * koi.speed;
            const homeX = centerX + Math.cos(koi.phase) * radiusX;
            const homeY = centerY + Math.sin(koi.phase) * radiusY;
            const reach = mobile ? 150 : 225;
            const distance = target ? Math.hypot(target.x - homeX, target.y - homeY) : reach;
            const interest = Math.max(0, 1 - distance / reach) * strength;
            const follow = 1 - Math.exp(-step * 2.8);
            koi.driftX += (((target?.x ?? homeX) - homeX) * interest - koi.driftX) * follow;
            koi.driftY += (((target?.y ?? homeY) - homeY) * interest - koi.driftY) * follow;

            const x = homeX + koi.driftX;
            const y = homeY + koi.driftY;
            const tangent = Math.atan2(Math.cos(koi.phase) * radiusY, -Math.sin(koi.phase) * radiusX);
            if (koi.angle === undefined) {
                koi.angle = tangent;
            } else {
                const direction = Math.atan2(y - koi.y, x - koi.x);
                const turn = direction - koi.angle;
                koi.angle += Math.atan2(Math.sin(turn), Math.cos(turn)) * follow;
            }
            koi.x = x;
            koi.y = y;
            drawKoi(context, koi, time);
        }

        for (const [index, [x, y, radius, rotation, bloom]] of lilies.entries()) {
            const bob = Math.sin(time * .8 + index) * 1.2;
            drawLily(context, x, y + bob, radius, rotation + bob * .016, bloom);
        }
    }

    function tick(now) {
        const step = lastFrame === undefined ? 0 : Math.min((now - lastFrame) / 1000, .05);
        lastFrame = now;
        time += step;
        if (tap && time >= tap.until) tap = null;
        while (ripples.length && time - ripples[0].start > 1.53) ripples.shift();
        rippleOnHover();
        draw(step);
        frame = requestAnimationFrame(tick);
    }

    function sync() {
        button.textContent = paused ? 'Play pond' : 'Pause pond';
        if (paused || document.hidden) {
            cancelAnimationFrame(frame);
            frame = 0;
            lastFrame = undefined;
            tap = null;
            clearHover();
            ripples.length = 0;
            draw();
        } else if (!frame) {
            frame = requestAnimationFrame(tick);
        }
    }

    function isWater(target) {
        return target instanceof Element &&
            !target.closest('.book-cover, .bookmarks, .site-header, .page-turn, dialog, a, button');
    }

    function clearHover() {
        hover = null;
        lastHoverRipple = null;
    }

    function addRipple({ x, y }, radius, opacity) {
        const ring = { x, y, start: time, radius, opacity };
        ripples.push(ring);
        if (ripples.length > 12) ripples.shift();
        return ring;
    }

    function rippleOnHover() {
        if (!hover) return;
        if (lastHoverRipple) {
            const age = time - lastHoverRipple.start;
            const moved = Math.hypot(hover.x - lastHoverRipple.x, hover.y - lastHoverRipple.y);
            if (age < .16 || (age < .68 && moved < 26)) return;
        }
        if (!isWater(document.elementFromPoint(hover.x, hover.y))) {
            clearHover();
            return;
        }
        lastHoverRipple = addRipple(hover, 44, .34);
    }

    layout();
    button.hidden = false;
    button.addEventListener('click', () => {
        paused = !paused;
        sync();
    });
    window.addEventListener('resize', layout, { passive: true });
    window.addEventListener('pointermove', event => {
        if (paused || event.pointerType !== 'mouse') return;
        if (isWater(event.target)) {
            hover = { x: event.clientX, y: event.clientY };
        } else {
            clearHover();
        }
    }, { passive: true });
    window.addEventListener('pointerdown', event => {
        if (paused || !isWater(event.target)) return;
        tap = { x: event.clientX, y: event.clientY, until: time + 2.8 };
        const ring = addRipple(tap, 84, .60);
        if (event.pointerType === 'mouse') lastHoverRipple = ring;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', clearHover);
    window.addEventListener('blur', clearHover);
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            paused = false;
            sync();
        }
    });
    document.addEventListener('visibilitychange', sync);
    sync();
}

startPond(
    document.getElementById('pond'),
    document.querySelector('.pond-toggle'),
    document.querySelector('.book-cover')
);
