/* Applique la langue choisie (FR/EN) à tous les éléments [data-i18n] / [data-i18n-attr],
   mémorise le choix dans localStorage et le propage entre les pages du portfolio. */
(function () {
  var STORAGE_KEY = "siteLang";

  function getLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    return stored === "en" ? "en" : "fr";
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function translate(key, lang) {
    var dict = window.I18N && window.I18N[lang];
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    var fallback = window.I18N && window.I18N.fr;
    if (fallback && Object.prototype.hasOwnProperty.call(fallback, key)) return fallback[key];
    return null;
  }

  function applyLanguage(lang) {
    if (!window.I18N) return;
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = translate(key, lang);
      if (value === null) return;
      el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr");
      spec.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length !== 2) return;
        var attr = parts[0].trim();
        var key = parts[1].trim();
        var value = translate(key, lang);
        if (value === null) return;
        el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll(".lang-switch .lang-option").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    setLang(lang);
  }

  function initSwitchers() {
    document.querySelectorAll(".lang-switch .lang-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSwitchers();
    applyLanguage(getLang());
  });
})();
