/**
 * LLM Service — OpenRouter (google/gemini-2.0-flash-exp:free)
 * Free model, no credit card needed.
 * Sign up at https://openrouter.ai and get your key from https://openrouter.ai/keys
 */

export async function callLLM(systemPrompt, history, userMessage) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in server/.env');
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Layout Agent',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages,
      temperature: 0.3,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${response.status}`;
    if (response.status === 429) throw new Error('rate limit');
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  // Strip markdown fences if model adds them
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.explanation || !parsed.updatedLayout) {
    throw new Error('LLM response missing required fields (explanation or updatedLayout)');
  }

  return parsed;
}

export function activeProvider() {
  return process.env.OPENROUTER_API_KEY ? 'openrouter/gemini-2.0-flash-exp:free' : 'none';
}
