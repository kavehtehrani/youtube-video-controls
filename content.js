// Store original video styles
let originalVideoStyles = null;

function saveOriginalStyles(video) {
  if (originalVideoStyles === null) {
    originalVideoStyles = {
      position: video.style.position,
      top: video.style.top,
      left: video.style.left,
      width: video.style.width,
      height: video.style.height,
      objectFit: video.style.objectFit,
      zIndex: video.style.zIndex,
      transformOrigin: video.style.transformOrigin,
      transform: video.style.transform,
    };
    console.log("Saved original video styles:", originalVideoStyles);
  }
}

function restoreOriginalStyles(video) {
  if (originalVideoStyles !== null) {
    video.style.position = originalVideoStyles.position;
    video.style.top = originalVideoStyles.top;
    video.style.left = originalVideoStyles.left;
    video.style.width = originalVideoStyles.width;
    video.style.height = originalVideoStyles.height;
    video.style.objectFit = originalVideoStyles.objectFit;
    video.style.zIndex = originalVideoStyles.zIndex;
    video.style.transformOrigin = originalVideoStyles.transformOrigin;
    video.style.transform = originalVideoStyles.transform;
    console.log("Restored original video styles");
  }
}

function applyTransform(angle, zoom, fill, panX, panY) {
  const video = document.querySelector("video");
  if (!video) return;

  console.log(
    `Applying transform: angle=${angle}, zoom=${zoom}, fill=${fill}, panX=${panX}, panY=${panY}`
  );

  // Check if this is a complete reset
  const isReset =
    angle === 0 && zoom === 1 && panX === 0 && panY === 0 && !fill;

  if (isReset) {
    // Complete reset - restore original styles
    restoreOriginalStyles(video);
    originalVideoStyles = null; // Clear saved state
    return;
  }

  // Save original styles before making any changes
  saveOriginalStyles(video);

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
    // Non-fill mode: apply transform with panning support
    const needsTransform =
      angle !== 0 || zoom !== 1 || panX !== 0 || panY !== 0;

    if (!needsTransform) {
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

      video.style.transformOrigin = "center";
      // Include panning in non-fill mode
      video.style.transform = `translate(${panX}%, ${panY}%) scale(${finalScale}) rotate(${angle}deg)`;
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
