// Utility for scaling image data
export function scaleImageData(imageData, targetWidth, targetHeight) {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  // Set canvas to source dimensions
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  
  // Draw original imageData
  tempCtx.putImageData(imageData, 0, 0);
  
  // Create second temp canvas for scaling
  const scaleCanvas = document.createElement('canvas');
  const scaleCtx = scaleCanvas.getContext('2d');
  
  // Set dimensions for scaled image
  scaleCanvas.width = targetWidth;
  scaleCanvas.height = targetHeight;
  
  // Draw scaled image
  scaleCtx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
  
  // Return scaled imageData
  return scaleCtx.getImageData(0, 0, targetWidth, targetHeight);
}