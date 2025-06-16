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
    // Non-fill mode: apply transform and scale if needed for rotation
    if (angle === 0 && zoom === 1) {
      // Reset transform when back to normal
      video.style.transform = "";
    } else {
      let finalScale = zoom;

      // If rotated 90° or 270°, we need to scale down to fit the swapped dimensions
      if (angle % 180 === 90) {
        const rect = video.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        // When rotated 90°/270°, width becomes height and vice versa
        // Scale to fit within the smaller dimension
        const scaleToFit = Math.min(
          containerWidth / containerHeight,
          containerHeight / containerWidth
        );
        finalScale = zoom * scaleToFit;

        console.log(
          `Video rotated, scaling from ${zoom} to ${finalScale} (scale factor: ${scaleToFit})`
        );
      }

      video.style.transform = `scale(${finalScale}) rotate(${angle}deg)`;
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
