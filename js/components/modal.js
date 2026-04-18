// ============================================
// Modal Component
// ============================================

export function openModal(title, bodyHtml, footerHtml = '') {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="action-btn" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

  document.addEventListener('keydown', handleEsc);
}

function handleEsc(e) {
  if (e.key === 'Escape') closeModal();
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 200);
  }
  document.removeEventListener('keydown', handleEsc);
}

export default { openModal, closeModal };
