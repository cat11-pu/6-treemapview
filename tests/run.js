import assert from "node:assert";
import { layoutTree, budget } from "../layout.js";
import { hitTest, cull } from "../viewport.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
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

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
