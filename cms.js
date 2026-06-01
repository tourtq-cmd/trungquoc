/**
 * VietKite CMS – áp dụng nội dung đã lưu lên trang web
 * Lưu trong localStorage key: vietkite_cms_v1
 */
(function () {
  var STORAGE_KEY = "vietkite_cms_v1";

  function getStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  window.CMS_getContent = function () {
    var base = Object.assign({}, window.CMS_DEFAULT || {});
    var stored = getStored();
    if (stored) Object.assign(base, stored);
    return base;
  };

  window.CMS_saveContent = function (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  window.CMS_clearContent = function () {
    localStorage.removeItem(STORAGE_KEY);
  };

  function pipeList(html, sep) {
    var parts = (html || "").split(sep || "|");
    return parts
      .map(function (p) {
        return "<li>" + p.trim() + "</li>";
      })
      .join("");
  }

  function applyPipeList(el, val, sep) {
    if (!el) return;
    el.innerHTML = pipeList(val, sep);
  }

  function setHtml(el, val) {
    if (el && val != null) el.innerHTML = val;
  }

  function setText(el, val) {
    if (el && val != null) el.textContent = val;
  }

  function setImg(el, val) {
    if (el && val) el.src = val;
  }

  function setBg(el, val) {
    if (el && val) el.style.backgroundImage = 'url("' + val.replace(/"/g, "") + '")';
  }

  window.CMS_apply = function () {
    var c = window.CMS_getContent();
    if (!c) return;

    document.title = c["meta.title"] || document.title;

    document.querySelectorAll("[data-cms]").forEach(function (el) {
      var key = el.getAttribute("data-cms");
      var val = c[key];
      if (val == null || val === "") return;
      var mode = el.getAttribute("data-cms-mode") || "html";
      if (mode === "text") setText(el, val);
      else if (mode === "img") setImg(el, val);
      else if (mode === "bg") setBg(el, val);
      else setHtml(el, val);
    });

    document.querySelectorAll("[data-cms-list]").forEach(function (el) {
      var key = el.getAttribute("data-cms-list");
      var val = c[key];
      if (val != null) applyPipeList(el, val, "|");
    });

    var schedBody = document.querySelector("[data-cms-sched]");
    if (schedBody && c["sched.table"]) schedBody.innerHTML = c["sched.table"];

    var heroBg = document.querySelector(".hero-bg");
    if (heroBg && c["hero.bg"]) setBg(heroBg, c["hero.bg"]);

    var bookSec = document.querySelector(".booking");
    if (bookSec && c["book.bg"]) {
      bookSec.style.backgroundImage =
        'url("' + c["book.bg"].replace(/"/g, "") + '")';
    }

    var priceList = document.querySelector("[data-cms-price-list]");
    if (priceList && c["price.p2.list"]) applyPipeList(priceList, c["price.p2.list"], "|");

    [1, 2, 3, 4].forEach(function (d) {
      var meals = document.querySelector('[data-cms-meals="day' + d + '"]');
      var acts = document.querySelector('[data-cms-acts="day' + d + '"]');
      if (meals && c["day" + d + ".meals"]) {
        meals.innerHTML = c["day" + d + ".meals"]
          .split("|")
          .map(function (m) {
            return '<span class="meal">' + m.trim() + "</span>";
          })
          .join("");
      }
      if (acts && c["day" + d + ".acts"]) applyPipeList(acts, c["day" + d + ".acts"], "|");
    });

    var tel = document.querySelector("[data-cms-tel]");
    if (tel && c["contact.phone"]) {
      tel.href = "tel:" + c["contact.phone"].replace(/\s/g, "");
    }
    var zalo = document.querySelector("[data-cms-zalo]");
    if (zalo && c["contact.zalo"]) zalo.href = c["contact.zalo"];
    var fb = document.querySelector("[data-cms-fb]");
    if (fb && c["contact.fb"]) fb.href = c["contact.fb"];
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.CMS_apply);
  } else {
    window.CMS_apply();
  }
})();
