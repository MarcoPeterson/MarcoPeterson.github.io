/*!
* Start Bootstrap - Resume v7.0.4
* MIT License
*/
window.addEventListener('DOMContentLoaded', event => {
  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });
});

/* ================== Code Rain Background (Matrix) ================== */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, columns, drops;
  let fontSize = 18;                     // slightly larger glyphs
  const chars = "01";
  const matrix = getComputedStyle(document.documentElement)
                   .getPropertyValue('--matrix').trim() || '#00FF41';

  // DRAMATIC slow-down controls
  const baseSpeed = 0.12;                // << super slow
  const varSpeed  = 0.10;                // randomness around base
  const trailFade = 0.06;                // lower = longer trails

  function hexToRgb(hex){
    const c = hex.replace('#','');
    const b = c.length === 3 ? c.split('').map(v=>v+v).join('') : c;
    return [parseInt(b.substr(0,2),16), parseInt(b.substr(2,2),16), parseInt(b.substr(4,2),16)].join(',');
  }
  const matrixRgb = hexToRgb(matrix);

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * ratio);
    H = canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    columns = Math.ceil(window.innerWidth / fontSize);
    // start many streams off-screen for staggered entry
    drops = new Array(columns).fill(0).map(() => -Math.random() * 80);
    ctx.font = `${fontSize}px monospace`;
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // trailing fade
    ctx.fillStyle = `rgba(0, 0, 0, ${trailFade})`;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < columns; i++){
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = `rgba(${matrixRgb}, 0.95)`;
      ctx.fillText(text, x, y);

      // reset stream occasionally after it leaves the screen
      if (y > H && Math.random() > 0.995) drops[i] = -Math.random() * 20;

      // VERY SLOW descent
      drops[i] += baseSpeed + Math.random() * varSpeed; // ~0.12–0.22 px per frame
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
