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

/* ================== MATRIX CODE RAIN (crisp 0/1 with light trail) ==================
   - No glow, no page darkening, no stripes
   - Head + short tail made of actual digits with decreasing alpha
   - Slower streams
=============================================================================== */
(function matrix(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  // Tunables
  const fontSize   = 18;        // px
  const tailLen    = 8;         // number of trailing digits
  const baseSpeed  = 0.05;      // slow
  const varSpeed   = 0.03;      // slight randomness
  const headAlpha  = 1.0;       // head brightness
  const tailAlpha0 = 0.75;      // first tail digit alpha (then decays)
  const digits     = ['0','1'];
  const colorHex   = getComputedStyle(document.documentElement)
                      .getPropertyValue('--matrix').trim() || '#00FF41';

  // Convert hex to rgb for alpha blending
  function hexToRgb(hex){
    const c = hex.replace('#','');
    const s = c.length === 3 ? c.split('').map(v=>v+v).join('') : c;
    return {
      r: parseInt(s.slice(0,2),16),
      g: parseInt(s.slice(2,4),16),
      b: parseInt(s.slice(4,6),16)
    };
  }
  const rgb = hexToRgb(colorHex);

  let W, H, columns, yPos, speeds;

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * ratio);
    H = canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    columns = Math.ceil(window.innerWidth / fontSize);
    yPos    = Array.from({length: columns}, () => -Math.random() * 40);
    speeds  = Array.from({length: columns}, () => baseSpeed + Math.random() * varSpeed);
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Start fresh each frame -> no glow/stripes
    ctx.clearRect(0, 0, W, H);

    for (let col = 0; col < columns; col++){
      const headY = yPos[col];

      // draw head
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${headAlpha})`;
      ctx.fillText(digits[(Math.random()*2)|0], col*fontSize, headY*fontSize);

      // draw tail (decreasing alpha, discrete digits)
      for (let t = 1; t <= tailLen; t++){
        const y = (headY - t) * fontSize;
        if (y < -fontSize) break;
        const a = Math.max(tailAlpha0 * (1 - t/(tailLen+1)), 0);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
        ctx.fillText(digits[(Math.random()*2)|0], col*fontSize, y);
      }

      // advance
      const py = headY * fontSize;
      if (py > H && Math.random() > 0.985){
        yPos[col]  = -Math.random() * 20;
        speeds[col] = baseSpeed + Math.random() * varSpeed;
      } else {
        yPos[col] += speeds[col];
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();
