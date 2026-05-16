import express from 'express';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { callLLM } from '../services/llmService.js';
import { validateLayout } from '../utils/jsonValidator.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, layout, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }
    if (!layout) {
      return res.status(400).json({ error: 'layout is required' });
    }

    // Build system prompt with current layout context
    const systemPrompt = buildSystemPrompt(layout);

    // Call LLM
    const result = await callLLM(systemPrompt, history, message);

    // Validate returned layout
    validateLayout(result.updatedLayout);

    res.json({
      explanation: result.explanation,
      updatedLayout: result.updatedLayout,
    });
  } catch (err) {
    console.error('[chat route error]', err.message);

    // Give helpful error messages
    let userMessage = 'Something went wrong. Please try again.';
    if (err.message.includes('OPENROUTER_API_KEY')) {
      userMessage = 'API key not configured. Add OPENROUTER_API_KEY to server/.env (get it free at openrouter.ai/keys)';
    } else if (err.message.includes('rate limit') || err.message.includes('429')) {
      userMessage = 'Free tier rate limit hit. Wait a few seconds and try again.';
    } else if (err.message.includes('JSON')) {
      userMessage = 'The AI returned an unexpected format. Please try rephrasing your request.';
    }

    res.status(500).json({ error: userMessage });
  }
});

export default router;
