/* =========================================================
   script.js  —  必要最小限
   1) reveal アニメーションの有効化（JSなしでも内容は表示される）
   2) 表示中スライドに合わせてナビをハイライト
   3) 矢印キーで前後スライドへ移動
   外部ライブラリ不使用 / file:/// でも動作 / コンソールエラーなし
   ========================================================= */
(function () {
  "use strict";

  // JS が有効なときだけ reveal の初期状態（非表示）を適用する
  document.body.classList.add("js");

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));

  // ---- 1) reveal アニメーション ----
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var revObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revObserver.observe(el); });
  } else {
    // 非対応ブラウザでは全て表示
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- 2) ナビのハイライト ----
  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-target") === id);
    });
  }
  if ("IntersectionObserver" in window && slides.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { threshold: 0.5 });
    slides.forEach(function (s) { navObserver.observe(s); });
  }

  // ---- 3) 矢印キーで移動 ----
  function currentIndex() {
    var pos = window.scrollY + window.innerHeight / 2;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].offsetTop <= pos && slides[i].offsetTop + slides[i].offsetHeight > pos) {
        return i;
      }
    }
    return 0;
  }
  document.addEventListener("keydown", function (e) {
    // 入力中などは無視
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) { return; }
    var idx = currentIndex();
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (idx < slides.length - 1) { e.preventDefault(); slides[idx + 1].scrollIntoView({ behavior: "smooth" }); }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (idx > 0) { e.preventDefault(); slides[idx - 1].scrollIntoView({ behavior: "smooth" }); }
    }
  });
})();
