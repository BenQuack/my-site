/**
 * projects.js  —  Projects page (projects.html) only
 *
 * Responsibilities:
 *   1. Populate the space scene with twinkling star divs
 *   2. Wire the back button to return to index.html
 */


/* =============================================================
   Element references
   ============================================================= */
const backBtn = document.getElementById('back-btn');


/* =============================================================
   Dynamic DOM — Space stars
   220 divs are created with randomised sizes, positions and
   individual twinkle durations so the field feels alive.
   ============================================================= */
(function buildSpaceStars() {
  const container = document.getElementById('space-stars');

  for (let i = 0; i < 220; i++) {
    const star = document.createElement('div');
    star.className = 'space-star';

    const size = Math.random() * 2.5 + 0.4;

    star.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `top:${Math.random() * 100}%`,
      `left:${Math.random() * 100}%`,
      `animation-duration:${2 + Math.random() * 4}s`,
      `animation-delay:${-Math.random() * 6}s`,  /* start mid-cycle so stars don't all sync */
    ].join(';');

    container.appendChild(star);
  }
})();


/* =============================================================
   Back button — return to homepage with reverse zoom

   Applying the transform to document.body causes all position:fixed
   children to be carried along (a parent transform makes body their
   new containing block), so the entire scene zooms as one unit.

   The zoom origin is anchored near the bottom (toward Earth), which
   is the visual reverse of the upward launch from index.html.
   ============================================================= */
let returning = false;

backBtn.addEventListener('click', () => {
  if (returning) return;
  returning = true;

  /* Match the easing and scale used in movement.js for consistency */
  /* Scale DOWN toward a vanishing point — space shrinks away as the
     camera pulls back, the inverse of the scale(8) launch from index.html */
  document.body.style.transition = 'transform 2.4s cubic-bezier(0.76, 0, 0.24, 1), filter 2.4s ease';
  document.body.style.transformOrigin = '50% 50%';
  document.body.style.transform = 'scale(0.08)';
  document.body.style.filter   = 'blur(3px) brightness(0.3)';

  /* Navigate once the zoom has peaked — same delay as the outbound trip */
  setTimeout(() => {
    window.location.href = 'home.html';
  }, 1600);
});
