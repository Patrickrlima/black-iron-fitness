/* Black Iron Fitness — scripts do site (sem dependências) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  /* ===== CONFIGURAÇÃO — edite aqui se algo mudar ===== */
  var WHATSAPP = "5551989766640"; // só números, com 55 + DDD
  // Horários: [dia da semana 0=domingo..6=sábado] = [abre, fecha] em horas; null = fechado
  var HORARIOS = {
    0: null,
    1: [6, 21], 2: [6, 21], 3: [6, 21], 4: [6, 21], 5: [6, 21],
    6: [9, 13]
  };

  /* ---------- navbar: estado ao rolar ---------- */
  var nav = document.querySelector(".nav");
  var waFloat = document.querySelector(".wa-float");
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle("is-scrolled", y > 24);
    if (waFloat) waFloat.classList.toggle("is-visible", y > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- menu mobile ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.setAttribute("aria-hidden", String(!open));
    if ("inert" in menu) menu.inert = !open;
    if (open) {
      var first = menu.querySelector("a");
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
  }
  if (toggle && menu) {
    if ("inert" in menu) menu.inert = true;
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("nav-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setMenu(false); toggle.focus();
      }
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && document.body.classList.contains("nav-open")) setMenu(false);
    });
  }

  /* ---------- vídeo do topo da home (só telas maiores, sem "economia de dados") ---------- */
  var heroVideo = document.querySelector(".hero__video");
  var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (heroVideo && motionOk && !saveData && window.matchMedia("(min-width: 761px)").matches) {
    // telas grandes/retina recebem a versão 4K; as demais, a Full HD (mais leve)
    var px = Math.max(window.screen.width, window.innerWidth) * (window.devicePixelRatio || 1);
    var q = px >= 2400 ? "4k" : "hd";
    [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(function (s) {
      var src = document.createElement("source");
      src.src = heroVideo.getAttribute("data-" + s[0] + "-" + q);
      src.type = s[1];
      heroVideo.appendChild(src);
    });
    heroVideo.addEventListener("playing", function () { heroVideo.classList.add("is-playing"); }, { once: true });
    heroVideo.load();
    var p = heroVideo.play();
    if (p && p.catch) p.catch(function () { /* autoplay bloqueado: fica a imagem */ });
    // pausa quando a aba não está visível (economiza bateria)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) heroVideo.pause(); else heroVideo.play().catch(function () {});
    });
  }

  /* ---------- revelar imagens ao rolar ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- horários: destacar hoje + aberto/fechado ---------- */
  var now = new Date();
  // horário de Brasília (a academia está em Osório/RS)
  try {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
    }).formatToParts(now);
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var dia = days[map.weekday];
    var hora = (parseInt(map.hour, 10) % 24) + parseInt(map.minute, 10) / 60;
  } catch (err) {
    dia = now.getDay(); hora = now.getHours() + now.getMinutes() / 60;
  }
  document.querySelectorAll('[data-day="' + dia + '"]').forEach(function (row) {
    row.classList.add("is-today");
  });
  document.querySelectorAll("[data-status]").forEach(function (el) {
    var h = HORARIOS[dia];
    var aberto = h && hora >= h[0] && hora < h[1];
    el.classList.toggle("is-open", !!aberto);
    el.textContent = aberto
      ? "Aberto agora — até " + h[1] + "h"
      : "Fechado agora";
  });

  /* ---------- mapa carregado só quando pedido / visível ---------- */
  document.querySelectorAll("[data-map]").forEach(function (box) {
    function load() {
      if (box.dataset.loaded) return;
      box.dataset.loaded = "1";
      var f = document.createElement("iframe");
      f.src = box.getAttribute("data-map");
      f.title = "Mapa: localização da Black Iron Fitness";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      box.innerHTML = "";
      box.appendChild(f);
    }
    var btn = box.querySelector("button");
    if (btn) btn.addEventListener("click", load);
    if ("IntersectionObserver" in window) {
      var mo = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { load(); mo.disconnect(); }
      }, { rootMargin: "200px" });
      mo.observe(box);
    }
  });

  /* ---------- galeria com lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (lb && items.length && typeof lb.showModal === "function") {
    var img = lb.querySelector("img");
    var cap = lb.querySelector(".lightbox__caption");
    var count = lb.querySelector("[data-count]");
    var idx = 0, opener = null;
    function show(i) {
      idx = (i + items.length) % items.length;
      var it = items[idx];
      img.src = it.getAttribute("data-lightbox");
      img.alt = it.querySelector("img") ? it.querySelector("img").alt : "";
      cap.textContent = it.getAttribute("data-caption") || "";
      if (count) count.textContent = (idx + 1) + " / " + items.length;
    }
    items.forEach(function (it, i) {
      it.addEventListener("click", function () { opener = it; show(i); lb.showModal(); });
    });
    lb.querySelector("[data-prev]").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector("[data-next]").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector("[data-close]").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* ---------- formulário de contato -> WhatsApp ---------- */
  var form = document.getElementById("contato-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var err = document.getElementById(f.id + "-err");
        var bad = !f.value.trim();
        f.setAttribute("aria-invalid", bad ? "true" : "false");
        if (err) err.textContent = bad ? "Preencha este campo para enviar." : "";
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;
      var nome = form.nome.value.trim();
      var assunto = form.assunto.value;
      var msg = form.mensagem.value.trim();
      var texto = "Olá, Black Iron Fitness! Meu nome é " + nome + ".\n" +
        "Assunto: " + assunto + "\n\n" + msg;
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }

  /* ---------- ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = now.getFullYear(); });
})();
