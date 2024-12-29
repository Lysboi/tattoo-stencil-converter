export const tribalStyleProcessor = {
  settings: {
    lineThickness: {
      label: 'Çizgi Kalınlığı',
      min: 1,
      max: 10,
      default: 3
    },
    patternDensity: {
      label: 'Desen Yoğunluğu',
      min: 1,
      max: 10,
      default: 5
    },
    flowDirection: {
      label: 'Akış Yönü',
      min: 0,
      max: 360,
      default: 45
    },
    curvature: {
      label: 'Eğrilik',
      min: 0,
      max: 100,
      default: 50
    }
  },

  process: function(imageData, settings) {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const { lineThickness, patternDensity, flowDirection, curvature } = settings;

    // Görüntüyü kenar tespiti için hazırla
    const edges = new Uint8Array(width * height);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const gray = Math.floor(
          (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
        );

        // Sobel operatörü ile kenar tespiti
        const gx = 
          -data[i-4-width*4] + data[i+4-width*4] +
          -2*data[i-4] + 2*data[i+4] +
          -data[i-4+width*4] + data[i+4+width*4];
        
        const gy = 
          -data[i-width*4-4] - 2*data[i-width*4] - data[i-width*4+4] +
          data[i+width*4-4] + 2*data[i+width*4] + data[i+width*4+4];

        edges[y * width + x] = Math.min(255, Math.sqrt(gx*gx + gy*gy));
      }
    }

    // Tribal desenleri oluştur
    const angleRad = (flowDirection * Math.PI) / 180;
    const curveIntensity = curvature / 50;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const edgeValue = edges[y * width + x];
        if (edgeValue > 50) {  // Kenar eşiği
          // Tribal desen çizgilerini oluştur
          for (let t = 0; t < lineThickness; t++) {
            const offset = Math.sin((x + y) * 0.1 * curveIntensity) * patternDensity;
            const nx = Math.floor(x + Math.cos(angleRad + offset) * t);
            const ny = Math.floor(y + Math.sin(angleRad + offset) * t);
            
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

    return output;
  }
}; 