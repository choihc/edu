export const presentationDownloads = {
  codingAi: {
    html: "/presentation.html",
    pdf: "/presentation.html?print=1",
    filename: "coding-ai-paradigm.html",
  },
  multiAgent: {
    html: "/multi-agent?export=html",
    pdf: "/multi-agent?print=1",
  },
  specManager: {
    html: "/spec-manager?export=html",
    pdf: "/spec-manager?print=1",
  },
  aiNative: {
    html: "/ai-native?export=html",
    pdf: "/ai-native?print=1",
    filename: "ai-native-presentation.html",
  },
};

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function downloadStaticHtml(path, filename) {
  const response = await fetch(path);
  const html = await response.text();
  triggerBlobDownload(new Blob([html], { type: "text/html;charset=utf-8" }), filename);
}

export function downloadCurrentPageHtml(filename) {
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll("[data-export-hidden]").forEach((node) => node.remove());
  clone.querySelectorAll("script").forEach((node) => node.remove());

  const html = `<!doctype html>\n${clone.outerHTML}`;
  triggerBlobDownload(new Blob([html], { type: "text/html;charset=utf-8" }), filename);
}

export function openPdfPrintView(path) {
  window.open(path, "_blank", "noopener,noreferrer");
}

export function runExportMode({ filename, delay = 700 }) {
  const params = new URLSearchParams(window.location.search);

  if (params.get("print") === "1") {
    window.setTimeout(() => window.print(), delay);
  }

  if (params.get("export") === "html") {
    window.setTimeout(() => downloadCurrentPageHtml(filename), delay);
  }
}
