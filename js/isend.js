document.addEventListener("DOMContentLoaded", function () {

  // sc02
  const previewItems = document.querySelectorAll(".preview_box li");
  const tabItems = document.querySelectorAll(".tab_box li");
  let currentPreview = 0;
  let previewInterval;

  function activatePreview(index) {
    previewItems.forEach((el, i) => {
      el.classList.toggle("show", i === index);
    });
    tabItems.forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
    currentPreview = index;
  }

  function startPreviewInterval() {
    stopPreviewInterval();
    previewInterval = setInterval(() => {
      let next = (currentPreview + 1) % previewItems.length;
      activatePreview(next);
    }, 3000);
  }

  function stopPreviewInterval() {
    if (previewInterval) {
      clearInterval(previewInterval);
      previewInterval = null;
    }
  }

  tabItems.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      stopPreviewInterval();
      activatePreview(idx);
      startPreviewInterval();
    });
  });

  const sc02 = document.querySelector("section.sc02");
  if (sc02 && previewItems.length > 0 && tabItems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!previewInterval) startPreviewInterval();
        } else {
          stopPreviewInterval();
        }
      });
    }, {
      threshold: 0.5
    });
    observer.observe(sc02);
  }

  // sc04
  const slides = document.querySelectorAll('.sc04Swiper .swiper-slide');
  let currentIndex = 0;
  const nextBtn = document.querySelector('.sc04 .next_btn');
  const prevBtn = document.querySelector('.sc04 .prev_btn');
  let initDone = false;

  function adjustSwiperLayout() {
    const swiperEl = document.querySelector('.sc04Swiper');
    const activeSlide = document.querySelector('.sc04Swiper .swiper-slide.active');
    if (swiperEl && activeSlide) {
      swiperEl.style.height = activeSlide.scrollHeight + 'px';
    }
  }

  function updateSlides() {
    slides.forEach(slide => slide.classList.remove('prev', 'active', 'next'));
    if (slides.length > 0) {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      const nextIndex = (currentIndex + 1) % slides.length;
      slides[prevIndex].classList.add('prev');
      slides[currentIndex].classList.add('active');
      slides[nextIndex].classList.add('next');
    }

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;

    if (initDone) {
      adjustSwiperLayout();
    }
  }

  function initSwiperLayout() {
    const images = document.querySelectorAll('.sc04Swiper img');
    let loaded = 0;

    if (images.length === 0) {
      adjustSwiperLayout();
      initDone = true;
      return;
    }

    images.forEach(img => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) {
          adjustSwiperLayout();
          initDone = true;
        }
      } else {
        img.addEventListener("load", () => {
          loaded++;
          if (loaded === images.length) {
            adjustSwiperLayout();
            initDone = true;
          }
        });
      }
    });
  }

  if (slides.length > 0) {
    updateSlides();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
          currentIndex++;
          updateSlides();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlides();
        }
      });
    }

    const swiperEl = document.querySelector('.sc04Swiper');
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isScrolling = false;

    function dragStart(x, y) {
      startX = x;
      startY = y;
      isDragging = true;
      isScrolling = false;
    }

    function dragMove(x, y, e) {
      if (!isDragging) return;
      const diffX = x - startX;
      const diffY = y - startY;

      if (Math.abs(diffY) > Math.abs(diffX)) {
        isScrolling = true;
      } else {
        e.preventDefault();
      }
    }

    function dragEnd(x) {
      if (!isDragging || isScrolling) {
        isDragging = false;
        return;
      }

      const diffX = x - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentIndex > 0) {
          currentIndex--;
          updateSlides();
        } else if (diffX < 0 && currentIndex < slides.length - 1) {
          currentIndex++;
          updateSlides();
        }
      }
      isDragging = false;
    }

    if (swiperEl) {
      swiperEl.addEventListener('touchstart', e => dragStart(e.touches[0].clientX, e.touches[0].clientY), {
        passive: true
      });
      swiperEl.addEventListener('touchmove', e => dragMove(e.touches[0].clientX, e.touches[0].clientY, e), {
        passive: false
      });
      swiperEl.addEventListener('touchend', e => dragEnd(e.changedTouches[0].clientX));

      swiperEl.addEventListener('mousedown', e => dragStart(e.clientX, e.clientY));
      swiperEl.addEventListener('mousemove', e => dragMove(e.clientX, e.clientY, e));
      swiperEl.addEventListener('mouseup', e => dragEnd(e.clientX));
    }
  }

  window.addEventListener("load", initSwiperLayout);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (initDone) {
        adjustSwiperLayout();
      }
    }, 200);
  });


  // sc05
  (function () {
    const sc05 = document.querySelector('.sc05');
    if (!sc05) return;

    const swiperEl = sc05.querySelector('.sc05Swiper .swiper-wrapper');
    const slides = sc05.querySelectorAll('.sc05Swiper .swiper-slide');
    const totalEl = sc05.querySelector('.sc05 .paging .all');
    const nowEl = sc05.querySelector('.sc05 .paging .now');
    let copyCount = 3;

    const slidesLength = slides.length;
    if (totalEl) totalEl.textContent = String(slidesLength).padStart(2, '0');
    slides.forEach((el, i) => el.setAttribute('_number', i + 1));

    for (let i = 0; i < copyCount; i++) {
      const clones = Array.from(slides).map((el) => {
        const clone = el.cloneNode(true);
        clone.classList.add(`clone_${i}`);
        return clone;
      });
      clones.forEach((clone) => swiperEl.appendChild(clone));
    }

    let lastRealIndex = 0;
    const sc05Swiper = new Swiper('.sc05Swiper', {
      loop: false,
      centeredSlides: true,
      speed: 800,
      slidesPerView: 1,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.sc05 .next_btn',
        prevEl: '.sc05 .prev_btn',
      },
      on: {
        slideChange: function () {
          if (this.realIndex !== lastRealIndex) {
            const nowNum = this.realIndex + 1;
            if (nowEl) nowEl.textContent = String(nowNum).padStart(2, '0');
            updateNavState(this.realIndex);
            lastRealIndex = this.realIndex;
          }
        }
      }
    });

    function updateNavState(realIndex) {
      const first = 0;
      const last = slidesLength - 1;

      const prevBtn = sc05.querySelector('.sc05 .prev_btn');
      const nextBtn = sc05.querySelector('.sc05 .next_btn');

      if (prevBtn) {
        if (realIndex === first) {
          prevBtn.setAttribute('disabled', 'true');
          sc05Swiper.allowSlidePrev = false;
        } else {
          prevBtn.removeAttribute('disabled');
          sc05Swiper.allowSlidePrev = true;
        }
      }

      if (nextBtn) {
        if (realIndex === last) {
          nextBtn.setAttribute('disabled', 'true');
          sc05Swiper.allowSlideNext = false;
        } else {
          nextBtn.removeAttribute('disabled');
          sc05Swiper.allowSlideNext = true;
        }
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) sc05Swiper.autoplay.start();
        else sc05Swiper.autoplay.stop();
      });
    }, {
      threshold: 0.5
    });
    observer.observe(sc05);
  })();

  // sc06
  (function () {
    const sc06 = document.querySelector(".sc06");
    if (!sc06) return;
    const tracks = sc06.querySelectorAll(".track");
    tracks.forEach((track) => {
      const ul = track.querySelector("ul");
      if (!ul) return;
      for (let i = 0; i < 5; i++) {
        const clone = ul.cloneNode(true);
        ul.parentNode.appendChild(clone);
      }
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) sc06.classList.add("animate");
        else sc06.classList.remove("animate");
      });
    }, {
      threshold: 0.2
    });
    observer.observe(sc06);
  })();

});