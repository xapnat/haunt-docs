document.querySelectorAll('.tab-container').forEach(container => {
    const list = container.querySelector('.tab-list');
    const leftBtn = container.querySelector('.tab-scroll.left');
    const rightBtn = container.querySelector('.tab-scroll.right');

    leftBtn.addEventListener('click', () => {
        list.scrollBy({ left: -150, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', () => {
        list.scrollBy({ left: 150, behavior: 'smooth' });
    });

    list.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            list.scrollLeft += e.deltaY;
        }
    });
});
