import { toPng } from 'html-to-image';

/** Letter width at 96dpi — matches the standard export sheet. */
export const PRACTICE_EXPORT_WIDTH_PX = 816;

export function enablePracticeExportMode(element: HTMLElement): void {
  element.classList.add('practice-export-mode');
}

export function disablePracticeExportMode(element: HTMLElement): void {
  element.classList.remove('practice-export-mode');
}

export function isMobileExportDevice(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function uniquifySvgIds(root: HTMLElement, suffix: string): void {
  const idMap = new Map<string, string>();

  root.querySelectorAll('[id]').forEach((node) => {
    if (!(node instanceof Element)) return;
    const nextId = `${node.id}${suffix}`;
    idMap.set(node.id, nextId);
    node.id = nextId;
  });

  root.querySelectorAll('*').forEach((node) => {
    if (!(node instanceof Element)) return;

    for (const attr of ['fill', 'stroke', 'filter', 'href', 'xlink:href']) {
      const value = node.getAttribute(attr);
      if (!value) continue;

      const match = value.match(/^url\(#([^)]+)\)$/);
      if (match && idMap.has(match[1])) {
        node.setAttribute(attr, `url(#${idMap.get(match[1])})`);
      }
    }
  });
}

function createCaptureClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.classList.add('practice-export-mode');
  clone.querySelectorAll('.animate-in').forEach((node) => {
    node.classList.remove('animate-in');
  });
  uniquifySvgIds(clone, '-capture');
  return clone;
}

export async function renderPracticeSnapshotPng(element: HTMLElement): Promise<string> {
  const host = document.createElement('div');
  host.className = 'practice-export-capture-host';
  const clone = createCaptureClone(element);
  host.appendChild(clone);
  document.body.appendChild(host);

  await document.fonts.ready;
  await waitForPaint();

  try {
    return await toPng(clone, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
  } finally {
    host.remove();
  }
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: 'image/png' });
}

export function canSharePracticeSnapshot(): boolean {
  return typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
}

export async function sharePracticeSnapshotFile(
  dataUrl: string,
  filename: string,
): Promise<boolean> {
  if (!canSharePracticeSnapshot()) return false;

  const file = await dataUrlToFile(dataUrl, filename);
  if (!navigator.canShare?.({ files: [file] })) return false;

  await navigator.share({
    files: [file],
    title: 'Practice Set',
  });

  return true;
}

export function downloadPracticeSnapshot(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function printPracticeSnapshotImage(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText =
      'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) {
      iframe.remove();
      reject(new Error('Unable to open print frame'));
      return;
    }

    let settled = false;
    const cleanup = () => {
      if (settled) return;
      settled = true;
      win.removeEventListener('afterprint', cleanup);
      iframe.remove();
      resolve();
    };

    win.addEventListener('afterprint', cleanup);

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <title>Practice Set</title>
    <style>
      @page { size: letter portrait; margin: 0.25in; }
      html, body { margin: 0; padding: 0; }
      img { display: block; width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" alt="Practice Set" />
  </body>
</html>`);
    doc.close();

    const img = doc.querySelector('img');
    if (!img) {
      cleanup();
      reject(new Error('Unable to prepare print image'));
      return;
    }

    const print = () => {
      try {
        win.focus();
        win.print();
      } catch (error) {
        if (!settled) {
          settled = true;
          win.removeEventListener('afterprint', cleanup);
          iframe.remove();
          reject(error);
        }
      }
    };

    if (img.complete) {
      print();
    } else {
      img.onload = print;
      img.onerror = () => {
        cleanup();
        reject(new Error('Unable to load print image'));
      };
    }

    window.setTimeout(cleanup, 60_000);
  });
}

export async function capturePracticeSnapshot(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const dataUrl = await renderPracticeSnapshotPng(element);
  downloadPracticeSnapshot(dataUrl, filename);
}

export async function printPracticeSheet(element: HTMLElement): Promise<void> {
  enablePracticeExportMode(element);
  await waitForPaint();
  window.print();
}

export function practiceSnapshotFilename(tuning: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `3stringchords-practice-${tuning}-${date}.png`;
}
