# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm start          # Start development server on http://localhost:3000
npm run build     # Build production bundle
npm test          # Run tests with React Scripts
```

### Testing Individual Components
```bash
npm test -- --watchAll=false ComponentName.test.tsx   # Run specific test file
npm test -- --coverage                               # Run tests with coverage
```

## Architecture

### Core Application Structure
- **React + TypeScript** application using Create React App
- **Fabric.js** for canvas manipulation and drawing functionality  
- **Tailwind CSS** for styling with PostCSS configuration
- **Google Gemini AI** for AI-powered thumbnail enhancement
- **Background Removal** using @imgly/background-removal library

### Key Services
- `geminiService.ts`: Handles AI thumbnail generation using Gemini 2.5 Flash Image Preview model with multimodal prompts
- `backgroundRemoval.ts`: Processes images to remove backgrounds using ML models
- `canvasUtils.ts`: Core canvas manipulation utilities for adding text, images, and exports

### Component Organization
- `App.tsx`: Main application controller handling state, API key management, and canvas events
- `components/Canvas/`: Canvas rendering and interaction
- `components/LeftPanel/`: Image upload, text controls, background settings
- `components/RightPanel/`: AI generation controls and prompts
- `components/Layout/`: Main application layout structure

### Canvas Event Handling
The app uses Fabric.js event system to track object selection and modifications. Canvas state is managed through refs and React state for selected objects.

### API Key Management
Gemini API keys are stored in localStorage and initialized on app load. The app shows a modal on first use to collect the API key.