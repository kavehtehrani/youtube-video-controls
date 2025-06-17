// Store original video styles
let originalVideoStyles = null;

// Memory-based settings persistence
let savedSettings = {
  angle: 0,
  zoom: 1,
  fill: false,
  panX: 0,
  panY: 0,
};
let hasSettings = false;
let persistenceEnabled = false; // Default to disabled
let lastURL = null;

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

function applyTransform(angle, zoom, fill, panX, panY, persistSettings = true) {
  const video = document.querySelector("video");
  if (!video) return;

  console.log(
    `Applying transform: angle=${angle}, zoom=${zoom}, fill=${fill}, panX=${panX}, panY=${panY}, persist=${persistSettings}`
  );

  // Update persistence setting
  persistenceEnabled = persistSettings;

  // Save settings in memory for persistence (only if persistence is enabled)
  if (persistSettings) {
    savedSettings = { angle, zoom, fill, panX, panY };
    hasSettings = angle !== 0 || zoom !== 1 || fill || panX !== 0 || panY !== 0;
    console.log("Settings saved to memory:", savedSettings);
  } else {
    console.log("Persistence disabled - not saving settings to memory");
  }

  // Check if this is a complete reset
  const isReset =
    angle === 0 && zoom === 1 && panX === 0 && panY === 0 && !fill;

  if (isReset) {
    // Complete reset - restore original styles and clear memory
    restoreOriginalStyles(video);
    originalVideoStyles = null;
    hasSettings = false;
    console.log("Settings cleared from memory");
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

// Simple URL-based video change detection
function checkForNewVideo() {
  const currentURL = window.location.href;

  if (currentURL !== lastURL) {
    console.log("NEW VIDEO DETECTED - URL changed!");
    console.log("Old URL:", lastURL);
    console.log("New URL:", currentURL);

    lastURL = currentURL;

    // Reset original styles for new video
    originalVideoStyles = null;

    // Reapply saved settings if we have any
    if (hasSettings && persistenceEnabled) {
      console.log("Reapplying saved settings to new video:", savedSettings);

      // Function to attempt applying settings
      const attemptApply = (attempt = 1) => {
        const video = document.querySelector("video");
        if (video && video.videoWidth > 0) {
          // Video is ready, apply settings using the exact same function
          console.log(`Video ready on attempt ${attempt}, applying settings`);
          applyTransform(
            savedSettings.angle,
            savedSettings.zoom,
            savedSettings.fill,
            savedSettings.panX,
            savedSettings.panY,
            persistenceEnabled
          );
        } else if (attempt < 10) {
          // Video not ready yet, try again
          console.log(`Video not ready on attempt ${attempt}, retrying...`);
          setTimeout(() => attemptApply(attempt + 1), 500);
        } else {
          console.log("Failed to find ready video after 10 attempts");
        }
      };

      // Start attempting to apply settings
      setTimeout(() => attemptApply(), 500);
    } else if (!persistenceEnabled) {
      console.log(
        "Persistence disabled - not reapplying settings to new video"
      );
    }
  }
}

// Check for URL changes every 1 second
setInterval(checkForNewVideo, 1000);

// Initial check
checkForNewVideo();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "transform") {
    applyTransform(
      request.angle,
      request.zoom,
      request.fill,
      request.panX,
      request.panY,
      request.persistSettings
    );
    sendResponse({ status: "done" });
  } else if (request.action === "getSettings") {
    // Send current settings to popup
    sendResponse({ settings: savedSettings, hasSettings: hasSettings });
  } else if (request.action === "setPersistence") {
    // Update persistence setting
    persistenceEnabled = request.persistSettings;
    console.log("Persistence preference updated:", persistenceEnabled);
    sendResponse({ status: "done" });
  }
});
