// viewport.js：命中与裁剪（边界算命中，裁剪按与视口相交判断）

function contains(rect, point) {
  return point.x >= rect.x && point.x <= rect.x + rect.w &&
    point.y >= rect.y && point.y <= rect.y + rect.h;
}

export function hitTest(rects, point) {
  let best = null;
  Object.keys(rects).forEach(function (name) {
    const rect = rects[name];
    if (!contains(rect, point)) return;
    const area = rect.w * rect.h;
    if (!best || area < best.area || (area === best.area && name < best.name)) {
      best = { name: name, area: area };
    }
  });
  return best ? best.name : null;
}

export function cull(rects, view) {
  const vx = view.x || 0;
  const vy = view.y || 0;
  return Object.keys(rects).filter(function (name) {
    const r = rects[name];
    return r.x <= vx + view.w && r.x + r.w >= vx &&
      r.y <= vy + view.h && r.y + r.h >= vy;
  }).sort();
}
