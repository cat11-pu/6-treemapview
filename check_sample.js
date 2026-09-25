import fs from "node:fs";
import { layoutTree, relayout, budget } from "./layout.js";
import { hitTest, cull } from "./viewport.js";
import { render } from "./app.js";

const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/tree.json", "utf8"));
const graph = layoutTree(spec.tree);
const hit = hitTest(graph.rects, spec.point);
const grown = relayout(graph, spec.tree, spec.zoom);
const cost = budget(spec.tree);
const view = render(spec);

console.log("每个节点的矩形 =", JSON.stringify(Object.keys(graph.rects).sort().map((k) => [k, graph.rects[k]])));
console.log("命中节点 =", hit);
console.log("缩放后重排的节点数 =", grown.reordered);
console.log("预算（访问节点数） =", cost.visits);
console.log("预算上限 =", cost.limit);
console.log("可见节点数 =", cull(graph.rects, { w: 1, h: 1 }).length);
console.log("不变量（子矩形面积和不超过父矩形） =", spec.area_invariant);
