/* ============================================================
   方寸造物 FANGCUN ZAOWU · 交互引擎
   原生 JS + GSAP/ScrollTrigger + Lenis（CDN 失败自动降级）
   ============================================================ */
(function () {
  'use strict';
  var D = window.SITE_DATA;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- CDN 兜底 ---------- */
  function loadScript(src) {
    return new Promise(function (res) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    });
  }
  function ensureLibs() {
    var jobs = [];
    if (!window.gsap) jobs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'));
    if (!window.ScrollTrigger) jobs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'));
    if (!window.Lenis) jobs.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.14/lenis.min.js'));
    return Promise.all(jobs);
  }

  /* ---------- 图标库（详情特性用） ---------- */
  var ICONS = {
    brush: '<svg viewBox="0 0 24 24"><path d="M9 3h6v7H9z"/><path d="M9 10c-2 1.5-3 3-3 5v6h12v-6c0-2-1-3.5-3-5"/><path d="M10 14v4M14 14v4"/></svg>',
    foam: '<svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"/><circle cx="15" cy="7" r="2.2"/><circle cx="16.5" cy="13" r="2.6"/><circle cx="10" cy="15.5" r="2"/><path d="M6 20h12"/></svg>',
    repair: '<svg viewBox="0 0 24 24"><path d="M4 16c0-2 1.5-3 3.5-3H16c2.5 0 4 1.5 4 3v2H4z"/><path d="M7 13V9a5 5 0 0 1 10 0v4"/><path d="M12 16v2"/></svg>',
    lace: '<svg viewBox="0 0 24 24"><path d="M7 4l10 4-10 4 10 4-10 4"/><circle cx="7" cy="4" r="1.2"/><circle cx="17" cy="8" r="1.2"/><circle cx="7" cy="12" r="1.2"/><circle cx="17" cy="16" r="1.2"/><circle cx="7" cy="20" r="1.2"/></svg>'
  };

  /* ---------- 渲染：首页作品矩阵 ---------- */
  function renderHome() {
    $('#studio-intro').textContent = D.studio.intro;
    $('#nav-taptap').href = D.studio.taptapUrl;
    $('#footer-taptap').href = D.studio.taptapUrl;
    $('#year').textContent = new Date().getFullYear();

    var grid = $('#games-grid');
    var html = D.games.map(function (g) {
      var badge = g.status === 'released' ? '现已上线 TapTap' : g.statusText;
      return '<article class="game-card" data-tilt data-game="' + g.id + '">' +
        '<div class="gc-media"><span class="gc-status">' + badge + '</span>' +
        '<img src="' + g.kv + '" alt="' + g.title + '主视觉" loading="lazy" decoding="async"></div>' +
        '<div class="gc-body">' +
        '<img class="gc-icon" src="' + g.icon + '" alt="' + g.title + '图标" loading="lazy">' +
        '<p class="gc-en">' + g.en + '</p>' +
        '<h3 class="gc-title">' + g.title + '</h3>' +
        '<p class="gc-tagline">' + g.tagline + '</p>' +
        '<div class="gc-tags">' + g.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
        '<div class="gc-actions">' +
        '<a class="btn btn-gold" href="#/game/' + g.id + '" data-cursor><span>查看详情</span></a>' +
        '<a class="btn btn-ghost" href="' + g.playUrl + '" target="_blank" rel="noopener" data-cursor><span>在线试玩</span></a>' +
        '</div></div></article>';
    }).join('');
    html += '<div class="game-card soon"><div class="soon-inner">' +
      '<img src="assets/img/cube-emblem.webp" alt="">' +
      '<div><b>更多作品 · 敬请期待</b><br><span>新的温暖小世界，正在方寸之间孕育</span></div>' +
      '</div></div>';
    grid.innerHTML = html;

    var g0 = D.games[0];
    if (g0 && g0.stats) {
      $('#stats-grid').innerHTML = g0.stats.map(function (s) {
        return '<div class="stat"><b data-count="' + s.n + '">0</b><span>' + s.label + '</span></div>';
      }).join('');
    }
  }

  /* ---------- 渲染：游戏详情 ---------- */
  function renderGame(g) {
    var v = $('#view-game');
    var badge = g.status === 'released' ? '现已上线 TapTap' : g.statusText;
    v.innerHTML =
      '<button class="gd-back" id="gd-back" data-cursor>← 返回作品</button>' +
      '<section class="gd-hero"><div class="gd-hero-bg"><img src="' + g.kv + '" alt="' + g.title + '主视觉"></div>' +
      '<div class="gd-hero-content">' +
      '<span class="gc-status">' + badge + '</span>' +
      '<h1 class="gd-title">' + g.title + '</h1>' +
      '<p class="gd-en">' + g.en + '</p>' +
      '<p class="gd-tagline">' + g.tagline + '</p>' +
      '<div class="gc-tags gd-tags">' + g.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
      '</div></section>' +

      '<section class="gd-section"><h2 class="gd-h" data-reveal>关于这款游戏</h2>' +
      '<div class="gd-intro" data-reveal>' + g.intro.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
      '<blockquote class="gd-dev" data-reveal><p>' + g.devWords.join('</p><p>') + '</p><cite>—— 方寸造物 · 开发者的话</cite></blockquote></section>' +

      '<section class="gd-section"><h2 class="gd-h" data-reveal>四大护理工序</h2>' +
      '<div class="gd-features">' + g.features.map(function (f) {
        return '<div class="feature" data-reveal>' + (ICONS[f.icon] || '') + '<b>' + f.title + '</b><span>' + f.desc + '</span></div>';
      }).join('') + '</div></section>' +

      '<section class="gd-section"><h2 class="gd-h" data-reveal>实机截图</h2>' +
      '<div class="gd-gallery">' + g.screens.map(function (s, i) {
        return '<figure class="shot" data-shot="' + i + '" data-cursor><img src="' + s.src + '" alt="' + s.caption + '" loading="lazy" decoding="async"><figcaption>' + s.caption + '</figcaption></figure>';
      }).join('') + '</div></section>' +

      '<section class="gd-section"><h2 class="gd-h" data-reveal>观看与试玩</h2>' +
      '<div class="gd-play-grid">' +
      '<div class="phone" data-reveal><div class="phone-screen">' +
      '<video id="gd-video" src="' + g.video + '" poster="' + g.videoPoster + '" muted loop playsinline preload="none"></video>' +
      '<div class="play-cover" id="play-cover"><img src="' + g.icon + '" alt=""><b>在线试玩</b>' +
      '<button class="play-btn" id="play-btn" aria-label="开始在线试玩" data-cursor><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></button>' +
      '<span style="font-size:11px;color:var(--muted);letter-spacing:.14em">点击在手机上直接游玩</span></div>' +
      '</div></div>' +
      '<div class="gd-play-info" data-reveal><h3>无需下载，即刻开铺</h3>' +
      '<p>左侧为实机游玩录屏。点击手机上的播放按钮，即可在官网直接体验完整的《' + g.title + '》——刷洗、泡沫、补底、换鞋带，一单不落。</p>' +
      '<div class="gd-play-actions">' +
      '<button class="btn btn-gold" id="play-btn-2" data-cursor><span>开始在线试玩</span></button>' +
      '<a class="btn btn-ghost" href="' + g.playUrl + '" target="_blank" rel="noopener" data-cursor><span>全屏试玩</span></a>' +
      '</div></div></div></section>' +

      '<section class="gd-section"><div class="gd-cta" data-reveal>' +
      '<img src="' + g.icon + '" alt="">' +
      '<div class="gd-cta-txt"><b>' + badge + '</b><span>' + (g.status === 'released' ? '前往 TapTap 下载游玩，第一时间获取更新。' : '游戏正在 TapTap 审核中，上线后第一时间在此更新入口。') + '</span></div>' +
      '<a class="btn btn-gold" href="' + g.taptapUrl + '" target="_blank" rel="noopener" data-cursor><span>前往 TapTap</span></a>' +
      '</div></section>';

    $('#gd-back').addEventListener('click', function () { location.hash = '#works'; });
    // 试玩 iframe：以 390px 逻辑宽度渲染游戏，再整体缩放进手机框，保证布局不被裁切
    var fitPhone = function () {
      var screen = $('.phone-screen', v);
      var f = screen && $('iframe', screen);
      if (!f) return;
      var s = screen.clientWidth / 390;
      f.style.width = '390px';
      f.style.height = Math.round(screen.clientHeight / s) + 'px';
      f.style.transform = 'scale(' + s + ')';
    };
    window.addEventListener('resize', fitPhone);
    var startPlay = function () {
      var cover = $('#play-cover');
      if (cover.classList.contains('hide')) return;
      cover.classList.add('hide');
      var vid = $('#gd-video');
      if (vid) { vid.pause(); }
      var f = document.createElement('iframe');
      f.src = g.playUrl;
      f.title = g.title + ' 在线试玩';
      f.setAttribute('allow', 'autoplay; fullscreen');
      $('.phone-screen', v).appendChild(f);
      fitPhone();
      setTimeout(fitPhone, 300);
    };
    $('#play-btn').addEventListener('click', startPlay);
    $('#play-btn-2').addEventListener('click', startPlay);

    $$('.shot', v).forEach(function (el) {
      el.addEventListener('click', function () { openLightbox(g, +el.dataset.shot); });
    });
    observeVideo($('#gd-video', v));
  }

  /* ---------- 路由 ---------- */
  var currentGame = null;
  function route() {
    var m = location.hash.match(/^#\/game\/([\w-]+)/);
    var home = $('#view-home'), game = $('#view-game');
    if (m) {
      var g = D.games.filter(function (x) { return x.id === m[1]; })[0];
      if (g) {
        currentGame = g;
        renderGame(g);
        home.classList.remove('active');
        game.classList.add('active');
        document.title = g.title + ' · 方寸造物 FANGCUN ZAOWU';
        afterRoute(true);
        return;
      }
    }
    currentGame = null;
    game.classList.remove('active');
    game.innerHTML = '';
    home.classList.add('active');
    document.title = '方寸造物 FANGCUN ZAOWU · 休闲游戏工作室';
    afterRoute(false);
    var sec = location.hash && !location.hash.startsWith('#/') ? $(location.hash) : null;
    if (sec) scrollToEl(sec, true);
  }
  function afterRoute(isGame) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) {
      try { window.__lenis.reset(); } catch (e) {}
      window.__lenis.scrollTo(0, { immediate: true, force: true });
    }
    if (isGame) $$('.nav-links a').forEach(function (a) { a.classList.remove('on'); });
    buildScrollAnims();
    if (!reduced && window.gsap) {
      var v = isGame ? $('#view-game') : $('#view-home');
      gsap.fromTo(v, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', clearProps: 'all' });
    }
  }

  /* ---------- 平滑滚动 ---------- */
  var lenis = null;
  function initLenis() {
    if (reduced || !window.Lenis) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    if (window.gsap) {
      lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }
  function scrollToEl(el, immediate) {
    if (lenis) lenis.scrollTo(el, { offset: -66, immediate: !!immediate });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- 滚动动画 ---------- */
  function buildScrollAnims() {
    if (!window.gsap || !window.ScrollTrigger || reduced) return;
    ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    var view = $('.view.active');
    $$('[data-reveal]', view).forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
    $$('[data-count]', view).forEach(function (el) {
      var target = +el.dataset.count;
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.fromTo(el, { innerText: 0 }, {
            innerText: target, duration: 1.6, ease: 'power2.out', snap: { innerText: 1 },
            onUpdate: function () { el.textContent = Math.round(+el.textContent); }
          });
        }
      });
    });
    if (view.id === 'view-home') {
      gsap.to('.hero-bg', {
        yPercent: 14, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero-content', {
        yPercent: -10, opacity: .25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    ScrollTrigger.refresh();
  }

  /* ---------- Hero 标题逐字 ---------- */
  function splitTitle() {
    var el = $('#hero-title');
    var parts = el.textContent.split('·');
    el.innerHTML = parts.map(function (p) {
      var chars = p.trim().split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('');
      return '<span class="ph">' + chars + '</span>';
    }).join('<span class="sep">·</span>');
  }
  function animateTitle() {
    if (!window.gsap || reduced) {
      $$('#hero-title .ch').forEach(function (c) { c.style.opacity = 1; c.style.transform = 'none'; });
      return;
    }
    gsap.to('#hero-title .ch', { opacity: 1, y: 0, rotate: 0, duration: 1.1, stagger: .055, ease: 'power4.out', delay: .15 });
  }

  /* ---------- 粒子星尘 ---------- */
  function initDust() {
    var cv = $('#dust');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d');
    var W, H, parts = [], running = true, visible = true;
    function size() {
      W = cv.width = cv.offsetWidth * devicePixelRatio;
      H = cv.height = cv.offsetHeight * devicePixelRatio;
    }
    function make() {
      var n = touch ? 34 : 72;
      parts = [];
      for (var i = 0; i < n; i++) parts.push({
        x: Math.random() * W, y: Math.random() * H,
        r: (Math.random() * 1.5 + .4) * devicePixelRatio,
        vy: -(Math.random() * .22 + .05) * devicePixelRatio,
        vx: (Math.random() - .5) * .12 * devicePixelRatio,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * .02 + .008
      });
    }
    function tick() {
      if (running && visible) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.y += p.vy; p.x += p.vx; p.p += p.s;
          if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
          if (p.x < -6) p.x = W + 6; if (p.x > W + 6) p.x = -6;
          var a = .25 + Math.abs(Math.sin(p.p)) * .6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(232,200,116,' + a.toFixed(3) + ')';
          ctx.shadowColor = 'rgba(212,175,55,.8)';
          ctx.shadowBlur = 6 * devicePixelRatio;
          ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    }
    size(); make(); tick();
    window.addEventListener('resize', function () { size(); make(); });
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; });
    new IntersectionObserver(function (e) { running = e[0].isIntersecting; }).observe(cv);
  }

  /* ---------- 自定义光标 ---------- */
  function initCursor() {
    if (touch || reduced) return;
    document.documentElement.classList.add('has-cursor');
    var dot = $('.cursor-dot'), ring = $('.cursor-ring');
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,[data-cursor],.shot')) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a,button,[data-cursor],.shot')) ring.classList.remove('hover');
    });
  }

  /* ---------- 磁吸按钮 & 卡片倾斜 ---------- */
  function initMagnetic() {
    if (touch || reduced || !window.gsap) return;
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .28, y: (e.clientY - r.top - r.height / 2) * .34, duration: .5, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
      });
    });
  }
  function bindTilt(root) {
    if (touch || reduced) return;
    $$('[data-tilt]', root).forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5;
        var py = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(1100px) rotateY(' + (px * 3.4) + 'deg) rotateX(' + (-py * 3) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1),border-color .5s,box-shadow .5s';
        card.style.transform = 'perspective(1100px) rotateY(0) rotateX(0)';
        setTimeout(function () { card.style.transition = ''; }, 700);
      });
    });
  }

  /* ---------- Hero 鼠标视差 ---------- */
  function initHeroParallax() {
    if (touch || reduced || !window.gsap) return;
    var hero = $('.hero');
    hero.addEventListener('mousemove', function (e) {
      var cx = e.clientX / innerWidth - .5, cy = e.clientY / innerHeight - .5;
      gsap.to('.hero-bg', { x: cx * -22, y: cy * -14, duration: 1.2, ease: 'power2.out' });
      gsap.to('.hero-emblem', { x: cx * 26, y: cy * 18, duration: 1, ease: 'power2.out' });
    });
  }

  /* ---------- 导航 ---------- */
  function initNav() {
    var nav = $('#nav'), burger = $('#burger'), mm = $('#mobile-menu');
    var onScroll = function () { nav.classList.toggle('scrolled', (window.scrollY || 0) > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    if (lenis) lenis.on('scroll', onScroll);
    onScroll();
    burger.addEventListener('click', function () {
      var open = mm.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      mm.setAttribute('aria-hidden', !open);
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    function closeMenu() {
      mm.classList.remove('open'); burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-nav]');
      if (!a) return;
      var href = a.getAttribute('href');
      closeMenu();
      if (href.startsWith('#/')) return; // 路由链接交给 hashchange
      e.preventDefault();
      var go = function () {
        var el = $(href);
        if (el) scrollToEl(el);
        history.replaceState(null, '', href);
      };
      if (!$('#view-home').classList.contains('active')) {
        location.hash = href; // 触发路由回首页后再滚动
        setTimeout(go, 60);
      } else go();
    });
    // 当前区块高亮
    var secs = ['home', 'works', 'about', 'contact'];
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          $$('.nav-links a').forEach(function (a) {
            a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(function (id) { var el = $('#' + id); if (el) io.observe(el); });
  }

  /* ---------- 灯箱 ---------- */
  var lbGame = null, lbIndex = 0;
  function openLightbox(g, i) {
    lbGame = g; lbIndex = i;
    updateLb();
    $('#lightbox').classList.add('open');
    $('#lightbox').setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  }
  function updateLb() {
    var s = lbGame.screens[lbIndex];
    $('#lb-img').src = s.src;
    $('#lb-img').alt = s.caption;
    $('#lb-cap').textContent = s.caption + ' · ' + (lbIndex + 1) + ' / ' + lbGame.screens.length;
  }
  function closeLightbox() {
    $('#lightbox').classList.remove('open');
    $('#lightbox').setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }
  function initLightbox() {
    $('.lb-close').addEventListener('click', closeLightbox);
    $('.lb-prev').addEventListener('click', function () { lbIndex = (lbIndex - 1 + lbGame.screens.length) % lbGame.screens.length; updateLb(); });
    $('.lb-next').addEventListener('click', function () { lbIndex = (lbIndex + 1) % lbGame.screens.length; updateLb(); });
    $('#lightbox').addEventListener('click', function (e) { if (e.target === e.currentTarget) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!$('#lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') $('.lb-prev').click();
      if (e.key === 'ArrowRight') $('.lb-next').click();
    });
  }

  /* ---------- 视频进入视口播放 ---------- */
  function observeVideo(v) {
    if (!v) return;
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { v.play().catch(function () {}); }
        else v.pause();
      });
    }, { threshold: .35 }).observe(v);
  }

  /* ---------- 预加载 ---------- */
  function initPreloader() {
    var pre = $('#preloader'), bar = $('#pre-progress');
    var p = 0;
    var t = setInterval(function () {
      p = Math.min(p + Math.random() * 22, 92);
      bar.style.width = p + '%';
    }, 160);
    var finish = function () {
      clearInterval(t);
      bar.style.width = '100%';
      setTimeout(function () {
        pre.classList.add('done');
        animateTitle();
        setTimeout(function () { pre.remove(); }, 900);
      }, reduced ? 0 : 350);
    };
    if (document.readyState === 'complete') setTimeout(finish, 500);
    else window.addEventListener('load', function () { setTimeout(finish, 400); });
    setTimeout(finish, 3200); // 兜底：资源慢也不卡门
  }

  /* ---------- 启动 ---------- */
  renderHome();
  splitTitle();
  ensureLibs().then(function () {
    var hasGsap = !!(window.gsap && window.ScrollTrigger);
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      if (!reduced) document.documentElement.classList.add('js-anim');
    }
    initLenis();
    initPreloader();
    initCursor();
    initDust();
    initNav();
    initLightbox();
    initMagnetic();
    initHeroParallax();
    bindTilt(document);
    route();
    window.addEventListener('hashchange', route);
    if (!hasGsap) {
      // 无 GSAP：直接显示所有内容
      $$('[data-reveal]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  });
})();