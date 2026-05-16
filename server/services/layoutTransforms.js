/**
 * Resize the artboard and recompute all child absolute coords from normalized values.
 */
export function resizeArtboard(layout, newWidth, newHeight) {
  const updated = JSON.parse(JSON.stringify(layout)); // deep clone
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];

  artboard.width = newWidth;
  artboard.height = newHeight;

  (artboard.children || []).forEach((childId) => {
    const node = updated.nodes[childId];
    if (!node) return;
    node.x = node.nx * newWidth;
    node.y = node.ny * newHeight;
    node.width = node.nw * newWidth;
    node.height = node.nh * newHeight;
  });

  return updated;
}

/**
 * Move a node by name or id to a semantic position.
 */
export function moveNode(layout, nodeId, position) {
  const updated = JSON.parse(JSON.stringify(layout));
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];
  const node = updated.nodes[nodeId];
  if (!node || !artboard) return updated;

  const aw = artboard.width;
  const ah = artboard.height;

  switch (position) {
    case 'top':
      node.ny = 0.03;
      node.y = node.ny * ah;
      break;
    case 'bottom':
      node.ny = 0.88;
      node.y = node.ny * ah;
      break;
    case 'center':
      node.nx = (1 - node.nw) / 2;
      node.ny = (1 - node.nh) / 2;
      node.x = node.nx * aw;
      node.y = node.ny * ah;
      break;
    case 'left':
      node.nx = 0.02;
      node.x = node.nx * aw;
      break;
    case 'right':
      node.nx = 1 - node.nw - 0.02;
      node.x = node.nx * aw;
      break;
    default:
      break;
  }

  return updated;
}

/**
 * Scale a node's size by a factor.
 */
export function scaleNode(layout, nodeId, factor) {
  const updated = JSON.parse(JSON.stringify(layout));
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];
  const node = updated.nodes[nodeId];
  if (!node || !artboard) return updated;

  node.nw = Math.min(1, node.nw * factor);
  node.nh = Math.min(1, node.nh * factor);
  node.width = node.nw * artboard.width;
  node.height = node.nh * artboard.height;

  if (node.style?.visual?.fontSize) {
    node.style.visual.fontSize = Math.round(node.style.visual.fontSize * factor);
  }

  return updated;
}
