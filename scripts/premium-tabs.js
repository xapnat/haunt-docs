(function() {
    'use strict';
    
    const SCROLL_SPEED = 60;
    const ARROW_SIZE = '32px';
    const ARROW_COLOR = '#666';
    const ARROW_HOVER_COLOR = '#333';
    
    function initTabScrolling() {
        const tabContainers = document.querySelectorAll('div:has(> [role="tab"]), .tabs, [class*="tab"]');
        
        tabContainers.forEach(container => {
            let tabList = container.querySelector('[role="tablist"]');
            if (!tabList) {
                const tabs = container.querySelectorAll('[role="tab"]');
                if (tabs.length > 0) {
                    tabList = tabs[0].parentElement;
                }
            }
            if (!tabList) return;
            
            if (tabList.querySelector('.tab-scroll-wrapper')) return;
            
            setupScrollableTabContainer(tabList);
        });
    }
    
    function setupScrollableTabContainer(tabList) {
        const wrapper = document.createElement('div');
        wrapper.className = 'tab-scroll-wrapper';
        wrapper.style.cssText = `
            position: relative;
            display: block;
            width: 100%;
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
            white-space: nowrap;
            padding: 0 40px;
        `;
        
        const style = document.createElement('style');
        if (!document.querySelector('#tab-scroll-styles')) {
            style.id = 'tab-scroll-styles';
            style.textContent = `
                .tab-scroll-wrapper *::-webkit-scrollbar {
                    display: none;
                }
                .tab-scroll-wrapper [role="tab"] {
                    flex-shrink: 0;
                    white-space: nowrap;
                }
            `;
            document.head.appendChild(style);
        }
        
        const leftArrow = createArrow('left', '‹');
        const rightArrow = createArrow('right', '›');
        
        wrapper.insertBefore(leftArrow, tabList);
        wrapper.appendChild(rightArrow);
        
        function updateArrows() {
            const canScrollLeft = tabList.scrollLeft > 5;
            const canScrollRight = tabList.scrollLeft < (tabList.scrollWidth - tabList.clientWidth - 5);
            
            leftArrow.style.opacity = canScrollLeft ? '1' : '0';
            leftArrow.style.pointerEvents = canScrollLeft ? 'auto' : 'none';
            rightArrow.style.opacity = canScrollRight ? '1' : '0';
            rightArrow.style.pointerEvents = canScrollRight ? 'auto' : 'none';
        }
        
        leftArrow.addEventListener('click', () => {
            tabList.scrollBy({ left: -150, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            tabList.scrollBy({ left: 150, behavior: 'smooth' });
        });
        
        wrapper.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            
            e.preventDefault();
            const scrollAmount = e.deltaY > 0 ? SCROLL_SPEED : -SCROLL_SPEED;
            tabList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        tabList.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                tabList.scrollBy({ left: -100, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                tabList.scrollBy({ left: 100, behavior: 'smooth' });
            }
        });
        
        tabList.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        
        setTimeout(() => {
            updateArrows();
        }, 250);
        
        const observer = new MutationObserver(() => {
            setTimeout(updateArrows, 100);
        });
        observer.observe(tabList, { childList: true, subtree: true });
    }
    
    function createArrow(direction, symbol) {
        const arrow = document.createElement('button');
        arrow.className = `tab-scroll-arrow tab-scroll-arrow-${direction}`;
        arrow.innerHTML = symbol;
        arrow.setAttribute('aria-label', `Scroll tabs ${direction}`);
        arrow.setAttribute('type', 'button');
        
        arrow.style.cssText = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            ${direction === 'left' ? 'left: 8px;' : 'right: 8px;'}
            width: ${ARROW_SIZE};
            height: ${ARROW_SIZE};
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #e0e0e0;
            border-radius: 50%;
            color: ${ARROW_COLOR};
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            opacity: 0;
            user-select: none;
        `;
        
        arrow.addEventListener('mouseenter', () => {
            arrow.style.color = ARROW_HOVER_COLOR;
            arrow.style.background = 'rgba(255, 255, 255, 1)';
            arrow.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            arrow.style.transform = 'translateY(-50%) scale(1.05)';
        });
        
        arrow.addEventListener('mouseleave', () => {
            arrow.style.color = ARROW_COLOR;
            arrow.style.background = 'rgba(255, 255, 255, 0.95)';
            arrow.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            arrow.style.transform = 'translateY(-50%) scale(1)';
        });
        
        return arrow;
    }
    
    function init() {
        initTabScrolling();
        
        const observer = new MutationObserver((mutations) => {
            let shouldReinit = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const hasTabsOrRoles = node.querySelector && (
                                node.querySelector('[role="tab"]') || 
                                node.querySelector('.tabs') ||
                                node.matches('[role="tab"]') ||
                                node.matches('.tabs')
                            );
                            if (hasTabsOrRoles) {
                                shouldReinit = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldReinit) {
                setTimeout(initTabScrolling, 300);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();