/**
 * TailoRex — Main Application Script
 * General-purpose JS for the site.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('TailoRex loaded');

    // ——— Evolution Panels Accordion ———
    const container = document.getElementById('evolution-panels');
    if (container) {
        const panels = Array.from(container.children);
        const PRIMARY_BG = 'linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.04))';

        function activatePanel(index) {
            panels.forEach((panel, i) => {
                const collapsedView = panel.children[1]; // icon + label (centered)
                const expandedView = panel.children[2];  // full content
                const numberSpan = panel.children[0];     // 01, 02, etc.
                const isActive = i === index;

                // Flex sizing
                panel.style.flex = isActive ? '3' : '1';

                // Background
                panel.style.background = isActive ? PRIMARY_BG : '';

                // Number styling
                if (numberSpan) {
                    if (isActive) {
                        numberSpan.className = numberSpan.className
                            .replace('text-4xl', 'text-6xl')
                            .replace('text-muted-foreground/10', 'text-primary/20');
                    } else {
                        numberSpan.className = numberSpan.className
                            .replace('text-6xl', 'text-4xl')
                            .replace('text-primary/20', 'text-muted-foreground/10');
                    }
                }

                // Collapsed view: hide when active, show when inactive
                if (collapsedView) {
                    if (isActive) {
                        collapsedView.style.opacity = '0';
                        collapsedView.style.pointerEvents = 'none';
                    } else {
                        collapsedView.style.opacity = '1';
                        collapsedView.style.pointerEvents = '';
                    }
                }

                // Expanded view: show when active, hide when inactive
                if (expandedView) {
                    if (panel.expandTimeout) clearTimeout(panel.expandTimeout);

                    if (isActive) {
                        panel.expandTimeout = setTimeout(() => {
                            expandedView.style.opacity = '1';
                            expandedView.style.pointerEvents = '';
                        }, 150);
                    } else {
                        expandedView.style.opacity = '0';
                        expandedView.style.pointerEvents = 'none';
                    }
                }
            });
        }

        // Bind click and mouseenter to each panel
        panels.forEach((panel, i) => {
            panel.addEventListener('mouseenter', () => activatePanel(i));
            panel.addEventListener('click', () => activatePanel(i));
        });

        // First panel expanded by default (already set in HTML, but reinforce)
        activatePanel(0);
    }

    // ——— Counter Animation ———
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'), 10);
                    const duration = 2000; // 2 seconds
                    const frameDuration = 1000 / 60; // 60fps
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;

                    const counter = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        // easeOutCubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentCount = Math.round(countTo * easeOut);

                        target.innerText = currentCount;

                        if (frame === totalFrames) {
                            clearInterval(counter);
                            target.innerText = countTo;
                        }
                    }, frameDuration);

                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});
