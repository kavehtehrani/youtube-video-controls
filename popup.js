let currentRotation = 0;
let currentZoom = 1.0;
let currentPanX = 0;
let currentPanY = 0;

async function sendTransform() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.tabs.sendMessage(tab.id, {
    action: "transform",
    angle: currentRotation,
    zoom: currentZoom,
    fill: document.getElementById('fillScreen').checked,
    panX: currentPanX,
    panY: currentPanY
  });
}

function updateRotation(delta) {
  currentRotation = (currentRotation + delta) % 360;
  if (currentRotation < 0) currentRotation += 360;
  sendTransform();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rotate90').addEventListener('click', () => updateRotation(90));
  document.getElementById('rotate180').addEventListener('click', () => updateRotation(180));
  document.getElementById('rotate270').addEventListener('click', () => updateRotation(270));

  document.getElementById('applyCustom').addEventListener('click', () => {
    let val = parseInt(document.getElementById('customAngle').value, 10);
    if (isNaN(val)) val = 0;
    currentRotation = val % 360;
    if (currentRotation < 0) currentRotation += 360;
    sendTransform();
  });

  document.getElementById('fillScreen').addEventListener('change', sendTransform);

  const zoomSlider = document.getElementById('zoomSlider');
  const zoomValue = document.getElementById('zoomValue');
  zoomSlider.addEventListener('input', () => {
    currentZoom = parseFloat(zoomSlider.value);
    zoomValue.textContent = currentZoom.toFixed(1) + "x";
    sendTransform();
  });

  const panXSlider = document.getElementById('panX');
  const panYSlider = document.getElementById('panY');
  const panXVal = document.getElementById('panXVal');
  const panYVal = document.getElementById('panYVal');

  panXSlider.addEventListener('input', () => {
    currentPanX = parseInt(panXSlider.value, 10);
    panXVal.textContent = currentPanX + "%";
    sendTransform();
  });

  panYSlider.addEventListener('input', () => {
    currentPanY = parseInt(panYSlider.value, 10);
    panYVal.textContent = currentPanY + "%";
    sendTransform();
  });
});