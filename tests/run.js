import assert from "node:assert";
import { layoutTree, relayout, budget } from "../layout.js";
import { hitTest, cull } from "../viewport.js";
import { render } from "../app.js";

let failed = 0;
let total = 0;
function check(name, fn) {
  total += 1;
  try { fn(); console.log("ok   " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const tree = { name: "root", children: [{ name: "a", weight: 3 }, { name: "b", weight: 1 }] };

check("layout returns rect for every node", () => {
  assert.strictEqual(Object.keys(layoutTree(tree).rects).length, 3);
});

check("root rect covers unit square", () => {
  const rect = layoutTree(tree).rects.root;
  assert.strictEqual(rect.w, 1);
});

check("budget has limit", () => {
  assert.strictEqual(typeof budget(tree).limit, "number");
});

check("cull lists nodes", () => {
  assert.ok(Array.isArray(cull(layoutTree(tree).rects, { w: 1, h: 1 })));
});

check("render exposes rects", () => {
  assert.ok(render({ tree: tree, point: { x: 0.1, y: 0.1 } }).rects.root);
});

check("layout splits parent rect by weight, left to right", () => {
  const rects = layoutTree(tree).rects;
  assert.deepStrictEqual(rects.a, { x: 0, y: 0, w: 0.75, h: 1 });
  assert.deepStrictEqual(rects.b, { x: 0.75, y: 0, w: 0.25, h: 1 });
});

check("hitTest returns deepest hit, boundary counts", () => {
  const rects = layoutTree(tree).rects;
  assert.strictEqual(hitTest(rects, { x: 0.1, y: 0.2 }), "a");
  assert.strictEqual(hitTest(rects, { x: 0.75, y: 0.5 }), "b");
  assert.strictEqual(hitTest(rects, { x: 2, y: 2 }), null);
});

check("relayout only rearranges zoomed subtree", () => {
  const graph = layoutTree(tree);
  const grown = relayout(graph, tree, "a");
  assert.strictEqual(grown.reordered, 1);
  assert.deepStrictEqual(grown.rects, graph.rects);
});

check("children area never exceeds parent area", () => {
  const rects = layoutTree(tree).rects;
  const childArea = rects.a.w * rects.a.h + rects.b.w * rects.b.h;
  assert.ok(childArea <= rects.root.w * rects.root.h);
});

check("budget visits stay within limit", () => {
  const cost = budget(tree);
  assert.strictEqual(cost.visits, 3);
  assert.strictEqual(cost.limit, 6);
  assert.ok(cost.visits <= cost.limit);
});

console.log(total + " cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
