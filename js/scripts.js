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

  // Collapse responsive navbar when toggler is visible (mobile)
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

/* ================== Matrix 0/1 Rain (slow, behind content, off sidebar) ================== */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d', { alpha: true });
  const DPR  = Math.max(1, window.devicePixelRatio || 1);

  // Visual tuning
  const FONT_SIZE      = 16;        // px per column cell
  const TAIL_LEN       = 8;         // short/light trail
  const MIN_SPEED      = 30;        // px/sec
  const MAX_SPEED      = 60;        // px/sec
  const MIN_SWITCH_MS  = 900;       // slow 0↔1 flips
  const MAX_SWITCH_MS  = 1800;

  const GLYPH_COLOR    = [0, 255, 65];   // Matrix green
  const HEAD_ALPHA     = 0.95;           // head brightness
  const TRAIL_ALPHA_0  = 0.16;           // first trail element alpha
  const TRAIL_FALLOFF  = 0.02;           // alpha decrease per trail step

  let W, H, COLS, colW;
  let streams = [];
  let lastT = performance.now();

  function cssSize(el){ return { w: el.clientWidth, h: el.clientHeight }; }

  function layout(){
    // Match canvas pixels to its CSS box (CSS already moves it off the sidebar on desktop)
    const { w, h } = cssSize(canvas);
    W = canvas.width  = Math.max(1, Math.floor(w * DPR));
    H = canvas.height = Math.max(1, Math.floor(h * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    colW = FONT_SIZE;
    COLS = Math.ceil(w / colW);

    // Initialize columns
    streams = new Array(COLS).fill(0).map((_, i) => ({
      x: i * colW + colW / 2,           // center glyph in its cell
      y: -Math.random() * h,            // start above screen
      speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
      glyph: Math.random() < 0.5 ? '0' : '1',
      lastSwitch: performance.now(),
      switchEvery: MIN_SWITCH_MS + Math.random() * (MAX_SWITCH_MS - MIN_SWITCH_MS),
      trail: []
    }));

    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
  }

  function frame(t){
    const dt = Math.min(100, t - lastT) / 1000; // seconds
    lastT = t;

    // Full clear so the background never accumulates
    ctx.clearRect(0, 0, W, H);

    streams.forEach(s => {
      // slow independent 0↔1 switching
      if (t - s.lastSwitch > s.switchEvery){
        s.glyph = (s.glyph === '0') ? '1' : '0';
        s.lastSwitch = t;
        s.switchEvery = MIN_SWITCH_MS + Math.random() * (MAX_SWITCH_MS - MIN_SWITCH_MS);
      }

      // advance
      s.y += s.speed * dt;

      // wrap when below screen
      const cssH = canvas.clientHeight;
      if (s.y > cssH + TAIL_LEN * FONT_SIZE){
        s.y = -Math.random() * cssH;
        s.trail.length = 0;
      }

      // push head position and clamp the trail
      s.trail.push(s.y);
      if (s.trail.length > TAIL_LEN) s.trail.shift();

      // draw trail (older first; light)
      for (let i = 1; i < s.trail.length; i++){
        const yPos  = s.trail[s.trail.length - 1 - i];
        const alpha = Math.max(0, TRAIL_ALPHA_0 - i * TRAIL_FALLOFF);
        if (alpha <= 0) break;
        ctx.fillStyle = `rgba(${GLYPH_COLOR.join(',')},${alpha})`;
        ctx.fillText(s.glyph, s.x, yPos);
      }

      // draw head (slight glow)
      ctx.shadowColor = `rgba(${GLYPH_COLOR.join(',')},0.6)`;
      ctx.shadowBlur  = 6;
      ctx.fillStyle   = `rgba(${GLYPH_COLOR.join(',')},${HEAD_ALPHA})`;
      ctx.fillText(s.glyph, s.x, s.y);
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', layout);
  layout();
  requestAnimationFrame(frame);
})();
