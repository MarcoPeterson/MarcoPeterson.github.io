/*!
* Start Bootstrap - Resume v7.0.4
* MIT License
*/
window.addEventListener('DOMContentLoaded', () => {
  // Scrollspy
  const sideNav = document.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, { target: '#sideNav', offset: 74 });
  }

  // Collapse responsive navbar when a link is clicked (mobile only)
  const navbarToggler = document.querySelector('.navbar-toggler');
  document.querySelectorAll('#navbarResponsive .nav-link').forEach((el) => {
    el.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') navbarToggler.click();
    });
  });
});

/* ================== MATRIX CODE RAIN (classic) ==================
   - characters: 0 and 1 only
   - slow columns with soft trails (like the movie)
   - dense vertical streams
   - ALWAYS behind content (canvas z-index handled in CSS)
================================================================= */
(function matrix(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // Tuning knobs
  const fontSize   = 18;        // glyph size in CSS px
  const fadeAlpha  = 0.06;      // trail strength (lower = longer trails)
  const baseSpeed  = 0.035;     // very slow
  const varSpeed   = 0.03;      // small randomness per column
  const chars      = ['0','1'];
  const color      = getComputedStyle(document.documentElement)
                      .getPropertyValue('--matrix').trim() || '#00FF41';

  // State
  let W, H, columns, drops, speeds;

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * ratio);
    H = canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    columns = Math.ceil(window.innerWidth / fontSize);
    drops   = Array.from({length: columns}, () => -Math.random() * 60);
    speeds  = Array.from({length: columns}, () => baseSpeed + Math.random() * varSpeed);
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // fade to black for trails
    ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
    ctx.fillRect(0, 0, W, H);

    // draw digits
    ctx.fillStyle = color;
    for (let i = 0; i < columns; i++){
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const ch = chars[(Math.random() * 2) | 0];   // 0 or 1
      ctx.fillText(ch, x, y);

      // reset after off-screen
      if (y > H && Math.random() > 0.985) {
        drops[i]  = -Math.random() * 20;
        speeds[i] = baseSpeed + Math.random() * varSpeed;
      } else {
        drops[i] += speeds[i];
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
