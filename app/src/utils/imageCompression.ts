export async function compressImageToDataUrl(file: File, maxSize = 800, quality = 0.90): Promise<string> {
  // Yield to the UI thread to avoid jank when selecting images.
  await new Promise<void>((r) => setTimeout(() => r(), 0));

  // Fast path for tiny files
  if (file.size < 50_000) {
    return await readAsDataURL(file);
  }

  // Faster decode path when available
  const bitmap = await fileToBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;

  const scale = Math.min(1, maxSize / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if ('close' in bitmap) (bitmap as ImageBitmap).close();
    return await readAsDataURL(file);
  }

  ctx.drawImage(bitmap as any, 0, 0, w, h);
  if ('close' in bitmap) (bitmap as ImageBitmap).close();

  // Prefer webp if supported
  const mime = 'image/webp';
  try {
    const dataUrl = canvas.toDataURL(mime, quality);
    // Some browsers may return png if webp unsupported; still ok.
    return dataUrl;
  } catch {
    return canvas.toDataURL('image/jpeg', quality);
  }
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fileToBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap is usually faster and doesn't require DOM image decoding.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall back
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
