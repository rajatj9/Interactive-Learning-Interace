var lastTouchEnd = 0;

export default {
  stopPinchZoom: (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  disableDoubleTapZoom: (event) => {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  disableScrolling: () => {
    document.getElementById("app").style.overflow = "hidden";
  },
  enableScrolling: () => {
    document.getElementById("app").style.overflow = "auto";
  }
}
