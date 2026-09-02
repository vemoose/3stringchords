import { toPng } from 'html-to-image';

/** Letter width at 96dpi — matches the standard export sheet. */
export const PRACTICE_EXPORT_WIDTH_PX = 816;

export function enablePracticeExportMode(element: HTMLElement): void {
  element.classList.add('practice-export-mode');
}

export function disablePracticeExportMode(element: HTMLElement): void {
  element.classList.remove('practice-export-mode');
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

export async function capturePracticeSnapshot(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const host = document.createElement('div');
  host.className = 'practice-export-capture-host';
  const clone = createCaptureClone(element);
  host.appendChild(clone);
  document.body.appendChild(host);

  await document.fonts.ready;
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  try {
    const dataUrl = await toPng(clone, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    host.remove();
  }
}

export function practiceSnapshotFilename(tuning: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `3stringchords-practice-${tuning}-${date}.png`;
}
