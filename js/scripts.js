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

/* ================== Matrix Code Rain (NO TRAILS) ==================
   Requirements you asked for:
   - very slow fall
   - crisp (no ghost trails)
   - rows alternate: even rows use "0", odd rows use "11"
   - lots of digits visible
=================================================================== */
(function initMatrix(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  // Tunables
  let fontSize = 18;           // glyph size (CSS pixels)
  const baseSpeed = 0.03;      // VERY slow
  const varSpeed  = 0.04;      // slight randomness

  // Color (Matrix green from CSS variable)
  const cssMatrix = getComputedStyle(document.documentElement)
                      .getPropertyValue('--matrix').trim();
  const color = cssMatrix || '#00FF41';

  // State
  let W, H, columns, drops, speeds, colWidth, rowHeight, charW;

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * ratio);
    H = canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    charW = Math.max(9, ctx.measureText('0').width); // width of one char
    colWidth = charW * 0.9;                          // slightly denser than strict grid
    rowHeight = Math.floor(fontSize * 1.12);         // vertical spacing

    columns = Math.max(1, Math.ceil(window.innerWidth / colWidth));
    drops   = Array.from({length: columns}, () => -Math.random() * 40);
    speeds  = Array.from({length: columns}, () => baseSpeed + Math.random() * varSpeed);
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // NO TRAILS: clear each frame
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;

    for (let i = 0; i < columns; i++){
      const x = Math.floor(i * colWidth);
      const rowIndex = drops[i] | 0;              // current integer row
      const y = rowIndex * rowHeight;

      // Alternate rows: even -> "0", odd -> "11"
      if ((rowIndex & 1) === 0) {
        ctx.fillText('0', x, y);
      } else {
        // Draw a tight "11" that fits in one column width
        ctx.fillText('1', x, y);
        ctx.fillText('1', x + charW * 0.65, y);
      }

      // Wrap/reset with a little randomness after leaving screen
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
