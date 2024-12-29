export const dotworkProcessor = {
  name: 'Dotwork',
  settings: {
    density: { min: 1, max: 10, default: 4, label: 'Dot Density' },
    size: { min: 1, max: 5, default: 2, label: 'Dot Size' },
    contrast: { min: 0, max: 100, default: 50, label: 'Contrast' }
  },

  process(imageData, settings) {
    const output = new ImageData(imageData.width, imageData.height);
    const data = imageData.data;
    const outData = output.data;
    
    // Fill with white
    outData.fill(255);
    
    // Add dots based on image darkness
    for (let y = 0; y < imageData.height; y += settings.density) {
      for (let x = 0; x < imageData.width; x += settings.density) {
        const i = (y * imageData.width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        if (brightness < (255 - settings.contrast * 2.55)) {
          this.drawDot(outData, x, y, settings.size, imageData.width);
        }
      }
    }
    
    return output;
  },

  drawDot(data, x, y, size, width) {
    for (let dy = -size; dy <= size; dy++) {
      for (let dx = -size; dx <= size; dx++) {
        if (dx * dx + dy * dy <= size * size) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] = data[i + 1] = data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }
    }
  }
}