/* ============================================
   RR ENGENHARIA — Main JavaScript v4
   Consent Mode v2 + medição íntegra + a11y
   ============================================ */

/* ============================================
   CONSENTIMENTO (LGPD) + GA4 + LINKEDIN
   - Consent Mode v2: tudo negado por padrão até o visitante escolher.
   - LinkedIn Insight Tag só carrega após consentimento de publicidade.
   - A escolha fica em localStorage (rr_consent: granted|denied).
   ============================================ */
(function () {
  var GA4_ID = 'G-8CL979Z1T5';
  var CONSENT_KEY = 'rr_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Estado padrão: negado (antes de qualquer tag)
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  // Modo conservador: NENHUMA tag carrega antes da escolha do visitante.
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID);
  }

  var linkedinLoaded = false;
  function loadLinkedIn() {
    if (linkedinLoaded) return;
    linkedinLoaded = true;
    window._linkedin_partner_id = '10522105';
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    if (!window.lintrk) {
      window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
      window.lintrk.q = [];
    }
    var b = document.createElement('script');
    b.async = true;
    b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(b);
  }

  function applyConsent(choice) {
    if (choice === 'granted') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
      loadGA();
      loadLinkedIn();
    }
  }

  function getChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* ignore */ }
  }

  function hideBanner() {
    var el = document.getElementById('rrConsentBanner');
    if (el) el.parentNode.removeChild(el);
  }

  function showBanner() {
    if (document.getElementById('rrConsentBanner')) return;
    var isEn = document.documentElement.lang === 'en';
    var div = document.createElement('div');
    div.id = 'rrConsentBanner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', isEn ? 'Cookie preferences' : 'Preferências de cookies');
    div.innerHTML = isEn
      ? '<p>We use cookies for traffic measurement (Google Analytics) and advertising (LinkedIn). You can accept or decline — the site works either way. <a href="/privacidade">Privacy Policy</a>.</p>' +
        '<div class="rr-consent-actions"><button type="button" id="rrConsentAccept" class="btn btn-primary">Accept</button><button type="button" id="rrConsentReject" class="btn btn-outline">Decline</button></div>'
      : '<p>Usamos cookies para medição de tráfego (Google Analytics) e publicidade (LinkedIn). Você pode aceitar ou recusar — o site funciona igual nos dois casos. <a href="/privacidade">Política de Privacidade</a>.</p>' +
        '<div class="rr-consent-actions"><button type="button" id="rrConsentAccept" class="btn btn-primary">Aceitar</button><button type="button" id="rrConsentReject" class="btn btn-outline">Recusar</button></div>';
    document.body.appendChild(div);
    document.getElementById('rrConsentAccept').addEventListener('click', function () {
      setChoice('granted'); applyConsent('granted'); hideBanner();
    });
    document.getElementById('rrConsentReject').addEventListener('click', function () {
      setChoice('denied'); hideBanner();
    });
  }

  window.rrOpenConsent = function () { showBanner(); };

  var choice = getChoice();
  if (choice === 'granted') {
    applyConsent('granted');
  } else if (choice !== 'denied') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  // Link "Preferências de cookies" no rodapé de todas as páginas
  document.addEventListener('DOMContentLoaded', function () {
    var fb = document.querySelector('.footer-bottom');
    if (fb && !document.getElementById('rrConsentPrefs')) {
      var span = document.createElement('span');
      var isEn = document.documentElement.lang === 'en';
      span.innerHTML = '<a href="#" id="rrConsentPrefs" style="color:inherit;">' +
        (isEn ? 'Cookie preferences' : 'Preferências de cookies') + '</a>';
      fb.appendChild(span);
      span.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        try { localStorage.removeItem(CONSENT_KEY); } catch (err) { /* ignore */ }
        showBanner();
      });
    }
  });

  /* ---------- EVENTOS ---------- */
  function track(name, params) {
    var base = { page_path: location.pathname };
    if (window.gtag) { gtag('event', name, Object.assign(base, params || {})); }
  }
  window.rrTrack = track;

  function ctaLocation(a) {
    if (a.classList && a.classList.contains('whatsapp-float')) return 'floating';
    if (a.closest('header')) return 'header';
    if (a.closest('footer')) return 'footer';
    if (a.closest('.cta-banner')) return 'cta_banner';
    if (a.closest('.lead-form')) return 'lead_form';
    if (a.closest('.hero')) return 'hero';
    var s2 = a.closest('section[id]');
    if (s2) return s2.id;
    return 'body';
  }

  /* ---------- MONTADOR DE MENSAGEM DO WHATSAPP ----------
     Em páginas com <script type="application/json" id="rrWaConfig">, os botões
     de WhatsApp (exceto o do rodapé) abrem um seletor de múltipla escolha que
     monta a mensagem. O click_whatsapp só é registrado no envio de fato. */
  var waCfg = null;
  try {
    var waCfgEl = document.getElementById('rrWaConfig');
    if (waCfgEl) waCfg = JSON.parse(waCfgEl.textContent);
  } catch (errCfg) { waCfg = null; }

  function waNumber(href) {
    var m = href.match(/wa\.me\/(\d+)/);
    return m ? m[1] : '5521997795500';
  }

  function openWaBuilder(originHref, origin, preset) {
    var existing = document.getElementById('rrWaBuilder');
    if (existing) existing.remove();
    var number = waNumber(originHref);
    var opener = document.activeElement;
    var overlay = document.createElement('div');
    overlay.id = 'rrWaBuilder';
    overlay.className = 'wa-builder';
    var html = '<div class="wa-builder-box" role="dialog" aria-modal="true" aria-labelledby="rrWaTitle">' +
      '<div class="wa-builder-head"><h2 id="rrWaTitle">' + waCfg.title + '</h2>' +
      '<button type="button" class="wa-builder-close" aria-label="Fechar">&times;</button></div>' +
      '<form class="wa-builder-body" novalidate>' +
      '<p class="wa-builder-sub">' + waCfg.subtitle + '</p>';
    waCfg.questions.forEach(function (q, qi) {
      html += '<fieldset><legend>' + q.label + '</legend>';
      q.options.forEach(function (opt, oi) {
        var id = 'rrWaQ' + qi + '_' + oi;
        html += '<label class="wa-builder-opt" for="' + id + '"><input type="radio" id="' + id + '" name="q' + qi + '" value="' + opt + '"><span>' + opt + '</span></label>';
      });
      html += '</fieldset>';
    });
    html += '<fieldset><legend><label for="rrWaDetails">Algo mais que queira contar? <span class="wa-builder-opt-tag">(opcional)</span></label></legend>' +
      '<textarea id="rrWaDetails" rows="2" maxlength="300" placeholder="' + (waCfg.detailsPlaceholder || '') + '"></textarea></fieldset>' +
      '</form>' +
      '<div class="wa-builder-foot"><p class="wa-builder-preview-label">Mensagem que será enviada:</p>' +
      '<p class="wa-builder-preview" aria-live="polite"></p>' +
      '<button type="button" class="btn btn-whatsapp wa-builder-send">Enviar pelo WhatsApp</button>' +
      '<button type="button" class="wa-builder-skip">Prefiro escrever do meu jeito</button></div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    document.body.classList.add('wa-builder-open');

    var box = overlay.querySelector('.wa-builder-box');
    var preview = overlay.querySelector('.wa-builder-preview');

    function message() {
      var lines = [waCfg.intro];
      waCfg.questions.forEach(function (q, qi) {
        var sel = overlay.querySelector('input[name="q' + qi + '"]:checked');
        if (sel) lines.push(q.summary + ': ' + sel.value);
      });
      var det = overlay.querySelector('#rrWaDetails').value.trim();
      if (det) lines.push('Detalhes: ' + det);
      return lines.join('\n');
    }
    function answered() {
      return overlay.querySelectorAll('input[type="radio"]:checked').length;
    }
    function refresh() { preview.textContent = message(); }
    refresh();
    overlay.addEventListener('input', refresh);
    overlay.addEventListener('change', refresh);

    function close() {
      overlay.remove();
      document.body.classList.remove('wa-builder-open');
      document.removeEventListener('keydown', onKey, true);
      if (opener && opener.focus) opener.focus();
    }
    function send(text, formId) {
      var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
      track('click_whatsapp', { link_url: url, cta_location: origin, form_id: formId, service_origin: waCfg.service, answers: answered() });
      window.open(url, '_blank', 'noopener');
      close();
    }
    function onKey(ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); close(); return; }
      if (ev.key === 'Tab') {
        var f = box.querySelectorAll('button, input, textarea');
        var first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay) close(); });
    overlay.querySelector('.wa-builder-close').addEventListener('click', close);
    overlay.querySelector('.wa-builder-send').addEventListener('click', function () { send(message(), 'wa_builder'); });
    overlay.querySelector('.wa-builder-skip').addEventListener('click', function () { send(waCfg.intro, 'wa_builder_skip'); });
    if (preset) {
      var pr = preset.split(':'), pre = overlay.querySelector('#rrWaQ' + pr[0] + '_' + pr[1]);
      if (pre) { pre.checked = true; refresh(); }
    }
    var firstInput = overlay.querySelector('input[type="radio"]');
    if (firstInput) firstInput.focus();
    track('wa_builder_open', { cta_location: origin, service_origin: waCfg.service });
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp') > -1) {
      if (waCfg && !a.closest('footer')) {
        e.preventDefault();
        openWaBuilder(href, ctaLocation(a), a.getAttribute('data-wa-preset'));
        return;
      }
      track('click_whatsapp', { link_url: href, cta_location: ctaLocation(a) });
    } else if (href.indexOf('tel:') === 0) {
      track('click_phone', { link_url: href, cta_location: ctaLocation(a) });
    } else if (href.indexOf('mailto:') === 0) {
      track('click_email', { link_url: href, cta_location: ctaLocation(a) });
    }
  }, true);

  // Envio do formulário: registra a TENTATIVA (form_submit) e grava um token
  // de envio. O generate_lead só dispara no /obrigado se o token existir —
  // visita direta, recarga ou robô na página de obrigado NÃO contam como lead.
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.classList && f.classList.contains('lead-form')) {
      var origemEl = f.querySelector('[name="origem"]');
      var servicoEl = f.querySelector('[name="servico"]');
      var origem = origemEl ? origemEl.value : '';
      var servico = (servicoEl && servicoEl.value) || origem || '';
      track('form_submit', {
        service_origin: servico,
        form_id: f.id || origem || 'lead-form'
      });
      try {
        sessionStorage.setItem('rr_lead_pending', JSON.stringify({ o: origem, s: servico, t: Date.now() }));
      } catch (err) { /* ignore */ }
    }
  }, true);

  // Conversão confirmada: só com token de envio recente (< 30 min), consumido uma única vez.
  if (location.pathname.indexOf('obrigado') > -1) {
    var raw = null;
    try { raw = sessionStorage.getItem('rr_lead_pending'); } catch (e2) { /* ignore */ }
    if (raw) {
      try {
        var pend = JSON.parse(raw);
        sessionStorage.removeItem('rr_lead_pending');
        if (pend && pend.t && (Date.now() - pend.t) < 30 * 60 * 1000) {
          track('generate_lead', { service_origin: pend.s || pend.o || '' });
        }
      } catch (e3) { /* ignore */ }
    }
  }

  var scrolled75 = false;
  window.addEventListener('scroll', function () {
    if (scrolled75) return;
    var doc = document.documentElement;
    var reach = (doc.scrollTop + window.innerHeight) / doc.scrollHeight;
    if (reach > 0.75) {
      scrolled75 = true;
      track('scroll_75', {});
    }
  }, { passive: true });
})();

