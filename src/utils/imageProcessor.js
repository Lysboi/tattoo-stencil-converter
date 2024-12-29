export function convertToStencil(imageData) {
  const processed = applyEdgeDetection(imageData);
  enhanceLines(processed);
  addCrossHatching(processed);
  return processed;
}

function applyEdgeDetection(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Sobel operator kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0;
      let pixelY = 0;

      // Apply convolution
      for (let kernelY = -1; kernelY <= 1; kernelY++) {
        for (let kernelX = -1; kernelX <= 1; kernelX++) {
          const idx = ((y + kernelY) * width + (x + kernelX)) * 4;
          const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
          pixelX += gray * sobelX[(kernelY + 1) * 3 + (kernelX + 1)];
          pixelY += gray * sobelY[(kernelY + 1) * 3 + (kernelX + 1)];
        }
      }

      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
      const idx = (y * width + x) * 4;
      const value = magnitude > 30 ? 0 : 255; // Threshold for edge detection

      outputData[idx] = value;
      outputData[idx + 1] = value;
      outputData[idx + 2] = value;
      outputData[idx + 3] = 255;
    }
  }

  return output;
}

function enhanceLines(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Check surrounding pixels for line continuity
      if (data[idx] === 0) {
        let connectedPixels = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
            if (data[neighborIdx] === 0) connectedPixels++;
          }
        }
        
        // Enhance isolated pixels that might be noise
        if (connectedPixels < 3) {
          data[idx] = data[idx + 1] = data[idx + 2] = 255;
        }
      }
    }
  }
}

function addCrossHatching(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Add cross-hatching to darker areas
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const idx = (y * width + x) * 4;
      if (data[idx] === 0) {
        // Add diagonal lines
        for (let i = 0; i < 4 && y + i < height && x + i < width; i++) {
          const hatchIdx = ((y + i) * width + (x + i)) * 4;
          data[hatchIdx] = data[hatchIdx + 1] = data[hatchIdx + 2] = 0;
        }
      }
    }
  }
}