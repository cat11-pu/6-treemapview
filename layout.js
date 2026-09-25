// layout.js：层级矩形布局（按子节点 weight 归一化切分父矩形）
const LIMIT_PER_NODE = 2; // 写死的预算倍数：limit = visits * 2

function weightOf(node) {
  return typeof node.weight === "number" && node.weight > 0 ? node.weight : 1;
}

// 把 node 及其子树摆进 rect，子矩形从左到右按权重占比切分，返回访问节点数
function placeSubtree(rects, node, rect) {
  let visits = 1;
  rects[node.name] = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
  const children = node.children || [];
  const total = children.reduce(function (sum, child) { return sum + weightOf(child); }, 0);
  if (!children.length || total <= 0) return visits;
  let x = rect.x;
  children.forEach(function (child) {
    const w = rect.w * (weightOf(child) / total);
    visits += placeSubtree(rects, child, { x: x, y: rect.y, w: w, h: rect.h });
    x += w;
  });
  return visits;
}

export function layoutTree(root) {
  const rects = {};
  const visits = placeSubtree(rects, root, { x: 0, y: 0, w: 1, h: 1 });
  return { rects: rects, visits: visits, reordered: 0 };
}

// 只重排被缩放节点及其子树，其余矩形沿用 prev
export function relayout(prev, root, zoomed) {
  const rects = Object.assign({}, prev.rects);
  let visits = 0;
  let reordered = 0;
  (function walk(node) {
    visits += 1;
    if (node.name === zoomed) {
      const rect = prev.rects[zoomed] || { x: 0, y: 0, w: 1, h: 1 };
      reordered = placeSubtree(rects, node, rect);
      return;
    }
    (node.children || []).forEach(walk);
  })(root);
  return { rects: rects, visits: visits, reordered: reordered };
}

export function budget(root) {
  let visits = 0;
  let reordered = 0;
  (function walk(node) {
    visits += 1;
    const children = node.children || [];
    if (children.length) reordered += 1; // 有子节点的层才可能被重排
    children.forEach(walk);
  })(root);
  return { visits: visits, limit: visits * LIMIT_PER_NODE, reordered: reordered };
}
