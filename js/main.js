/**
 * IIT (ISM) DHANBAD — OFFICIAL WEBSITE SCRIPTS
 * Core interactions, mobile navigation, video scroll-scrubbing, and demo notices
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initVideoHero();
  initDemoForms();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    });

    // Close when clicking nav links
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        toggleBtn.innerHTML = '&#9776;';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   Landing Page Video: Scroll-Scrubbing & Resilient Playback
   -------------------------------------------------------------------------- */
function initVideoHero() {
  const videoWrapper = document.querySelector('.video-scrub-wrapper');
  const video = document.getElementById('heroLandingVideo');
  const skipBtn = document.getElementById('skipHeroVideoBtn');
  const statusTag = document.getElementById('videoStatusTag');
  const localPicker = document.getElementById('localVideoPicker');

  if (!video) return;

  // Respect Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Handle Skip Button
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('heritageTransitionSection') || document.querySelector('.stats-bar');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Handle local video picker fallback if user tests with local file directly
  if (localPicker) {
    localPicker.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        video.src = fileUrl;
        video.load();
        const fallbackNotice = document.querySelector('.video-fallback-box');
        if (fallbackNotice) fallbackNotice.style.display = 'none';
        video.style.display = 'block';
        if (statusTag) statusTag.innerHTML = '&#9654; Friend\'s Video Loaded';
      }
    });
  }

  let isLoaded = false;
  video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
    if (statusTag) statusTag.innerHTML = '&#9679; Video Ready (Scroll to Scrub)';
  });

  // If video encounters an error (e.g. file pending placement)
  video.addEventListener('error', () => {
    console.info('Video file pending at assets/video/landing-animation.mp4. Showing fallback selector.');
    const fallbackBox = document.querySelector('.video-fallback-box');
    if (fallbackBox) {
      fallbackBox.style.display = 'block';
    }
  });

  // Scroll Scrubbing Controller
  const runway = document.querySelector('.hero-video-container');
  if (!runway || prefersReducedMotion) {
    if (video) {
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.play().catch(() => {});
    }
    return;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateVideoOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  function updateVideoOnScroll() {
    if (!isLoaded || !video.duration) return;

    const rect = runway.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far down runway we have scrolled
    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      const totalScrollable = rect.height - windowHeight;
      const currentScroll = Math.abs(rect.top);
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 0.999);
      
      // Update video frame safely
      if (isFinite(video.duration)) {
        video.currentTime = progress * video.duration;
      }
    }
  }
}

/* --------------------------------------------------------------------------
   Demo Form Validation & Honest Transparency Notice
   -------------------------------------------------------------------------- */
function initDemoForms() {
  const forms = document.querySelectorAll('form[data-demo-form="true"]');
  const toast = document.getElementById('demoToastNotice');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic HTML5 validation check
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Show honest feedback notice
      showToast(
        "Demonstration Form: Your input has been validated. As this is a static frontend deployment, no data has been transmitted to institute servers. Configure backend SMTP/REST API to enable live mail dispatch."
      );

      form.reset();
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('demoToastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'demoToastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 6500);
}

/* --------------------------------------------------------------------------
   Back To Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const bttBtn = document.getElementById('backToTopBtn');
  if (!bttBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.style.display = 'flex';
    } else {
      bttBtn.style.display = 'none';
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
