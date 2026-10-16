const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const programs = {
  exchange: { title: 'Student exchange', description: 'A semester in a different academic environment can change how you see your subject—and the world. ISC creates awareness of student and semester exchange opportunities through DoIC.', questions: ['Which exchange programs are available for my course and semester?', 'How are academic credits and course equivalence handled?', 'What are the nomination, application and travel requirements?'] },
  internships: { title: 'Global internships', description: 'Explore international work environments, build practical skills and learn alongside people with different perspectives. ISC supports awareness of global internship opportunities.', questions: ['Which international internships fit my field of study?', 'What are the duration, funding and visa requirements?', 'What documents should I prepare before applying?'] },
  research: { title: 'Research & projects', description: 'Bring your curiosity to collaborative international research and projects. Discover how working across institutions and cultures can deepen your academic experience.', questions: ['Are there international projects aligned with my interests?', 'How can I connect with a relevant faculty mentor?', 'What experience, proposal or academic record is required?'] },
  schools: { title: 'Summer & winter schools', description: 'Explore short-term academic learning and cultural immersion during university breaks. These experiences offer another way to broaden your international outlook.', questions: ['Which summer or winter schools are currently available?', 'How do program dates fit the MUJ academic calendar?', 'What do the fees cover, and is financial support available?'] }
};

