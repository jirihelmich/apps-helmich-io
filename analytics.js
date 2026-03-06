(function () {
  var GA_ID = 'G-CG2QXGRSNW';
  var CONSENT_KEY = 'nighty_cookie_consent';

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function loadGA() {
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
    trackClicks();
  }

  function trackClicks() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var label = '';
      if (link.classList.contains('btn-primary')) {
        label = link.textContent.trim();
      } else if (link.closest('.nav-links')) {
        label = 'nav:' + link.textContent.trim();
      } else if (link.closest('.footer-links')) {
        label = 'footer:' + link.textContent.trim();
      }

      if (label && window.gtag) {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: label,
          link_url: link.href
        });
      }
    });
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p>We use cookies to analyze site traffic and improve your experience. ' +
        'See our <a href="/privacy.html">Privacy Policy</a>.</p>' +
        '<div class="cookie-banner-buttons">' +
          '<button id="cookie-reject" class="cookie-btn cookie-btn-secondary">Decline</button>' +
          '<button id="cookie-accept" class="cookie-btn cookie-btn-primary">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      banner.remove();
      loadGA();
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
      setConsent('rejected');
      banner.remove();
    });
  }

  var consent = getConsent();
  if (consent === 'accepted') {
    loadGA();
  } else if (!consent) {
    showBanner();
  }
})();
