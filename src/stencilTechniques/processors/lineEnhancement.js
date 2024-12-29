export function enhanceLines(imageData, settings) {
  const { lineWeight, smoothing, detail } = settings;
  
  // Apply line weight enhancement
  const weighted = applyLineWeight(imageData, lineWeight);
  
  // Enhance line continuity
  const continuous = enhanceLineContinuity(weighted, detail);
  
  // Apply smoothing if needed
  return smoothing ? smoothLines(continuous) : continuous;
}

function applyLineWeight(imageData, weight) {
  const output = new ImageData(imageData.width, imageData.height);
  const data = imageData.data;
  const outData = output.data;
  
  for (let y = 1; y < imageData.height - 1; y++) {
    for (let x = 1; x < imageData.width - 1; x++) {
      const idx = (y * imageData.width + x) * 4;
      
      // Check for line presence
      if (data[idx] === 0) {
        // Apply weight to surrounding pixels
        for (let wy = -weight; wy <= weight; wy++) {
          for (let wx = -weight; wx <= weight; wx++) {
            if (wx*wx + wy*wy <= weight*weight) {
              const targetIdx = ((y + wy) * imageData.width + (x + wx)) * 4;
              outData[targetIdx] = outData[targetIdx + 1] = outData[targetIdx + 2] = 0;
              outData[targetIdx + 3] = 255;
            }
          }
        }
      }
    }
  }
  
  return output;
}