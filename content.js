// Store original video styles
let originalVideoStyles = null;
let lastURL = null;
const DEBUG = false; // Debug flag for logging

// Style properties to track
const STYLE_PROPERTIES = [
  "position",
  "top",
  "left",
  "width",
  "height",
  "objectFit",
  "zIndex",
  "transformOrigin",
  "transform",
];

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

function saveOriginalStyles(video) {
  if (originalVideoStyles === null) {
    originalVideoStyles = {};
    STYLE_PROPERTIES.forEach((prop) => {
      originalVideoStyles[prop] = video.style[prop];
    });
    log("Saved original video styles:", originalVideoStyles);
  }
}

function restoreOriginalStyles(video) {
  if (originalVideoStyles !== null) {
    STYLE_PROPERTIES.forEach((prop) => {
      video.style[prop] = originalVideoStyles[prop];
    });
    log("Restored original video styles");
  }
}

function isDefaultTransform(angle, zoom, fill, panX, panY) {
  return angle === 0 && zoom === 1 && panX === 0 && panY === 0 && !fill;
}

async function applyTransform(
  angle,
  zoom,
  fill,
  panX,
  panY,
  persistSettings = true,
  saveToStorage = false
) {
  const video = document.querySelector("video");
  if (!video) return;

  log(
    `Applying transform: angle=${angle}, zoom=${zoom}, fill=${fill}, panX=${panX}, panY=${panY}, persist=${persistSettings}, saveToStorage=${saveToStorage}`
  );

  // Save settings to storage (only if explicitly requested and persistence is enabled)
  if (saveToStorage && persistSettings) {
    const settings = { angle, zoom, fill, panX, panY };
    await chrome.storage.local.set({ videoSettings: settings });
    log("Settings saved to storage:", settings);
  }

  // Check if this is a complete reset
  if (isDefaultTransform(angle, zoom, fill, panX, panY)) {
    // Complete reset - restore original styles and clear storage
    restoreOriginalStyles(video);
    originalVideoStyles = null;
    if (persistSettings) {
      await chrome.storage.local.remove(["videoSettings"]);
      log("Settings cleared from storage");
    }
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

        log(
          `Video rotated, scaling from ${zoom} to ${finalScale} (scale factor: ${scaleToFit})`
        );
      }

      video.style.transformOrigin = "center";
      // Include panning in non-fill mode
      video.style.transform = `translate(${panX}%, ${panY}%) scale(${finalScale}) rotate(${angle}deg)`;
    }

    log("Applied transform:", video.style.transform);
  }
}

// Simple URL-based video change detection
async function checkForNewVideo() {
  const currentURL = window.location.href;

  if (currentURL !== lastURL) {
    log("NEW VIDEO DETECTED - URL changed!");
    log("Old URL:", lastURL);
    log("New URL:", currentURL);

    lastURL = currentURL;

    // Reset original styles for new video
    originalVideoStyles = null;

    // Load persistence preference and settings from storage
    const result = await chrome.storage.local.get([
      "persistSettings",
      "videoSettings",
    ]);
    const persistenceEnabled = result.persistSettings || false;

    if (persistenceEnabled && result.videoSettings) {
      const settings = result.videoSettings;
      const hasSettings =
        settings.angle !== 0 ||
        settings.zoom !== 1 ||
        settings.fill ||
        settings.panX !== 0 ||
        settings.panY !== 0;

      if (hasSettings) {
        log("Reapplying saved settings to new video:", settings);

        // Function to attempt applying settings
        const attemptApply = (attempt = 1) => {
          const video = document.querySelector("video");
          if (video && video.videoWidth > 0) {
            // Video is ready, apply settings using the exact same function
            log(`Video ready on attempt ${attempt}, applying settings`);
            applyTransform(
              settings.angle,
              settings.zoom,
              settings.fill,
              settings.panX,
              settings.panY,
              persistenceEnabled
            );
          } else if (attempt < 10) {
            // Video not ready yet, try again
            log(`Video not ready on attempt ${attempt}, retrying...`);
            setTimeout(() => attemptApply(attempt + 1), 500);
          } else {
            log("Failed to find ready video after 10 attempts");
          }
        };

        // Start attempting to apply settings
        setTimeout(() => attemptApply(), 500);
      }
    } else {
      log("Persistence disabled or no settings - new video starts fresh");
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
    ).then(() => {
      sendResponse({ status: "done" });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === "getSettings") {
    // Load current settings from storage
    chrome.storage.local.get(["videoSettings"]).then((result) => {
      const settings = result.videoSettings || {
        angle: 0,
        zoom: 1,
        fill: false,
        panX: 0,
        panY: 0,
      };
      const hasSettings =
        settings.angle !== 0 ||
        settings.zoom !== 1 ||
        settings.fill ||
        settings.panX !== 0 ||
        settings.panY !== 0;
      sendResponse({ settings: settings, hasSettings: hasSettings });
    });
    return true; // Keep message channel open for async response
  } else if (request.action === "setPersistence") {
    log("Persistence preference updated:", request.persistSettings);

    // If persistence is being disabled, clear saved settings (but don't reset current video)
    if (!request.persistSettings) {
      log("Persistence disabled, clearing saved settings for future videos");
      chrome.storage.local.remove(["videoSettings"]).then(() => {
        sendResponse({ status: "done" });
      });
    } else {
      sendResponse({ status: "done" });
    }
    return true; // Keep message channel open for async response
  }
});
