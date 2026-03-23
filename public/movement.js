/**
 * movement.js  —  Homepage (index.html) only
 *
 * Responsibilities:
 *   1. Shooting star canvas animation while hovering the sky
 *   2. Navigate to projects.html when sky is clicked
 *      → zoom from the sky's anchor point so the camera appears to rise
 *   3. Navigate to about.html when ocean is clicked
 *      → zoom from the ocean's anchor point so the camera appears to descend
 */


/* =============================================================
   Element references
   ============================================================= */
const scene = document.getElementById('scene');
const sky   = document.getElementById('sky');
const ocean = document.getElementById('ocean');


/* =============================================================
   Shooting stars — canvas
   A <canvas> inside #sky is painted every frame via
   requestAnimationFrame. Using canvas (rather than DOM divs)
   avoids compositor artefacts where overlapping elements meet.
   ============================================================= */
const canvas = document.getElementById('sky-canvas');
const ctx    = canvas.getContext('2d');

/** Active shooter particles. Each is { x, y, dx, dy, len, life, dur } */
let shooters = [];

/** Tracks whether the pointer is over the sky (controls spawning) */
let isHoveringSky  = false;
let shootInterval  = null;

/** Match canvas pixel size to the sky element's rendered size */
function resizeCanvas() {
  canvas.width  = sky.offsetWidth;
  canvas.height = sky.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/**
 * Add one shooting star to the active list.
 * Stars travel on a shallow downward diagonal (20–45°).
 */
function spawnShooter() {
  const angle = (20 + Math.random() * 25) * Math.PI / 180;
  const speed = 500 + Math.random() * 300;  /* px / second */
  const len   = 120 + Math.random() * 160;  /* trail length px */

  shooters.push({
    x:    Math.random() * canvas.width  * 0.85,
    y:    Math.random() * canvas.height * 0.55,
    dx:   Math.cos(angle) * speed,
    dy:   Math.sin(angle) * speed,
    len,
    life: 0,
    dur:  len / speed + 0.15,   /* total lifetime in seconds */
  });
}

/** Render loop — runs every frame whether or not any stars are active */
let lastTime = null;

function renderShooters(ts) {
  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000;  /* delta in seconds */
  lastTime  = ts;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = shooters.length - 1; i >= 0; i--) {
    const s = shooters[i];
    s.life += dt;

    const t = s.life / s.dur;
    if (t >= 1) { shooters.splice(i, 1); continue; }

    /* Current head position */
    const headX = s.x + s.dx * s.life;
    const headY = s.y + s.dy * s.life;

    /* Tail trails behind; grows to full length then holds */
    const trailFrac = Math.min(t * 4, 1);
    const ang  = Math.atan2(s.dy, s.dx);
    const tailX = headX - Math.cos(ang) * s.len * trailFrac;
    const tailY = headY - Math.sin(ang) * s.len * trailFrac;

    /* Fade in at birth, fade out near death */
    const alpha = t < 0.1 ? t / 0.1 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;

    const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
    grad.addColorStop(0,   `rgba(255,255,255,0)`);
    grad.addColorStop(0.7, `rgba(255,240,200,${alpha * 0.7})`);
    grad.addColorStop(1,   `rgba(255,255,255,${alpha})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1.2;
    ctx.stroke();
  }

  requestAnimationFrame(renderShooters);
}
requestAnimationFrame(renderShooters);

/* Spawn stars while hovering; stop when the pointer leaves */
sky.addEventListener('mouseenter', () => {
  isHoveringSky = true;
  spawnShooter();
  shootInterval = setInterval(() => {
    if (!isHoveringSky) return;
    spawnShooter();
    if (Math.random() > 0.5) spawnShooter();  /* occasional double */
  }, 650);
});

sky.addEventListener('mouseleave', () => {
  isHoveringSky = false;
  clearInterval(shootInterval);
  shootInterval = null;
});


/* =============================================================
   Scene zoom helpers

   Instead of combining scale() + translateY(), we anchor the
   zoom to a specific point on the scene using transform-origin.
   This guarantees the correct area fills the viewport:

     Sky  (top ~20%) → zoom origin near the top   → camera rises
     Ocean (bot ~80%) → zoom origin near the bottom → camera descends
   ============================================================= */

/** Duration (ms) to wait before navigating — should be less than the
 *  CSS transition duration (2.4s) so the page changes while fully zoomed */
const NAV_DELAY = 1600;

/**
 * Trigger the sky zoom (camera rising upward) then navigate.
 */
function zoomToSky() {
  /* Anchor zoom near the top of the scene so sky fills the frame */
  scene.style.transformOrigin = '50% 15%';
  scene.style.transform       = 'scale(8)';
  scene.style.filter          = 'blur(3px) brightness(0.3)';

  setTimeout(() => { window.location.href = 'projects.html'; }, NAV_DELAY);
}

/**
 * Trigger the ocean zoom (camera descending downward) then navigate.
 */
function zoomToOcean() {
  /* Anchor zoom near the bottom of the scene so ocean fills the frame */
  scene.style.transformOrigin = '50% 85%';
  scene.style.transform       = 'scale(8)';
  scene.style.filter          = 'blur(3px) brightness(0.3)';

  setTimeout(() => { window.location.href = 'about.html'; }, NAV_DELAY);
}


/* =============================================================
   Click handlers
   ============================================================= */

/* Prevent double-triggering once a transition has started */
let transitioning = false;

sky.addEventListener('click', () => {
  if (transitioning) return;
  transitioning = true;

  /* Stop spawning new stars mid-flight */
  isHoveringSky = false;
  clearInterval(shootInterval);
  shootInterval = null;

  zoomToSky();
});

ocean.addEventListener('click', () => {
  if (transitioning) return;
  transitioning = true;

  zoomToOcean();
});
