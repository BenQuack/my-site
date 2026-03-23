/**
 * about.js  —  About page (about.html) only
 *
 * Responsibilities:
 *   1. Populate the underwater scene with bubbles and seaweed
 *   2. Wire the back button to return to index.html
 */


/* =============================================================
   Element references
   ============================================================= */
const underwaterPage = document.getElementById('underwater-page');
const backBtn        = document.getElementById('back-btn');


/* =============================================================
   Dynamic DOM — Bubbles
   Spawned at random horizontal positions; each rises at a
   different speed so they never all move together.
   ============================================================= */
(function buildBubbles() {
  for (let i = 0; i < 18; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = 4 + Math.random() * 14;

    bubble.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `bottom:${-size}px`,                        /* start just below the viewport */
      `left:${5 + Math.random() * 90}%`,
      `animation-duration:${6 + Math.random() * 10}s`,
      `animation-delay:${-Math.random() * 14}s`,  /* negative delay = already mid-rise on load */
    ].join(';');

    underwaterPage.appendChild(bubble);
  }
})();


/* =============================================================
   Dynamic DOM — Seaweed
   Strands are anchored to the bottom edge and sway on staggered
   timings so they feel organic rather than synchronised.
   ============================================================= */
(function buildSeaweed() {
  for (let i = 0; i < 8; i++) {
    const weed = document.createElement('div');
    weed.className = 'seaweed';

    weed.style.cssText = [
      `left:${3 + i * 13}%`,
      `height:${50 + Math.random() * 80}px`,
      `animation-duration:${3 + Math.random() * 4}s`,
      `animation-delay:${-Math.random() * 5}s`,
    ].join(';');

    underwaterPage.appendChild(weed);
  }
})();


/* =============================================================
   Back button — return to homepage
   ============================================================= */
backBtn.addEventListener('click', () => {
  window.location.href = 'home.html';
});
