/**
 * VietKite CMS — Firebase là nguồn chính cho mọi máy
 */
(function () {
  var STORAGE_KEY = "vietkite_cms_v1";
  var CONTENT_FILE = "content.json";

  window.CMS_fileData = null;

  function isAdminPage() {
    return !!document.getElementById("adminApp");
  }

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

    if (window.CMS_firebaseData) {
      Object.assign(base, window.CMS_firebaseData);
      return base;
    }

    if (!isAdminPage()) {
      if (window.CMS_fileData) Object.assign(base, window.CMS_fileData);
      return base;
    }

    if (window.CMS_fileData) Object.assign(base, window.CMS_fileData);
    var stored = getStored();
    if (stored) Object.assign(base, stored);
    return base;
  };

  window.CMS_getContentForAdmin = function () {
    var base = Object.assign({}, window.CMS_DEFAULT || {});
    if (window.CMS_firebaseData) {
      Object.assign(base, window.CMS_firebaseData);
      return base;
    }
    var stored = getStored();
    if (stored) Object.assign(base, stored);
    if (window.CMS_fileData) Object.assign(base, window.CMS_fileData);
    return base;
  };

  window.CMS_saveContent = function (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  window.CMS_clearContent = function () {
    localStorage.removeItem(STORAGE_KEY);
  };

  window.CMS_loadRemote = function () {
    return new Promise(function (resolve) {
      if (location.protocol === "file:") {
        resolve(null);
        return;
      }
      fetch(CONTENT_FILE + "?v=" + Date.now())
        .then(function (r) {
          if (!r.ok) throw new Error("404");
          return r.json();
        })
        .then(function (data) {
          window.CMS_fileData = data;
          resolve(data);
        })
        .catch(function () {
          resolve(null);
        });
    });
  };

  window.CMS_downloadJson = function (data, filename) {
    data = data || window.CMS_getContentForAdmin();
    var blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || "content.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  function pipeList(html, sep) {
    return (html || "")
      .split(sep || "|")
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
    if (el && val) {
      el.style.backgroundImage =
        'url("' + String(val).replace(/"/g, "") + '")';
    }
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
        'url("' + String(c["book.bg"]).replace(/"/g, "") + '")';
    }

    var priceList = document.querySelector("[data-cms-price-list]");
    if (priceList && c["price.p2.list"])
      applyPipeList(priceList, c["price.p2.list"], "|");

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
      if (acts && c["day" + d + ".acts"])
        applyPipeList(acts, c["day" + d + ".acts"], "|");
    });

    var tel = document.querySelector("[data-cms-tel]");
    if (tel && c["contact.phone"])
      tel.href = "tel:" + c["contact.phone"].replace(/\s/g, "");
    var zalo = document.querySelector("[data-cms-zalo]");
    if (zalo && c["contact.zalo"]) zalo.href = c["contact.zalo"];
    var fb = document.querySelector("[data-cms-fb]");
    if (fb && c["contact.fb"]) fb.href = c["contact.fb"];
  };

  function cmsMarkReady() {
    document.documentElement.classList.remove("cms-loading");
    document.documentElement.classList.add("cms-ready");
  }

  window.CMS_init = function () {
    document.documentElement.classList.add("cms-loading");

    var loadFb =
      typeof window.CMS_loadFirebase === "function"
        ? window.CMS_loadFirebase()
        : Promise.resolve(null);

    return loadFb
      .then(function (fbData) {
        window.CMS_apply();
        cmsMarkReady();

        if (!isAdminPage() && typeof window.CMS_watchFirebase === "function") {
          window.CMS_watchFirebase(function () {
            window.CMS_apply();
          });
        }

        if (!fbData && !isAdminPage()) {
          return window.CMS_loadRemote().then(function () {
            window.CMS_apply();
          });
        }
        return fbData;
      })
      .catch(function (err) {
        console.error("CMS_init:", err);
        cmsMarkReady();
        return window.CMS_loadRemote().then(function () {
          window.CMS_apply();
        });
      });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.CMS_init);
  } else {
    window.CMS_init();
  }
})();