(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- HERO VIDEO: carregamento condicional ---
  // As <source> não existem no HTML: só são injetadas em telas largas e sem
  // preferência por movimento reduzido. No mobile, apenas o poster é exibido.
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    var wantVideo = window.innerWidth > 768 && !reducedMotion;
    if (wantVideo && heroVideo.dataset.webm) {
      var s1 = document.createElement('source');
      s1.src = heroVideo.dataset.webm; s1.type = 'video/webm';
      var s2 = document.createElement('source');
      s2.src = heroVideo.dataset.mp4; s2.type = 'video/mp4';
      heroVideo.appendChild(s1); heroVideo.appendChild(s2);
      heroVideo.load();
      var p = heroVideo.play(); if (p && p.catch) p.catch(function () {});

      // Pausa quando sai do viewport ou a aba fica oculta
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { var pp = heroVideo.play(); if (pp && pp.catch) pp.catch(function () {}); }
            else { heroVideo.pause(); }
          });
        }, { threshold: 0.1 }).observe(heroVideo);
      }
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) heroVideo.pause();
      });

      // Controle acessível de pausa (WCAG 2.2.2)
      var wrap = heroVideo.parentElement;
      if (wrap) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'video-pause-btn';
        btn.setAttribute('aria-label', 'Pausar animação do vídeo');
        btn.textContent = '❚❚';
        btn.addEventListener('click', function () {
          if (heroVideo.paused) {
            var pl = heroVideo.play(); if (pl && pl.catch) pl.catch(function () {});
            btn.textContent = '❚❚';
            btn.setAttribute('aria-label', 'Pausar animação do vídeo');
          } else {
            heroVideo.pause();
            btn.textContent = '▶';
            btn.setAttribute('aria-label', 'Retomar animação do vídeo');
          }
        });
        wrap.appendChild(btn);
      }
    }
  }

  // --- HERO PARTICLES (desativadas com movimento reduzido) ---
  var canvas = document.getElementById('heroParticles');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;
    var mouseX = -1000;
    var mouseY = -1000;

    var resizeCanvas = function () {
      var hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    var createParticle = function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1
      };
    };

    var initParticles = function () {
      particles = [];
      for (var i = 0; i < particleCount; i++) particles.push(createParticle());
    };

    var drawParticles = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(9, 99, 237, ' + p.opacity + ')';
        ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x, dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(9, 99, 237, ' + (0.06 * (1 - dist / 150)) + ')';
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
        var mdx = p.x - mouseX, mdy = p.y - mouseY;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 200) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = 'rgba(9, 99, 237, ' + (0.12 * (1 - mDist / 200)) + ')';
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
      requestAnimationFrame(drawParticles);
    };

    if (window.innerWidth > 768) {
      resizeCanvas(); initParticles(); drawParticles();
      window.addEventListener('resize', function () { resizeCanvas(); initParticles(); });
      canvas.parentElement.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top;
      });
      canvas.parentElement.addEventListener('mouseleave', function () {
        mouseX = -1000; mouseY = -1000;
      });
    }
  }

  // --- MOBILE MENU (com ARIA completa, Escape e retorno de foco) ---
  var menuToggle = document.getElementById('menuToggle');
  var navList = document.getElementById('navList');

  if (menuToggle && navList) {
    menuToggle.setAttribute('aria-controls', 'navList');

    var setMenu = function (open) {
      navList.classList.toggle('open', open);
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', function () {
      setMenu(!navList.classList.contains('open'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }

  // --- HEADER SCROLL EFFECT ---
  var header = document.getElementById('header');

  function handleHeaderScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
      if (scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // --- ACTIVE NAV LINK ---
  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    var scrollPos = window.pageYOffset + 150;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) link.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- FLUTUANTES: somem quando um formulário, CTA ou o rodapé está visível ---
  var floatBtn = document.querySelector('.whatsapp-float');
  var backToTop = document.getElementById('backToTop');

  if (floatBtn && 'IntersectionObserver' in window) {
    var overlapTargets = document.querySelectorAll('.lead-form, .cta-banner, footer');
    if (overlapTargets.length) {
      var visibleCount = 0;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visibleCount += en.isIntersecting ? 1 : -1;
        });
        if (visibleCount < 0) visibleCount = 0;
        var hide = visibleCount > 0;
        floatBtn.classList.toggle('float-hidden', hide);
        if (backToTop) backToTop.classList.toggle('float-hidden', hide);
      }, { threshold: 0.05 });
      overlapTargets.forEach(function (t) { io.observe(t); });
    }
  }

  // --- BACK TO TOP ---
  function handleBackToTop() {
    if (!backToTop) return;
    if (window.pageYOffset > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }
  window.addEventListener('scroll', handleBackToTop, { passive: true });

  // --- MARQUEE DE LOGOS: pausa por toque/foco (além do hover no CSS) ---
  var marquee = document.querySelector('.clients-marquee');
  if (marquee) {
    marquee.addEventListener('click', function () {
      marquee.classList.toggle('paused');
    });
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  function revealOnScroll() {
    var selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    var reveals = document.querySelectorAll(selectors);
    var windowHeight = window.innerHeight;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < windowHeight - 80) el.classList.add('visible');
    });
    var staggerContainers = document.querySelectorAll('.reveal-stagger');
    staggerContainers.forEach(function (container) {
      var top = container.getBoundingClientRect().top;
      if (top < windowHeight - 60) {
        var children = container.children;
        for (var i = 0; i < children.length; i++) {
          (function (index) {
            setTimeout(function () {
              children[index].classList.add('visible');
            }, reducedMotion ? 0 : index * 120);
          })(i);
        }
        container.classList.remove('reveal-stagger');
        container.classList.add('reveal-stagger-done');
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll, { passive: true });
  window.addEventListener('load', revealOnScroll);

  document.querySelectorAll('.reveal-stagger').forEach(function (container) {
    var children = container.children;
    for (var i = 0; i < children.length; i++) {
      if (reducedMotion) continue;
      children[i].style.opacity = '0';
      children[i].style.transform = 'translateY(30px)';
      children[i].style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
  });

  var staggerStyle = document.createElement('style');
  staggerStyle.textContent = '.reveal-stagger-done > .visible, .reveal-stagger > .visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(staggerStyle);

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 88;
        var targetPos = target.offsetTop - headerHeight;
        window.scrollTo({ top: targetPos, behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // --- COUNTER ANIMATION FOR STATS ---
  var statNumbers = document.querySelectorAll('.stat-number');
  var statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    var statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    statsAnimated = true;
    if (reducedMotion) return; // números já estão no HTML
    statNumbers.forEach(function (el) {
      var text = el.textContent.trim();
      var prefix = '';
      var target = 0;
      if (text.startsWith('+')) {
        prefix = '+';
        target = parseInt(text.replace('+', ''), 10);
      } else {
        target = parseInt(text, 10);
      }
      if (isNaN(target)) return;
      var current = 0;
      var increment = Math.ceil(target / 60);
      var duration = 1800;
      var stepTime = duration / (target / increment);
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = prefix + current;
      }, stepTime);
    });
  }
  window.addEventListener('scroll', animateCounters, { passive: true });

  window.addEventListener('load', function () {
    handleHeaderScroll();
    handleBackToTop();
    revealOnScroll();
    animateCounters();
  });
})();
