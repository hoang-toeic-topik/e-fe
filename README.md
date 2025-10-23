# English AI Teacher - Frontend

React + TypeScript frontend for English language learning with AI feedback.

## Features

- 🎤 **Audio Recording**: Record and send audio to AI teacher
- 💬 **Real-time Chat**: Interactive chat with AI feedback
- 🌍 **Multi-language Support**: English, Vietnamese, Korean (i18n)
- 🗣️ **Multiple AI Voices**: Choose from different voice options
- 📊 **Feedback Display**: Grammar, pronunciation, and accent feedback
- 💾 **Session Management**: Persistent chat history per session
- 📱 **Responsive Design**: Works on desktop and mobile

## Requirements

- Node.js 16+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_DEFAULT_LANGUAGE=en
```

## Running the App

### Development Server

```bash
npm run dev
```

Server will run at: http://localhost:5173

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AudioRecorder.tsx      # Audio recording component
│   │   ├── ChatBox.tsx            # Chat display component
│   │   ├── VoiceSelector.tsx      # Voice selection
│   │   └── LanguageSwitcher.tsx   # Language switcher
│   ├── pages/
│   │   └── HomePage.tsx           # Main page
│   ├── services/
│   │   └── api.ts                 # API client
│   ├── store/
│   │   └── useChatStore.ts        # Zustand store
│   ├── i18n/
│   │   ├── index.ts               # i18next config
│   │   └── locales/
│   │       ├── en.json            # English translations
│   │       ├── vi.json            # Vietnamese translations
│   │       └── ko.json            # Korean translations
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **i18next**: Internationalization
- **Zustand**: State management
- **Axios**: HTTP client
- **React Icons**: Icon library

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`.

### Key API Calls

```typescript
// Send audio
await teacherAPI.chatWithAudio(audioBlob, sessionId, voiceId, language);

// Send text
await teacherAPI.chatWithText(userText, sessionId, voiceId, language);

// Get session
await teacherAPI.getSession(sessionId);

// Text-to-Speech
await teacherAPI.textToSpeech(text, voiceId, language);
```

## Internationalization (i18n)

Supported languages:
- English (en)
- Vietnamese (vi)
- Korean (ko)

Add new language:
1. Create `src/i18n/locales/xx.json`
2. Add to `src/i18n/index.ts`
3. Add to language selector in `LanguageSwitcher.tsx`

## State Management

Using Zustand for global state:

```typescript
const { messages, addMessage, setLanguage } = useChatStore();
```

## Styling

Using Tailwind CSS with custom animations. Customize in `tailwind.config.js`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Backend Not Responding
```
Make sure backend is running:
cd backend
.\run_server.bat
```

### Microphone Permission Denied
```
Allow microphone access in browser settings
```

### Build Errors
```
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## License

MIT

