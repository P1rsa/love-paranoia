    /* ─────────────────────────────────────────
       STATE
    ───────────────────────────────────────── */
    let paranoiaLevel = 0;          // 0 to 100
    const MAX_PARANOIA = 100;
 
    /* ─────────────────────────────────────────
       DOM REFERENCES
    ───────────────────────────────────────── */
    const body          = document.body;
    const hint          = document.getElementById('hint');
    const progressBar   = document.getElementById('progress-bar');
    const meterEl       = document.getElementById('meter');
    const meterFill     = document.getElementById('meter-fill');
    const noise         = document.getElementById('noise');
    const scanlines     = document.getElementById('scanlines');
    const chaosWords    = document.getElementById('chaos-words');
    const resetBtn      = document.getElementById('reset-btn');
    const thoughtsCont  = document.getElementById('thoughts-container');
    const glitchWrap    = document.querySelector('#title-main.glitch-wrap');
 
    /* ─────────────────────────────────────────
       PARANOID THOUGHTS — floating fixed text
    ───────────────────────────────────────── */
    const thoughtTexts = [
      "what was really going on?",
      "are you sure it was nothing?",
      "I've heard those words before",
      "does it really fucking matter?",
      "you're the phoney one now",
      "just check. one look.",
      "she's typing to someone",
      "you're not insecure, you're right",
      "stop. you're doing it again.",
      "the ocean. remember the ocean.",
      "you destroyed it",
      "she deserved better",
      "you knew you'd do this",
      "babe. babe. babe.",
      "it was pure. it was real.",
    ];
 
    /* Pre-create thought elements, scatter them randomly */
    const thoughtEls = thoughtTexts.map((text, i) => {
      const el = document.createElement('div');
      el.className = 'thought';
      el.textContent = text;
      /* Random fixed positions across the viewport */
      el.style.top  = (8 + Math.random() * 84) + 'vh';
      el.style.left = (2 + Math.random() * 88) + 'vw';
      el.style.fontSize = (0.55 + Math.random() * 0.4) + 'rem';
      el.style.transform = `rotate(${(Math.random() - 0.5) * 8}deg)`;
      thoughtsCont.appendChild(el);
      return el;
    });
 
    /* ─────────────────────────────────────────
       CHAOS WORDS — fragmented lyrics scattered
    ───────────────────────────────────────── */
    const chaosFragments = [
      "really sorry", "dying inside", "cross the line",
      "what you're typing", "fair play", "hit me like an arrow",
      "the worst in me", "the ocean", "phoney",
      "paranoid", "I know now", "it was nothing",
      "I'd be normal", "I'd be fine", "gonna do it",
      "the walls go up", "does it matter", "babe",
      "pure", "for real", "I know now",
      "really really", "sorry", "again",
    ];
 
    chaosFragments.forEach((word, i) => {
      const el = document.createElement('div');
      el.className = 'chaos-word';
      el.textContent = word;
 
      /* Scatter randomly across the chaos panel area */
      el.style.top      = (5 + Math.random() * 90) + '%';
      el.style.left     = (2 + Math.random() * 90) + '%';
      el.style.fontSize = (0.9 + Math.random() * 3.5) + 'rem';
      el.style.opacity  = '0';
      el.style.color    = Math.random() > 0.7 ? 'var(--accent)' :
                          Math.random() > 0.5 ? 'var(--red)'    : 'var(--text)';
      el.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)`;
      el.style.transition = `opacity ${1 + Math.random() * 1.5}s ease ${Math.random() * 2}s`;
 
      chaosWords.appendChild(el);
    });
 
    /* ─────────────────────────────────────────
       INTERSECTION OBSERVER — reveal elements on scroll
    ───────────────────────────────────────── */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.25 });
 
    /* Observe all animated elements */
    document.querySelectorAll(
      '.lyric-line, .section-label, .sep, #title-main, #title-sub'
    ).forEach(el => observer.observe(el));
 
    /* Show meter after first scroll */
    document.addEventListener('scroll', () => {
      meterEl.classList.add('visible');
    }, { once: true });
 
    /* ─────────────────────────────────────────
       SCROLL HANDLER — main paranoia engine
    ───────────────────────────────────────── */
    window.addEventListener('scroll', () => {
      /* Calculate how far down we've scrolled (0–1) */
      const scrollTop  = window.scrollY;
      const maxScroll  = document.body.scrollHeight - window.innerHeight;
      const scrollFrac = Math.min(scrollTop / maxScroll, 1);
 
      /* Update progress bar */
      progressBar.style.width = (scrollFrac * 100) + '%';
 
      /* Increase paranoia level as user scrolls deeper */
      const targetParanoia = scrollFrac * MAX_PARANOIA;
      /* Paranoia rises quickly but falls slowly (sticky fear) */
      if (targetParanoia > paranoiaLevel) {
        paranoiaLevel = Math.min(paranoiaLevel + 1.2, targetParanoia);
      }
 
      /* Hide hint early */
      if (scrollFrac > 0.04) hint.style.opacity = '0';
 
      /* Apply visual effects based on paranoiaLevel */
      applyParanoia(paranoiaLevel);
    });
 
    /* ─────────────────────────────────────────
       APPLY PARANOIA — mutates CSS variables & DOM
    ───────────────────────────────────────── */
    function applyParanoia(level) {
      const p = level / 100;   // normalised 0–1
 
      /* ── Meter fill ── */
      meterFill.style.width = level + '%';
 
      /* ── Background darkening — starts immediately ── */
      const bgL = Math.round(13 - p * 10);
      body.style.setProperty('--bg', `hsl(270, 30%, ${bgL}%)`);
 
      /* ── Noise — begins whispering from level 5 ── */
      noise.style.opacity = 0.03 + p * 0.22;
 
      /* ── Vignette — creeps in from level 10 ── */
      const vigAlpha = Math.max(0, (level - 10) / 90) * 0.82;
      const vigEdge  = Math.max(20, 50 - p * 30);
      document.getElementById('vignette').style.background =
        `radial-gradient(ellipse at center, transparent ${vigEdge}%, rgba(0,0,0,${vigAlpha}) 100%)`;
 
      /* ── Red bleed from the bottom — starts level 25, panel 3 area ── */
      const redBleed = document.getElementById('red-bleed');
      if (redBleed) {
        redBleed.style.opacity = level > 25 ? Math.min((level - 25) / 75, 1) * 0.9 : 0;
      }
 
      /* ── Scanlines — earlier onset, level 35 instead of 50 ── */
      scanlines.style.opacity = level > 35 ? (level - 35) / 65 * 0.5 : 0;
 
      /* ── Glitch — earlier onset, level 20 ── */
      const glitchOp = level > 20 ? Math.min((level - 20) / 80, 1) * 0.9 : 0;
      document.querySelectorAll('.glitch-wrap').forEach(el => {
        el.style.setProperty('--glitch-op', glitchOp.toFixed(2));
      });
 
      /* ── Cursor corruption:
            level 15 → crosshair
            level 45 → fake lagging cursor appears ── */
      if (level > 45) {
        body.classList.add('cursor-corrupt');
        body.classList.remove('cursor-uneasy');
        fakeCursor.classList.add('active');
      } else if (level > 15) {
        body.classList.add('cursor-uneasy');
        fakeCursor.classList.remove('active');
      } else {
        body.classList.remove('cursor-uneasy', 'cursor-corrupt');
        fakeCursor.classList.remove('active');
      }
 
      /* ── Heartbeat pulse on lyric blocks — level 20 ── */
      document.querySelectorAll('.lyric-block').forEach(el => {
        if (level > 20) {
          el.classList.add('beating');
          /* speed up as paranoia rises */
          const bpm = 1.4 - (level - 20) / 80 * 0.8;
          el.style.animationDuration = Math.max(0.6, bpm) + 's';
        } else {
          el.classList.remove('beating');
        }
      });
 
      /* ── Lyric distortion — starts level 40 (was 55) ── */
      document.querySelectorAll('.lyric-line').forEach(el => {
        const orig = el.dataset.original;
        const dist = el.dataset.distorted;
        if (!orig || !dist) return;
 
        if (level > 40) {
          el.textContent = dist;
          el.style.letterSpacing = (0.02 + (p - 0.40) * 0.14) + 'em';
          el.style.color = `hsl(280, 60%, ${85 - (p - 0.40) * 45}%)`;
          el.style.filter = `blur(${(p - 0.40) * 1.8}px)`;
        } else {
          el.textContent = orig;
          el.style.letterSpacing = '0.02em';
          el.style.color = 'var(--text)';
          el.style.filter = 'none';
        }
      });
 
      /* ── Conflict pairs — earlier, tighter spread ── */
      revealConflictAt('conflict-1', 22, level);
      revealConflictAt('conflict-2', 38, level);
      revealConflictAt('conflict-3', 52, level);
 
      /* ── "He'll do it again" doubt line ── */
      const doubtLine = document.getElementById('doubt-line');
      if (doubtLine) {
        doubtLine.style.opacity = level > 82 ? '1' : '0';
      }
 
      /* ── Sorry lines — hollow blur ── */
      const sorry1 = document.getElementById('sorry-line-1');
      const sorry2 = document.getElementById('sorry-line-2');
      if (sorry1 && sorry2 && level > 70) {
        const sorryFade = Math.min((level - 70) / 30, 1);
        sorry1.style.filter = `blur(${sorryFade * 0.8}px)`;
        sorry1.style.opacity = 1 - sorryFade * 0.35;
        sorry2.style.filter = `blur(${sorryFade * 1.2}px)`;
        sorry2.style.opacity = 0.7 - sorryFade * 0.3;
      }
 
      /* ── Floating thoughts — start at level 15 (was 30) ── */
      thoughtEls.forEach((el, i) => {
        /* First few thoughts appear very early and faintly */
        const threshold = 15 + (i / thoughtEls.length) * 45;
        /* opacity scales up gradually rather than binary snap */
        const thoughtOp = level > threshold
          ? Math.min((level - threshold) / 35, 1) * 0.65
          : 0;
        el.style.opacity = thoughtOp;
        if (thoughtOp > 0) {
          const drift = (level - threshold) * 0.12;
          el.style.transform = `rotate(${Math.sin(Date.now()*0.0005 + i) * 5}deg)
            translate(${Math.sin(Date.now()*0.0003 + i) * drift}px,
                      ${Math.cos(Date.now()*0.0004 + i) * drift}px)`;
        }
      });
 
      /* ── Echo text — earlier onset, level 30 ── */
      document.querySelectorAll('.echo').forEach(el => {
        if (level > 30) {
          el.style.opacity = Math.min((level - 30) / 70, 1) * 0.14;
        } else {
          el.style.opacity = 0;
        }
      });
 
      /* ── Body trembling — starts level 58 (was 70) ── */
      if (level > 58) {
        body.classList.add('trembling');
        const intensity = (level - 58) / 42;
        body.style.setProperty('--shake-x', (intensity * 3.0).toFixed(1) + 'px');
        body.style.setProperty('--shake-y', (intensity * 2.0).toFixed(1) + 'px');
      } else {
        body.classList.remove('trembling');
      }
 
      /* ── Chaos words — start bleeding in at level 70 ── */
      if (level > 70) {
        document.querySelectorAll('.chaos-word').forEach(el => {
          el.style.opacity = ((level - 70) / 30) * (0.1 + Math.random() * 0.8);
        });
        if (level > 82) resetBtn.classList.add('visible');
      }
 
      /* ── Hue rotation — earlier onset, level 45 ── */
      if (level > 45) {
        const hue = (level - 45) * 1.8;
        body.style.filter = `hue-rotate(${hue}deg)`;
      } else {
        body.style.filter = 'none';
      }
    }
 
    /* ─────────────────────────────────────────
       HELPER — reveal conflict pairs above threshold
    ───────────────────────────────────────── */
    function revealConflictAt(id, threshold, level) {
      const pair = document.getElementById(id);
      if (!pair) return;
      if (level >= threshold) {
        pair.querySelectorAll('.conflict-a, .conflict-b').forEach(el => {
          el.classList.add('visible');
        });
      } else {
        pair.querySelectorAll('.conflict-a, .conflict-b').forEach(el => {
          el.classList.remove('visible');
        });
      }
    }
 
    /* ─────────────────────────────────────────
       RESET — scroll back to top & calm everything
    ───────────────────────────────────────── */
    resetBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
 
      /* Gradually reduce paranoia */
      const calm = setInterval(() => {
        paranoiaLevel = Math.max(0, paranoiaLevel - 3);
        applyParanoia(paranoiaLevel);
        if (paranoiaLevel <= 0) clearInterval(calm);
      }, 50);
 
      /* Reset lyric text */
      document.querySelectorAll('.lyric-line').forEach(el => {
        if (el.dataset.original) el.textContent = el.dataset.original;
        el.style.color = 'var(--text)';
        el.style.filter = 'none';
        el.style.letterSpacing = '0.02em';
      });
 
      hint.style.opacity = '1';
      resetBtn.classList.remove('visible');
    });
 
    /* ─────────────────────────────────────────
       FAKE CURSOR — lags behind real mouse position,
       stutters and glitches as paranoia rises
    ───────────────────────────────────────── */
    const fakeCursor = document.getElementById('fake-cursor');
    let realX = 0, realY = 0;    // where mouse actually is
    let fakeX = 0, fakeY = 0;    // where fake cursor is (lags)
 
    document.addEventListener('mousemove', e => {
      realX = e.clientX;
      realY = e.clientY;
    });
 
    function updateFakeCursor() {
      if (paranoiaLevel > 45) {
        /* Lag amount grows with paranoia — cursor can't keep up with itself */
        const lag = 0.04 + (paranoiaLevel - 45) / 55 * 0.12;
        fakeX += (realX - fakeX) * lag;
        fakeY += (realY - fakeY) * lag;
 
        /* Occasional random stutter-jump */
        if (Math.random() < (paranoiaLevel - 45) / 3000) {
          fakeX += (Math.random() - 0.5) * 30;
          fakeY += (Math.random() - 0.5) * 30;
        }
 
        fakeCursor.style.left = fakeX + 'px';
        fakeCursor.style.top  = fakeY + 'px';
 
        /* Size pulses with paranoia */
        const sz = 10 + (paranoiaLevel - 45) / 55 * 14;
        fakeCursor.style.width  = sz + 'px';
        fakeCursor.style.height = sz + 'px';
      }
      requestAnimationFrame(updateFakeCursor);
    }
    requestAnimationFrame(updateFakeCursor);
 
    /* ─────────────────────────────────────────
       AMBIENT DRIFT — thoughts gently move even when still
    ───────────────────────────────────────── */
    function ambientDrift() {
      /* Drift is now handled inside applyParanoia per scroll tick.
         This loop just keeps thoughts moving when the user isn't scrolling. */
      if (paranoiaLevel > 15) {
        thoughtEls.forEach((el, i) => {
          const t = Date.now() * 0.0004;
          const dx = Math.sin(t + i * 1.3) * (paranoiaLevel / 38);
          const dy = Math.cos(t + i * 0.9) * (paranoiaLevel / 55);
          el.style.transform = `rotate(${Math.sin(t + i) * 5}deg) translate(${dx}px, ${dy}px)`;
        });
      }
      requestAnimationFrame(ambientDrift);
    }
    requestAnimationFrame(ambientDrift);
 
    /* ─────────────────────────────────────────
       INITIAL FADE-IN of title
    ───────────────────────────────────────── */
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        document.getElementById('title-main').classList.add('visible');
        document.getElementById('title-sub').classList.add('visible');
      }, 200);
    });
 