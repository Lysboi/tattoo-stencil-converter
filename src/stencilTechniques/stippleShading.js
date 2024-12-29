export const stippleShadingProcessor = {
  settings: {
    density: {
      label: 'Nokta Yoğunluğu',
      min: 1,
      max: 10,
      default: 5
    },
    minDotSize: {
      label: 'Minimum Nokta Boyutu',
      min: 1,
      max: 5,
      default: 1
    },
    maxDotSize: {
      label: 'Maximum Nokta Boyutu',
      min: 2,
      max: 8,
      default: 4
    },
    contrast: {
      label: 'Kontrast',
      min: 0,
      max: 100,
      default: 50
    }
  },

  process: function(imageData, settings) {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const { density, minDotSize, maxDotSize, contrast } = settings;

    // Görüntüyü gri tonlamaya çevir
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const gray = Math.floor(
          (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
        );
        
        // Kontrast ayarı
        const adjustedGray = Math.min(255, Math.max(0,
          ((gray - 128) * (1 + contrast / 100)) + 128
        ));

        // Nokta boyutu hesaplama
        const dotSize = Math.floor(
          minDotSize + (maxDotSize - minDotSize) * (1 - adjustedGray / 255)
        );

        // Nokta yoğunluğuna göre rastgele nokta yerleştirme
        if (Math.random() < (1 - adjustedGray / 255) * (density / 10)) {
          // Nokta çizimi
          for (let dy = -dotSize; dy <= dotSize; dy++) {
            for (let dx = -dotSize; dx <= dotSize; dx++) {
              if (dx * dx + dy * dy <= dotSize * dotSize) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const ni = (ny * width + nx) * 4;
                  output.data[ni] = 0;
                  output.data[ni + 1] = 0;
                  output.data[ni + 2] = 0;
                  output.data[ni + 3] = 255;
                }
              }
            }
          }
        }
      }
    }

    return output;
  }
}; 