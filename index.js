/* ==========================================================================
   RETRO DUAL-MODE PORTFOLIO - ENGINE LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // NAVIGATION & VIEW SWITCHING (NO SWITCH BUTTON)
  // ==========================================
  const splitLanding = document.getElementById("splitLanding");
  const videoView = document.getElementById("videoView");
  const pythonView = document.getElementById("pythonView");
  const globalHud = document.getElementById("globalHud");
  const btnEnterVideo = document.getElementById("btnEnterVideo");
  const btnEnterPython = document.getElementById("btnEnterPython");
  const btnBackHub = document.getElementById("btnBackHub");
  const hudLogoText = document.getElementById("hudLogoText");
  const body = document.body;

  let activeTheme = "landing"; // "landing", "video", "python"

  btnEnterVideo.addEventListener("click", () => {
    triggerSwitchSound();
    
    // Slide landing left
    splitLanding.className = "split-landing exit-left";
    
    // Switch views
    setTimeout(() => {
      body.className = "theme-video";
      videoView.classList.remove("hidden");
      globalHud.classList.remove("hidden");
      hudLogoText.textContent = "CREATIVE PORTFOLIO";
      activeTheme = "video";
      
      initVideoCores();
    }, 400);
  });

  btnEnterPython.addEventListener("click", () => {
    triggerSwitchSound();
    
    // Slide landing right
    splitLanding.className = "split-landing exit-right";
    
    // Switch views
    setTimeout(() => {
      body.className = "theme-python";
      pythonView.classList.remove("hidden");
      globalHud.classList.remove("hidden");
      hudLogoText.textContent = "AMBER PYTHON CORE";
      activeTheme = "python";
      
      initPythonCores();
    }, 400);
  });

  btnBackHub.addEventListener("click", () => {
    triggerSwitchSound();
    
    // Re-hide views
    videoView.classList.add("hidden");
    pythonView.classList.add("hidden");
    globalHud.classList.add("hidden");
    
    // Slide landing back in
    splitLanding.className = "split-landing";
    body.className = "";
    activeTheme = "landing";
    
    // Stop loops
    if (tvAnimationId) cancelAnimationFrame(tvAnimationId);
    if (pyAnimationId) cancelAnimationFrame(pyAnimationId);
    isTvPlaying = false;
  });

  // Sound generator
  function triggerSwitchSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 0.18);
      
      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  // ==========================================
  // ANTIGRAVITY ZERO-G PHYSICS ENGINE
  // ==========================================
  const physicsCanvas = document.getElementById("antigravityCanvas");
  const pCtx = physicsCanvas?.getContext("2d");
  const shapesList = [];
  const pMouse = { x: -100, y: -100, vx: 0, vy: 0, lastX: 0, lastY: 0, active: false };

  function resizePhysicsCanvas() {
    if (physicsCanvas) {
      physicsCanvas.width = window.innerWidth;
      physicsCanvas.height = window.innerHeight;
    }
  }
  resizePhysicsCanvas();
  window.addEventListener("resize", resizePhysicsCanvas);

  // Track mouse coordinates & speed
  window.addEventListener("mousemove", (e) => {
    pMouse.x = e.clientX;
    pMouse.y = e.clientY;
    pMouse.active = true;
    
    pMouse.vx = pMouse.x - pMouse.lastX;
    pMouse.vy = pMouse.y - pMouse.lastY;
    
    pMouse.lastX = pMouse.x;
    pMouse.lastY = pMouse.y;
  });

  window.addEventListener("mouseleave", () => {
    pMouse.active = false;
  });

  // Gravity explosion on click
  window.addEventListener("click", () => {
    if (activeTheme !== "landing") return; // only play explosion in landing screen for cleaner UI
    
    shapesList.forEach(shape => {
      const dx = shape.x - pMouse.x;
      const dy = shape.y - pMouse.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 280) {
        const force = (280 - dist) * 0.1;
        shape.vx += (dx / dist) * force;
        shape.vy += (dy / dist) * force;
      }
    });
    
    triggerClickSound();
  });

  // Construct zero-g shapes
  function initZeroGShapes() {
    shapesList.length = 0;
    const itemsCount = 20;
    const shapes = ["star", "circle", "braces", "reel", "chevron"];
    
    for (let i = 0; i < itemsCount; i++) {
      shapesList.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 25 + 20,
        shape: shapes[i % shapes.length],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        mass: Math.random() * 1.5 + 0.5,
        bounce: 0.9,
        // Colors mapping both views
        color: i % 2 === 0 ? "rgba(217, 84, 56, 0.15)" : "rgba(38, 140, 132, 0.15)" // orange & teal
      });
    }
  }
  initZeroGShapes();

  function drawPhysicsStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  function updateZeroGPhysics() {
    if (!pCtx) return;
    
    pCtx.clearRect(0, 0, physicsCanvas.width, physicsCanvas.height);
    
    // Update theme-specific color accent overlay
    const nodeColor = activeTheme === "video" 
      ? "rgba(217, 84, 56, 0.08)" 
      : activeTheme === "python" 
      ? "rgba(242, 184, 36, 0.05)" 
      : "rgba(38, 140, 132, 0.08)";

    shapesList.forEach(shape => {
      // 1. Vortex Gravity: swirl around cursor if mouse is moving
      if (pMouse.active) {
        const dx = shape.x - pMouse.x;
        const dy = shape.y - pMouse.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 320 && dist > 5) {
          // Attract force
          const pull = (320 - dist) * 0.0035;
          shape.vx -= (dx / dist) * pull;
          shape.vy -= (dy / dist) * pull;
          
          // Tangent Swirl force (Vortex)
          const speed = Math.hypot(pMouse.vx, pMouse.vy);
          if (speed > 1.5) {
            const swirl = (320 - dist) * 0.005;
            shape.vx += (-dy / dist) * swirl;
            shape.vy += (dx / dist) * swirl;
          }
        }
      }

      // 2. Drag & speed decay
      shape.vx *= 0.985;
      shape.vy *= 0.985;
      
      // 3. Move
      shape.x += shape.vx;
      shape.y += shape.vy;
      shape.rotation += shape.rotSpeed;

      // 4. Boundary elastic collision
      const w = physicsCanvas.width;
      const h = physicsCanvas.height;
      const r = shape.radius;

      if (shape.x < r) { shape.x = r; shape.vx *= -shape.bounce; }
      if (shape.x > w - r) { shape.x = w - r; shape.vx *= -shape.bounce; }
      if (shape.y < r) { shape.y = r; shape.vy *= -shape.bounce; }
      if (shape.y > h - r) { shape.y = h - r; shape.vy *= -shape.bounce; }

      // 5. Draw
      pCtx.save();
      pCtx.translate(shape.x, shape.y);
      pCtx.rotate(shape.rotation);
      pCtx.fillStyle = activeTheme === "landing" ? shape.color : nodeColor;
      pCtx.strokeStyle = activeTheme === "landing" ? shape.color : nodeColor;
      pCtx.lineWidth = 2.5;

      if (shape.shape === "star") {
        drawPhysicsStar(pCtx, 0, 0, 5, r, r / 2.2);
      } else if (shape.shape === "circle") {
        pCtx.beginPath();
        pCtx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
        pCtx.stroke();
      } else if (shape.shape === "braces") {
        pCtx.font = `bold ${r * 1.5}px 'JetBrains Mono'`;
        pCtx.textAlign = "center";
        pCtx.textBaseline = "middle";
        pCtx.fillText("{}", 0, 0);
      } else if (shape.shape === "reel") {
        // Draw film spool
        pCtx.beginPath();
        pCtx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
        pCtx.stroke();
        pCtx.beginPath();
        pCtx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        pCtx.stroke();
        // Spokes
        for (let i = 0; i < 4; i++) {
          pCtx.rotate(Math.PI / 4);
          pCtx.fillRect(-2, -r * 0.8, 4, r * 0.6);
        }
      } else if (shape.shape === "chevron") {
        pCtx.font = `bold ${r * 1.4}px 'Space Grotesk'`;
        pCtx.textAlign = "center";
        pCtx.textBaseline = "middle";
        pCtx.fillText("<>", 0, 0);
      }

      pCtx.restore();
    });

    requestAnimationFrame(updateZeroGPhysics);
  }
  updateZeroGPhysics();


  // ==========================================
  // VIDEO EDITOR ENGINE (CRT VISUALIZER)
  // ==========================================
  const tvCanvas = document.getElementById("tvCanvas");
  const tvCtx = tvCanvas?.getContext("2d");
  const tvStatic = document.getElementById("tvStatic");
  const tvPowerBtn = document.getElementById("tvPowerBtn");
  const tvLed = document.getElementById("tvLed");
  const tvTimecode = document.getElementById("tvTimecode");
  
  const dialChannel = document.getElementById("dialChannel");
  const dialVolume = document.getElementById("dialVolume");
  
  const btnPlay = document.getElementById("btnPlay");
  const btnPause = document.getElementById("btnPause");
  const btnGlitch = document.getElementById("btnGlitch");
  
  let isTvOn = true;
  let isTvPlaying = false;
  let tvChannel = 1; 
  let tvFrame = 0;
  let tvAnimationId = null;
  let tvVolume = 45;
  let isGlitching = false;
  let timecodeTime = 0;

  function resizeTvCanvas() {
    if (tvCanvas) {
      tvCanvas.width = 460;
      tvCanvas.height = 345;
    }
  }
  resizeTvCanvas();

  function renderTv() {
    if (!tvCtx || !isTvOn) return;

    if (isGlitching) {
      drawGlitchScreen();
    } else {
      if (tvChannel !== 3) {
        tvCtx.fillStyle = "#0c0d0c";
        tvCtx.fillRect(0, 0, tvCanvas.width, tvCanvas.height);
      }
      
      switch (tvChannel) {
        case 1: drawAdvancedMograph(); break;
        case 2: drawSynthwaveScenic(); break;
        case 3: drawAcidGlitchTrails(); break;
      }
    }
    
    drawTvGraticule();

    if (isTvPlaying) {
      tvFrame++;
      timecodeTime += 1 / 30;
      updateTimecodeDisplay();
    }
    
    tvAnimationId = requestAnimationFrame(renderTv);
  }

  function drawAdvancedMograph() {
    const t = tvFrame * 0.018;
    const cx = tvCanvas.width / 2;
    const cy = tvCanvas.height / 2;
    
    tvCtx.strokeStyle = "rgba(38, 140, 132, 0.15)";
    tvCtx.lineWidth = 2;
    for (let r = 30; r < 250; r += 45) {
      const radius = (r + t * 40) % 240;
      tvCtx.beginPath();
      tvCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      tvCtx.stroke();
    }

    tvCtx.fillStyle = "rgba(242, 184, 36, 0.07)";
    tvCtx.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const offset = 15 * Math.sin(angle * 5 + t * 3) * Math.cos(angle * 3);
      const dist = 100 + offset;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      if (angle === 0) tvCtx.moveTo(x, y);
      else tvCtx.lineTo(x, y);
    }
    tvCtx.closePath();
    tvCtx.fill();

    // 3D Cube Renders
    const size = 65 + 10 * Math.sin(t * 2);
    const angleX = t * 0.6;
    const angleY = t * 0.8;
    const angleZ = t * 0.4;
    const projected2D = [];

    cubeVertices.forEach(v => {
      let x1 = v.x * Math.cos(angleZ) - v.y * Math.sin(angleZ);
      let y1 = v.x * Math.sin(angleZ) + v.y * Math.cos(angleZ);
      let z1 = v.z;
      
      let x2 = x1 * Math.cos(angleY) + z1 * Math.sin(angleY);
      let y2 = y1;
      let z2 = -x1 * Math.sin(angleY) + z1 * Math.cos(angleY);
      
      let x3 = x2;
      let y3 = y2 * Math.cos(angleX) - z2 * Math.sin(angleX);
      let z3 = y2 * Math.sin(angleX) + z2 * Math.cos(angleX);
      
      const distance = 3.5;
      const fov = 280;
      const px = (x3 * fov) / (z3 + distance) + cx;
      const py = (y3 * fov) / (z3 + distance) + cy;
      projected2D.push({ x: px, y: py });
    });

    tvCtx.strokeStyle = "var(--theme-video-accent)";
    tvCtx.lineWidth = 3.5;
    cubeEdges.forEach(edge => {
      const p1 = projected2D[edge[0]];
      const p2 = projected2D[edge[1]];
      tvCtx.beginPath();
      tvCtx.moveTo(p1.x, p1.y);
      tvCtx.lineTo(p2.x, p2.y);
      tvCtx.stroke();
    });

    tvCtx.fillStyle = "#fff";
    tvCtx.beginPath();
    tvCtx.arc(cx, cy, 5, 0, Math.PI * 2);
    tvCtx.fill();
    
    tvCtx.font = "bold 15px 'Space Grotesk'";
    tvCtx.fillStyle = "#1d1b1a";
    tvCtx.save();
    tvCtx.translate(cx, cy);
    tvCtx.rotate(-t * 0.4);
    tvCtx.textAlign = "center";
    tvCtx.fillText("• MOTION ENGINE • COMPOSITING •", 0, -110);
    tvCtx.restore();
  }

  function drawSynthwaveScenic() {
    const t = tvFrame * 0.025;
    const horizon = tvCanvas.height * 0.55;
    
    const sky = tvCtx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#100b09");
    sky.addColorStop(0.5, "#30081d");
    sky.addColorStop(1, "#d95438");
    tvCtx.fillStyle = sky;
    tvCtx.fillRect(0, 0, tvCanvas.width, tvCanvas.height);
    
    tvCtx.beginPath();
    tvCtx.arc(tvCanvas.width / 2, horizon + 5, 55, Math.PI, 0, false);
    const sun = tvCtx.createLinearGradient(0, horizon - 50, 0, horizon);
    sun.addColorStop(0, "#f2b824");
    sun.addColorStop(0.5, "#e63e8d");
    sun.addColorStop(1, "#d95438");
    tvCtx.fillStyle = sun;
    tvCtx.fill();
    
    tvCtx.fillStyle = "#100b09";
    for (let y = horizon - 45; y < horizon; y += 4) {
      const h = Math.max(1.5, (y - (horizon - 45)) * 0.2);
      tvCtx.fillRect(tvCanvas.width / 2 - 60, y, 120, h);
    }

    tvCtx.strokeStyle = "rgba(38, 140, 132, 0.4)";
    tvCtx.lineWidth = 1.5;
    
    tvCtx.beginPath();
    tvCtx.moveTo(0, horizon);
    tvCtx.lineTo(60, horizon - 40);
    tvCtx.lineTo(120, horizon - 80);
    tvCtx.lineTo(180, horizon - 20);
    tvCtx.lineTo(240, horizon);
    tvCtx.stroke();
    
    tvCtx.beginPath();
    tvCtx.moveTo(220, horizon);
    tvCtx.lineTo(280, horizon - 60);
    tvCtx.lineTo(340, horizon - 90);
    tvCtx.lineTo(400, horizon - 30);
    tvCtx.lineTo(460, horizon);
    tvCtx.stroke();

    tvCtx.strokeStyle = "#e63e8d";
    tvCtx.lineWidth = 2;
    
    const cols = 14;
    for (let i = 0; i <= cols; i++) {
      const xRatio = i / cols;
      const startX = tvCanvas.width / 2;
      const endX = xRatio * tvCanvas.width * 2.4 - (tvCanvas.width * 0.7);
      
      tvCtx.beginPath();
      tvCtx.moveTo(startX, horizon);
      tvCtx.lineTo(endX, tvCanvas.height);
      tvCtx.stroke();
    }
    
    const gridPhase = (t * 22) % 35;
    for (let y = 0; y < 9; y++) {
      const ratio = y / 8;
      const curY = horizon + Math.pow(ratio, 2) * (tvCanvas.height - horizon) + gridPhase * (ratio * 0.8);
      if (curY <= tvCanvas.height) {
        tvCtx.beginPath();
        tvCtx.moveTo(0, curY);
        tvCtx.lineTo(tvCanvas.width, curY);
        tvCtx.stroke();
      }
    }
  }

  function drawAcidGlitchTrails() {
    const t = tvFrame;
    tvCtx.save();
    tvCtx.globalAlpha = 0.085;
    tvCtx.fillStyle = "#100b09";
    tvCtx.fillRect(0, 0, tvCanvas.width, tvCanvas.height);
    tvCtx.restore();

    tvCtx.save();
    tvCtx.translate(tvCanvas.width / 2, tvCanvas.height / 2);
    tvCtx.rotate(t * 0.05);
    const r = 50 + Math.sin(t * 0.08) * 35;
    
    tvCtx.strokeStyle = `hsl(${(t * 2) % 360}, 90%, 60%)`;
    tvCtx.lineWidth = 2.5;
    tvCtx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) tvCtx.moveTo(x, y);
      else tvCtx.lineTo(x, y);
    }
    tvCtx.closePath();
    tvCtx.stroke();
    
    tvCtx.strokeStyle = `hsl(${(t * 2 + 120) % 360}, 90%, 60%)`;
    tvCtx.beginPath();
    tvCtx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
    tvCtx.stroke();
    tvCtx.restore();

    if (Math.random() < 0.15) {
      tvCtx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.6)`;
      const blockY = Math.random() * tvCanvas.height;
      const blockH = Math.random() * 25 + 5;
      tvCtx.fillRect(0, blockY, tvCanvas.width, blockH);
    }
  }

  function drawGlitchScreen() {
    tvCtx.fillStyle = "#1d1b1a";
    tvCtx.fillRect(0, 0, tvCanvas.width, tvCanvas.height);
    for (let i = 0; i < 30; i++) {
      tvCtx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.7)`;
      tvCtx.fillRect(Math.random()*tvCanvas.width, Math.random()*tvCanvas.height, Math.random()*120 + 20, Math.random()*25 + 2);
    }
    tvCtx.fillStyle = "#fff";
    tvCtx.fillRect(0, Math.random()*tvCanvas.height, tvCanvas.width, Math.random()*15 + 1);
  }

  function drawTvGraticule() {
    tvCtx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    tvCtx.lineWidth = 1;
    tvCtx.beginPath();
    tvCtx.moveTo(tvCanvas.width / 2, 10);
    tvCtx.lineTo(tvCanvas.width / 2, tvCanvas.height - 10);
    tvCtx.moveTo(10, tvCanvas.height / 2);
    tvCtx.lineTo(tvCanvas.width - 10, tvCanvas.height / 2);
    tvCtx.stroke();
    tvCtx.strokeRect(30, 25, tvCanvas.width - 60, tvCanvas.height - 50);
  }

  function updateTimecodeDisplay() {
    const hrs = Math.floor(timecodeTime / 3600).toString().padStart(2, "0");
    const mins = Math.floor((timecodeTime % 3600) / 60).toString().padStart(2, "0");
    const secs = Math.floor(timecodeTime % 60).toString().padStart(2, "0");
    const frames = Math.floor((timecodeTime * 30) % 30).toString().padStart(2, "0");
    if (tvTimecode) tvTimecode.textContent = `${hrs}:${mins}:${secs}:${frames}`;
  }

  if (dialChannel) {
    dialChannel.addEventListener("click", () => {
      tvChannel = (tvChannel % 3) + 1;
      dialAngle = (dialAngle + 45) % 360;
      dialChannel.style.transform = `rotate(${dialAngle}deg)`;
      triggerGlitchBurst();
      triggerClickSound();
    });
  }

  if (dialVolume) {
    dialVolume.addEventListener("click", () => {
      tvVolume = (tvVolume + 45) % 360;
      dialVolume.style.transform = `rotate(${tvVolume}deg)`;
      triggerClickSound();
    });
  }

  function triggerGlitchBurst() {
    isGlitching = true;
    setTimeout(() => { isGlitching = false; }, 200);
  }

  function triggerClickSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch(e) {}
  }

  if (tvPowerBtn) {
    tvPowerBtn.addEventListener("click", () => {
      triggerClickSound();
      isTvOn = !isTvOn;
      
      if (isTvOn) {
        tvStatic.style.opacity = "0.7";
        tvLed.style.backgroundColor = "var(--color-accent)";
        tvLed.className = "tv-status-led " + (isTvPlaying ? "playing" : "paused");
        
        setTimeout(() => {
          tvStatic.style.opacity = "0";
          renderTv();
        }, 300);
      } else {
        cancelAnimationFrame(tvAnimationId);
        drawCrtShutoff();
        tvLed.style.backgroundColor = "#2b2825";
        tvLed.className = "tv-status-led";
      }
    });
  }

  function drawCrtShutoff() {
    if (!tvCtx) return;
    let size = 1.0;
    function shrink() {
      tvCtx.fillStyle = "#0c0d0c";
      tvCtx.fillRect(0, 0, tvCanvas.width, tvCanvas.height);
      
      if (size > 0.02) {
        tvCtx.fillStyle = "#ffb000";
        tvCtx.beginPath();
        tvCtx.ellipse(tvCanvas.width / 2, tvCanvas.height / 2, tvCanvas.width * size * 0.5, tvCanvas.height * size * 0.02, 0, 0, Math.PI * 2);
        tvCtx.fill();
        size *= 0.45;
        setTimeout(shrink, 50);
      } else if (size > 0) {
        tvCtx.fillStyle = "#fff";
        tvCtx.beginPath();
        tvCtx.arc(tvCanvas.width / 2, tvCanvas.height / 2, 3, 0, Math.PI * 2);
        tvCtx.fill();
        size = 0;
        setTimeout(shrink, 80);
      } else {
        tvCtx.fillStyle = "#000";
        tvCtx.fillRect(0, 0, tvCanvas.width, tvCanvas.height);
      }
    }
    shrink();
  }

  if (btnPlay) {
    btnPlay.addEventListener("click", () => {
      if (isTvOn && !isTvPlaying) {
        isTvPlaying = true;
        tvLed.className = "tv-status-led playing";
        renderTv();
        triggerClickSound();
      }
    });
  }

  if (btnPause) {
    btnPause.addEventListener("click", () => {
      if (isTvOn && isTvPlaying) {
        isTvPlaying = false;
        tvLed.className = "tv-status-led paused";
        triggerClickSound();
      }
    });
  }

  if (btnGlitch) {
    btnGlitch.addEventListener("click", () => {
      if (isTvOn) {
        triggerGlitchBurst();
        triggerClickSound();
      }
    });
  }

  // ==========================================
  // TIMELINE WIDGET DRAGGING SCRUBBER
  // ==========================================
  const timelineSuite = document.getElementById("timelineSuite");
  const timelinePlayhead = document.getElementById("timelinePlayhead");
  const timelineRuler = document.getElementById("timelineRuler");
  const timelineMeta = document.getElementById("timelineMeta");
  const metaContent = timelineMeta?.querySelector(".meta-content");
  const metaPlaceholder = timelineMeta?.querySelector(".meta-placeholder");
  const clipBlocks = document.querySelectorAll(".clip-block");
  let isDraggingPlayhead = false;

  function populateTimelineRuler() {
    if (!timelineRuler) return;
    timelineRuler.innerHTML = "";
    
    const rulerWidth = timelineRuler.clientWidth;
    const ticksCount = 60;
    
    for (let i = 0; i <= ticksCount; i++) {
      const tick = document.createElement("div");
      tick.className = "ruler-tick";
      const leftPercent = (i / ticksCount) * 100;
      tick.style.left = `${leftPercent}%`;
      
      if (i % 10 === 0) {
        tick.classList.add("major");
        const label = document.createElement("span");
        label.className = "ruler-label";
        label.style.left = `${leftPercent}%`;
        label.textContent = `00:00:${(i / 2).toString().padStart(2, "0")}:00`;
        timelineRuler.appendChild(label);
      }
      timelineRuler.appendChild(tick);
    }
  }
  populateTimelineRuler();
  window.addEventListener("resize", populateTimelineRuler);

  function movePlayhead(e) {
    if (!timelineSuite) return;
    
    const rect = timelineRuler.getBoundingClientRect();
    const trackWidth = rect.width - 140; 
    const tracksOffsetLeft = rect.left + 140;
    
    let clientX = e.clientX;
    if (e.touches) clientX = e.touches[0].clientX;
    
    let xOffset = clientX - tracksOffsetLeft;
    if (xOffset < 0) xOffset = 0;
    if (xOffset > trackWidth) xOffset = trackWidth;
    
    const pct = (xOffset / trackWidth) * 100;
    timelinePlayhead.style.left = `calc(140px + ${pct}%)`;
    
    timecodeTime = (pct / 100) * 30;
    updateTimecodeDisplay();
    
    if (!isTvPlaying) {
      tvFrame = Math.floor(timecodeTime * 30);
      renderTvFrameOnce();
    }
  }

  if (timelineRuler) {
    timelineRuler.addEventListener("mousedown", (e) => {
      isDraggingPlayhead = true;
      movePlayhead(e);
    });
    timelineRuler.addEventListener("touchstart", (e) => {
      isDraggingPlayhead = true;
      movePlayhead(e);
    }, {passive: true});
  }

  window.addEventListener("mousemove", (e) => {
    if (isDraggingPlayhead) movePlayhead(e);
  });
  window.addEventListener("touchmove", (e) => {
    if (isDraggingPlayhead) movePlayhead(e);
  }, {passive: true});
  window.addEventListener("mouseup", () => { isDraggingPlayhead = false; });
  window.addEventListener("touchend", () => { isDraggingPlayhead = false; });

  clipBlocks.forEach(clip => {
    clip.addEventListener("click", () => {
      clipBlocks.forEach(c => c.classList.remove("active"));
      clip.classList.add("active");
      
      const title = clip.getAttribute("data-title");
      const notes = clip.getAttribute("data-notes");
      const track = clip.parentElement.parentElement.getAttribute("data-track");
      const start = clip.style.left;
      const len = clip.style.width;
      
      if (metaContent && metaPlaceholder) {
        metaPlaceholder.classList.add("hidden");
        metaContent.classList.remove("hidden");
        
        document.getElementById("metaTrack").textContent = track;
        document.getElementById("metaStart").textContent = start;
        document.getElementById("metaLen").textContent = len;
        metaContent.querySelector(".meta-title").textContent = title;
        metaContent.querySelector(".meta-notes").textContent = notes;
      }
      
      if (track === "Video") {
        if (title.includes("Intro")) tvChannel = 1;
        else if (title.includes("Synth")) tvChannel = 2;
        else tvChannel = 3;
      } else if (track === "Graphics") {
        tvChannel = 1;
      }
      
      triggerClickSound();
      triggerGlitchBurst();
    });
  });

  const audioWaveCanvas = document.querySelector(".audio-wave-canvas");
  if (audioWaveCanvas) {
    const actx = audioWaveCanvas.getContext("2d");
    audioWaveCanvas.width = 800;
    audioWaveCanvas.height = 36;
    
    actx.fillStyle = "rgba(24, 66, 50, 0.05)";
    actx.fillRect(0, 0, audioWaveCanvas.width, audioWaveCanvas.height);
    
    actx.strokeStyle = "rgba(0, 210, 132, 0.6)";
    actx.lineWidth = 1.5;
    actx.beginPath();
    
    const sliceWidth = audioWaveCanvas.width / 180;
    let x = 0;
    actx.moveTo(0, audioWaveCanvas.height / 2);
    
    for (let i = 0; i < 180; i++) {
      const amp = 13 * Math.sin(i * 0.12) * Math.cos(i * 0.04) * (0.4 + 0.6 * Math.sin(i * 0.7));
      const y = audioWaveCanvas.height / 2 + amp;
      actx.lineTo(x, y);
      x += sliceWidth;
    }
    actx.stroke();
  }

  const playTriggers = document.querySelectorAll(".cassette-play-trigger");
  playTriggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const source = btn.getAttribute("data-source");
      
      if (source === "mograph") tvChannel = 1;
      else if (source === "promo") tvChannel = 2;
      else if (source === "glitch") tvChannel = 3;
      
      isTvOn = true;
      isTvPlaying = true;
      if (tvStatic) tvStatic.style.opacity = "0";
      if (tvLed) tvLed.className = "tv-status-led playing";
      
      triggerGlitchBurst();
      triggerClickSound();
      renderTv();
      
      document.querySelector(".hero-section").scrollIntoView({ behavior: "smooth" });
    });
  });

  // ==========================================
  // COLOR TIMING LAB SLIDER COMPARISON LOGIC
  // ==========================================
  const colorSlider = document.getElementById("colorSlider");
  const sliderRawClip = document.getElementById("sliderRawClip");
  const sliderHandle = document.getElementById("sliderHandle");
  
  const sliderGradedCanvas = document.getElementById("sliderGradedCanvas");
  const sliderRawCanvas = document.getElementById("sliderRawCanvas");
  
  let isDraggingSlider = false;

  function initColorSliderCanvases() {
    if (!sliderGradedCanvas || !sliderRawCanvas) return;
    
    const w = colorSlider.clientWidth;
    const h = 420;
    
    sliderGradedCanvas.width = w;
    sliderGradedCanvas.height = h;
    sliderRawCanvas.width = w;
    sliderRawCanvas.height = h;
    
    drawVectorScene(sliderGradedCanvas.getContext("2d"), w, h, true);
    drawVectorScene(sliderRawCanvas.getContext("2d"), w, h, false);
  }

  function drawVectorScene(ctx, w, h, isGraded) {
    if (!ctx) return;
    
    // Graded: vibrant saturated 70s colors; Raw: flat desaturated grey LOG colors
    const bgCol = isGraded ? "#f5efeb" : "#d1cdca";
    const sunGrad1 = isGraded ? "#f2b824" : "#b0aba7";
    const sunGrad2 = isGraded ? "#d95438" : "#878381";
    const lineCol = isGraded ? "#268c84" : "#777c7a";
    const shapeCol = isGraded ? "#e63e8d" : "#948f91";
    
    // Background
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, w, h);
    
    // Draw grid background
    ctx.strokeStyle = isGraded ? "rgba(38, 140, 132, 0.15)" : "rgba(100, 100, 100, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    
    // Draw big sunset circle in center
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + 30, 110, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(0, h / 2 - 80, 0, h / 2 + 140);
    grad.addColorStop(0, sunGrad1);
    grad.addColorStop(1, sunGrad2);
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Sun slats
    ctx.fillStyle = bgCol;
    for (let y = h / 2 - 60; y < h / 2 + 140; y += 12) {
      ctx.fillRect(w / 2 - 120, y, 240, 3);
    }
    
    // Draw abstract geometric stars
    ctx.fillStyle = shapeCol;
    ctx.save();
    ctx.translate(w / 2 - 160, h / 2 - 60);
    drawPhysicsStar(ctx, 0, 0, 4, 30, 12);
    ctx.restore();
    
    ctx.save();
    ctx.translate(w / 2 + 160, h / 2 + 60);
    drawPhysicsStar(ctx, 0, 0, 4, 25, 10);
    ctx.restore();
    
    // Draw wave lines underneath
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 200, h / 2 + 160);
    ctx.bezierCurveTo(w / 2 - 100, h / 2 + 110, w / 2 + 100, h / 2 + 210, w / 2 + 200, h / 2 + 160);
    ctx.stroke();
  }

  // Handle drag comparisons
  function moveSlider(clientX) {
    if (!colorSlider || !sliderRawClip || !sliderHandle) return;
    
    const rect = colorSlider.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    
    const pct = (x / rect.width) * 100;
    sliderRawClip.style.width = pct + "%";
    sliderHandle.style.left = pct + "%";
  }

  if (colorSlider) {
    colorSlider.addEventListener("mousedown", (e) => {
      isDraggingSlider = true;
      moveSlider(e.clientX);
    });
    colorSlider.addEventListener("touchstart", (e) => {
      isDraggingSlider = true;
      moveSlider(e.touches[0].clientX);
    }, {passive: true});
  }

  window.addEventListener("mousemove", (e) => {
    if (isDraggingSlider) moveSlider(e.clientX);
  });
  window.addEventListener("touchmove", (e) => {
    if (isDraggingSlider) moveSlider(e.touches[0].clientX);
  }, {passive: true});
  window.addEventListener("mouseup", () => { isDraggingSlider = false; });
  window.addEventListener("touchend", () => { isDraggingSlider = false; });

  // ==========================================
  // PYTHON CORE VIEW LOGIC (RETRO WORKSTATION)
  // ==========================================
  
  // Terminal inputs
  const cmdBtns = document.querySelectorAll(".cmd-btn");
  
  // Controls indicators
  const indScrape = document.getElementById("indScrape");
  const indRender = document.getElementById("indRender");
  const indAnalyze = document.getElementById("indAnalyze");
  
  const btnScrape = document.getElementById("btnScrape");
  const btnRender = document.getElementById("btnRender");
  const btnAnalyze = document.getElementById("btnAnalyze");
  
  const cpuBar = document.getElementById("cpuBar");
  const cpuVal = document.getElementById("cpuVal");
  const memVal = document.getElementById("memVal");
  
  // Visualizer Canvas
  const pythonCanvas = document.getElementById("pythonCanvas");
  const pyCtx = pythonCanvas?.getContext("2d");
  const vizLed = document.getElementById("vizLed");
  const vizConsole = document.getElementById("vizConsole");
  
  // Floppies
  const floppies = document.querySelectorAll(".floppy-disk");
  const floppyReaderBay = document.getElementById("floppyReaderBay");
  const readerContents = document.getElementById("readerContents");
  const btnEject = document.getElementById("btnEject");
  const diskTitle = document.getElementById("diskTitle");
  const diskDesc = document.getElementById("diskDesc");
  const diskSize = document.getElementById("diskSize");
  const diskComplexity = document.getElementById("diskComplexity");
  const diskCode = document.getElementById("diskCode");

  // State Variables
  let isPythonInited = false;
  let pyAnimationId = null;
  let pyFrame = 0;
  let runningPipelinesCount = 0;
  let activeScriptType = "idle"; 
  let insertedDisk = null;

  // Initialize Python Mode
  function initPythonCores() {
    if (isPythonInited) return;
    isPythonInited = true;
    
    if (pythonCanvas) {
      pythonCanvas.width = 460;
      pythonCanvas.height = 250;
    }
    
    renderPythonVisuals();
    
    const termScreen = document.getElementById("terminalScreen");
    if (termScreen && terminalInput) {
      termScreen.addEventListener("click", () => {
        terminalInput.focus();
      });
    }
    
    setInterval(updateSysStats, 1500);
  }

  function updateSysStats() {
    if (activeTheme !== "python") return;
    
    let targetCpu = 12 + Math.floor(Math.random() * 8);
    let targetMem = 3.42 + Math.random() * 0.05;
    
    if (runningPipelinesCount > 0) {
      targetCpu += runningPipelinesCount * 25 + Math.floor(Math.random() * 10);
      targetMem += runningPipelinesCount * 1.25;
    }
    
    targetCpu = Math.min(99, targetCpu);
    
    if (cpuBar) cpuBar.style.width = `${targetCpu}%`;
    if (cpuVal) cpuVal.textContent = `${targetCpu}%`;
    if (memVal) memVal.textContent = `${targetMem.toFixed(2)} GB / 16.00 GB`;
  }

  function renderPythonVisuals() {
    if (!pyCtx || activeTheme !== "python") return;
    
    pyFrame++;
    
    // Clear with slight green decay (no black)
    pyCtx.fillStyle = "rgba(19, 37, 29, 0.25)";
    pyCtx.fillRect(0, 0, pythonCanvas.width, pythonCanvas.height);
    
    if (activeScriptType === "binary-rain") {
      drawAmberBinaryRain();
    } else if (activeScriptType === "particle-physics") {
      drawInteractiveParticlePhysics();
    } else if (activeScriptType === "bubble-sort") {
      drawBubbleSortSimulation();
    } else {
      drawAmberWorkstationStandby();
    }
    
    pyAnimationId = requestAnimationFrame(renderPythonVisuals);
  }

  function drawAmberWorkstationStandby() {
    const w = pythonCanvas.width;
    const h = pythonCanvas.height;
    
    pyCtx.strokeStyle = "rgba(242, 184, 36, 0.06)";
    pyCtx.lineWidth = 1;
    
    const spacing = 20;
    const offset = (pyFrame * 0.5) % spacing;
    
    for (let x = offset; x < w; x += spacing) {
      pyCtx.beginPath();
      pyCtx.moveTo(x, 0);
      pyCtx.lineTo(x, h);
      pyCtx.stroke();
    }
    for (let y = offset; y < h; y += spacing) {
      pyCtx.beginPath();
      pyCtx.moveTo(0, y);
      pyCtx.lineTo(w, y);
      pyCtx.stroke();
    }
    
    const scale = 1.0 + 0.08 * Math.sin(pyFrame * 0.04);
    pyCtx.save();
    pyCtx.translate(w / 2, h / 2);
    pyCtx.rotate(pyFrame * 0.006);
    pyCtx.scale(scale, scale);
    
    pyCtx.strokeStyle = "var(--color-accent)";
    pyCtx.lineWidth = 2;
    pyCtx.strokeRect(-35, -35, 70, 70);
    
    pyCtx.rotate(Math.PI / 4);
    pyCtx.strokeStyle = "var(--color-accent-sub)";
    pyCtx.strokeRect(-35, -35, 70, 70);
    
    pyCtx.restore();
    
    pyCtx.font = "10px 'JetBrains Mono'";
    pyCtx.fillStyle = "rgba(242, 184, 36, 0.8)";
    pyCtx.fillText("SYS_STATUS: AMBER WORKSTATION READY", 15, 20);
    pyCtx.fillText("PIPELINE_MAP: ONLINE", 15, 35);
  }

  const binDrops = Array(25).fill(0);
  function drawAmberBinaryRain() {
    pyCtx.font = "bold 11px 'JetBrains Mono'";
    
    for (let i = 0; i < binDrops.length; i++) {
      const char = Math.random() > 0.5 ? "1" : "0";
      const x = i * 19 + 5;
      const y = binDrops[i] * 13;
      
      if (Math.random() > 0.92) {
        pyCtx.fillStyle = "#fff";
      } else {
        pyCtx.fillStyle = "rgba(242, 184, 36, 0.85)";
      }
      
      pyCtx.fillText(char, x, y);
      
      if (y > pythonCanvas.height && Math.random() > 0.97) {
        binDrops[i] = 0;
      }
      binDrops[i]++;
    }
  }

  const pyNodes = [];
  function initPyNodes() {
    pyNodes.length = 0;
    for (let i = 0; i < 28; i++) {
      pyNodes.push({
        x: Math.random() * pythonCanvas.width,
        y: Math.random() * (pythonCanvas.height - 40) + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 4 + 2,
        mass: Math.random() * 1.5 + 0.5,
        bounce: 0.9
      });
    }
  }

  function drawInteractiveParticlePhysics() {
    if (pyNodes.length === 0) initPyNodes();
    
    const w = pythonCanvas.width;
    const h = pythonCanvas.height;
    
    const rect = pythonCanvas.getBoundingClientRect();
    const localMouse = {
      x: pMouse.x - rect.left,
      y: pMouse.y - rect.top
    };
    
    pyCtx.lineWidth = 1;
    for (let i = 0; i < pyNodes.length; i++) {
      for (let j = i + 1; j < pyNodes.length; j++) {
        const dist = Math.hypot(pyNodes[i].x - pyNodes[j].x, pyNodes[i].y - pyNodes[j].y);
        if (dist < 75) {
          pyCtx.strokeStyle = `rgba(242, 184, 36, ${1 - dist / 75})`;
          pyCtx.beginPath();
          pyCtx.moveTo(pyNodes[i].x, pyNodes[i].y);
          pyCtx.lineTo(pyNodes[j].x, pyNodes[j].y);
          pyCtx.stroke();
        }
      }
    }
    
    pyNodes.forEach(node => {
      if (pMouse.active) {
        const dMouse = Math.hypot(node.x - localMouse.x, node.y - localMouse.y);
        if (dMouse < 120 && dMouse > 5) {
          const force = (120 - dMouse) * 0.015;
          node.vx += ((localMouse.x - node.x) / dMouse) * force;
          node.vy += ((localMouse.y - node.y) / dMouse) * force;
        }
      }
      
      node.vx *= 0.96;
      node.vy *= 0.96;
      
      node.x += node.vx;
      node.y += node.vy;
      
      if (node.x < 0) { node.x = 0; node.vx *= -1; }
      if (node.x > w) { node.x = w; node.vx *= -1; }
      if (node.y < 0) { node.y = 0; node.vy *= -1; }
      if (node.y > h) { node.y = h; node.vy *= -1; }
      
      pyCtx.fillStyle = "var(--color-accent)";
      pyCtx.beginPath();
      pyCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      pyCtx.fill();
    });
  }

  const sortBars = [];
  const barsCount = 22;
  let isSorted = false;

  function initSortBars() {
    sortBars.length = 0;
    for (let i = 0; i < barsCount; i++) {
      sortBars.push({
        val: Math.floor(Math.random() * 150) + 30,
        swapping: false
      });
    }
    isSorted = false;
  }

  function drawBubbleSortSimulation() {
    if (sortBars.length === 0) initSortBars();
    
    const w = pythonCanvas.width;
    const h = pythonCanvas.height;
    const barWidth = w / barsCount - 6;
    
    if (pyFrame % 3 === 0 && !isSorted) {
      let swapped = false;
      sortBars.forEach(b => b.swapping = false);
      
      for (let i = 0; i < sortBars.length - 1; i++) {
        if (sortBars[i].val > sortBars[i + 1].val) {
          const temp = sortBars[i].val;
          sortBars[i].val = sortBars[i + 1].val;
          sortBars[i + 1].val = temp;
          
          sortBars[i].swapping = true;
          sortBars[i + 1].swapping = true;
          swapped = true;
          break;
        }
      }
      
      if (!swapped) {
        isSorted = true;
        setTimeout(() => { initSortBars(); }, 2000);
      }
    }
    
    for (let i = 0; i < sortBars.length; i++) {
      const bar = sortBars[i];
      const barX = i * (w / barsCount) + 3;
      const barH = bar.val;
      const barY = h - 40 - barH;
      
      if (bar.swapping) {
        pyCtx.fillStyle = "var(--color-accent-sub)";
        pyCtx.shadowColor = "var(--color-accent-sub)";
        pyCtx.shadowBlur = 6;
      } else if (isSorted) {
        pyCtx.fillStyle = "#00d284";
        pyCtx.shadowColor = "#00d284";
        pyCtx.shadowBlur = 4;
      } else {
        pyCtx.fillStyle = "var(--color-accent)";
        pyCtx.shadowBlur = 0;
      }
      
      pyCtx.fillRect(barX, barY, barWidth, barH);
    }
    pyCtx.shadowBlur = 0;
    
    pyCtx.font = "9px 'JetBrains Mono'";
    pyCtx.fillStyle = "rgba(255, 176, 0, 0.8)";
    pyCtx.fillText(isSorted ? "ALGORITHM: BUBBLE_SORT_COMPLETE (SHUFFLE_STANDBY)" : "ALGORITHM: BUBBLE_SORT_ACTIVE", 15, 20);
  }

  btnScrape.addEventListener("click", () => {
    executePipeline(indScrape, "Web Scraper node", "binary-rain");
  });

  btnRender.addEventListener("click", () => {
    executePipeline(indRender, "Mograph Thread Core", "bubble-sort");
  });

  btnAnalyze.addEventListener("click", () => {
    executePipeline(indAnalyze, "System AST parsing", "particle-physics");
  });

  function executePipeline(indicator, name, visualType) {
    if (indicator.textContent === "RUNNING") return;
    triggerClickSound();
    
    indicator.textContent = "RUNNING";
    indicator.className = "rack-indicator running";
    runningPipelinesCount++;
    activeScriptType = visualType;
    if (vizLed) vizLed.className = "visualizer-led running";
    
    logToPipelineConsole(`[SYS] Spawned worker process: ${name}...`);
    
    setTimeout(() => {
      indicator.textContent = "SUCCESS";
      indicator.className = "rack-indicator";
      runningPipelinesCount--;
      
      logToPipelineConsole(`[SUCCESS] Process completed: ${name}`);
      
      if (runningPipelinesCount === 0) {
        activeScriptType = "idle";
        if (vizLed) vizLed.className = "visualizer-led";
      }
    }, 4500 + Math.random() * 2000);
  }

  function logToPipelineConsole(msg) {
    if (!vizConsole) return;
    const log = document.createElement("div");
    log.className = "viz-log";
    log.textContent = `> ${msg}`;
    vizConsole.appendChild(log);
    vizConsole.scrollTop = vizConsole.scrollHeight;
  }

  // ==========================================
  // PYTHON REPL COMMAND PARSER
  // ==========================================
  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = terminalInput.value.trim();
        terminalInput.value = "";
        if (cmd) executeTerminalCommand(cmd);
      }
    });
  }

  cmdBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      executeTerminalCommand(cmd);
      triggerClickSound();
    });
  });

  function executeTerminalCommand(cmd) {
    appendTerminalLine(`<span class="terminal-prompt">python@amber-core:~$</span> <span class="cmd-line">${cmd}</span>`);
    const cleanCmd = cmd.toLowerCase().trim();
    
    switch (cleanCmd) {
      case "help":
        appendTerminalLine(`Amber Workstation Core Help Macros:
  - <strong>help</strong>          : Print this macros checklist index
  - <strong>skills</strong>        : Load developer stack modules
  - <strong>projects</strong>      : Execute projects shelf files list
  - <strong>clear</strong>         : Reset phosphor console log
  - <strong>run visualizer.py</strong> : Execute core visual animations
  - <strong>cat bio.txt</strong>    : Read operator bio file`);
        break;
      case "skills":
      case "show_skills()":
        appendTerminalLine(`Resolving skills dependencies...
======================================================
[LANG]      Python (Core), SQL, HTML/CSS/JS (Analogue/Digital)
[PIPELINES] multiprocessing, asyncio, aiohttp, ast, regex
[TOOLSTACK] Django, FastAPI, NumPy, Docker, Git, FFmpeg
======================================================
Status: ALL MODULES PARSED OK.`);
        break;
      case "projects":
      case "list_projects()":
        appendTerminalLine(`Parsing file sectors:
------------------------------------------------------
1. <strong>Mograph-Auto-Renderer</strong>: AE multiprocessing.
2. <strong>Async-Web-Scraper</strong>: High speed Semaphore crawler.
3. <strong>Waveform-Synth</strong>: Sound array wave compiler.
------------------------------------------------------
* Hint: Use floppy shelves below to load source codes *`);
        break;
      case "clear":
        if (terminalOutput) terminalOutput.innerHTML = "";
        break;
      case "run visualizer.py":
        appendTerminalLine("Executing core_visualizer.py node...");
        executePipeline(indAnalyze, "Amber Core Visualizer", "particle-physics");
        break;
      case "cat bio.txt":
        appendTerminalLine(`Parsing operator bio info:
------------------------------------------------------
SYS_OP: Karan
ROLE: Python Developer & Video Editor
FOCUS: Integrating retro aesthetic motion with fast scripts.
------------------------------------------------------
"Writing concurrent codes & optimizing render nodes."`);
        break;
      default:
        if (cleanCmd.startsWith("python ") || cleanCmd.startsWith("run ")) {
          const script = cmd.substring(cleanCmd.indexOf(" ") + 1);
          appendTerminalLine(`Executing sector script: \`${script}\`...`);
          if (script.includes("visualizer")) {
            executePipeline(indAnalyze, "Core Visualizer", "particle-physics");
          } else if (script.includes("render")) {
            executePipeline(indRender, "Renderer Automation", "bubble-sort");
          } else {
            setTimeout(() => {
              appendTerminalLine(`[Core] Execution complete for \`${script}\`. Exit Code: 0.`, "success-line");
            }, 1000);
          }
        } else {
          appendTerminalLine(`NameError: name '${cmd}' is not defined. Type 'help' for assist macros.`, "error-line");
        }
    }
    const screen = document.getElementById("terminalScreen");
    if (screen) screen.scrollTop = screen.scrollHeight;
  }

  function appendTerminalLine(text, className = "") {
    if (!terminalOutput) return;
    const line = document.createElement("div");
    line.className = className ? `system-line ${className}` : "system-line";
    line.innerHTML = text;
    terminalOutput.appendChild(line);
  }

  // ==========================================
  // FLOPPY SHELF & INSERTION READER BAY
  // ==========================================
  floppies.forEach(disk => {
    disk.addEventListener("click", () => {
      if (insertedDisk) ejectDisk();
      
      insertedDisk = disk;
      const projId = disk.getAttribute("data-project");
      
      disk.style.transform = "translateY(100px) rotateX(50deg) scale(0.55)";
      disk.style.opacity = "0";
      disk.style.pointerEvents = "none";
      
      const data = floppyDb[projId];
      
      setTimeout(() => {
        floppyReaderBay.classList.add("disk-inserted");
        triggerClickSound();
        
        setTimeout(() => {
          if (readerContents) {
            readerContents.classList.remove("hidden");
            diskTitle.textContent = data.title;
            diskDesc.textContent = data.desc;
            diskSize.textContent = data.size;
            diskComplexity.textContent = data.complexity;
            diskCode.textContent = data.code;
            
            appendTerminalLine(`[FLOPPY DRIVE A:] Loaded: \`${data.title}\` successfully.`, "success-line");
            const screen = document.getElementById("terminalScreen");
            if (screen) screen.scrollTop = screen.scrollHeight;
          }
        }, 700);
      }, 300);
    });
  });

  if (btnEject) {
    btnEject.addEventListener("click", () => { ejectDisk(); });
  }

  function ejectDisk() {
    if (!insertedDisk) return;
    triggerClickSound();
    
    insertedDisk.style.transform = "";
    insertedDisk.style.opacity = "1";
    insertedDisk.style.pointerEvents = "";
    
    floppyReaderBay.classList.remove("disk-inserted");
    if (readerContents) readerContents.classList.add("hidden");
    
    appendTerminalLine("[FLOPPY DRIVE A:] Disk ejected.", "system-line");
    insertedDisk = null;
  }

  // ==========================================
  // INITIALIZATION RUN
  // ==========================================
  // Setup TV 3D meshes
  const cubeVertices = [
    {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1},
    {x: -1, y: -1, z: 1},  {x: 1, y: -1, z: 1},  {x: 1, y: 1, z: 1},  {x: -1, y: 1, z: 1}
  ];
  const cubeEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];

  // Initialize Color Slider illustrations
  initColorSliderCanvases();
  window.addEventListener("resize", initColorSliderCanvases);

  function initVideoCores() {
    isTvPlaying = true;
    if (tvLed) tvLed.className = "tv-status-led playing";
    renderTv();
  }
});
