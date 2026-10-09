/**
 * IIT (ISM) DHANBAD — HIGH-QUALITY CANVAS SCROLL ANIMATION
 * Pure 300-Frame Image Sequence Scrubbing (No Text Overlay)
 * Ultra-smooth 60fps canvas rendering with progressive preloading
 */

(() => {
  const TOTAL_FRAMES = 300;
  const FRAME_PATH = (idx) => `assets/video/frames/frame_${String(idx).padStart(6, '0')}.jpg`;

  const canvas = document.getElementById('animationCanvas');
  const track = document.getElementById('animationScrollTrack');
  if (!canvas || !track) return;

  const ctx = canvas.getContext('2d');
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrameIndex = 0;
  let lastDrawnIndex = -1;
  let isTicking = false;

  // Set canvas size for high-DPI screens
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawFrame(currentFrameIndex);
  }

  // Draw frame with object-fit: cover math
  function drawFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return;

    let img = images[index];
    // If target frame is not loaded yet, find nearest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 0 && images[index - offset] && images[index - offset].complete) {
          img = images[index - offset];
          break;
        }
        if (index + offset < TOTAL_FRAMES && images[index + offset] && images[index + offset].complete) {
          img = images[index + offset];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = img.naturalWidth * ratio;
    const drawH = img.naturalHeight * ratio;
    const shiftX = (canvas.width - drawW) / 2;
    const shiftY = (canvas.height - drawH) / 2;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, drawW, drawH);
    lastDrawnIndex = index;
  }

  // Preloading Strategy:
  // 1. Immediately load frame 1
  // 2. Load step-5 keyframes for fast scrubbing
  // 3. Load all remaining frames
  function preloadImages() {
    // First frame
    const firstImg = new Image();
    firstImg.src = FRAME_PATH(1);
    images[0] = firstImg;
    firstImg.onload = () => {
      loadedCount++;
      drawFrame(0);
    };

    // Progressive keyframe loading
    const priorityIndices = [];
    for (let i = 1; i < TOTAL_FRAMES; i += 4) {
      priorityIndices.push(i);
    }
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (i % 4 !== 0) priorityIndices.push(i);
    }

    let loadIdx = 0;
    function loadNextBatch(batchSize = 12) {
      const end = Math.min(loadIdx + batchSize, priorityIndices.length);
      for (let j = loadIdx; j < end; j++) {
        const frameIdx = priorityIndices[j];
        if (!images[frameIdx]) {
          const img = new Image();
          img.src = FRAME_PATH(frameIdx + 1);
          images[frameIdx] = img;
          img.onload = () => {
            loadedCount++;
            if (currentFrameIndex === frameIdx) {
              drawFrame(frameIdx);
            }
          };
        }
      }
      loadIdx = end;
      if (loadIdx < priorityIndices.length) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => loadNextBatch(batchSize));
        } else {
          setTimeout(() => loadNextBatch(batchSize), 20);
        }
      }
    }

    loadNextBatch(15);
  }

  // Scroll Handler
  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateFrameFromScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  function updateFrameFromScroll() {
    const rect = track.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = rect.height - windowH;

    if (totalDist <= 0) return;

    // Calculate progress through track (0.0 to 1.0)
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalDist));
    const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));

    if (targetIndex !== currentFrameIndex) {
      currentFrameIndex = targetIndex;
      drawFrame(currentFrameIndex);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // Init
  resizeCanvas();
  preloadImages();
})();
