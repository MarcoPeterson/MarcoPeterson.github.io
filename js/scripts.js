/*!
* Start Bootstrap - Resume v7.0.4
* MIT License
*/
window.addEventListener('DOMContentLoaded', () => {
  const sideNav = document.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      offset: 80,
    });
  }

  const navbarToggler = document.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map((item) => {
    item.addEventListener('click', () => {
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

  // Tunables (faster fall)
  let fontSize = 18;
  const trailLen = 12;
  let baseSpeed = 0.34;     // ↑ faster
  let varSpeed  = 0.20;     // ↑ variability
  const color   = [0, 255, 65];

  // Layout
  let W = 0, H = 0, columns = 0, drops = [];
  let skipLeft = 0;
  let contentBounds = { left: 0, right: 0 };

  function updateBounds(){
    const ratio = window.devicePixelRatio || 1;
    canvas.width  = Math.floor(window.innerWidth  * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    W = window.innerWidth;
    H = window.innerHeight;

    // keep off the left pane
    const side = document.getElementById('sideNav');
    skipLeft = side ? Math.ceil(side.getBoundingClientRect().right) : 0;

    // content bounds to dim rain over resume text
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

    ctx.clearRect(0, 0, W, H);

    // keep dim region accurate
    const wrap = document.querySelector('.page-wrapper');
    if (wrap){
      const r2 = wrap.getBoundingClientRect();
      contentBounds.left  = Math.floor(r2.left);
      contentBounds.right = Math.floor(r2.right);
    }

    for (let i = 0; i < columns; i++){
      const x = skipLeft + i * fontSize;

      const overContent = (x >= contentBounds.left && x <= contentBounds.right);
      const dimFactor = overContent ? 0.35 : 1.0;

      // vertical stack (head + light trail)
      for (let k = 0; k < trailLen; k++){
        const y = (drops[i] - k) * fontSize;
        if (y < -fontSize || y > H) continue;

        const ch = ((Math.floor(drops[i]) - k) % 2 === 0) ? '0' : '1';
        const alpha = Math.max(0, 1 - k/(trailLen + 2)) * dimFactor;

        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        ctx.fillText(ch, x, y);
      }

      drops[i] += baseSpeed + Math.random() * varSpeed;
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
