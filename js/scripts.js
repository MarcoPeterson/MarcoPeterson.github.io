/*!
* Start Bootstrap - Resume v7.0.4
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

/* ================== Code Rain Background ================== */
(function(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, columns, drops, fontSize = 16, mouseX = null;
  const chars = "01";
  const brand = getComputedStyle(document.documentElement)
                  .getPropertyValue('--brand').trim() || '#0d6efd';

  function hexToRgb(hex){
    const c = hex.replace('#','');
    const b = c.length === 3 ? c.split('').map(v=>v+v).join('') : c;
    return [parseInt(b.substr(0,2),16), parseInt(b.substr(2,2),16), parseInt(b.substr(4,2),16)].join(',');
  }
  const brandRgb = hexToRgb(brand);

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    W = canvas.width  = Math.floor(window.innerWidth  * ratio);
    H = canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    columns = Math.ceil(window.innerWidth / fontSize);
    drops = new Array(columns).fill(Math.random() * -20);
    ctx.font = `${fontSize}px monospace`;
  }

  function draw(){
    // Respect reduce motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // trailing fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < columns; i++){
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // brighten near cursor
      let glow = 0.6;
      if (mouseX !== null){
        const colX = i * fontSize;
        const d = Math.abs(colX - mouseX);
        glow = Math.max(0.6, 1.2 - Math.min(d / 180, 1));
      }

      ctx.fillStyle = `rgba(${brandRgb}, ${glow})`;
      ctx.fillText(text, x, y);

      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += (1 + Math.random() * 0.9);
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouseX = e.clientX; });
  window.addEventListener('mouseleave', () => { mouseX = null; });

  resize();
  requestAnimationFrame(draw);
})();
