/* =========================================================
   Снег + звёзды на <canvas>
   - рисуется спрайтом (быстро, без shadowBlur)
   - учитывает prefer-reduced-motion, ретину и ресайз
   - останавливается, когда вкладка не активна
   ========================================================= */

(function () {
  "use strict";

  const canvas = document.getElementById("sky");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rand = (min, max) => min + Math.random() * (max - min);

  let width = 0;
  let height = 0;
  let dpr = 1;
  let flakes = [];
  let stars = [];
  let rafId = null;
  let lastTime = 0;
  let elapsed = 0;

  /* ---------- мягкий спрайт снежинки ---------- */

  const sprite = (function makeSprite() {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;

    const s = c.getContext("2d");
    const half = size / 2;
    const gradient = s.createRadialGradient(half, half, 0, half, half, half);

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.18, "rgba(245,249,255,0.95)");
    gradient.addColorStop(0.42, "rgba(214,229,255,0.42)");
    gradient.addColorStop(0.72, "rgba(178,205,255,0.12)");
    gradient.addColorStop(1, "rgba(150,185,255,0)");

    s.fillStyle = gradient;
    s.beginPath();
    s.arc(half, half, half, 0, Math.PI * 2);
    s.fill();

    return c;
  })();

  /* ---------- генерация частиц ---------- */

  function build() {
    const area = width * height;

    const flakeCount = Math.max(70, Math.min(300, Math.round(area / 6000)));
    const starCount = Math.max(40, Math.min(140, Math.round(area / 16000)));

    flakes = Array.from({ length: flakeCount }, () => spawnFlake(true));
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: rand(0.4, 1.5),
      alpha: rand(0.15, 0.75),
      phase: Math.random() * Math.PI * 2,
      speed: rand(0.35, 1.2)
    }));
  }

  function spawnFlake(anywhere) {
    const depth = Math.random();                 // 0 = далеко, 1 = близко
    return {
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -rand(10, 60),
      r: 0.7 + depth * 2.4,                      // радиус
      vy: 9 + depth * 30,                        // скорость падения, px/сек
      sway: 6 + depth * 22,                      // амплитуда качания
      swaySpeed: rand(0.4, 1.1),
      phase: Math.random() * Math.PI * 2,
      alpha: 0.3 + depth * 0.65,
      wind: 4 + depth * 10
    };
  }

  /* ---------- отрисовка ---------- */

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    drawStars(0);
    for (const f of flakes) drawFlake(f);
  }

  function drawStars(time) {
    for (const s of stars) {
      const twinkle = 0.65 + 0.35 * Math.sin(time * s.speed + s.phase);
      ctx.globalAlpha = s.alpha * twinkle;
      ctx.fillStyle = "#dfe8ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFlake(f) {
    const size = f.r * 3.2; // спрайт с запасом под свечение
    ctx.globalAlpha = f.alpha;
    ctx.drawImage(sprite, f.x - size / 2, f.y - size / 2, size, size);
  }

  function step(dt) {
    ctx.clearRect(0, 0, width, height);
    drawStars(elapsed);

    for (const f of flakes) {
      f.y += f.vy * dt;
      f.x += (Math.sin(elapsed * f.swaySpeed + f.phase) * f.sway + f.wind) * dt;

      if (f.y - 12 > height) {
        Object.assign(f, spawnFlake(false));
      }
      if (f.x < -30) f.x = width + 30;
      if (f.x > width + 30) f.x = -30;

      drawFlake(f);
    }

    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += dt;

    step(dt);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (reduceMotion) {
      drawStatic();
      return;
    }
    if (rafId !== null) return;
    lastTime = 0;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* ---------- размеры ---------- */

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    build();
    if (reduceMotion) drawStatic();
  }

  let resizeFrame = null;
  window.addEventListener("resize", function () {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(function () {
      resizeFrame = null;
      resize();
    });
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  resize();
  start();
})();
