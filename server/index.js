import express from "express";
import cors from "cors";
import "dotenv/config";
import chatRoute from "./routes/chat.js";
import { activeProvider } from "./services/llmService.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://layout-agent-zeta.vercel.app",
    ],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json({ limit: "10mb" })); // Layout JSON can be large

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    provider: "openrouter/gemini-2.0-flash-exp:free",
    keySet: !!process.env.OPENROUTER_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/chat", chatRoute);

// Start
app.listen(PORT, () => {
  console.log(`\n🚀 Layout Agent server running on http://localhost:${PORT}`);
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn(
      "⚠️  OPENROUTER_API_KEY not set. Get your free key at https://openrouter.ai/keys",
    );
  } else {
    console.log(
      "✅ Model: google/gemini-2.0-flash-exp:free via OpenRouter (FREE)",
    );
  }
  console.log("\nEndpoints:");
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/chat\n`);
});
