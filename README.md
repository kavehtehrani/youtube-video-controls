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

### **Settings Persistence**

- **Preserve settings toggle** - Choose whether video transformations carry over to new videos
- **Smart storage system** - Settings automatically saved and restored when enabled
- **Per-video control** - Current video keeps its transformations regardless of persistence setting
- **Easy debugging** - All settings stored in Chrome's local storage for transparency

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
   - **Check "Preserve settings"** to carry transformations to new videos
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
- **Chrome Storage API**: Persistent settings storage with `chrome.storage.local`
- **Modern JavaScript**: ES6+ features with async/await for clean, maintainable code
- **Responsive Design**: Compact, modern popup interface with optimized spacing
- **HTML5 Compliance**: Proper semantic markup with accessibility labels

### **Smart Features**

- **Automatic scaling** for rotated videos to prevent clipping
- **Transform origin centering** for proper rotation behavior
- **Original state preservation** for perfect reset functionality
- **Container-aware positioning** that works with YouTube's layout
- **Intelligent persistence** - Settings only affect new videos when enabled
- **Storage-based architecture** - All settings transparently stored for debugging

## 🎨 Design Philosophy

### **User Experience**

- **Intuitive controls** with clear visual feedback
- **Immediate response** to all user interactions
- **Non-destructive editing** - original video always preserved
- **Compact, modern interface** optimized to eliminate scrolling
- **Accessibility compliant** with proper labels and semantic markup

### **Technical Approach**

- **Minimal DOM manipulation** - only touches necessary styles
- **Efficient transforms** using GPU-accelerated CSS properties
- **Graceful degradation** - extension doesn't break YouTube functionality
- **Performance conscious** - no unnecessary processing or memory usage
- **Persistent storage** - Chrome's local storage for reliable settings management
- **Async architecture** - Modern promise-based code for smooth user experience

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

## 🆕 Recent Updates

### **v2.0 - Major Improvements**

**✅ Settings Persistence System**

- Added "Preserve settings on video change" toggle
- Implemented Chrome storage API for reliable settings management
- Fixed persistence behavior to only affect new videos, not current one
- Settings now transparently stored for easy debugging

**✅ HTML5 Compliance & Accessibility**

- Fixed all HTML validation warnings
- Added proper `lang` attribute and `<title>` element
- Implemented proper label associations for all form controls
- Enhanced accessibility for screen readers and keyboard navigation

**✅ UI/UX Improvements**

- Redesigned popup with compact layout (no scrolling needed)
- Reduced padding, margins, and font sizes throughout
- Optimized spacing for better information density
- Maintained visual hierarchy while saving space

**✅ Architecture Refactoring**

- Migrated from memory-based to storage-based settings management
- Implemented async/await patterns for cleaner code
- Added proper error handling and message channel management
- Improved debugging capabilities with transparent storage

## 🔧 Development Process

This extension was built through iterative development focusing on:

1. **Core functionality** - Basic rotation, zoom, and pan
2. **User interface design** - Modern, intuitive popup controls
3. **Edge case handling** - Proper scaling for rotated videos
4. **Reset functionality** - Complete restoration of original state
5. **Code refinement** - Clean, maintainable implementation
6. **Quality improvements** - HTML compliance, accessibility, and storage architecture

### **Challenges Solved**

- **Video disappearing on rotation** - Fixed with proper transform origins and scaling
- **Fill mode positioning conflicts** - Resolved with careful style management
- **Character encoding issues** - Used HTML entities for reliable symbol display
- **Container clipping** - Implemented smart scaling for rotated content
- **Persistence checkbox behavior** - Fixed to only affect new videos, not current ones
- **Settings storage reliability** - Migrated to Chrome storage API for persistence
- **HTML validation warnings** - Achieved full compliance with semantic markup
- **UI space constraints** - Redesigned for compact, scroll-free interface

## 🎯 Future Enhancements

Potential features for future versions:

- **Keyboard shortcuts** for quick transformations
- **Preset configurations** for common use cases
- **Animation transitions** for smooth transform changes
- **Multi-video support** for picture-in-picture scenarios
- **Export/Import settings** for sharing configurations
- **Advanced rotation** with arbitrary angles and animation
- **Video effects** like brightness, contrast, and filters

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit pull requests.

---

**Enjoy enhanced YouTube viewing with full control over video presentation!** 🎬✨