const dialog = document.querySelector('#program-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const dialogList = document.querySelector('#dialog-list');
let dialogTrigger = null;
document.querySelectorAll('[data-program]').forEach(button => button.addEventListener('click', () => {
  const item = programs[button.dataset.program];
  dialogTrigger = button;
  dialogTitle.textContent = item.title;
  dialogDescription.textContent = item.description;
  dialogList.replaceChildren(...item.questions.map(question => { const li = document.createElement('li'); li.textContent = question; return li; }));
  dialog.showModal();
}));
function closeDialog() { dialog.close(); dialogTrigger?.focus(); }
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); });

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); document.body.classList.remove('menu-open'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
matchMedia('(max-width:780px)').addEventListener('change', closeMenu);
document.addEventListener('click', event => { if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });

const header = document.querySelector('.site-header');
const quickMenuButton = document.querySelector('.quick-menu-toggle');
const quickMenu = document.querySelector('#quick-menu');
function closeQuickMenu() { quickMenu.hidden = true; quickMenuButton.setAttribute('aria-expanded', 'false'); quickMenuButton.setAttribute('aria-label', 'Open ISC menu'); }
quickMenuButton.addEventListener('click', () => {
  const open = quickMenu.hidden;
  closeMenu();
  quickMenu.hidden = !open;
  quickMenuButton.setAttribute('aria-expanded', String(open));
  quickMenuButton.setAttribute('aria-label', open ? 'Close ISC menu' : 'Open ISC menu');
});
menuButton.addEventListener('click', closeQuickMenu);
quickMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', (e) => {
  closeQuickMenu();
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
}));
document.addEventListener('click', event => { if (!event.target.closest('.quick-navigation')) closeQuickMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !quickMenu.hidden) { closeQuickMenu(); quickMenuButton.focus(); } });
header.addEventListener('focusout', event => { if (!header.contains(event.relatedTarget)) closeQuickMenu(); });
const progress = document.querySelector('.scroll-progress span');
const backToTop = document.querySelector('.back-to-top');
const worldBg = document.querySelector('.world-background');
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${scrollable > 0 ? (scrollY / scrollable) * 100 : 0}%`;
  header.classList.toggle('is-scrolled', scrollY > 20);
  backToTop.classList.toggle('visible', scrollY > 700);
  if (worldBg) {
    const blurPx = Math.min(10, (scrollY / 450) * 8);
    const opacity = Math.max(0.38, 1 - (scrollY / 1600) * 0.55);
    worldBg.style.setProperty('--globe-scroll-blur', `${blurPx.toFixed(1)}px`);
    worldBg.style.setProperty('--globe-scroll-opacity', opacity.toFixed(2));
  }
}
addEventListener('scroll', updateScrollUI, { passive: true });
backToTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
updateScrollUI();

const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(section => sectionObserver.observe(section));

if (!reducedMotion.matches && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.program').forEach(card => {
    card.addEventListener('pointermove', event => { const r = card.getBoundingClientRect(); const x = (event.clientX - r.left) / r.width; const y = (event.clientY - r.top) / r.height; card.style.setProperty('--mx', `${x * 100}%`); card.style.setProperty('--my', `${y * 100}%`); card.style.transform = `rotateX(${(.5 - y) * 5}deg) rotateY(${(x - .5) * 5}deg) translateY(-5px)`; });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  const parallaxImage = document.querySelector('[data-parallax]');
  if (parallaxImage) {
    addEventListener('scroll', () => { const r = parallaxImage.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) { const move = ((r.top + r.height / 2) - innerHeight / 2) * -.035; parallaxImage.style.transform = `translateY(${move}px) scale(1.03)`; } }, { passive: true });
  }
}

const canvas = document.querySelector('#globe');
const context = canvas.getContext('2d');
const motionButton = document.querySelector('#motion');
let rotating = !reducedMotion.matches, angle = -.9, dragging = false, lastPointerX = 0, canvasWidth = 0, canvasHeight = 0, lastFrame = 0, globeVisible = true;
const continents = [
  [[-168, 70], [-135, 72], [-123, 60], [-110, 57], [-97, 52], [-82, 53], [-60, 48], [-64, 42], [-80, 25], [-98, 17], [-105, 22], [-116, 32], [-128, 51], [-150, 59]],
  [[-81, 12], [-65, 10], [-51, 0], [-35, -7], [-43, -23], [-54, -35], [-69, -55], [-76, -35], [-80, -12]],
  [[-53, 60], [-42, 60], [-20, 75], [-35, 83], [-58, 78]],
  [[-18, 35], [0, 37], [14, 33], [33, 31], [43, 12], [51, 11], [42, -10], [32, -30], [18, -35], [8, -18], [-2, 3], [-16, 13]],
  [[-10, 36], [-8, 52], [5, 58], [20, 71], [35, 69], [43, 55], [59, 56], [76, 73], [110, 75], [145, 65], [176, 60], [155, 45], [140, 34], [123, 23], [107, 2], [99, 5], [91, 22], [79, 8], [70, 25], [52, 13], [41, 30], [29, 41], [14, 40]],
  [[112, -12], [132, -11], [145, -17], [154, -28], [143, -39], [117, -34]], [[46, -13], [50, -16], [47, -26], [43, -22]], [[129, 31], [142, 45], [145, 42], [137, 33]],
  [[-8, 50], [-2, 59], [1, 53]], [[166, -35], [178, -39], [170, -47]], [[96, 5], [108, -6], [120, -8], [130, -4], [113, 0]]
];
function insidePolygon(x, y, polygon) { let inside = false; for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { const a = polygon[i], b = polygon[j]; if (((a[1] > y) !== (b[1] > y)) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside; } return inside; }
const landPoints = [];
for (let lat = -57; lat < 80; lat += 2.7) { for (let lon = -180; lon < 180; lon += 2.7 / Math.cos(lat * Math.PI / 180)) { if (continents.some(poly => insidePolygon(lon, lat, poly))) landPoints.push([lat, lon]); } }
const stars = Array.from({ length: 55 }, (_, i) => ({ x: ((i * 73) % 997) / 997, y: ((i * 137) % 991) / 991, r: .35 + (i % 3) * .28, a: .12 + (i % 5) * .04 }));
function project(lat, lon) { const latitude = lat * Math.PI / 180; const longitude = lon * Math.PI / 180 + angle; const x = Math.cos(latitude) * Math.sin(longitude), y = -Math.sin(latitude), z = Math.cos(latitude) * Math.cos(longitude), tilt = .15; return { x, y: y * Math.cos(tilt) - z * Math.sin(tilt), z: y * Math.sin(tilt) + z * Math.cos(tilt) }; }
function drawRoute(start, end, radius) { context.beginPath(); let started = false; for (let i = 0; i <= 42; i++) { const t = i / 42; const lat = start[0] + (end[0] - start[0]) * t + Math.sin(t * Math.PI) * 15; const lon = start[1] + (end[1] - start[1]) * t; const point = project(lat, lon); if (point.z > 0) { const scale = radius * (1 + Math.sin(t * Math.PI) * .05); if (!started) context.moveTo(point.x * scale, point.y * scale); else context.lineTo(point.x * scale, point.y * scale); started = true; } else started = false; } context.stroke(); }
function resizeGlobe() { const r = canvas.getBoundingClientRect(); canvasWidth = r.width; canvasHeight = r.height; const dpr = Math.min(devicePixelRatio || 1, canvasWidth <= 780 ? 1.25 : 2); canvas.width = canvasWidth * dpr; canvas.height = canvasHeight * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); drawGlobe(); }
// Representative points within each country, rather than capital-city markers.
const globeMarkers = [
  { label: 'JAIPUR', lat: 26.9124, lon: 75.7873, home: true },
  { label: 'UNITED STATES', lat: 39, lon: -100 },
  { label: 'RUSSIA', lat: 60, lon: 95 },
  { label: 'CHINA', lat: 35, lon: 104 },
  { label: 'CANADA', lat: 57, lon: -110 },
  { label: 'BRAZIL', lat: -12, lon: -52 },
  { label: 'AUSTRALIA', lat: -25, lon: 134 },
  { label: 'JAPAN', lat: 37, lon: 138 },
  { label: 'UNITED KINGDOM', lat: 54, lon: -2 },
  { label: 'SOUTH AFRICA', lat: -30, lon: 25 }
];
let markerHitBoxes = [];
let hoveredMarker = null;
const JAIPUR_URL = 'https://jaipur.manipal.edu/international-collaboration-and-partners.php';

function drawGlobeMarkers(radius, cx, cy) {
  const occupied = [];
  markerHitBoxes = [];
  const fontSize = canvasWidth <= 780 ? 10 : 11.5;
  context.save();
  context.font = `600 ${fontSize}px 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
  context.textBaseline = 'middle';
  context.lineJoin = 'round';
  for (const marker of globeMarkers) {
    const p = project(marker.lat, marker.lon);
    if (p.z <= 0) continue;
    const isHovered = (hoveredMarker && hoveredMarker.label === marker.label);
    const scale = isHovered ? 1.25 : 1.0;
    const x = p.x * radius, y = p.y * radius;
    context.globalAlpha = Math.min(1, p.z / .16);

    // Node markers: Jaipur in refined terracotta orange; partner institutions in soft warm champagne-ivory
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);

    if (isHovered) {
      context.beginPath();
      context.arc(0, 0, marker.home ? 18 : 12, 0, Math.PI * 2);
      context.fillStyle = marker.home ? 'rgba(209,92,42,0.25)' : 'rgba(232,235,225,0.28)';
      context.fill();
    }

    context.fillStyle = marker.home ? '#d15c2a' : (isHovered ? '#ffffff' : '#e8ebe1');
    context.beginPath(); context.arc(0, 0, (marker.home ? 5 : 2.8), 0, Math.PI * 2); context.fill();
    if (marker.home) {
      context.strokeStyle = isHovered ? 'rgba(209,92,42,1)' : 'rgba(209,92,42,0.85)'; context.lineWidth = 1.2;
      context.beginPath(); context.arc(0, 0, 11, 0, Math.PI * 2); context.stroke();
      context.strokeStyle = 'rgba(209,92,42,0.25)'; context.lineWidth = 1;
      context.beginPath(); context.arc(0, 0, 17, 0, Math.PI * 2); context.stroke();
    }
    context.restore();

    // Register dot area as hit target
    markerHitBoxes.push({
      marker,
      left: cx + x - 18,
      right: cx + x + 18,
      top: cy + y - 18,
      bottom: cy + y + 18
    });

    const width = context.measureText(marker.label).width;
    const gap = marker.home ? 22 : 10;
    const preferredX = p.x > .45 ? x - gap - width : x + gap;
    const left = Math.max(8 - cx, Math.min(preferredX, canvasWidth - cx - width - 8));
    const candidates = [y, y - 18, y + 18];
    for (const labelY of candidates) {
      const box = { left: left - 4, right: left + width + 4, top: labelY - fontSize / 2 - 3, bottom: labelY + fontSize / 2 + 3 };
      if (box.top < -cy + 4 || box.bottom > canvasHeight - cy - 4) continue;
      if (occupied.some(b => box.left < b.right && box.right > b.left && box.top < b.bottom && box.bottom > b.top)) continue;
      occupied.push(box);

      context.save();
      if (isHovered) {
        context.translate(left + width / 2, labelY);
        context.scale(scale, scale);
        context.translate(-(left + width / 2), -labelY);
      }

      // Subtle, clean pill backing matching deep forest-teal without harshness
      context.lineWidth = isHovered ? 4.5 : 3.5;
      context.strokeStyle = isHovered ? (marker.home ? '#d15c2a' : '#2b4438') : '#1d2f28';
      context.strokeText(marker.label, left, labelY);
      context.fillStyle = marker.home ? '#ffe8dc' : (isHovered ? '#ffffff' : '#f4f6ee');
      context.fillText(marker.label, left, labelY);
      context.restore();

      // Register label area as hit target
      markerHitBoxes.push({
        marker,
        left: cx + box.left - 4,
        right: cx + box.right + 4,
        top: cy + box.top - 4,
        bottom: cy + box.bottom + 4
      });
      break;
    }
  }
  context.restore();
}
function drawGlobe() {
  if (!context || !canvasWidth) return; context.clearRect(0, 0, canvasWidth, canvasHeight);
  const radius = Math.min(canvasWidth * .48, canvasHeight * .46), cx = canvasWidth * (canvasWidth > 780 ? .69 : .55), cy = canvasHeight * .53;
  context.save(); context.translate(cx, cy);

  // 1. Soft, realistic atmospheric glow (natural, gentle, non-neon)
  const halo = context.createRadialGradient(0, 0, radius * .88, 0, 0, radius * 1.18);
  halo.addColorStop(0, 'rgba(184,196,164,0.18)');
  halo.addColorStop(.5, 'rgba(98,126,112,0.08)');
  halo.addColorStop(1, 'rgba(30,48,40,0)');
  context.fillStyle = halo; context.beginPath(); context.arc(0, 0, radius * 1.18, 0, Math.PI * 2); context.fill();

  // 2. Refined Sphere Material: Rich, muted forest-green & dark sage-teal (depth without heavy blackness)
  const sphereGrad = context.createRadialGradient(-radius * .32, -radius * .35, radius * .04, 0, 0, radius * 1.01);
  sphereGrad.addColorStop(0, '#4a6558');     // Gentle natural sage highlight
  sphereGrad.addColorStop(.35, '#2e473d');   // Sophisticated academic forest green
  sphereGrad.addColorStop(.75, '#1e322a');   // Soft deep teal-forest
  sphereGrad.addColorStop(1, '#162520');     // Realistic sphere limb shadow (not harsh black)
  context.fillStyle = sphereGrad; context.beginPath(); context.arc(0, 0, radius, 0, Math.PI * 2); context.fill();

  // 3. Subtle, whisper-thin latitude & longitude graticule (thinner, understated)
  context.lineWidth = .5; context.strokeStyle = 'rgba(215,224,204,0.11)';
  for (let lat = -60; lat <= 60; lat += 30) { context.beginPath(); let drawing = false; for (let lon = -180; lon <= 180; lon += 3) { const p = project(lat, lon); if (p.z > 0) { if (!drawing) context.moveTo(p.x * radius, p.y * radius); else context.lineTo(p.x * radius, p.y * radius); drawing = true; } else drawing = false; } context.stroke(); }
  for (let lon = 0; lon < 360; lon += 30) { context.beginPath(); let drawing = false; for (let lat = -90; lat <= 90; lat += 3) { const p = project(lat, lon); if (p.z > 0) { if (!drawing) context.moveTo(p.x * radius, p.y * radius); else context.lineTo(p.x * radius, p.y * radius); drawing = true; } else drawing = false; } context.stroke(); }

  // 4. Continent dots: Restrained soft ivory / muted champagne with gentle 3D depth fade
  landPoints.forEach(([lat, lon]) => {
    const p = project(lat, lon);
    if (p.z < 0) return;
    const alpha = .30 + p.z * .65;
    context.fillStyle = `rgba(238,242,228,${alpha})`;
    context.beginPath(); context.arc(p.x * radius, p.y * radius, Math.max(.65, radius * .0048 * (.85 + p.z * .3)), 0, Math.PI * 2); context.fill();
  });

  // 5. Restrained satin rim edge (smooth natural feather into background)
  const rimGrad = context.createLinearGradient(-radius * .8, -radius * .8, radius * .8, radius * .8);
  rimGrad.addColorStop(0, 'rgba(215,226,205,0.40)');
  rimGrad.addColorStop(.55, 'rgba(148,168,154,0.20)');
  rimGrad.addColorStop(1, 'rgba(30,48,40,0.35)');
  context.strokeStyle = rimGrad;
  context.lineWidth = 0.9;
  context.beginPath(); context.arc(0, 0, radius, 0, Math.PI * 2); context.stroke();

  drawGlobeMarkers(radius, cx, cy); context.restore();
}
function updateMotionButton() { motionButton.textContent = rotating ? 'Ⅱ' : '▷'; motionButton.setAttribute('aria-label', rotating ? 'Pause globe rotation' : 'Resume globe rotation'); }
motionButton.addEventListener('click', () => { rotating = !rotating; updateMotionButton(); });
reducedMotion.addEventListener('change', event => { rotating = !event.matches; updateMotionButton(); });

