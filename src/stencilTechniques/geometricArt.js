export const geometricArtProcessor = {
  settings: {
    complexity: {
      label: 'Karmaşıklık',
      min: 1,
      max: 10,
      default: 5
    },
    shapeSize: {
      label: 'Şekil Boyutu',
      min: 5,
      max: 50,
      default: 20
    },
    angleSnap: {
      label: 'Açı Hassasiyeti',
      min: 0,
      max: 90,
      default: 45
    },
    minimalism: {
      label: 'Sadelik',
      min: 0,
      max: 100,
      default: 50
    }
  },

  process: function(imageData, settings) {
    const { width, height, data } = imageData;
    const output = new ImageData(width, height);
    const { complexity, shapeSize, angleSnap, minimalism } = settings;

    // Kenar tespiti için gradient hesapla
    const gradients = new Float32Array(width * height);
    const directions = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x);
        const pixel = (y * width + x) * 4;

        // Sobel operatörü
        const gx = 
          -data[pixel-4-width*4] + data[pixel+4-width*4] +
          -2*data[pixel-4] + 2*data[pixel+4] +
          -data[pixel-4+width*4] + data[pixel+4+width*4];
        
        const gy = 
          -data[pixel-width*4-4] - 2*data[pixel-width*4] - data[pixel-width*4+4] +
          data[pixel+width*4-4] + 2*data[pixel+width*4] + data[pixel+width*4+4];

        gradients[i] = Math.sqrt(gx*gx + gy*gy);
        directions[i] = Math.atan2(gy, gx);
      }
    }

    // Geometrik şekiller oluştur
    const shapes = [];
    const cellSize = Math.max(5, Math.floor(shapeSize * (11 - complexity) / 2));
    const threshold = (100 - minimalism) * 2;

    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        let avgGradient = 0;
        let avgDirection = 0;
        let count = 0;

        // Hücre içindeki gradyanları ortala
        for (let dy = 0; dy < cellSize && y + dy < height; dy++) {
          for (let dx = 0; dx < cellSize && x + dx < width; dx++) {
            const i = ((y + dy) * width + (x + dx));
            if (gradients[i] > threshold) {
              avgGradient += gradients[i];
              avgDirection += directions[i];
              count++;
            }
          }
        }

        if (count > 0) {
          avgGradient /= count;
          avgDirection /= count;

          // Açıyı snap değerine yuvarla
          if (angleSnap > 0) {
            const snap = (Math.PI * angleSnap) / 180;
            avgDirection = Math.round(avgDirection / snap) * snap;
          }

          // Şekil büyüklüğünü gradyana göre ayarla
          const size = Math.min(
            cellSize,
            Math.max(cellSize/2, (avgGradient/255) * cellSize)
          );

          shapes.push({
            x: x + cellSize/2,
            y: y + cellSize/2,
            size: size,
            angle: avgDirection
          });
        }
      }
    }

    // Şekilleri çiz
    const ctx = new OffscreenCanvas(width, height).getContext('2d');
    ctx.fillStyle = 'black';
    
    shapes.forEach(shape => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.angle);

      // Farklı geometrik şekiller çiz
      const shapeType = Math.floor(Math.random() * 3);
      switch(shapeType) {
        case 0: // Üçgen
          ctx.beginPath();
          ctx.moveTo(-shape.size/2, shape.size/2);
          ctx.lineTo(shape.size/2, shape.size/2);
          ctx.lineTo(0, -shape.size/2);
          ctx.closePath();
          ctx.fill();
          break;
        
        case 1: // Dikdörtgen
          ctx.fillRect(-shape.size/2, -shape.size/4, shape.size, shape.size/2);
          break;
        
        case 2: // Çizgi
          ctx.lineWidth = Math.max(1, shape.size/8);
          ctx.beginPath();
          ctx.moveTo(-shape.size/2, 0);
          ctx.lineTo(shape.size/2, 0);
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    });

    // Sonucu ImageData'ya aktar
    const finalImage = ctx.getImageData(0, 0, width, height);
    output.data.set(finalImage.data);

    return output;
  }
}; 