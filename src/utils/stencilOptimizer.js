export function optimizeStencil(imageData, options) {
  const { lineWeight, contrast, smoothing } = options;
  
  // Enhance line definition
  const enhancedLines = enhanceLines(imageData, lineWeight);
  
  // Adjust contrast
  const contrastedImage = adjustContrast(enhancedLines, contrast);
  
  // Apply smoothing if needed
  return smoothing ? smoothLines(contrastedImage) : contrastedImage;
}

function enhanceLines(imageData, lineWeight) {
  const output = new ImageData(imageData.width, imageData.height);
  const data = imageData.data;
  const outData = output.data;
  
  for (let y = 1; y < imageData.height - 1; y++) {
    for (let x = 1; x < imageData.width - 1; x++) {
      const idx = (y * imageData.width + x) * 4;
      
      // Edge detection with adjustable line weight
      const edges = detectEdges(data, idx, imageData.width, lineWeight);
      
      outData[idx] = edges;
      outData[idx + 1] = edges;
      outData[idx + 2] = edges;
      outData[idx + 3] = 255;
    }
  }
  
  return output;
}

function detectEdges(data, idx, width, weight) {
  const surrounding = [
    idx - width * 4 - 4, idx - width * 4, idx - width * 4 + 4,
    idx - 4,            idx,            idx + 4,
    idx + width * 4 - 4, idx + width * 4, idx + width * 4 + 4
  ].map(i => data[i]);
  
  const maxDiff = Math.max(...surrounding.map(v => Math.abs(v - data[idx])));
  return maxDiff > (128 / weight) ? 0 : 255;
}

function adjustContrast(imageData, amount) {
  const output = new ImageData(imageData.width, imageData.height);
  const data = imageData.data;
  const outData = output.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const value = data[i] < 128 ? 0 : 255;
    outData[i] = outData[i + 1] = outData[i + 2] = value;
    outData[i + 3] = 255;
  }
  
  return output;
}

function smoothLines(imageData) {
  const output = new ImageData(imageData.width, imageData.height);
  const data = imageData.data;
  const outData = output.data;
  
  for (let y = 1; y < imageData.height - 1; y++) {
    for (let x = 1; x < imageData.width - 1; x++) {
      const idx = (y * imageData.width + x) * 4;
      
      // Apply 3x3 smoothing kernel
      const smoothed = applySmoothing(data, idx, imageData.width);
      
      outData[idx] = smoothed;
      outData[idx + 1] = smoothed;
      outData[idx + 2] = smoothed;
      outData[idx + 3] = 255;
    }
  }
  
  return output;
}

function applySmoothing(data, idx, width) {
  const kernel = [
    0.1, 0.1, 0.1,
    0.1, 0.2, 0.1,
    0.1, 0.1, 0.1
  ];
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const y = Math.floor(i / 3) - 1;
    const x = (i % 3) - 1;
    const pixelIdx = idx + (y * width + x) * 4;
    sum += data[pixelIdx] * kernel[i];
  }
  
  return sum < 128 ? 0 : 255;
}