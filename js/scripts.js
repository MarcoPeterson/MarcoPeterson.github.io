/*!
* Start Bootstrap - Resume base helpers (scrollspy + collapse)
*/
window.addEventListener('DOMContentLoaded', () => {
  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      offset: 80,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.forEach((responsiveNavItem) => {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });
});

/* =========================================================
   Matrix 0/1 code rain with light trails (no background dim)
   - Skips the left sidebar area
   - Slightly reduces brightness across the resume area
   - Columns show alternating 0/1 vertically
   ========================================================= */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const MATRIX_COLOR = getComputedStyle(document.documentElement)
                        .getPropertyValue('--matrix').trim() || '#00FF41';

  // Speed & trail controls (tuned to be a bit faster)
  const FONT_SIZE = 18;          // glyph size
  const SPEED_MIN = 0.16;        // min rows/frame
  const SPEED_VAR = 0.10;        // variability
  const TRAIL_LEN = 10;          // number of trailing glyphs to draw

  let W=0, H=0, DPR=1;
  let columns = 0;
  let drops = [];                // current row index (float) per column
  let speeds = [];               // speed per column
  let trails = [];               // array of arrays of previous rows per column

  let sidebarRect = {x:0,y:0,w:0,h:0};
  let contentRect = {x:0,y:0,w:0,h:0};

  function hexToRgb(hex){
    const c = hex.replace('#','');
    const b = c.length === 3 ? c.split('').map(v=>v+v).join('') : c;
    return [parseInt(b.substr(0,2),16), parseInt(b.substr(2,2),16), parseInt(b.substr(4,2),16)];
  }
  const [mr, mg, mb] = hexToRgb(MATRIX_COLOR);

  function computeRects(){
    const sn = document.getElementById('sideNav');
    if (sn){
      const r = sn.getBoundingClientRect();
      sidebarRect = { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    const cont = document.querySelector('.container-fluid');
    if (cont){
      const r = cont.getBoundingClientRect();
      contentRect = { x: r.left, y: r.top, w: r.width, h: r.height };
    }
  }

  function resize(){
    DPR = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * DPR);
    H = canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width  = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    columns = Math.ceil(window.innerWidth / FONT_SIZE);
    drops = new Array(columns).fill(0).map(() => -Math.random() * 60);
    speeds = new Array(columns).fill(0).map(() => SPEED_MIN + Math.random() * SPEED_VAR);
    trails = new Array(columns).fill(0).map(() => []);

    ctx.font = `${FONT_SIZE}px monospace`;

    computeRects();
  }

  function insideRect(x, y, r){
    return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  }

  function drawGlyph(g, x, y, alpha){
    ctx.fillStyle = `rgba(${mr},${mg},${mb},${alpha})`;
    ctx.fillText(g, x, y);
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Clear fully each frame to avoid background tinting
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i<columns; i++){
      const colX = i * FONT_SIZE;
      let rowFloat = drops[i];
      const y = rowFloat * FONT_SIZE;

      // compute mask: skip drawing over the sidebar
      const approxCanvasX = colX;           // already in CSS pixels because we set transform
      const approxCanvasY = y;

      // add new head position to trail buffer (store integer row)
      const headRow = Math.floor(rowFloat);
      trails[i].unshift(headRow);
      if (trails[i].length > TRAIL_LEN) trails[i].pop();

      // draw trail from head -> older, with fading alpha
      for (let t = 0; t < trails[i].length; t++){
        const drawRow = trails[i][t];
        const drawY = drawRow * FONT_SIZE;

        const px = colX;
        const py = drawY;

        // Skip if inside sidebar rect
        if (insideRect(px, py, sidebarRect)) continue;

        // Character alternates 0/1 down the column
        const ch = (drawRow % 2 === 0) ? '0' : '1';

        // Base alpha by trail age (head brightest)
        let alpha = 1 - (t / TRAIL_LEN);        // 1 .. ~0
        alpha = Math.max(alpha, 0.08);

        // De-emphasize over the resume content area slightly
        if (insideRect(px, py, contentRect)) {
          alpha *= 0.35; // much lighter over text
        }

        drawGlyph(ch, px, py, alpha);
      }

      // advance this column
      drops[i] += speeds[i];

      // when the tail is well off-screen, restart above the top
      const tailBottomY = (trails[i][trails[i].length - 1] || headRow) * FONT_SIZE;
      if (tailBottomY > window.innerHeight + (TRAIL_LEN * FONT_SIZE)) {
        drops[i] = -Math.random() * 40;                        // restart a bit above
        speeds[i] = SPEED_MIN + Math.random() * SPEED_VAR;     // new speed
        trails[i] = [];
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
  });
  window.addEventListener('scroll', computeRects);

  // init
  resize();
  requestAnimationFrame(draw);
})();
