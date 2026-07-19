/* ============================================================
   Dropdown menu behavior for .has-dropdown items.
   Supports both hover (desktop, handled by CSS) and click-to-open.
   ============================================================ */
(function () {
  function close(item) {
    item.classList.remove('is-open');
    var t = item.querySelector('.dropdown-toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  }
  function open(item) {
    item.classList.add('is-open');
    var t = item.querySelector('.dropdown-toggle');
    if (t) t.setAttribute('aria-expanded', 'true');
  }

  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('is-open')) close(item);
      else open(item);
    });
    item.querySelectorAll('.dropdown-menu a').forEach(function (link) {
      link.addEventListener('click', function () { close(item); });
    });
  });

  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (item) {
      if (!item.contains(e.target)) close(item);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.is-open').forEach(close);
    }
  });

  // Defensive: ensure no dropdown is left open after page load.
  document.querySelectorAll('.has-dropdown.is-open').forEach(close);
})();

/* ============================================================
   Lead-capture form on funnel landing pages.
   Posts to the form's Mailchimp action URL (when set) and
   redirects to the page's data-thank-you URL on completion.
   Falls back to a straight redirect if no action is set.
   ============================================================ */
(function () {
  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action');
      var dest = form.getAttribute('data-thank-you');
      var go = function () { if (dest) window.location.href = dest; };
      if (action) {
        fetch(action, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
          .then(go, go);
      } else {
        go();
      }
    });
  });
})();

/* ============================================================
   "Send me the guide" buttons outside the form scroll to the
   form and focus the first field.
   ============================================================ */
(function () {
  document.querySelectorAll('a[href="#lead-form"], button[data-scroll-to-form]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var form = document.getElementById('lead-form');
      if (!form) return;
      e.preventDefault();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var firstInput = form.querySelector('input, select, textarea');
      if (firstInput) setTimeout(function () { firstInput.focus({ preventScroll: true }); }, 350);
    });
  });
})();

/* ============================================================
   BETWEEN THE LINES page-nav row. Drops a small row of buttons
   (Back to Home / Browse Insights / Browse the Bookstore) into
   any page that contains <div id="btl-page-nav-mount"></div>.
   Reused on every page in the BETWEEN THE LINES section.
   ============================================================ */
(function () {
  var nav = document.getElementById('btl-page-nav-mount');
  if (!nav) return;

  // Tan CTA panel with Book a Consultation + Submit Your Manuscript,
  // matching the home page panel. Used on every page that includes the
  // mount: every Insights article AND the BETWEEN THE LINES landing
  // pages (Insights, Before You Sign, Business Owners).
  var PANEL_HTML = [
    '<section class="article-cta-panel" aria-label="Take the next step with True Haven Press">',
    '  <div class="container">',
    '    <a href="https://tidycal.com/truehavenpress/free-publishing-consultation" class="btn" target="_blank" rel="noopener noreferrer">Book a consultation</a>',
    '    <a href="/submit-manuscript.html" class="btn">Submit your manuscript</a>',
    '  </div>',
    '</section>'
  ].join('\n');

  nav.outerHTML = PANEL_HTML;
})();

/* ============================================================
   Site-wide unified footer. Replaces any of these markers with a
   single canonical footer, so every page renders the same one:
     <div id="site-footer-mount"></div>     (clean static pages)
     <footer class="wp-block-template-part">  (WP-style pages)
     <footer class="site-footer">             (legacy simple pages)
   The markup lives in one place — this file.
   ============================================================ */
