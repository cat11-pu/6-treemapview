// viewport.js：命中与缩放（基线：不命中、不裁剪）
export function hitTest(rects, point) {
  return null;
}

export function cull(rects, view) {
  return Object.keys(rects).sort();
}
