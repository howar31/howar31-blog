// Theme + UX interactions:
//   - Dark mode toggle (localStorage-backed, respects system pref until a choice is made).
//   - Navbar dropdown menus (click + keyboard).
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

  // ---- Navbar dropdowns -------------------------------------------------
  var dropdowns = document.querySelectorAll('[data-dropdown]');
  dropdowns.forEach(function (dd) {
    var title = dd.querySelector('.vp-nav-dropdown-title');
    if (!title) return;
    title.addEventListener('click', function (e) {
      e.preventDefault();
      dd.classList.toggle('open');
      title.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
    });
    title.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dd.classList.toggle('open');
        title.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
      } else if (e.key === 'Escape') {
        dd.classList.remove('open');
        title.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (dd) {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        var t = dd.querySelector('.vp-nav-dropdown-title');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ---- Mobile navbar hamburger -----------------------------------------
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navMenu = document.getElementById('vp-nav-menu');
  if (navToggle && navMenu) {
    var closeNav = function () {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      // Also collapse any accordion dropdowns so next open starts clean.
      navMenu.querySelectorAll('[data-dropdown].open').forEach(function (dd) {
        dd.classList.remove('open');
        var t = dd.querySelector('.vp-nav-dropdown-title');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    };
    var openNav = function () {
      navMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    };

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) closeNav();
      else openNav();
    });

    // Close when a link inside the menu is tapped (route change).
    navMenu.addEventListener('click', function (e) {
      var target = e.target.closest('a');
      if (target) closeNav();
    });

    // Close on outside tap.
    document.addEventListener('click', function (e) {
      if (!navMenu.classList.contains('open')) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });

    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Close if window resized back to desktop width.
    var mqDesktop = window.matchMedia('(min-width: 720px)');
    var handleResize = function (e) { if (e.matches) closeNav(); };
    if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', handleResize);
    else if (mqDesktop.addListener) mqDesktop.addListener(handleResize);
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
})();
