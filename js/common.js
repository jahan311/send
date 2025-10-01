// common.js
document.addEventListener("DOMContentLoaded", function () {
    // smooth scroll
    (function () {
        const scrollSpeed = 0.08;
        let targetScroll = window.scrollY;
        let currentScroll = window.scrollY;

        function updateScroll() {
            currentScroll += (targetScroll - currentScroll) * scrollSpeed;
            window.scrollTo(0, currentScroll);
            requestAnimationFrame(updateScroll);
        }

        window.addEventListener("wheel", (e) => {
            e.preventDefault();
            targetScroll += e.deltaY;
            targetScroll = Math.max(0, Math.min(
                targetScroll,
                document.body.scrollHeight - window.innerHeight
            ));
        }, {
            passive: false
        });

        updateScroll();
    })();

    // section on 제어
    (function () {
        const sections = document.querySelectorAll('.contents section:not(.main)');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('on');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach((sec) => observer.observe(sec));
    })();

    // mainSwiper
    (function () {
        const pad2 = n => String(n).padStart(2, '0');
        const $curr = document.querySelector('.swiper_custom .curr');
        const $total = document.querySelector('.swiper_custom .total');
        const section = document.querySelector('section.main');
        const swiperEl = document.querySelector('.mainSwiper');

        if (!swiperEl) return;

        if (window.innerWidth <= 768) {
            const firstSlide = swiperEl.querySelector('.swiper-slide');
            if (firstSlide) {
                const inner = firstSlide.querySelector('.inner');
                if (inner) inner.classList.add('on');
            }
            return;
        }

        let initialSlide = 0;
        const slides = swiperEl.querySelectorAll('.swiper-slide');

        if (section) {
            ['isend', 'point', 'brand'].forEach(cls => {
                if (section.classList.contains(cls)) {
                    slides.forEach((slide, idx) => {
                        if (slide.classList.contains(cls)) {
                            initialSlide = idx;
                        }
                    });
                }
            });
        }

        const swiper = new Swiper('.mainSwiper', {
            speed: 800,
            slidesPerView: 1,
            loop: true,
            initialSlide: initialSlide,
            navigation: {
                prevEl: '.swiper_custom .prev_btn',
                nextEl: '.swiper_custom .next_btn'
            },
            pagination: {
                el: '.swiper_custom .bar',
                type: 'progressbar'
            },
            on: {
                init(s) {
                    const realTotal = s.wrapperEl.querySelectorAll(
                        '.swiper-slide:not(.swiper-slide-duplicate)'
                    ).length;
                    if ($total) $total.textContent = pad2(realTotal);
                    if ($curr) $curr.textContent = pad2(s.realIndex + 1);

                    setTimeout(() => {
                        s.slides.forEach(slide => {
                            const inner = slide.querySelector('.inner');
                            if (inner) inner.classList.remove('on');
                        });
                        const activeInner = s.slides[s.activeIndex].querySelector('.inner');
                        if (activeInner) activeInner.classList.add('on');
                    }, 50);
                },
                slideChange(s) {
                    if ($curr) $curr.textContent = pad2(s.realIndex + 1);

                    s.slides.forEach(slide => {
                        const inner = slide.querySelector('.inner');
                        if (inner) inner.classList.remove('on');
                    });

                    const activeInner = s.slides[s.activeIndex].querySelector('.inner');
                    if (activeInner) {
                        activeInner.classList.remove('on');
                        void activeInner.offsetWidth;
                        activeInner.classList.add('on');
                    }
                }
            }
        });

        window.addEventListener('load', () => {
            const activeInner = swiper.slides[swiper.activeIndex].querySelector('.inner');
            if (activeInner) {
                activeInner.classList.remove('on');
                void activeInner.offsetWidth;
                activeInner.classList.add('on');
            }
        });
    })();

    // mo nav
    (function () {
        const moNavBtn = document.querySelector('.mo_nav_btn');
        const moNav = document.querySelector('.mo_nav');
        let scrollY = 0;

        if (moNavBtn && moNav) {
            moNavBtn.addEventListener('click', function () {
                const isOn = moNavBtn.classList.toggle('on');
                moNav.classList.toggle('on');

                if (isOn) {
                    scrollY = window.scrollY;

                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${scrollY}px`;
                    document.body.style.left = '0';
                    document.body.style.right = '0';
                } else {
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.left = '';
                    document.body.style.right = '';

                    window.scrollTo(0, scrollY);
                }
            });
        }
    })();
});