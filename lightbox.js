(function () {
  'use strict';

  var images = [];
  var current = 0;
  var overlay, img, counter, closeBtn, prevBtn, nextBtn;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');

    img = document.createElement('img');
    img.id = 'lb-img';
    img.alt = '';

    closeBtn = document.createElement('button');
    closeBtn.id = 'lb-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close image viewer');

    prevBtn = document.createElement('button');
    prevBtn.id = 'lb-prev';
    prevBtn.innerHTML = '&#8592;';
    prevBtn.setAttribute('aria-label', 'Previous image');

    nextBtn = document.createElement('button');
    nextBtn.id = 'lb-next';
    nextBtn.innerHTML = '&#8594;';
    nextBtn.setAttribute('aria-label', 'Next image');

    counter = document.createElement('span');
    counter.id = 'lb-counter';

    overlay.appendChild(prevBtn);
    overlay.appendChild(img);
    overlay.appendChild(nextBtn);
    overlay.appendChild(closeBtn);
    overlay.appendChild(counter);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); navigate(-1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); navigate(1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('lb-active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function open(index) {
    current = index;
    img.src = images[current].src;
    img.alt = images[current].alt || '';
    counter.textContent = (current + 1) + ' / ' + images.length;
    prevBtn.style.display = images.length > 1 ? '' : 'none';
    nextBtn.style.display = images.length > 1 ? '' : 'none';
    overlay.classList.add('lb-active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('lb-active');
    document.body.style.overflow = '';
    img.src = '';
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    img.style.opacity = '0';
    setTimeout(function () {
      img.src = images[current].src;
      img.alt = images[current].alt || '';
      counter.textContent = (current + 1) + ' / ' + images.length;
      img.style.opacity = '1';
    }, 150);
  }

  function init() {
    var items = document.querySelectorAll('.gallery-item img');
    if (!items.length) return;

    buildOverlay();

    items.forEach(function (el, i) {
      images.push({ src: el.src, alt: el.alt });
      el.parentElement.style.cursor = 'zoom-in';
      el.addEventListener('click', function () { open(i); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
