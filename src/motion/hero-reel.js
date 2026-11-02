import gsap from 'gsap';

const SEGMENT = 3.4; // seconds each clip holds the screen
const REVEAL = 1.1; // noise → image
const NOISE_REST = 0.08; // the faint grain left once a frame is "denoised"
const AMBIENT_EVERY = 90; // ms between ambient redraws

/**
 * Full-bleed showreel in the hero. Two <video> elements take turns: the
 * incoming clip starts as static and blur, then resolves into the frame
 * while the prompt that made it types into the caption.
 *
 * Stays paused while off screen, while the tab is hidden, and when the
 * visitor presses pause. With reduced motion it never autoplays.
 */
export function createHeroReel(root, clips, { reducedMotion }) {
  const videos = [...root.querySelectorAll('[data-reel-video]')];
  const noise = root.querySelector('[data-reel-noise]');
  const ambient = root.querySelector('[data-reel-ambient]');
  const promptEl = root.querySelector('[data-reel-prompt]');
  const clientEl = root.querySelector('[data-reel-client]');
  const countEl = root.querySelector('[data-reel-count]');
  const toggle = root.querySelector('[data-reel-toggle]');
  const progress = root.querySelector('[data-reel-progress]');

  progress.innerHTML = clips.map(() => '<span></span>').join('');
  const bars = [...progress.children];
  const ctx = ambient?.getContext('2d');

  let tl = null;
  let front = 0; // index of the <video> currently on top
  let started = false;
  let userPaused = reducedMotion;
  let inView = true;
  let raf = 0;
  let lastDraw = 0;

  const pad = (n) => String(n).padStart(2, '0');

  const load = (video, clip) => {
    if (video.dataset.clip === clip.id) return;
    video.dataset.clip = clip.id;
    video.poster = clip.poster;
    video.src = clip.src;
    video.preload = 'auto';
  };

  const caption = (i, typedChars = Infinity) => {
    const clip = clips[i];
    promptEl.textContent = clip.prompt.slice(0, typedChars);
    clientEl.textContent = `${clip.client} · ${clip.category}`;
    countEl.textContent = `${pad(i + 1)} / ${pad(clips.length)}`;
  };

  const shouldPlay = () => started && !userPaused && inView && !document.hidden;

  /* Ambient: the current frame drawn tiny, then blurred and scaled by CSS */
  const drawAmbient = (now) => {
    raf = requestAnimationFrame(drawAmbient);
    if (now - lastDraw < AMBIENT_EVERY) return;
    lastDraw = now;
    const v = videos[front];
    if (v.readyState >= 2) ctx.drawImage(v, 0, 0, ambient.width, ambient.height);
  };
  const ambientOn = () => ctx && getComputedStyle(ambient).display !== 'none';

  const cut = (i, slot) => {
    const clip = clips[i];
    const incoming = videos[slot];
    const outgoing = videos[slot ^ 1];
    front = slot;

    load(incoming, clip);
    incoming.currentTime = 0;
    incoming.play().catch(() => {});
    gsap.set(incoming, { zIndex: 1 });
    gsap.set(outgoing, { zIndex: 0 });

    if (i === 0) bars.forEach((b) => b.style.setProperty('--p', 0));
    bars.slice(0, i).forEach((b) => b.style.setProperty('--p', 1));

    const typed = { n: 0 };
    tl = gsap.timeline({ onComplete: () => cut((i + 1) % clips.length, slot ^ 1) });

    if (reducedMotion) {
      tl.set(incoming, { opacity: 1 }).set(outgoing, { opacity: 0 });
      caption(i);
    } else {
      caption(i, 0);
      tl.fromTo(
        incoming,
        { opacity: 0, scale: 1.08, filter: 'blur(18px) saturate(0.3)' },
        { opacity: 1, scale: 1, filter: 'blur(0px) saturate(1)', duration: REVEAL, ease: 'power2.out' },
        0,
      )
        .fromTo(noise, { '--noise': 0.95 }, { '--noise': NOISE_REST, duration: REVEAL * 1.1, ease: 'power2.out' }, 0)
        .fromTo(noise, { backgroundPosition: '0px 0px' }, { backgroundPosition: '200px 140px', duration: REVEAL, ease: 'steps(14)' }, 0)
        .set(outgoing, { opacity: 0 }, REVEAL)
        .to(
          typed,
          {
            n: clip.prompt.length,
            duration: Math.min(clip.prompt.length * 0.028, 1.3),
            ease: 'none',
            onUpdate: () => caption(i, Math.round(typed.n)),
          },
          0.15,
        );
    }

    tl.fromTo(bars[i], { '--p': 0 }, { '--p': 1, duration: SEGMENT, ease: 'none' }, 0);
    // Warm up the next clip on the hidden element once this one has landed
    tl.call(() => load(outgoing, clips[(i + 1) % clips.length]), null, REVEAL + 0.1);
    tl.set({}, {}, SEGMENT);
  };

  const sync = () => {
    const play = shouldPlay();
    toggle.setAttribute('aria-pressed', String(userPaused));
    if (!started) return;
    if (play) {
      tl?.resume();
      videos[front].play().catch(() => {});
      if (ambientOn() && !raf) raf = requestAnimationFrame(drawAmbient);
    } else {
      tl?.pause();
      videos.forEach((v) => v.pause());
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  // Initial frame: first clip loaded, caption filled. Before the intro
  // reveals it, the frame is pure static: the "before" of denoising.
  load(videos[0], clips[0]);
  caption(0);
  if (!reducedMotion) {
    gsap.set(videos[0], { opacity: 0 });
    gsap.set(noise, { '--noise': 0.95 });
  }

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    if (!userPaused && !started) {
      started = true;
      cut(0, 0);
    }
    sync();
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(root);
  document.addEventListener('visibilitychange', sync);

  return {
    /** Called by the hero intro. With reduced motion this only paints the first frame. */
    start() {
      if (started || userPaused) {
        sync();
        return;
      }
      started = true;
      cut(0, 0);
      sync();
    },
  };
}
