export function enhanceDetails(imageData, settings) {
  const { detailLevel, sharpness, contrast } = settings;
  
  // Enhance fine details
  const detailed = enhanceFineParts(imageData, detailLevel);
  
  // Apply local contrast enhancement
  const contrasted = enhanceLocalContrast(detailed, contrast);
  
  // Sharpen edges
  return sharpenEdges(contrasted, sharpness);
}

function enhanceFineParts(imageData, level) {
  const output = new ImageData(imageData.width, imageData.height);
  const data = imageData.data;
  const outData = output.data;
  
  // Use unsharp masking for detail enhancement
  const blurred = applyGaussianBlur(imageData, 1.0);
  
  for (let i = 0; i < data.length; i += 4) {
    const detail = data[i] - blurred.data[i];
    const enhanced = data[i] + detail * level;
    outData[i] = outData[i + 1] = outData[i + 2] = Math.max(0, Math.min(255, enhanced));
    outData[i + 3] = 255;
  }
  
  return output;
}