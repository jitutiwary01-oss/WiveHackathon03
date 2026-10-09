/**
 * IIT (ISM) DHANBAD — ADMISSIONS PAGE & PROFESSOR ZORO POPUP CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initZoroPopup();
  initAdmissionsTabs();
});

function initZoroPopup() {
  const modalBackdrop = document.getElementById('zoroWelcomeModal');
  if (!modalBackdrop) return;

  const btnExplore = document.getElementById('zoroBtnExplore');
  const btnMaybeLater = document.getElementById('zoroBtnLater');
  const btnClose = document.getElementById('zoroBtnClose');
  const avatarImg = document.getElementById('zoroAvatarImg');
  const avatarPlaceholder = document.getElementById('zoroAvatarPlaceholder');

  // Check if user provided zoro.png
  if (avatarImg) {
    avatarImg.addEventListener('load', () => {
      avatarImg.style.display = 'block';
      if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
    });
    avatarImg.addEventListener('error', () => {
      // Gracefully show clean editorial badge if pending user asset
      avatarImg.style.display = 'none';
      if (avatarPlaceholder) avatarPlaceholder.style.display = 'flex';
    });
  }

  // Check session storage
  const isDismissed = sessionStorage.getItem('iitism_zoro_popup_dismissed');
  if (!isDismissed) {
    // Show after natural delay
    setTimeout(() => {
      openModal();
    }, 1200);
  }

  function openModal() {
    modalBackdrop.classList.add('is-active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    if (btnExplore) btnExplore.focus();
    document.addEventListener('keydown', handleKeydown);
  }

  function closeModal(persist = true) {
    modalBackdrop.classList.remove('is-active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKeydown);
    if (persist) {
      sessionStorage.setItem('iitism_zoro_popup_dismissed', 'true');
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeModal(true);
    }
  }

  // Event Listeners
  if (btnClose) {
    btnClose.addEventListener('click', () => closeModal(true));
  }

  if (btnMaybeLater) {
    btnMaybeLater.addEventListener('click', () => closeModal(true));
  }

  if (btnExplore) {
    btnExplore.addEventListener('click', () => {
      closeModal(true);
      const target = document.getElementById('admissions-programmes');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Close on backdrop click outside dialog
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal(true);
    }
  });
}

function initAdmissionsTabs() {
  const tabs = document.querySelectorAll('.admissions-tab-btn');
  const contents = document.querySelectorAll('.admissions-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
      }
    });
  });
}