let pointerDownPos = { x: 0, y: 0, time: 0 };
function getHitMarker(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left, y = clientY - rect.top;
  const match = markerHitBoxes.find(box => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
  return match ? match.marker : null;
}
function isJaipurHit(clientX, clientY) {
  const m = getHitMarker(clientX, clientY);
  return !!(m && m.home);
}

// Global pointer events so hovering over any icon zooms it and gives visual feedback
window.addEventListener('pointermove', event => {
  if (!globeVisible) return;
  const m = getHitMarker(event.clientX, event.clientY);
  const changed = (hoveredMarker?.label !== m?.label);
  hoveredMarker = m;
  document.body.style.cursor = m ? 'pointer' : '';
  if (changed) {
    drawGlobe();
  }
});

// Direct click handler so tapping or clicking Jaipur opens the official partnership page
window.addEventListener('click', event => {
  if (event.target.closest('a, button, input, textarea, select, dialog, .dialog-close, [role="button"]')) {
    return;
  }
  if (isJaipurHit(event.clientX, event.clientY)) {
    window.open(JAIPUR_URL, '_blank', 'noopener,noreferrer');
  }
});

window.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  if (event.target.closest('a, button, input, textarea, select, dialog, .dialog-close, [role="button"]')) {
    return;
  }
  pointerDownPos = { x: event.clientX, y: event.clientY, time: Date.now() };
  if (getHitMarker(event.clientX, event.clientY)) {
    dragging = false;
    return;
  }
  if (event.target === canvas || event.target === document.body || event.target.classList?.contains('hero') || event.target.classList?.contains('world-background')) {
    dragging = true;
    lastPointerX = event.clientX;
    try { canvas.setPointerCapture(event.pointerId); } catch { }
  }
});

