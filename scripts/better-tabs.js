(function () {
  function findTablists(root = document) {
    return Array.from(root.querySelectorAll(
      '[role="tablist"], .tab-list, .tabs, [data-tab-list]'
    ));
  }

  function enhance(tablist) {
    if (!tablist || tablist.__enhanced) return;
    tablist.__enhanced = true;

    const wrapper = document.createElement('div');
    wrapper.className = 'tablist-scroller';
    const viewport = document.createElement('div');
    viewport.className = 'tablist-viewport';

    const left = document.createElement('button');
    left.className = 'tab-scroll left';
    left.type = 'button';
    left.setAttribute('aria-label', 'Scroll left');
    left.textContent = '‹';

    const right = document.createElement('button');
    right.className = 'tab-scroll right';
    right.type = 'button';
    right.setAttribute('aria-label', 'Scroll right');
    right.textContent = '›';

    const parent = tablist.parentNode;
    parent.insertBefore(wrapper, tablist);
    wrapper.appendChild(left);
    wrapper.appendChild(viewport);
    wrapper.appendChild(right);
    viewport.appendChild(tablist);

    tablist.style.display = 'flex';
    tablist.style.flexWrap = 'nowrap';
    tablist.style.whiteSpace = 'nowrap';

    const step = () => Math.max(180, viewport.clientWidth * 0.5);
    left.addEventListener('click', () => viewport.scrollBy({ left: -step(), behavior: 'smooth' }));
    right.addEventListener('click', () => viewport.scrollBy({ left:  step(), behavior: 'smooth' }));

    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    const updateArrows = () => {
      const max = viewport.scrollWidth - viewport.clientWidth - 1;
      left.disabled  = viewport.scrollLeft <= 0;
      right.disabled = viewport.scrollLeft >= max;
      viewport.style.setProperty('--fade-opacity-left', left.disabled ? '0' : '1');
      viewport.style.setProperty('--fade-opacity-right', right.disabled ? '0' : '1');
    };
    viewport.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    requestAnimationFrame(updateArrows);
  }

  function enhanceAll(root = document) {
    findTablists(root).forEach(enhance);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(enhanceAll);
    });
  } else {
    requestAnimationFrame(enhanceAll);
  }

  const observer = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes && m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          enhanceAll(node);
        }
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();