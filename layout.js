// layout.js：层级矩形布局（按子节点 weight 归一化切分父矩形，从左到右）

const LIMIT_PER_NODE = 2;

function nodeWeight(node) {
  const w = node && node.weight;
  return typeof w === "number" && w > 0 ? w : 1;
}

function layoutInto(node, rect, rects) {
  let visits = 1;
  rects[node.name] = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
  const children = node.children || [];
  if (children.length) {
    let total = 0;
    children.forEach(function (child) { total += nodeWeight(child); });
    let cursor = rect.x;
    children.forEach(function (child) {
      const w = rect.w * nodeWeight(child) / total;
      const childRect = { x: cursor, y: rect.y, w: w, h: rect.h };
      cursor += w;
      visits += layoutInto(child, childRect, rects);
    });
  }
  return visits;
}

function findNode(node, name) {
  if (node.name === name) return node;
  const children = node.children || [];
  for (let i = 0; i < children.length; i += 1) {
    const hit = findNode(children[i], name);
    if (hit) return hit;
  }
  return null;
}

function countNodes(node) {
  let count = 1;
  (node.children || []).forEach(function (child) { count += countNodes(child); });
  return count;
}

export function layoutTree(root) {
  const rects = {};
  const visits = layoutInto(root, { x: 0, y: 0, w: 1, h: 1 }, rects);
  return { rects: rects, visits: visits, reordered: 0 };
}

export function relayout(prev, root, zoomed) {
  const target = findNode(root, zoomed);
  if (!target) {
    return { rects: Object.assign({}, prev.rects), visits: 0, reordered: 0 };
  }
  const region = (prev.rects && prev.rects[zoomed]) || { x: 0, y: 0, w: 1, h: 1 };
  const rects = Object.assign({}, prev.rects);
  const visits = layoutInto(target, region, rects);
  return { rects: rects, visits: visits, reordered: visits };
}

export function budget(root) {
  const visits = countNodes(root);
  return { visits: visits, limit: visits * LIMIT_PER_NODE };
}
