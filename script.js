(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav frosts on scroll */
  var nav = document.getElementById('nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* hero: approve with undo (optimistic, silent success) */
  var suggest = document.getElementById('suggest');
  var approve = document.getElementById('approve');
  var undo = document.getElementById('undo');
  if (suggest && approve && undo) {
    approve.addEventListener('click', function () {
      suggest.classList.add('is-approved');
      undo.focus();
    });
    undo.addEventListener('click', function () {
      suggest.classList.remove('is-approved');
      approve.focus();
    });
  }

  /* waitlist form: no backend yet. A valid email is accepted, the box is cleared,
   * and the user sees a confirmation. Nothing is stored. */
  var form = document.getElementById('join-form');
  var email = document.getElementById('email');
  var status = document.getElementById('join-status');
  var submit = document.getElementById('join-submit');
  var EMAIL_RE = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle('is-error', !!isError);
    form.classList.toggle('is-error', !!isError);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = email.value.trim();
    if (!v) {
      setStatus('Enter your work email to join the list.', true);
      email.focus();
      return;
    }
    if (!EMAIL_RE.test(v) || v.indexOf('..') !== -1) {
      setStatus('That email address is not valid. Use the format name@company.com.', true);
      email.focus();
      return;
    }
    email.value = '';
    setStatus('You\u2019re on the list. We\u2019ll be in touch when early access opens.', false);
  });
  email.addEventListener('input', function () { if (form.classList.contains('is-error')) setStatus('', false); });
})();
