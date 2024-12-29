export function createTransferControls(container) {
  const controls = document.createElement('div');
  controls.className = 'control-group';
  controls.innerHTML = `
    <h3>Transfer Method</h3>
    <div class="input-group">
      <label for="transferMethod">Select Method</label>
      <select id="transferMethod">
        <option value="thermal">Thermal Transfer Paper</option>
        <option value="carbon">Carbon Transfer Paper</option>
        <option value="freehand">Freehand Transfer</option>
      </select>
    </div>
    <div class="input-group">
      <label for="stencilSize">Size (inches)</label>
      <input type="number" id="stencilSize" min="1" max="24" value="6" step="0.5">
    </div>
    <div class="size-display">
      <span id="sizeCm">15.2 cm</span>
    </div>
  `;
  
  container.appendChild(controls);
  
  // Update cm display when inches change
  const sizeInput = controls.querySelector('#stencilSize');
  const cmDisplay = controls.querySelector('#sizeCm');
  
  sizeInput.addEventListener('input', (e) => {
    const inches = parseFloat(e.target.value);
    const cm = (inches * 2.54).toFixed(1);
    cmDisplay.textContent = `${cm} cm`;
  });
  
  return controls;
}