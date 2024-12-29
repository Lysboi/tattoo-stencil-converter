export const transferMethods = {
  thermal: {
    name: 'Thermal Transfer',
    requirements: {
      dpi: 300,
      contrast: 0.85,
      lineWeight: 1.2
    }
  },
  carbon: {
    name: 'Carbon Transfer',
    requirements: {
      dpi: 200,
      contrast: 0.75,
      lineWeight: 1.0
    }
  },
  freehand: {
    name: 'Freehand Transfer',
    requirements: {
      dpi: 150,
      contrast: 0.65,
      lineWeight: 1.5
    }
  }
};

export function optimizeForTransfer(imageData, method) {
  const settings = transferMethods[method].requirements;
  return {
    ...imageData,
    dpi: settings.dpi,
    contrast: settings.contrast,
    lineWeight: settings.lineWeight
  };
}