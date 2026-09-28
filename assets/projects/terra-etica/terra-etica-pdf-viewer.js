// Lecteur PDF (page par page) pour la fiche projet "Terra Ética — Stratégie
// d'internationalisation". Copie adaptée de pdf-viewer.js (même logique, IDs
// préfixés "terra"), gardée séparée pour ne jamais toucher au lecteur utilisé
// par la page Fandom (ni à celui de Xbox).
//
// Le PDF est chargé depuis terra-etica-pdf-data.js (contenu encodé en base64,
// généré à partir du vrai fichier) plutôt que via fetch() d'un chemin local :
// fetch()/XHR vers un fichier local est bloqué par Chrome quand la page est
// ouverte directement en file:// (double-clic). Le worker PDF.js, lui, est
// chargé depuis le CDN (une vraie requête réseau https, non concernée par
// cette restriction).

import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs";

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const els = {
  canvas: document.getElementById("terraPdfCanvas"),
  status: document.getElementById("terraPdfStatus"),
  statusText: document.getElementById("terraPdfStatusText"),
  statusFallback: document.getElementById("terraPdfStatusFallback"),
  prev: document.getElementById("terraPdfPrev"),
  next: document.getElementById("terraPdfNext"),
  pageInput: document.getElementById("terraPdfPageInput"),
  pageCurrent: document.getElementById("terraPdfPageCurrent"),
  pageTotal: document.getElementById("terraPdfPageTotal"),
  expand: document.getElementById("terraPdfExpand"),

  modal: document.getElementById("terraPdfModal"),
  modalClose: document.getElementById("terraPdfModalClose"),
  modalCanvas: document.getElementById("terraPdfModalCanvas"),
  modalPrev: document.getElementById("terraPdfModalPrev"),
  modalNext: document.getElementById("terraPdfModalNext"),
  modalPageInput: document.getElementById("terraPdfModalPageInput"),
  modalPageCurrent: document.getElementById("terraPdfModalPageCurrent"),
  modalPageTotal: document.getElementById("terraPdfModalPageTotal"),
};

if (els.canvas && els.modal) {
  let pdfDoc = null;
  let currentPage = 1;
  let totalPages = 1;
  let lastFocused = null;

  const inlineTaskRef = { task: null };
  const modalTaskRef = { task: null };

  function setStatus(message, showFallback) {
    els.status.hidden = false;
    els.statusText.textContent = message;
    els.statusFallback.hidden = !showFallback;
  }

  function hideStatus() {
    els.status.hidden = true;
  }

  async function renderInto(canvas, pageNum, taskRef) {
    if (taskRef.task) {
      try {
        taskRef.task.cancel();
      } catch {
        // rendu déjà terminé, rien à annuler
      }
    }

    const page = await pdfDoc.getPage(pageNum);
    const baseViewport = page.getViewport({ scale: 1 });
    const containerWidth = canvas.parentElement.clientWidth || baseViewport.width;
    const scale =
      Math.min(containerWidth / baseViewport.width, 2.2) * (window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: Math.max(scale, 0.5) });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    const task = page.render({ canvasContext: ctx, viewport });
    taskRef.task = task;

    try {
      await task.promise;
    } catch (err) {
      if (err && err.name === "RenderingCancelledException") return;
      throw err;
    }
  }

  function syncUI() {
    els.pageCurrent.textContent = String(currentPage);
    els.pageTotal.textContent = String(totalPages);
    els.pageInput.value = String(currentPage);
    els.pageInput.max = String(totalPages);
    els.prev.disabled = currentPage <= 1;
    els.next.disabled = currentPage >= totalPages;

    els.modalPageCurrent.textContent = String(currentPage);
    els.modalPageTotal.textContent = String(totalPages);
    els.modalPageInput.value = String(currentPage);
    els.modalPageInput.max = String(totalPages);
    els.modalPrev.disabled = currentPage <= 1;
    els.modalNext.disabled = currentPage >= totalPages;
  }

  async function goToPage(num) {
    if (!pdfDoc) return;
    const clamped = Math.min(Math.max(1, Math.round(num) || 1), totalPages);
    currentPage = clamped;
    syncUI();
    try {
      await renderInto(els.canvas, currentPage, inlineTaskRef);
      if (!els.modal.hidden) {
        await renderInto(els.modalCanvas, currentPage, modalTaskRef);
      }
    } catch (err) {
      console.error("Erreur de rendu du PDF Terra Ética :", err);
    }
  }

  function onModalKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      const focusables = els.modal.querySelectorAll(
        'button:not(:disabled), [href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openModal() {
    lastFocused = document.activeElement;
    els.modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onModalKeydown);
    els.modalClose.focus();
    if (pdfDoc) {
      renderInto(els.modalCanvas, currentPage, modalTaskRef).catch((err) =>
        console.error("Erreur de rendu du PDF Terra Ética :", err)
      );
    }
  }

  function closeModal() {
    els.modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  els.prev.addEventListener("click", () => goToPage(currentPage - 1));
  els.next.addEventListener("click", () => goToPage(currentPage + 1));
  els.pageInput.addEventListener("change", () => goToPage(Number(els.pageInput.value)));
  els.pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToPage(Number(els.pageInput.value));
    }
  });

  els.modalPrev.addEventListener("click", () => goToPage(currentPage - 1));
  els.modalNext.addEventListener("click", () => goToPage(currentPage + 1));
  els.modalPageInput.addEventListener("change", () => goToPage(Number(els.modalPageInput.value)));
  els.modalPageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToPage(Number(els.modalPageInput.value));
    }
  });

  els.expand.addEventListener("click", openModal);
  els.modalClose.addEventListener("click", closeModal);
  els.modal.addEventListener("click", (e) => {
    if (e.target === els.modal) closeModal();
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (!pdfDoc) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderInto(els.canvas, currentPage, inlineTaskRef).catch(() => {});
      if (!els.modal.hidden) {
        renderInto(els.modalCanvas, currentPage, modalTaskRef).catch(() => {});
      }
    }, 200);
  });

  (async function init() {
    setStatus("Chargement de l’étude Terra Ética…", false);
    try {
      if (typeof window.__TERRA_PDF_BASE64__ !== "string" || !window.__TERRA_PDF_BASE64__) {
        throw new Error(
          "Données du PDF introuvables : assets/projects/terra-etica/terra-etica-pdf-data.js n'est pas chargé (vérifie la balise <script> dans la page)."
        );
      }
      const pdfData = base64ToUint8Array(window.__TERRA_PDF_BASE64__);
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      pdfDoc = await loadingTask.promise;
      totalPages = pdfDoc.numPages;
      // Ouvre sur la page 5 ("Le C.A.P.") plutôt que la page 1 : la slide de titre
      // du deck contient des filigranes Canva, alors que celle-ci est propre.
      currentPage = 5;
      syncUI();
      await renderInto(els.canvas, currentPage, inlineTaskRef);
      hideStatus();
      els.expand.disabled = false;
    } catch (err) {
      console.error("Erreur de chargement du PDF Terra Ética :", err);
      setStatus("Le document ne peut pas être affiché ici.", true);
    }
  })();
}
