/*!
* Start Bootstrap - Resume v7.0.4
* MIT License
*/
window.addEventListener('DOMContentLoaded', () => {
  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      offset: 80,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map((responsiveNavItem) => {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });
});

/* ================== Matrix Code Rain (0/1 columns) ================== */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.textBaseline = 'top';

  // Tunables
  let fontSize = 18;                 // glyph size
  const trailLen = 12;               // digits per column (visual trail)
  let baseSpeed = 0.22;              // a bit faster per your ask
  let varSpeed  = 0.12;              // randomness per column
  const color   = [0, 255, 65];      // matrix green

  // Layout
  let W = 0, H = 0, columns = 0, drops = [];
  let skipLeft = 0;                  // pixels to skip (left pane)
  let contentBounds = { left: 0, right: 0 }; // to dim over resume text

  function updateBounds(){
    const ratio = window.devicePixelRatio || 1;
    canvas.width  = Math.floor(window.innerWidth  * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);  // draw in CSS pixels
    W = window.innerWidth;
    H = window.innerHeight;

    // left pane width (don't draw under it)
    const side = document.getElementById('sideNav');
    if (side){
      const r = side.getBoundingClientRect();
      skipLeft = Math.ceil(r.right);
    } else {
      skipLeft = 0;
    }

    // content bounds to reduce visibility over text
    const wrap = document.querySelector('.page-wrapper');
    if (wrap){
      const r2 = wrap.getBoundingClientRect();
      contentBounds.left  = Math.floor(r2.left);
      contentBounds.right = Math.floor(r2.right);
    } else {
      contentBounds.left = skipLeft;
      contentBounds.right = W;
    }

    columns = Math.max(1, Math.floor((W - skipLeft) / fontSize));
    drops = new Array(columns).fill(0).map(() => -Math.random()*20);
    ctx.font = `${fontSize}px monospace`;
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Clear the canvas completely (we render our own trail as stacked digits)
    ctx.clearRect(0, 0, W, H);

    // recompute content bounds occasionally (small cost, keeps it correct)
    const wrap = document.querySelector('.page-wrapper');
    if (wrap){
      const r2 = wrap.getBoundingClientRect();
      contentBounds.left  = Math.floor(r2.left);
      contentBounds.right = Math.floor(r2.right);
    }

    for (let i = 0; i < columns; i++){
      const x = skipLeft + i * fontSize;

      // dim when over the resume column for readability
      const overContent = (x >= contentBounds.left && x <= contentBounds.right);
      const dimFactor = overContent ? 0.35 : 1.0;

      // draw a vertical stack of digits (head + fading tail)
      for (let k = 0; k < trailLen; k++){
        const y = (drops[i] - k) * fontSize;
        if (y < -fontSize || y > H) continue;

        // alternating 0/1 down the column
        const ch = ((Math.floor(drops[i]) - k) % 2 === 0) ? '0' : '1';

        // head brighter, tail fades
        const alpha = Math.max(0, 1 - k/(trailLen + 2)) * dimFactor;
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        ctx.fillText(ch, x, y);
      }

      // advance the column
      drops[i] += baseSpeed + Math.random() * varSpeed;

      // reset after fully off-screen + tail
      if (drops[i] * fontSize > H + trailLen * fontSize){
        drops[i] = -Math.random() * 20;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', updateBounds);
  updateBounds();
  requestAnimationFrame(draw);
})();
