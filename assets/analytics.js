/* Shared analytics for production pages; no tracking on file:// or localhost. */
(() => {
  'use strict';
  if (!['wooohu.com', 'www.wooohu.com'].includes(location.hostname)) return;
  const id = 'G-PZCRGE8WVW';
  let active = false;
  const preference = () => { try { return localStorage.getItem('wooohu-analytics'); } catch { return null; } };
  const save = value => { try { localStorage.setItem('wooohu-analytics', value); } catch {} };
  function start() {
    if (active) return;
    active = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer.split('?')[0].split('#')[0],
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!active || !link) return;
    const url = new URL(link.href, location.href);
    const method = url.hostname === 'wa.me' ? 'whatsapp' : url.protocol === 'mailto:' ? 'email' : null;
    if (!method) return;
    const model = location.pathname.match(/^\/new-arrivals\/([^/]+)\//);
    window.gtag('event', 'contact_click', {
      contact_method: method,
      style_id: model ? model[1] : 'none',
      transport_type: 'beacon'
    });
  });
  function showChoice() {
    const existing = document.getElementById('analytics-choice');
    if (existing) { existing.querySelector('button').focus(); return; }
    const box = document.createElement('section');
    box.id = 'analytics-choice';
    box.setAttribute('aria-label', 'Analytics privacy choice');
    box.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:550px;z-index:3000;padding:18px;background:#fff;color:#333;border:1px solid #ddd;box-shadow:0 4px 24px #0002;font:12px/1.7 Arial,sans-serif;text-align:left;letter-spacing:normal';
    box.innerHTML = '<p style="margin:0 0 12px">May we use Google Analytics to understand visits and contact-button clicks? Optional analytics cookies stay off unless you accept. <a href="/privacy.html" style="text-decoration:underline">Privacy</a></p>';
    for (const [label, value] of [['Accept analytics', 'accepted'], ['Reject analytics', 'rejected']]) {
      const button = document.createElement('button');
      button.textContent = label;
      button.style.cssText = 'padding:9px 13px;margin:0 8px 0 0;border:1px solid #777;background:white;color:#222;cursor:pointer;font:12px Arial,sans-serif;min-height:40px';
      button.onclick = () => {
        save(value);
        box.remove();
        if (value === 'accepted') start();
        else if (active) {
          window['ga-disable-' + id] = true;
          for (const cookie of document.cookie.split(';')) {
            const name = cookie.split('=')[0].trim();
            if (!/^_ga($|_)/.test(name)) continue;
            for (const domain of ['', '; domain=wooohu.com', '; domain=.wooohu.com', '; domain=www.wooohu.com']) {
              document.cookie = name + '=; Max-Age=0; path=/' + domain;
            }
          }
          location.reload();
        }
      };
      box.appendChild(button);
    }
    document.body.appendChild(box);
  }
  const footer = document.querySelector('footer') || document.body;
  const settings = document.createElement('button');
  settings.textContent = 'Privacy settings';
  settings.style.cssText = 'border:0;background:none;color:#666;text-decoration:underline;font:11px Arial,sans-serif;cursor:pointer;padding:8px';
  settings.onclick = showChoice;
  footer.appendChild(settings);
  if (preference() === 'accepted') start();
  else if (preference() !== 'rejected') showChoice();
})();
