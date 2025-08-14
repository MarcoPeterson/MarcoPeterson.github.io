/*!
* Start Bootstrap - Resume v7.0.4
* MIT License
*/
window.addEventListener('DOMContentLoaded', () => {
  // Scrollspy
  const sideNav = document.querySelector('#sideNav');
  if (sideNav) new bootstrap.ScrollSpy(document.body, { target: '#sideNav', offset: 74 });

  // Collapse responsive navbar when a link is clicked (mobile only)
  const navbarToggler = document.querySelector('.navbar-toggler');
  document.querySelectorAll('#navbarResponsive .nav-link').forEach((el) => {
    el.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') navbarToggler.click();
    });
  });
});

/* ================== MATRIX CODE RAIN ==================
   - Digits: '0' and '1' only
   - Light trail (no page darkening): fade by ERASE
   - Slow columns, dense streams
======================================================= */
(function matrix(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // Tunables
  const fontSize  = 18;        // glyph size (px)
  const fadeAmt   = 0.08;      // trail strength (higher = shorter trail)
  const baseSpeed = 0.03;      // slow
  const varSpeed  = 0.03;      // slight random
  const digits    = ['0','1'];
  const color     = getComputedStyle(document.documentElement)
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

    // ERASE to create trails without darkening the page
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${fadeAmt})`;
    ctx.fillRect(0, 0, W, H);

    // Now draw fresh digits on top
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;

    for (let i = 0; i < columns; i++){
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const ch = digits[(Math.random() * 2) | 0]; // '0' or '1'
      ctx.fillText(ch, x, y);

      if (y > H && Math.random() > 0.985) {       // reset off-screen
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
