# YouTube Video Controls Extension

A powerful browser extension that adds advanced video manipulation controls to YouTube, allowing you to rotate, zoom, and pan videos with precision.

![Extension Popup](controls.png)

## 🎬 Features

### **Video Rotation**

- **90° Clockwise/Counter-clockwise rotation** with intuitive arrow buttons
- **Custom angle input** for precise rotation (0-360°)
- **Smart scaling** when rotated to keep video visible within player bounds

### **Video Zoom**

- **Zoom range**: 0.5x to 3.0x with smooth slider control
- **Real-time zoom display** showing exact zoom level
- **Works in both normal and fullscreen modes**

### **Video Panning**

- **Pan X and Y controls** (-100% to +100%) for precise positioning
- **Essential for zoomed videos** - explore different parts of enlarged content
- **Works in both fill and non-fill modes**

### **Fill Screen Mode**

- **Toggle fullscreen fill** that covers the entire browser viewport
- **Automatic dimension adjustment** for rotated videos
- **High z-index positioning** to overlay all page content

### **Smart Reset**

- **One-click reset** that restores video to original state
- **Clears all transformations** and returns video to natural position
- **Preserves original YouTube styling**

## 🚀 Installation

1. **Download** or clone this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Navigate to YouTube** and the extension will be active

## 📖 Usage

### **Basic Controls**

1. **Open any YouTube video**
2. **Click the extension icon** in your browser toolbar
3. **Use the popup controls** to manipulate the video:
   - Click rotation arrows for quick 90° turns
   - Drag sliders to zoom and pan
   - Check "Fill entire available space" for fullscreen mode
   - Enter custom angles for precise rotation

### **Use Cases**

- **Portrait videos on landscape screens** - Rotate 90° for proper viewing
- **Incorrectly oriented videos** - Fix upside-down or sideways content
- **Detail examination** - Zoom in and pan around to see specific parts
- **Immersive viewing** - Fill entire screen for maximum impact
- **Content reframing** - Adjust position and scale for better composition

## 🛠️ Technical Implementation

### **Architecture**

- **Manifest V3** extension with modern Chrome APIs
- **Content Script** (`content.js`) - Handles video manipulation
- **Popup Interface** (`popup.html/js`) - User controls and settings
- **CSS Transforms** - Efficient video manipulation without affecting playback

### **Key Technologies**

- **CSS Transforms**: `translate()`, `scale()`, `rotate()` for smooth video manipulation
- **Chrome Extension APIs**: Message passing between popup and content script
- **Modern JavaScript**: ES6+ features for clean, maintainable code
- **Responsive Design**: Clean, modern popup interface with gradients and animations

### **Smart Features**

- **Automatic scaling** for rotated videos to prevent clipping
- **Transform origin centering** for proper rotation behavior
- **Original state preservation** for perfect reset functionality
- **Container-aware positioning** that works with YouTube's layout

## 🎨 Design Philosophy

### **User Experience**

- **Intuitive controls** with clear visual feedback
- **Immediate response** to all user interactions
- **Non-destructive editing** - original video always preserved
- **Clean, modern interface** that fits with browser aesthetics

### **Technical Approach**

- **Minimal DOM manipulation** - only touches necessary styles
- **Efficient transforms** using GPU-accelerated CSS properties
- **Graceful degradation** - extension doesn't break YouTube functionality
- **Performance conscious** - no unnecessary processing or memory usage

## 📁 File Structure

```
youtube-video-controls/
├── manifest.json          # Extension configuration
├── content.js             # Video manipulation logic
├── popup.html             # User interface
├── popup.js               # UI interaction handling
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── controls.png           # Interface screenshot
└── README.md              # This file
```

## 🔧 Development Process

This extension was built through iterative development focusing on:

1. **Core functionality** - Basic rotation, zoom, and pan
2. **User interface design** - Modern, intuitive popup controls
3. **Edge case handling** - Proper scaling for rotated videos
4. **Reset functionality** - Complete restoration of original state
5. **Code refinement** - Clean, maintainable implementation

### **Challenges Solved**

- **Video disappearing on rotation** - Fixed with proper transform origins and scaling
- **Fill mode positioning conflicts** - Resolved with careful style management
- **Character encoding issues** - Used HTML entities for reliable symbol display
- **Container clipping** - Implemented smart scaling for rotated content

## 🎯 Future Enhancements

Potential features for future versions:

- **Settings persistence** across video changes and autoplay
- **Keyboard shortcuts** for quick transformations
- **Preset configurations** for common use cases
- **Animation transitions** for smooth transform changes
- **Multi-video support** for picture-in-picture scenarios

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit pull requests.

---

**Enjoy enhanced YouTube viewing with full control over video presentation!** 🎬✨
