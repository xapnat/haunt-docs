document.addEventListener('keydown', (e) => {
  const container = document.querySelector('.tabs-container');
  if (!container) return;
  if (e.key === 'ArrowRight') {
    container.scrollBy({ left: 100, behavior: 'smooth' });
  } else if (e.key === 'ArrowLeft') {
    container.scrollBy({ left: -100, behavior: 'smooth' });
  }
});