(function () {
  var existing =
    document.getElementById('site-footer-mount') ||
    document.querySelector('footer.wp-block-template-part') ||
    document.querySelector('footer.site-footer');
  if (!existing) return;

  var FOOTER_HTML = [
    '<footer class="full-footer">',
    '  <div class="full-footer-top">',
    '    <div class="container">',
    '      <p>Selected submissions will receive a manuscript assessment, marketability report, and publishing proposal.</p>',
    '      <p>Even when we have to say no, you won&rsquo;t be left guessing. If we decline your manuscript, you&rsquo;ll receive a manuscript assessment and marketability report&mdash;a clear look at why we passed and what to focus on to make it stronger. And there&rsquo;s no limit on how many times you can revise and resubmit.</p>',
    '    </div>',
    '  </div>',
    '  <div class="full-footer-main">',
    '    <div class="container full-footer-grid">',
    '      <div class="full-footer-brand">',
    '        <h3>True Haven Press</h3>',
    '        <p>A true partner in book publishing, home of The Pro Book Editor and award-winning designers and marketing professionals.</p>',
    '        <p>Founder Debra L Hartmann brings 30 years of experience that began in traditional publishing and includes working as an Editor, Managing Editor, and Chief Publishing Officer. In the self-publishing space for the last 15 years, her mission is to provide authors with direct access to high quality book production services unparalleled in today’s internet-based sea of misinformation and predatory practices.</p>',
    '        <ul class="full-footer-socials" aria-label="True Haven Press on social media">',
    '          <li><a href="https://www.facebook.com/TrueHavenPress/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12,2A10,10,0,0,0,10.4,21.9V15H7.9V12h2.5V9.8a3.5,3.5,0,0,1,3.8-3.9,15.07,15.07,0,0,1,2.2.2v2.5H15.1c-1.2,0-1.6.8-1.6,1.6V12h2.8l-.4,2.9H13.5v6.9A10,10,0,0,0,12,2Z"/></svg></a></li>',
    '          <li><a href="https://www.instagram.com/truehavenpress/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12,4.62c2.4,0,2.69,0,3.64.05.88,0,1.35.19,1.67.31a2.79,2.79,0,0,1,1,.67,2.78,2.78,0,0,1,.67,1c.12.32.27.79.31,1.67,0,.95.05,1.23.05,3.64s0,2.69-.05,3.64a4.61,4.61,0,0,1-.31,1.67,2.78,2.78,0,0,1-.67,1,2.79,2.79,0,0,1-1,.67c-.32.12-.79.27-1.67.31-.95,0-1.23,0-3.64,0s-2.69,0-3.64,0a4.61,4.61,0,0,1-1.67-.31,2.79,2.79,0,0,1-1-.67,2.78,2.78,0,0,1-.67-1,4.61,4.61,0,0,1-.31-1.67c0-.95-.05-1.23-.05-3.64s.05-2.69.05-3.64A4.61,4.61,0,0,1,5,7.32,2.78,2.78,0,0,1,5.65,6.3a2.79,2.79,0,0,1,1-.67c.32-.12.79-.27,1.67-.31C9.31,4.63,9.6,4.62,12,4.62M12,3C9.56,3,9.25,3,8.29,3.05A6.16,6.16,0,0,0,6.11,3.47a4.4,4.4,0,0,0-1.59,1,4.4,4.4,0,0,0-1,1.59A6.16,6.16,0,0,0,3.05,8.29C3,9.25,3,9.56,3,12s0,2.75,0,3.71a6.16,6.16,0,0,0,.42,2.19,4.4,4.4,0,0,0,1,1.59,4.4,4.4,0,0,0,1.59,1,6.16,6.16,0,0,0,2.19.42c1,0,1.27.05,3.71.05s2.75,0,3.71-.05a6.16,6.16,0,0,0,2.19-.42,4.4,4.4,0,0,0,1.59-1,4.4,4.4,0,0,0,1-1.59,6.16,6.16,0,0,0,.42-2.19c0-1,.05-1.27.05-3.71s0-2.75-.05-3.71a6.16,6.16,0,0,0-.42-2.19,4.4,4.4,0,0,0-1-1.59,4.4,4.4,0,0,0-1.59-1A6.16,6.16,0,0,0,15.71,3C14.75,3,14.44,3,12,3Zm0,4.38A4.62,4.62,0,1,0,16.62,12,4.62,4.62,0,0,0,12,7.38ZM12,15a3,3,0,1,1,3-3A3,3,0,0,1,12,15Zm4.8-8.88a1.08,1.08,0,1,0,1.08,1.08A1.08,1.08,0,0,0,16.8,6.12Z"/></svg></a></li>',
    '          <li><a href="https://www.linkedin.com/in/theprobookeditor/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.7,3H4.3A1.3,1.3,0,0,0,3,4.3V19.7A1.3,1.3,0,0,0,4.3,21H19.7A1.3,1.3,0,0,0,21,19.7V4.3A1.3,1.3,0,0,0,19.7,3ZM8.34,18.34H5.67V9.75H8.34ZM7,8.57A1.55,1.55,0,1,1,8.55,7,1.55,1.55,0,0,1,7,8.57ZM18.34,18.34h-2.67V14.16c0-1-0-2.28-1.39-2.28s-1.6,1.09-1.6,2.21v4.25H10V9.75H12.6v1.17h0a2.81,2.81,0,0,1,2.53-1.39c2.7,0,3.2,1.78,3.2,4.1Z"/></svg></a></li>',
    '        </ul>',
    '      </div>',
    '      <div class="full-footer-contact">',
    '        <p class="contact-heading">Contact information:</p>',
    '        <p><a href="tel:18005853690">1&#8209;800&#8209;585&#8209;3690</a></p>',
    '        <p><a href="mailto:managingeditor@truehavenpress.com">managingeditor@truehavenpress.com</a></p>',
    '        <ul class="full-footer-links">',
    '          <li><a href="/about.html">About</a></li>',
    '          <li><a href="/privacy-policy.html">Privacy Policy</a></li>',
    '          <li><a href="/terms-and-conditions.html">Terms &amp; Conditions</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  existing.outerHTML = FOOTER_HTML;
})();

/* ============================================================
   LinkedIn Insight Tag (partner id 9528684) — site-wide
   conversion tracking and retargeting. Loaded here so a single
   edit covers every page.
   ============================================================ */
(function () {
  window._linkedin_partner_id = "9528684";
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
  if (!window.lintrk) {
    window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
    window.lintrk.q = [];
  }
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";
  b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);
})();
