# 🎨 ThumbPop

**AI-Powered YouTube Thumbnail Creator** - Design and enhance viral thumbnails with AI assistance and professional editing tools.

[![Live Site](https://img.shields.io/badge/🚀_Live_Site-thumbpop.antonioleiva.com-blue?style=for-the-badge)](https://thumbpop.antonioleiva.com)
[![GitHub Issues](https://img.shields.io/github/issues/devexpert-io/thumbpop?style=for-the-badge)](https://github.com/devexpert-io/thumbpop/issues)
[![License](https://img.shields.io/github/license/devexpert-io/thumbpop?style=for-the-badge)](LICENSE)

---

## 🌟 Try ThumbPop Now

### 🔗 **[thumbpop.antonioleiva.com](https://thumbpop.antonioleiva.com)**

**No installation required!** Use ThumbPop directly in your browser with full functionality.

### 🚀 Quick Start Guide

1. **🔑 Get Your API Key** (Optional)
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) 
   - Create a free Gemini API key for AI features
   - Or skip for editor-only mode

2. **🎨 Create Your Thumbnail**
   - **Design Mode**: Use text, images, and backgrounds
   - **Upload Images**: Drag & drop or click to add images
   - **Remove Backgrounds**: One-click AI background removal
   - **Add Text**: Customize fonts, colors, and effects

3. **🤖 Enhance with AI** (Requires API key)
   - Describe your video content
   - Click **"Generate"** for custom AI enhancement
   - Or try **"I'm Lucky!"** for automatic viral optimization

4. **💾 Download Your Thumbnail**
   - Perfect 1280x720 YouTube format
   - High-quality PNG export

---

## ✨ Features

### 🎨 **Professional Editor**
- **Canvas Editor**: Full-featured design tools powered by Fabric.js
- **Text Tools**: Multiple fonts, colors, shadows, and effects
- **Image Editing**: Upload, resize, rotate, and position images
- **Background Options**: Solid colors, gradients, or custom images
- **Persistent State**: Your work auto-saves in browser

### 🤖 **AI-Powered Enhancement**
- **Smart Generation**: Transform thumbnails with Gemini AI
- **Context Awareness**: Describe your video for targeted results  
- **Viral Optimization**: "I'm Lucky" mode for maximum CTR
- **Background Removal**: ML-powered one-click background removal

### 📱 **Modern Interface**
- **Responsive Design**: Works on desktop and mobile
- **Unified Toolbar**: Streamlined editing experience
- **Real-time Preview**: See changes instantly
- **Professional Output**: YouTube-optimized 16:9 format

---

## 🔧 Local Development

Want to contribute or run your own instance? Here's how to set up ThumbPop locally:

### 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git**

### 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devexpert-io/thumbpop.git
   cd thumbpop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Visit [http://localhost:3000](http://localhost:3000)
   - Start creating amazing thumbnails!

### 🧪 Available Scripts

```bash
npm start          # 🚀 Start development server
npm run build      # 📦 Build for production  
npm test           # 🧪 Run test suite
```

---

## 🏗 Architecture

### 🎯 **BYOK (Bring Your Own Key) Model**
- **Client-Side Only**: No server required, runs entirely in browser
- **Your API Key**: Users provide their own Gemini API keys
- **Privacy First**: No data leaves your browser
- **Zero Costs**: No API costs for the app maintainer

### 🛠 **Tech Stack**

| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI framework with latest features |
| **TypeScript** | Type safety and better development experience |
| **Fabric.js** | Powerful canvas manipulation and editing |
| **Tailwind CSS** | Utility-first styling framework |
| **Google Gemini AI** | State-of-the-art AI image generation |
| **@imgly/background-removal** | Client-side ML background removal |

### 📁 **Project Structure**
```
src/
├── components/
│   ├── Canvas/           # Canvas rendering and interaction
│   ├── Layout/           # App layout and structure  
│   ├── Toolbar/          # Editing tools and controls
│   └── Toast/            # Notification system
├── services/
│   ├── geminiService.ts  # AI integration and API calls
│   └── backgroundRemoval.ts # Background removal logic
├── utils/
│   ├── canvasUtils.ts    # Canvas manipulation utilities
│   └── textPropertiesUtils.ts # Text styling persistence
└── App.tsx               # Main application component
```

---

## 🤝 Contributing

We welcome contributions! ThumbPop is open source and community-driven.

### 🐛 **Report Issues**
Found a bug or have a feature request?  
[**Open an Issue →**](https://github.com/devexpert-io/thumbpop/issues/new)

### 💡 **Feature Requests**
Have an idea to make ThumbPop better?  
[**Suggest a Feature →**](https://github.com/devexpert-io/thumbpop/issues/new)

### 🔧 **Code Contributions**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| **Chrome** | ✅ **Recommended** |
| **Firefox** | ✅ Full Support |
| **Safari** | ✅ Full Support |
| **Edge** | ✅ Full Support |

*Note: Modern browsers required for Canvas API and WebAssembly support*

---

## 🛡 Privacy & Security

- **🔒 Client-Side Only**: No server processing, your data stays local
- **🔑 BYOK Model**: You control your own API keys and usage
- **📝 No Tracking**: No analytics or user data collection
- **🏠 Self-Hostable**: Run your own instance if preferred

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 💖 Support

Love ThumbPop? Here's how you can support the project:

- ⭐ **Star this repository**
- 🐛 **Report bugs** and suggest features
- 🤝 **Contribute code** or documentation
- 📢 **Share with others** who create YouTube content

---

## 📞 Contact

- **🌐 Website**: [thumbpop.antonioleiva.com](https://thumbpop.antonioleiva.com)
- **💬 Issues**: [GitHub Issues](https://github.com/devexpert-io/thumbpop/issues)
- **📧 Developer**: [@devexpert-io](https://github.com/devexpert-io)

---

<div align="center">

**Made with ❤️ for the YouTube creator community**

[**🚀 Try ThumbPop Now**](https://thumbpop.antonioleiva.com)

</div>