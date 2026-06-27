# Multi-Model Playground

A React app for chatting with and comparing AI models from the [GitHub Models](https://github.com/marketplace/models) catalog — including Meta Llama, Mistral, DeepSeek, Microsoft Phi, and OpenAI GPT.

## Models included

| Model | Publisher | Strengths |
|---|---|---|
| Llama 4 Maverick 17B | Meta | Multimodal, agents |
| Llama 3.3 70B | Meta | Conversation |
| Mistral Small 3.1 | Mistral AI | Vision, multimodal |
| DeepSeek V3 | DeepSeek | Coding, reasoning |
| Phi-4 | Microsoft | Low latency, reasoning |
| GPT-4.1 mini | OpenAI | Multipurpose, fast |

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/praneetjena-prog/multi-model-playground.git
cd multi-model-playground
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your GitHub token

Copy `.env.example` to `.env` and add your GitHub personal access token:

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_GITHUB_TOKEN=your_github_pat_here
```

Your token needs **Models: read** permission. Generate one at [github.com/settings/tokens](https://github.com/settings/tokens).

> ⚠️ Never commit `.env` — it is already in `.gitignore`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production

```bash
npm run build
```

## Project structure

```
src/
  App.jsx              # Root component, state management
  App.css              # All styles
  main.jsx             # React entry point
  models.js            # Model catalog config
  api.js               # GitHub Models API client
  components/
    ModelStrip.jsx     # Model selector buttons
    ChatWindow.jsx     # Message thread
    InputBar.jsx       # Text input + send/clear
index.html
vite.config.js
```

## Tech stack

- **React 18** + **Vite**
- **GitHub Models** inference endpoint (`models.inference.ai.azure.com`)
- No external UI library — plain CSS
