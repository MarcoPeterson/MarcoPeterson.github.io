/*!
* Start Bootstrap - Resume v7.0.4
* MIT License
*/
window.addEventListener('DOMContentLoaded', () => {
  // Activate Bootstrap scrollspy on the main nav element
  const sideNav = document.body.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, { target: '#sideNav', offset: 74 });
  }

  // Collapse responsive navbar when toggler is visible (mobile)
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(document.querySelectorAll('#navbarResponsive .nav-link'));
  responsiveNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') navbarToggler.click();
    });
  });
});

/* ================== Matrix 0/1 Streams (slow, behind content, dim over text) ================== */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d', { alpha: true });
  const DPR  = Math.max(1, window.devicePixelRatio || 1);

  // Visual tuning
  const CELL       = 18;          // font size + column width
  const TAIL       = 14;          // number of glyphs per column (vertical line)
  const SPD_MIN    = 70;          // px/sec  (was 28)  -> 1.5× faster
  const SPD_MAX    = 100;        // px/sec  (was 55)  -> 1.5× faster
  const SWITCH_MIN = 1400;        // ms between 0↔1 toggle at head (slower)
  const SWITCH_MAX = 2800;

  const COLOR      = [0, 255, 65];  // Matrix green
  const HEAD_A     = 0.95;          // head alpha
  const TRAIL_A0   = 0.18;          // first trail alpha (light)
  const TRAIL_DA   = 0.012;         // alpha falloff per glyph

  let W, H, COLS, streams = [];
  let lastT = performance.now();
  let contentRectCss = null; // updated on resize/scroll

  function cssSize(el){ return { w: el.clientWidth, h: el.clientHeight }; }

  function updateContentRect(){
    const container = document.querySelector('.container-fluid');
    if (!container) return;
    const r = container.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    // Convert to canvas CSS coordinates
    contentRectCss = {
      left:  r.left  - c.left,
      top:   r.top   - c.top,
      right: r.right - c.left,
      bottom:r.bottom- c.top
    };
  }

  function layout(){
    const { w, h } = cssSize(canvas);
    W = canvas.width  = Math.max(1, Math.floor(w * DPR));
    H = canvas.height = Math.max(1, Math.floor(h * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    COLS = Math.ceil(w / CELL);
    streams = new Array(COLS).fill(0).map((_, i) => ({
      x: i * CELL + CELL/2,
      y: -Math.random() * h,
      speed: SPD_MIN + Math.random() * (SPD_MAX - SPD_MIN),
      // head value toggles slowly; entire stream alternates 0/1 downwards
      headVal: Math.random() < 0.5 ? 0 : 1,
      lastSwitch: performance.now(),
      switchEvery: SWITCH_MIN + Math.random() * (SWITCH_MAX - SWITCH_MIN),
    }));

    ctx.font = `${CELL}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    updateContentRect();
  }

  function dimFactor(x, y){
    // reduce visibility over the resume content so text is readable
    if (!contentRectCss) return 1;
    if (x >= contentRectCss.left && x <= contentRectCss.right &&
        y >= contentRectCss.top  && y <= contentRectCss.bottom) {
      return 0.35; // dim inside content area
    }
    return 1;
  }

  function frame(t){
    const dt = Math.min(120, t - lastT) / 1000; // seconds
    lastT = t;

    // Clear completely so no residue/afterglow remains
    ctx.clearRect(0, 0, W, H);

    const cssH = canvas.clientHeight;

    streams.forEach(s => {
      // slow 0↔1 toggling at the head only
      if (t - s.lastSwitch > s.switchEvery){
        s.headVal = s.headVal ? 0 : 1;
        s.lastSwitch = t;
        s.switchEvery = SWITCH_MIN + Math.random() * (SWITCH_MAX - SWITCH_MIN);
      }

      // advance head
      s.y += s.speed * dt;

      // wrap
      if (s.y > cssH + TAIL * CELL){
        s.y = -Math.random() * cssH;
      }

      // Draw from head downward (alternating 0/1 vertically)
      for (let k = 0; k < TAIL; k++){
        const y = s.y - k * CELL;
        if (y < -CELL || y > cssH + CELL) continue;

        const val = ((s.headVal + k) % 2); // 0/1 alternating by row
        const baseAlpha = k === 0 ? HEAD_A : Math.max(0, TRAIL_A0 - k * TRAIL_DA);
        const alpha = baseAlpha * dimFactor(s.x, y);

        if (alpha <= 0.001) continue;

        ctx.shadowColor = `rgba(${COLOR.join(',')},${k===0?0.5:0})`;
        ctx.shadowBlur  = k===0 ? 6 : 0;
        ctx.fillStyle   = `rgba(${COLOR.join(',')},${alpha})`;
        ctx.fillText(val.toString(), s.x, y);
      }
    });

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { layout(); });
  window.addEventListener('scroll',  () => { updateContentRect(); });
  layout();
  requestAnimationFrame(frame);
})();
