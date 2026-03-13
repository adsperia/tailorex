/**
 * TailoRex — Main Application Script
 * General-purpose JS for the site.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('TailoRex loaded');

    // ——— Viewport Fade-Up Animation ———
    const animatedElements = document.querySelectorAll('.animate-fade-up');
    if (animatedElements.length > 0) {
        document.body.classList.add('animate-on-scroll');

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealAll = () => {
            animatedElements.forEach((element) => element.classList.add('is-visible'));
        };

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealAll();
        } else {
            const animationObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    });
                },
                {
                    root: null,
                    threshold: 0.15,
                    rootMargin: '0px 0px -10% 0px'
                }
            );

            animatedElements.forEach((element) => animationObserver.observe(element));
        }
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
