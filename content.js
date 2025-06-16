function applyTransform(angle, zoom, fill, panX, panY) {
  const video = document.querySelector('video');
  if (!video) return;

  const translateX = -50 + panX;
  const translateY = -50 + panY;

  if (fill) {
    video.style.position = 'fixed';
    video.style.top = '50%';
    video.style.left = '50%';
    if (angle % 180 === 90) {
      video.style.width = '100vh';
      video.style.height = '100vw';
    } else {
      video.style.width = '100vw';
      video.style.height = '100vh';
    }
    video.style.objectFit = 'cover';
    video.style.zIndex = '9999';
    video.style.transformOrigin = 'center';
    video.style.transform = `translate(${translateX}%, ${translateY}%) scale(${zoom}) rotate(${angle}deg)`;
  } else {
    video.style.position = '';
    video.style.top = '';
    video.style.left = '';
    video.style.width = '';
    video.style.height = '';
    video.style.objectFit = '';
    video.style.zIndex = '';
    video.style.transformOrigin = 'center';
    video.style.transform = `translate(${panX}%, ${panY}%) scale(${zoom}) rotate(${angle}deg)`;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'transform') {
    applyTransform(request.angle, request.zoom, request.fill, request.panX, request.panY);
    sendResponse({ status: 'done' });
  }
});