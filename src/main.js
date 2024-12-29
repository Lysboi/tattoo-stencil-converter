import { setupCanvas, drawImageMaintainAspectRatio } from './utils/canvasHelpers.js';
import { calculateDimensions } from './utils/sizeCalculator.js';
import { dotworkProcessor } from './stencilTechniques/dotwork.js';
import { stippleShadingProcessor } from './stencilTechniques/stippleShading.js';
import { tribalStyleProcessor } from './stencilTechniques/tribalStyle.js';
import { watercolorStyleProcessor } from './stencilTechniques/watercolorStyle.js';
import { geometricArtProcessor } from './stencilTechniques/geometricArt.js';

let WIDTH = 800;
let HEIGHT = 1000;

const processors = {
  dotwork: dotworkProcessor,
  stippleShading: stippleShadingProcessor,
  tribalStyle: tribalStyleProcessor,
  watercolorStyle: watercolorStyleProcessor,
  geometricArt: geometricArtProcessor
};

const sourceCanvas = document.getElementById('sourceCanvas');
const outputCanvas = document.getElementById('outputCanvas');
const sourceCtx = setupCanvas(sourceCanvas, WIDTH, HEIGHT);
const outputCtx = setupCanvas(outputCanvas, WIDTH, HEIGHT);

let currentSettings = {};
let currentImage = null;

// Boyut ayarları
document.getElementById('width').addEventListener('input', (e) => {
  WIDTH = parseInt(e.target.value);
  e.target.nextElementSibling.textContent = `${WIDTH}px`;
  updateCanvasSize();
});

document.getElementById('height').addEventListener('input', (e) => {
  HEIGHT = parseInt(e.target.value);
  e.target.nextElementSibling.textContent = `${HEIGHT}px`;
  updateCanvasSize();
});

function updateCanvasSize() {
  setupCanvas(sourceCanvas, WIDTH, HEIGHT);
  setupCanvas(outputCanvas, WIDTH, HEIGHT);
  if (currentImage) {
    drawImageMaintainAspectRatio(sourceCtx, currentImage, WIDTH, HEIGHT);
    processImage();
  }
}

// Teknik ayarlarını güncelle
function updateTechniqueSettings() {
  const technique = document.getElementById('technique').value;
  const processor = processors[technique];
  const settingsContainer = document.getElementById('techniqueSettings');
  
  settingsContainer.innerHTML = '<h3>Teknik Ayarları</h3>';
  currentSettings = {};
  
  if (!processor || !processor.settings) {
    console.error('Teknik ayarları bulunamadı');
    return;
  }
  
  Object.entries(processor.settings).forEach(([key, setting]) => {
    currentSettings[key] = setting.default;
    
    const group = document.createElement('div');
    group.className = 'input-group';
    
    const label = document.createElement('label');
    label.textContent = setting.label;
    
    const input = document.createElement('input');
    input.type = 'range';
    input.min = setting.min;
    input.max = setting.max;
    input.value = setting.default;
    
    const value = document.createElement('div');
    value.className = 'value-display';
    value.textContent = setting.default;
    
    input.addEventListener('input', (e) => {
      value.textContent = e.target.value;
      updateSettings(key, e.target.value);
    });
    
    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(value);
    settingsContainer.appendChild(group);
  });
}

function processImage() {
  if (!currentImage) return;

  const technique = document.getElementById('technique').value;
  
  try {
    sourceCtx.clearRect(0, 0, WIDTH, HEIGHT);
    drawImageMaintainAspectRatio(sourceCtx, currentImage, WIDTH, HEIGHT);

    const imageData = sourceCtx.getImageData(0, 0, WIDTH, HEIGHT);
    
    const processor = processors[technique];
    if (!processor) {
      throw new Error('Seçilen teknik bulunamadı');
    }

    if (!imageData || !imageData.data) {
      throw new Error('Görüntü verisi alınamadı');
    }

    let processed = processor.process(imageData, currentSettings);
    
    if (!processed || !processed.data) {
      throw new Error('Görüntü işlenemedi');
    }

    outputCtx.clearRect(0, 0, WIDTH, HEIGHT);
    outputCtx.putImageData(processed, 0, 0);

  } catch (error) {
    console.error('Görüntü işleme hatası:', error);
    alert(`Görüntü işlenirken bir hata oluştu: ${error.message}`);
  }
}

// Event listeners
document.getElementById('technique').addEventListener('change', () => {
  updateTechniqueSettings();
  setTimeout(() => {
    if (currentImage) processImage();
  }, 100);
});

document.getElementById('imageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentImage = img;
        setTimeout(() => {
          processImage();
        }, 100);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function updateSettings(key, value) {
  currentSettings[key] = parseInt(value);
  if (currentImage) {
    setTimeout(() => processImage(), 100);
  }
}

document.getElementById('process').addEventListener('click', () => {
  if (currentImage) processImage();
});

document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'stencil.png';
  link.href = outputCanvas.toDataURL();
  link.click();
});

// Initialize UI
updateTechniqueSettings();