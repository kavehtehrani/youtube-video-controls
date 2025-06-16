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
    fill: document.getElementById("fillScreen").checked,
    panX: currentPanX,
    panY: currentPanY,
  });
}

function updateRotation(delta) {
  currentRotation = (currentRotation + delta) % 360;
  if (currentRotation < 0) currentRotation += 360;
  sendTransform();
}

function resetAllControls() {
  // Reset all values to defaults
  currentRotation = 0;
  currentZoom = 1.0;
  currentPanX = 0;
  currentPanY = 0;

  // Update UI elements to reflect reset values
  document.getElementById("customAngle").value = "0";
  document.getElementById("fillScreen").checked = false;

  document.getElementById("zoomSlider").value = "1";
  document.getElementById("zoomValue").textContent = "1.0x";

  document.getElementById("panX").value = "0";
  document.getElementById("panXVal").textContent = "0%";

  document.getElementById("panY").value = "0";
  document.getElementById("panYVal").textContent = "0%";

  // Apply the reset
  sendTransform();
}

document.addEventListener("DOMContentLoaded", () => {
  // New rotation buttons
  document
    .getElementById("rotateCCW")
    .addEventListener("click", () => updateRotation(-90));
  document
    .getElementById("rotateCW")
    .addEventListener("click", () => updateRotation(90));

  document.getElementById("applyCustom").addEventListener("click", () => {
    let val = parseInt(document.getElementById("customAngle").value, 10);
    if (isNaN(val)) val = 0;
    currentRotation = val % 360;
    if (currentRotation < 0) currentRotation += 360;
    sendTransform();
  });

  document
    .getElementById("fillScreen")
    .addEventListener("change", sendTransform);

  // Reset button
  document
    .getElementById("resetAll")
    .addEventListener("click", resetAllControls);

  const zoomSlider = document.getElementById("zoomSlider");
  const zoomValue = document.getElementById("zoomValue");
  zoomSlider.addEventListener("input", () => {
    currentZoom = parseFloat(zoomSlider.value);
    zoomValue.textContent = currentZoom.toFixed(1) + "x";
    sendTransform();
  });

  const panXSlider = document.getElementById("panX");
  const panYSlider = document.getElementById("panY");
  const panXVal = document.getElementById("panXVal");
  const panYVal = document.getElementById("panYVal");

  panXSlider.addEventListener("input", () => {
    currentPanX = parseInt(panXSlider.value, 10);
    panXVal.textContent = currentPanX + "%";
    sendTransform();
  });

  panYSlider.addEventListener("input", () => {
    currentPanY = parseInt(panYSlider.value, 10);
    panYVal.textContent = currentPanY + "%";
    sendTransform();
  });
});
