document.addEventListener('keydown', (e) => {
  const tabList = document.querySelector('[role="tablist"]');
  if (!tabList) return;
  if (e.key === 'ArrowRight') {
    tabList.scrollBy({ left: 100, behavior: 'smooth' });
  } else if (e.key === 'ArrowLeft') {
    tabList.scrollBy({ left: -100, behavior: 'smooth' });
  }
});
