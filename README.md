# 🎵 ACE-STEP Music AI Interface

**Full-featured web interface for ACE-STEP Music AI API**

Professional Next.js application providing complete access to all 99 ACE-STEP API endpoints with an intuitive, modern UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎼 Generation Modes
- **Simple Mode** - Quick music generation with description
- **Custom Mode** - Full control over prompts, lyrics, and parameters
- **Cover Mode** - Transform existing audio with new style
- **Repaint Mode** - Edit specific sections of audio

### 🎚️ Advanced Controls
- **Model Management** - Initialize, configure, and switch between models
- **LoRA Support** - Load/unload LoRA adapters for custom styles
- **Batch Generation** - Generate 1-8 samples simultaneously
- **Parameter Control** - Full access to DiT steps, CFG, temperature, etc.
- **Metadata Management** - Export/import generation parameters

### 🎧 Audio Features
- **Multi-sample Output** - Generate up to 8 variations
- **LRC Lyrics Support** - Real-time synchronized lyrics display
- **Quality Scoring** - Automatic quality assessment
- **Audio Export** - Download individual or batch files

### 💎 UI/UX
- **Modern Design** - Built with shadcn/ui components
- **Dark Mode** - Eye-friendly interface
- **Responsive** - Works on desktop and mobile
- **Real-time Status** - Live generation progress tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- Access to ACE-STEP API endpoint

### Installation

```bash
# Clone repository
git clone https://github.com/arturwyroslak/ace-step-interface.git
cd ace-step-interface

# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Set API endpoint (optional)
echo "NEXT_PUBLIC_API_URL=https://ace-step-ace-step-v1-5.hf.space" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. Initialize Model

First, initialize the ACE-STEP model:

1. Go to **Settings** tab
2. Select model configuration
3. Click **Initialize Model**
4. Wait for confirmation

### 2. Generate Music

**Simple Mode:**
```
1. Switch to Simple Mode
2. Enter song description (e.g., "upbeat electronic dance music")
3. Choose vocal language or instrumental
4. Click Generate
```

**Custom Mode:**
```
1. Switch to Custom Mode
2. Enter detailed prompt and lyrics
3. Set BPM, duration, key signature
4. Adjust advanced parameters
5. Click Generate
```

**Cover Mode:**
```
1. Upload source audio
2. Enter style prompt
3. Adjust cover strength
4. Generate
```

### 3. Export Results

- Download individual samples from player
- Export all samples as ZIP
- Save metadata JSON for later reuse

## 🏗️ Project Structure

```
ace-step-interface/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── generation/        # Generation UI components
│   ├── settings/          # Settings components
│   └── audio/             # Audio player components
├── lib/
│   ├── api/               # API client
│   ├── types/             # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://ace-step-ace-step-v1-5.hf.space

# Optional: API key if required
NEXT_PUBLIC_API_KEY=your_api_key
```

### Model Settings

Configure in Settings tab:
- **Model Path**: acestep-v15-turbo / acestep-v15
- **Device**: auto / cuda / cpu
- **5Hz LM**: Enable for better quality
- **Flash Attention**: Speed optimization
- **CPU Offload**: Memory optimization

## 🎨 Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Icons**: Lucide React

## 📊 API Coverage

Complete implementation of all 99 ACE-STEP endpoints:

- ✅ Model initialization and configuration
- ✅ LoRA loading/unloading
- ✅ Text-to-music generation (all modes)
- ✅ Audio transcription and analysis
- ✅ Metadata management
- ✅ Quality scoring
- ✅ LRC lyrics timestamps
- ✅ Batch processing

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🔗 Links

- **Repository**: [github.com/arturwyroslak/ace-step-interface](https://github.com/arturwyroslak/ace-step-interface)
- **ACE-STEP API**: [ace-step-ace-step-v1-5.hf.space](https://ace-step-ace-step-v1-5.hf.space/)
- **Author**: [@arturwyroslak](https://github.com/arturwyroslak)

## 🆘 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/arturwyroslak/ace-step-interface/issues)
- Check [Discussions](https://github.com/arturwyroslak/ace-step-interface/discussions)

---

**Made with ❤️ using Next.js, TypeScript, and shadcn/ui**
