// Theme + UX interactions:
//   - Dark mode toggle (localStorage-backed, respects system pref until a choice is made).
//   - Mark code fences with `line-numbers` class so Prism.js line-numbers plugin activates.
//   - Back-to-top button with circular scroll-progress ring.
// Theme is applied inline in <head> before paint to avoid FOUC.
// This script runs with `defer` and so does Prism, so our class tagging runs
// first and Prism picks up the class on its initial sweep.
(function () {
  'use strict';

  // ---- Prism line-numbers opt-in --------------------------------------
  // Goldmark emits <pre><code class="language-xxx">. Prism's line-numbers plugin
  // needs `line-numbers` on <pre>; tagging it here avoids writing a custom
  // render hook just to add one class.
  document.querySelectorAll('code[class*="language-"]').forEach(function (code) {
    var pre = code.parentElement;
    if (pre && pre.tagName === 'PRE' && !pre.classList.contains('line-numbers')) {
      pre.classList.add('line-numbers');
    }
  });


  var THEME_KEY = 'howar31-theme';
  var root = document.documentElement;

  // ---- Dark mode --------------------------------------------------------
  function getTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function setTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var listener = function (e) {
      try { if (localStorage.getItem(THEME_KEY)) return; } catch (_) {}
      setTheme(e.matches ? 'dark' : 'light');
    };
    if (mq.addEventListener) mq.addEventListener('change', listener);
    else if (mq.addListener) mq.addListener(listener);
  }

  // ---- Back-to-top button + scroll progress ring -----------------------
  var backBtn = document.querySelector('[data-back-to-top]');
  if (backBtn) {
    var bar = backBtn.querySelector('.back-to-top-bar');
    var C = 2 * Math.PI * 21; // matches SCSS r=21

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (bar) bar.style.strokeDashoffset = String(C - progress * C);

      if (scrollTop > 200) backBtn.classList.add('visible');
      else backBtn.classList.remove('visible');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Image modal (lightbox) ------------------------------------------
  // Click any image inside .post-content to view it enlarged.
  // Close on backdrop click, X button, or Escape. Linked images are skipped.
  var postContent = document.querySelector('.post-content');
  if (postContent) {
    var modal = document.createElement('div');
    modal.className = 'vp-image-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', '放大圖片');
    modal.innerHTML =
      '<div class="vp-image-modal-backdrop"></div>' +
      '<img class="vp-image-modal-img" alt="">' +
      '<button class="vp-image-modal-close" type="button" aria-label="關閉">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<line x1="6" y1="6" x2="18" y2="18"></line>' +
          '<line x1="18" y1="6" x2="6" y2="18"></line>' +
        '</svg>' +
      '</button>';
    document.body.appendChild(modal);

    var modalImg = modal.querySelector('.vp-image-modal-img');
    var modalBackdrop = modal.querySelector('.vp-image-modal-backdrop');
    var modalClose = modal.querySelector('.vp-image-modal-close');
    var lastTrigger = null;
    var clearSrcTimer = null;

    function openModal(img) {
      lastTrigger = img;
      modalImg.setAttribute('src', img.currentSrc || img.src);
      var srcset = img.getAttribute('srcset');
      if (srcset) modalImg.setAttribute('srcset', srcset);
      else modalImg.removeAttribute('srcset');
      var sizes = img.getAttribute('sizes');
      if (sizes) modalImg.setAttribute('sizes', sizes);
      else modalImg.removeAttribute('sizes');
      modalImg.setAttribute('alt', img.getAttribute('alt') || '');

      if (clearSrcTimer) { clearTimeout(clearSrcTimer); clearSrcTimer = null; }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      root.classList.add('modal-open');
      // Defer focus until after the open transition starts so the cue is visible.
      window.requestAnimationFrame(function () { modalClose.focus(); });
    }

    function closeModal() {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      root.classList.remove('modal-open');
      // Release the (potentially large) image after the fade-out completes.
      clearSrcTimer = setTimeout(function () {
        modalImg.removeAttribute('src');
        modalImg.removeAttribute('srcset');
        modalImg.removeAttribute('sizes');
      }, 200);
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        try { lastTrigger.focus({ preventScroll: true }); } catch (_) { lastTrigger.focus(); }
      }
      lastTrigger = null;
    }

    postContent.addEventListener('click', function (e) {
      var target = e.target;
      if (!target || target.tagName !== 'IMG') return;
      if (target.closest('a')) return;
      e.preventDefault();
      openModal(target);
    });

    // Close on backdrop click, but NOT on clicks on the image itself.
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target === modalBackdrop) closeModal();
    });

    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }
})();
