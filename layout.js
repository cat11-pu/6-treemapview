// layout.js：层级矩形布局（基线：平均分，不看权重）
export function layoutTree(root) {
  const rects = {};
  const children = root.children || [];
  const step = children.length ? 1 / children.length : 1;
  children.forEach(function (child, index) {
    rects[child.name] = { x: index * step, y: 0, w: step, h: 1 };
  });
  rects[root.name] = { x: 0, y: 0, w: 1, h: 1 };
  return { rects: rects, visits: Object.keys(rects).length, reordered: 0 };
}

export function relayout(prev, root, zoomed) {
  return layoutTree(root);
}

export function budget(root) {
  return { visits: 0, limit: 0 };
}
