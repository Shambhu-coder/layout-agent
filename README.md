# 🎨 Layout Agent

A chat-based design layout agent. Describe changes in plain English and watch the layout JSON update in real time — with a live wireframe preview.

## What It Does

- Chat with an AI to modify a design layout
- Preview changes as a wireframe instantly
- View the raw JSON that powers the layout
- Supports: resize canvas, move elements, change colors, resize text, and more

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| AI | Google Gemini 1.5 Flash (free: 1500 req/day) |

---

## Setup Instructions

### Prerequisites

- Node.js v18 or newer (`node --version` to check)
- A free Google Gemini API key

### 1. Get a Free Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

---

### 2. Clone / Download

```bash
# If you have git:
git clone <your-repo-url>
cd layout-agent

# Or just unzip the downloaded file
cd layout-agent
```

---

### 3. Set Up the Backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and paste your API key:

```
GEMINI_API_KEY=your_actual_key_here
PORT=3001
```

Start the server:

```bash
npm run dev
```

You should see:
```
🚀 Layout Agent server running on http://localhost:3001
✅ Gemini API key found
```

---

### 4. Set Up the Frontend

Open a **new terminal window**:

```bash
cd client
npm install
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## Example Prompts to Try

- `"Convert this design to 9:16"`
- `"Move the headline to the top"`
- `"Make the discount badge bigger"`
- `"Change the headline color to red"`
- `"Center the product image"`
- `"Make the headline font size smaller"`
- `"Move the offer badge to the bottom"`
- `"Make it bigger"` *(follow-up — the AI remembers context)*

---

## Project Structure

```
layout-agent/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ChatWindow.jsx
│       │   ├── ChatInput.jsx
│       │   ├── WireframePreview.jsx
│       │   └── JsonViewer.jsx
│       ├── hooks/
│       │   └── useLayoutAgent.js
│       └── data/
│           └── initialLayout.json
│
└── server/                     # Node.js + Express backend
    ├── routes/chat.js
    ├── services/
    │   ├── llmService.js       # Gemini API calls
    │   └── layoutTransforms.js # Helper transforms
    ├── prompts/systemPrompt.js
    ├── utils/jsonValidator.js
    └── index.js
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `GEMINI_API_KEY not found` | Add the key to `server/.env` |
| `Rate limit` error | Wait 1 minute (free tier: 15 req/min) |
| Frontend can't reach backend | Make sure the server is running on port 3001 |
| JSON parse error | Try rephrasing your prompt more clearly |

---

## Approach Notes (APPROACH.md summary)

- **LLM Prompt**: The system prompt explains normalized coords (`nx/ny/nw/nh`), semantic node roles, and strict transformation rules. Returning `responseMimeType: 'application/json'` forces clean JSON output from Gemini.
- **Safe Transforms**: JSON is deep-cloned before mutation. Output is validated (required keys, root node presence) before being sent to the frontend.
- **Context**: Last 6 messages are passed as `history` so follow-ups like "make it bigger" resolve correctly.
- **Free LLM**: Google Gemini 1.5 Flash — 1500 free requests/day, 15/min. No credit card needed.
