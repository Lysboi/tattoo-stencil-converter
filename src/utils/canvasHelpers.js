export function setupCanvas(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false; // Preserve sharp edges
  return ctx;
}

export function drawImageMaintainAspectRatio(ctx, img, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
  const width = img.width * scale;
  const height = img.height * scale;
  const x = (maxWidth - width) / 2;
  const y = (maxHeight - height) / 2;

  ctx.clearRect(0, 0, maxWidth, maxHeight);
  ctx.drawImage(img, x, y, width, height);
  return { x, y, width, height };
}