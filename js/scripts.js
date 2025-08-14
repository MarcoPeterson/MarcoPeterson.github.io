/* =========================================================
   Matrix 0/1 Rain (NO TRAILS, DENSE, SLOW)
   Works anywhere as long as a <canvas id="bg-canvas"> exists.
   ========================================================= */
(function initMatrix(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  // ---- Tunables ----
  let fontSize = 18;                  // 0/1 glyph size in CSS pixels
  const densityBoost = 0.70;          // < 1.0 => MORE columns (0.70 ≈ +43%)
  const baseSpeed = 0.06;             // very slow descent
  const varSpeed  = 0.06;             // slight per-column randomness

  // Only 0/1 characters, repeated to avoid string bounds branching
  const chars = "0101010101001010010110010101010010100101100101";

  // Matrix green from CSS variable (fallback if missing)
  const cssMatrix = getComputedStyle(document.documentElement)
                      .getPropertyValue('--matrix').trim();
  const color = cssMatrix || '#00FF41';

  let W, H, columns, drops, speeds;

  function resize(){
    // Draw using CSS pixels while keeping a high-res canvas for HiDPI
    const ratio = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * ratio);
    H = canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    // More columns by using a smaller effective column width
    const colWidth = fontSize * densityBoost;
    columns = Math.max(1, Math.ceil(window.innerWidth / colWidth));

    // Each column has its own vertical position and speed
    drops  = Array.from({length: columns}, () => -Math.random() * 40);
    speeds = Array.from({length: columns}, () => baseSpeed + Math.random() * varSpeed);

    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
  }

  function draw(){
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ****** NO TRAILS: clear every frame ******
    ctx.clearRect(0, 0, W, H);

    const colWidth = fontSize * densityBoost;

    for (let i = 0; i < columns; i++){
      const x = Math.floor(i * colWidth);
      const y = drops[i] * fontSize;

      // One crisp glyph per column
      const ch = chars.charAt((Math.random() * chars.length) | 0);
      ctx.fillText(ch, x, y);

      // Wrap with slight randomness
      if (y > H && Math.random() > 0.98) {
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
