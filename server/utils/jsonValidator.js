export function validateLayout(layout) {
  if (!layout || typeof layout !== 'object') {
    throw new Error('Layout must be an object');
  }
  if (!Array.isArray(layout.rootNodes) || layout.rootNodes.length === 0) {
    throw new Error('Layout must have rootNodes array');
  }
  if (!layout.nodes || typeof layout.nodes !== 'object') {
    throw new Error('Layout must have nodes object');
  }
  for (const id of layout.rootNodes) {
    if (!layout.nodes[id]) {
      throw new Error(`Missing root node: ${id}`);
    }
  }

  // Check each node has required fields
  for (const [id, node] of Object.entries(layout.nodes)) {
    if (typeof node.x !== 'number') throw new Error(`Node ${id} missing x`);
    if (typeof node.y !== 'number') throw new Error(`Node ${id} missing y`);
    if (typeof node.width !== 'number') throw new Error(`Node ${id} missing width`);
    if (typeof node.height !== 'number') throw new Error(`Node ${id} missing height`);
  }

  return true;
}

/**
 * Safely parse JSON from LLM response — strips markdown fences if present.
 */
export function safeParse(text) {
  // Remove markdown fences if LLM wrapped in ```json ... ```
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  return JSON.parse(cleaned);
}
