// ── Mobile menu ──
document.addEventListener('DOMContentLoaded', function () {
    const mobMenuBtn = document.getElementById('mobMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobMenuBtn && mainNav) {
        mobMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            mainNav.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!mainNav.contains(event.target) && !mobMenuBtn.contains(event.target)) {
                mainNav.classList.remove('open');
            }
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
            });
        });
    }
});

// ── Universal Slider Factory ──
function makeSlider(trackId, prevId, nextId, dotsId, getVC, gap) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    const dotsEl = dotsId ? document.getElementById(dotsId) : null;
    const cards = track.querySelectorAll(':scope > *');
    const G = gap || 14;
    let idx = 0;

    function total() { return Math.max(1, Math.ceil(cards.length / getVC())); }

    function buildDots() {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (let i = 0; i < total(); i++) {
            const d = document.createElement('div');
            d.className = 'dot' + (trackId.includes('dd') || trackId.includes('dh') ? ' dot-dk' : '') + (i === idx ? ' active' : '');
            d.onclick = () => go(i);
            dotsEl.appendChild(d);
        }
    }

    function updateUI() {
        if (dotsEl) dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx >= total() - 1;
    }

    function go(i) {
        idx = Math.max(0, Math.min(i, total() - 1));
        const cw = cards[0] ? cards[0].offsetWidth + G : 0;
        track.style.transform = `translateX(-${idx * getVC() * cw}px)`;
        updateUI();
    }

    if (prev) prev.onclick = () => go(idx - 1);
    if (next) next.onclick = () => go(idx + 1);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', e => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                go(idx + 1);
            } else {
                go(idx - 1);
            }
        }
    });

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            idx = 0;
            buildDots();
            go(0);
        }, 150);
    });

    buildDots();
    updateUI();
}

// View count functions based on screen width
const vc6 = () => {
    const w = window.innerWidth;
    return w <= 480 ? 2 : w <= 700 ? 3 : w <= 900 ? 4 : w <= 1100 ? 5 : 6;
};

const vc7 = () => {
    const w = window.innerWidth;
    return w <= 480 ? 3 : w <= 700 ? 4 : w <= 900 ? 5 : w <= 1100 ? 6 : 7;
};

const vcGF = () => {
    const w = window.innerWidth;
    return w <= 700 ? 1 : w <= 1100 ? 2 : 3;
};

const vcUO = () => {
    const w = window.innerWidth;
    return w <= 480 ? 2 : w <= 700 ? 3 : w <= 900 ? 4 : w <= 1100 ? 5 : 6;
};

// Initialize sliders after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    makeSlider('pc-track', 'pc-prev', 'pc-next', 'pc-dots', vc7, 14);
    makeSlider('nc-track', 'nc-prev', 'nc-next', 'nc-dots', vc6, 14);
    makeSlider('tr-track', 'tr-prev', 'tr-next', 'tr-dots', vc6, 14);
    makeSlider('dd-track', 'dd-prev', 'dd-next', 'dd-dots', vc6, 14);
    makeSlider('uo-track', 'uo-prev', 'uo-next', 'uo-dots', vcUO, 16);
    makeSlider('gf-track', 'gf-prev', 'gf-next', null, vcGF, 16);
    makeSlider('dh-track', 'dh-prev', 'dh-next', 'dh-dots', vc6, 14);
});

// ── Trending tab ──
function switchTrendTab(el) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const t = document.getElementById('tr-track');
    if (t) t.style.transform = 'translateX(0)';
}

// ── Countdown timer ──
document.addEventListener('DOMContentLoaded', function () {
    let secs = 15 * 3600 + 36 * 60 + 42;
    const tH = document.getElementById('t-h');
    const tM = document.getElementById('t-m');
    const tS = document.getElementById('t-s');

    if (tH && tM && tS) {
        setInterval(() => {
            if (secs <= 0) return;
            secs--;
            tH.textContent = String(Math.floor(secs / 3600)).padStart(2, '0');
            tM.textContent = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
            tS.textContent = String(secs % 60).padStart(2, '0');
        }, 1000);
    }
});