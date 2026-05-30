/**
 * TailoRex — Main Application Script
 * General-purpose JS for the site.
 */

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/9884764/4bh0qc1/';

function captureTrackingParams() {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get('gclid');
    if (gclid) {
        sessionStorage.setItem('gclid', gclid);
    }
}

function getGclid() {
    return sessionStorage.getItem('gclid')
        || new URLSearchParams(window.location.search).get('gclid')
        || '';
}

function getThanksUrl() {
    if (window.location.protocol === 'file:') {
        return new URL('thanks.html', window.location.href).href;
    }

    const path = window.location.pathname.replace(/\/[^/]*$/, '') || '';
    return window.location.origin.replace('http:', 'https:') + path + '/thanks.html';
}

function buildFormPayload(form) {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    payload.page_url = window.location.href;
    payload.page_path = window.location.pathname;
    payload.page_title = document.title;
    payload.referrer = document.referrer || '';
    payload.gclid = getGclid();
    payload.submitted_at = new Date().toISOString();

    return payload;
}

function submitViaHiddenForm(payload) {
    return new Promise((resolve, reject) => {
        const iframeName = 'zapier-submit-' + Date.now();
        const iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.setAttribute('aria-hidden', 'true');
        iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
        document.body.appendChild(iframe);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = ZAPIER_WEBHOOK_URL;
        form.target = iframeName;
        form.style.display = 'none';

        Object.entries(payload).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value ?? '');
            form.appendChild(input);
        });

        document.body.appendChild(form);

        let settled = false;
        const finish = (success) => {
            if (settled) return;
            settled = true;
            clearTimeout(fallbackTimer);
            form.remove();
            iframe.remove();
            success ? resolve() : reject(new Error('Hidden form submit failed'));
        };

        const fallbackTimer = setTimeout(() => finish(true), 2500);

        iframe.addEventListener('load', () => finish(true));
        iframe.addEventListener('error', () => finish(false));

        form.submit();
    });
}

async function submitToZapier(form) {
    const payload = buildFormPayload(form);
    const body = new URLSearchParams(payload).toString();

    try {
        const response = await fetch(ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body
        });

        if (response.ok) {
            return;
        }
    } catch (error) {
        console.warn('Fetch submit failed, trying hidden form fallback:', error);
    }

    await submitViaHiddenForm(payload);
}

function initZapierForms() {
    document.querySelectorAll('form[data-zapier-form]').forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!form.reportValidity()) {
                return;
            }

            const submitBtn = form.querySelector('[type="submit"]');
            const originalHtml = submitBtn?.innerHTML;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                await submitToZapier(form);
                window.location.href = getThanksUrl();
            } catch (error) {
                console.error('Form submission failed:', error);
                alert('Something went wrong sending your message. Please try again or email us directly.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (originalHtml) {
                        submitBtn.innerHTML = originalHtml;
                    }
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    captureTrackingParams();
    initZapierForms();

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
