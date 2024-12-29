export const watercolorStyleProcessor = {
  settings: {
    edgeIntensity: {
      label: 'Kenar Yoğunluğu',
      min: 1,
      max: 10,
      default: 5
    },
    splatterAmount: {
      label: 'Sıçrama Miktarı',
      min: 0,
      max: 100,
      default: 30
    },
    flowIntensity: {
      label: 'Akış Yoğunluğu',
      min: 1,
      max: 10,
      default: 5
    },
    softness: {
      label: 'Yumuşaklık',
      min: 0,
      max: 100,
      default: 50
    }
  },

  process: function(imageData, settings) {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const { edgeIntensity, splatterAmount, flowIntensity, softness } = settings;

    // Geçici buffer oluştur
    const tempBuffer = new Uint8ClampedArray(width * height * 4);

    // Görüntüyü gri tonlamaya çevir ve kenarları tespit et
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const gray = Math.floor(
          (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
        );

        // Kenar tespiti için Sobel operatörü
        let gx = 0, gy = 0;
        if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              const g = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114);
              gx += g * ((dx === 0) ? 0 : (dx === 1 ? 1 : -1));
              gy += g * ((dy === 0) ? 0 : (dy === 1 ? 1 : -1));
            }
          }
        }

        const edge = Math.sqrt(gx * gx + gy * gy) * (edgeIntensity / 5);
        tempBuffer[i] = edge;
      }
    }

    // Suluboya efekti uygula
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        // Akış efekti
        let flow = 0;
        const flowRadius = flowIntensity * 2;
        for (let dy = -flowRadius; dy <= flowRadius; dy++) {
          for (let dx = -flowRadius; dx <= flowRadius; dx++) {
            if (x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              flow += tempBuffer[idx] * (1 - Math.sqrt(dx*dx + dy*dy) / flowRadius);
            }
          }
        }
        flow /= (flowRadius * 2) * (flowRadius * 2);

        // Sıçrama efekti
        const splatter = (Math.random() * 255) < splatterAmount ? 255 : 0;

        // Yumuşatma
        const softFactor = softness / 100;
        const finalValue = Math.min(255,
          (flow * (1 - softFactor) + splatter * softFactor) * 
          (1 - Math.random() * 0.2)  // Rastgele varyasyon
        );

        // Sonucu kaydet
        output.data[i] = output.data[i + 1] = output.data[i + 2] = finalValue;
        output.data[i + 3] = finalValue > 10 ? 255 : 0;  // Şeffaflık eşiği
      }
    }

    return output;
  }
}; 