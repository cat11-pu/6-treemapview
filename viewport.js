// viewport.js：命中与裁剪
// 点落在矩形边界上算命中；嵌套命中时取面积最小（最深）的节点
export function hitTest(rects, point) {
  let hit = null;
  let bestArea = Infinity;
  Object.keys(rects).forEach(function (name) {
    const r = rects[name];
    const inside = point.x >= r.x && point.x <= r.x + r.w && point.y >= r.y && point.y <= r.y + r.h;
    if (inside && r.w * r.h < bestArea) {
      bestArea = r.w * r.h;
      hit = name;
    }
  });
  return hit;
}

// 返回与视口有正面积交集的节点名，按名字升序
export function cull(rects, view) {
  const vx = view.x || 0;
  const vy = view.y || 0;
  return Object.keys(rects).filter(function (name) {
    const r = rects[name];
    return r.x < vx + view.w && r.x + r.w > vx && r.y < vy + view.h && r.y + r.h > vy;
  }).sort();
}
