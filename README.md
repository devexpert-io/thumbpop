# YouTube Thumbnail Pro

AI-powered YouTube thumbnail designer with advanced editing capabilities and background removal features.

## Features

- **Canvas Editor**: Full-featured canvas editor powered by Fabric.js
- **AI Enhancement**: Generate viral thumbnails using Google Gemini AI
- **Background Removal**: Remove backgrounds from images with one click
- **Text Editing**: Add and customize text with various fonts, colors, and styles
- **Image Upload**: Import and manipulate images on the canvas
- **Export**: Download your thumbnails in high quality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key (get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thumbnail-pro.git
cd thumbnail-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Enter your Gemini API key when prompted (or skip for editor-only mode)

## Usage

### Basic Editing
1. **Background**: Choose a solid color or gradient for your thumbnail background
2. **Add Text**: Click "Add Text" to insert text elements, then customize font, size, and color
3. **Upload Images**: Drag and drop or click to upload images to your canvas
4. **Remove Background**: Select an image and click "Remove Background" for automatic background removal

### AI Enhancement
1. **Video Context**: Describe what your video is about
2. **Custom Prompt**: Add specific instructions for the AI (optional)
3. **Generate**: Click "Generate with AI" to enhance your thumbnail
4. **I'm Feeling Lucky**: Let AI create a viral thumbnail automatically

### Export
Click "Download Thumbnail" to save your creation as a PNG file.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Fabric.js** - Canvas manipulation
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI image generation
- **@imgly/background-removal** - ML-based background removal

## Development

```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
```

## Project Structure

```
src/
├── components/
│   ├── Canvas/         # Canvas rendering
│   ├── Layout/         # App layout
│   ├── LeftPanel/      # Editor controls
│   └── RightPanel/     # AI controls
├── services/
│   ├── geminiService.ts       # AI integration
│   └── backgroundRemoval.ts   # Background removal
├── utils/
│   └── canvasUtils.ts         # Canvas utilities
└── App.tsx                    # Main application
```

## Environment Variables

The app stores the Gemini API key in localStorage. No `.env` file is required.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.