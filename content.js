function applyTransform(angle, zoom, fill, panX, panY) {
  const video = document.querySelector("video");
  if (!video) return;

  console.log(
    `Applying transform: angle=${angle}, zoom=${zoom}, fill=${fill}, panX=${panX}, panY=${panY}`
  );

  if (fill) {
    const translateX = -50 + panX;
    const translateY = -50 + panY;

    video.style.position = "fixed";
    video.style.top = "50%";
    video.style.left = "50%";
    if (angle % 180 === 90) {
      video.style.width = "100vh";
      video.style.height = "100vw";
    } else {
      video.style.width = "100vw";
      video.style.height = "100vh";
    }
    video.style.objectFit = "cover";
    video.style.zIndex = "9999";
    video.style.transformOrigin = "center";
    video.style.transform = `translate(${translateX}%, ${translateY}%) scale(${zoom}) rotate(${angle}deg)`;
  } else {
    // Non-fill mode: just apply the transform like the console command, don't touch other styles
    if (angle === 0 && zoom === 1) {
      // Reset transform when back to normal
      video.style.transform = "";
    } else {
      // Just apply the transform, exactly like the console command
      video.style.transform = `scale(${zoom}) rotate(${angle}deg)`;
    }

    console.log("Applied transform:", video.style.transform);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "transform") {
    applyTransform(
      request.angle,
      request.zoom,
      request.fill,
      request.panX,
      request.panY
    );
    sendResponse({ status: "done" });
  }
});
