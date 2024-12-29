const INCH_TO_PX = 96; // Standard screen DPI

export function calculateDimensions(width, height) {
  return {
    inches: {
      width: (width / INCH_TO_PX).toFixed(1),
      height: (height / INCH_TO_PX).toFixed(1)
    },
    cm: {
      width: (width / INCH_TO_PX * 2.54).toFixed(1),
      height: (height / INCH_TO_PX * 2.54).toFixed(1)
    }
  };
}

export function scaleToSize(imageData, targetWidth, targetHeight) {
  const scale = Math.min(
    targetWidth / imageData.width,
    targetHeight / imageData.height
  );
  return {
    width: Math.round(imageData.width * scale),
    height: Math.round(imageData.height * scale)
  };
}