canvas.addEventListener('pointermove', event => {
  if (dragging) {
    angle += (event.clientX - lastPointerX) * .008;
    lastPointerX = event.clientX;
    drawGlobe();
  }
});

window.addEventListener('pointerup', event => {
  if (event.button !== 0) return;
  const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
  const elapsed = Date.now() - pointerDownPos.time;
  if (dist < 10 && elapsed < 600 && !event.target.closest('a, button, input, textarea, select, dialog, .dialog-close, [role="button"]') && isJaipurHit(event.clientX, event.clientY)) {
    window.open(JAIPUR_URL, '_blank', 'noopener,noreferrer');
  }
  if (dragging) {
    try { canvas.releasePointerCapture(event.pointerId); } catch { }
  }
  dragging = false;
});

['pointercancel', 'lostpointercapture'].forEach(type => canvas.addEventListener(type, () => { dragging = false; }));
canvas.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); angle += event.key === 'ArrowLeft' ? -.15 : .15; drawGlobe(); } });
new ResizeObserver(resizeGlobe).observe(canvas);
new IntersectionObserver(entries => { globeVisible = entries[0].isIntersecting; }).observe(canvas);
let animationFrame = 0;
function animateGlobe(time) {
  animationFrame = 0;
  if (!rotating || document.hidden) return;
  const delta = time - lastFrame;
  if (delta >= (canvasWidth <= 780 ? 1000 / 30 : 1000 / 60)) {
    lastFrame = time;
    if (!dragging && globeVisible) { angle += Math.min(delta, 65) * .000065; drawGlobe(); }
  }
  animationFrame = requestAnimationFrame(animateGlobe);
}
function syncAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0; lastFrame = performance.now();
  if (rotating && !document.hidden) animationFrame = requestAnimationFrame(animateGlobe);
}
motionButton.addEventListener('click', syncAnimation);
reducedMotion.addEventListener('change', syncAnimation);
document.addEventListener('visibilitychange', syncAnimation);
updateMotionButton(); syncAnimation();
