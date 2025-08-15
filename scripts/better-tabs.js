const wrappers = document.querySelectorAll('.tabs-wrapper');
wrappers.forEach(wrapper => {
  const container = wrapper.querySelector('.tabs-scroll-container');
  const leftBtn = wrapper.querySelector('.tab-scroll.left');
  const rightBtn = wrapper.querySelector('.tab-scroll.right');

  const updateButtons = () => {
    leftBtn.disabled = container.scrollLeft <= 0;
    rightBtn.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
  }

  leftBtn.addEventListener('click', () => {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  });
  rightBtn.addEventListener('click', () => {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  });

  container.addEventListener('scroll', updateButtons);
  updateButtons();
});