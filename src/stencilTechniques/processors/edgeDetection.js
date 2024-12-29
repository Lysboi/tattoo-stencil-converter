// Advanced edge detection using multiple algorithms
export function detectEdges(imageData, settings) {
  const sobelResult = applySobel(imageData);
  const cannyResult = applyCanny(imageData, settings.threshold);
  return combineEdgeDetectors(sobelResult, cannyResult, settings.blendMode);
}

function applySobel(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const output = new ImageData(width, height);
  const data = imageData.data;
  const outData = output.data;

  // Sobel kernels
  const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0;
      let pixelY = 0;

      // Apply convolution
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
          pixelX += gray * kernelX[(ky + 1) * 3 + (kx + 1)];
          pixelY += gray * kernelY[(ky + 1) * 3 + (kx + 1)];
        }
      }

      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
      const idx = (y * width + x) * 4;
      const value = magnitude > settings.threshold ? 0 : 255;
      
      outData[idx] = outData[idx + 1] = outData[idx + 2] = value;
      outData[idx + 3] = 255;
    }
  }

  return output;
}

function applyCanny(imageData, threshold) {
  // 1. Gaussian blur
  const blurred = applyGaussianBlur(imageData, 1.4);
  
  // 2. Gradient calculation
  const gradients = calculateGradients(blurred);
  
  // 3. Non-maximum suppression
  const suppressed = nonMaximumSuppression(gradients);
  
  // 4. Double threshold and edge tracking
  return hysteresisThresholding(suppressed, threshold * 0.5, threshold);
}