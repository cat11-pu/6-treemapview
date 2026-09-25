// app.js：渲染结果（基线：只回矩形，不回命中）
import { layoutTree, relayout, budget } from "./layout.js";
import { hitTest, cull } from "./viewport.js";

export function render(spec) {
  const graph = layoutTree(spec.tree);
  const hit = hitTest(graph.rects, spec.point);
  const visible = cull(graph.rects, { w: 1, h: 1 });
  const cost = budget(spec.tree);
  return { rects: graph.rects, hit: hit, visible: visible, visits: cost.visits, limit: cost.limit };
}
