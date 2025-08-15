(function() {
    'use strict';
    
    const SCROLL_SPEED = 40;
    const ARROW_SIZE = '24px';
    const ARROW_COLOR = '#666';
    const ARROW_HOVER_COLOR = '#333';
    
    function initTabScrolling() {
        const tabContainers = document.querySelectorAll('.tabs, [class*="tab"]');
        
        tabContainers.forEach(container => {
            const tabList = container.querySelector('[role="tablist"], .tab-list, .tabs-header');
            if (!tabList) return;
            
            setupScrollableTabContainer(tabList);
        });
    }
    
    function setupScrollableTabContainer(tabList) {
        const wrapper = document.createElement('div');
        wrapper.className = 'tab-scroll-wrapper';
        wrapper.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
        `;
        
        tabList.parentNode.insertBefore(wrapper, tabList);
        wrapper.appendChild(tabList);
        
        tabList.style.cssText += `
            overflow-x: auto;
            overflow-y: hidden;
            scroll-behavior: smooth;
            scrollbar-width: none;
            -ms-overflow-style: none;
            display: flex;
            flex-wrap: nowrap;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .tab-scroll-wrapper [role="tablist"]::-webkit-scrollbar,
            .tab-scroll-wrapper .tab-list::-webkit-scrollbar,
            .tab-scroll-wrapper .tabs-header::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);
        
        const leftArrow = createArrow('left', '◀');
        const rightArrow = createArrow('right', '▶');
        
        wrapper.insertBefore(leftArrow, tabList);
        wrapper.appendChild(rightArrow);
        
        function updateArrows() {
            const canScrollLeft = tabList.scrollLeft > 0;
            const canScrollRight = tabList.scrollLeft < (tabList.scrollWidth - tabList.clientWidth);
            
            leftArrow.style.display = canScrollLeft ? 'flex' : 'none';
            rightArrow.style.display = canScrollRight ? 'flex' : 'none';
        }
        
        leftArrow.addEventListener('click', () => {
            tabList.scrollBy({ left: -100, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            tabList.scrollBy({ left: 100, behavior: 'smooth' });
        });
        
        tabList.addEventListener('wheel', (e) => {
            e.preventDefault();
            const scrollAmount = e.deltaY > 0 ? SCROLL_SPEED : -SCROLL_SPEED;
            tabList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        tabList.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                tabList.scrollBy({ left: -50, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                tabList.scrollBy({ left: 50, behavior: 'smooth' });
            }
        });
        
        tabList.addEventListener('scroll', updateArrows);
        
        window.addEventListener('resize', updateArrows);
        
        setTimeout(updateArrows, 100);
        
        const observer = new MutationObserver(updateArrows);
        observer.observe(tabList, { childList: true, subtree: true });
    }
    
    function createArrow(direction, symbol) {
        const arrow = document.createElement('button');
        arrow.className = `tab-scroll-arrow tab-scroll-arrow-${direction}`;
        arrow.innerHTML = symbol;
        arrow.setAttribute('aria-label', `Scroll tabs ${direction}`);
        
        arrow.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            ${direction === 'left' ? 'left: 0;' : 'right: 0;'}
            width: ${ARROW_SIZE};
            height: ${ARROW_SIZE};
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ddd;
            border-radius: 50%;
            color: ${ARROW_COLOR};
            font-size: 12px;
            cursor: pointer;
            z-index: 10;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        arrow.addEventListener('mouseenter', () => {
            arrow.style.color = ARROW_HOVER_COLOR;
            arrow.style.background = 'rgba(255, 255, 255, 1)';
            arrow.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        });
        
        arrow.addEventListener('mouseleave', () => {
            arrow.style.color = ARROW_COLOR;
            arrow.style.background = 'rgba(255, 255, 255, 0.9)';
            arrow.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        
        return arrow;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabScrolling);
    } else {
        initTabScrolling();
    }
    
    const pageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const newTabs = node.querySelectorAll && node.querySelectorAll('.tabs, [class*="tab"]');
                        if (newTabs && newTabs.length > 0) {
                            setTimeout(initTabScrolling, 100);
                        }
                    }
                });
            }
        });
    });
    
    pageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();