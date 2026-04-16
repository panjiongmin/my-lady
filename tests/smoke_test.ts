import { assert, assertStringIncludes } from "jsr:@std/assert";

Deno.test("index.html loads app.js and gsap scripts", async () => {
  const html = await Deno.readTextFile("index.html");

  assertStringIncludes(html, "js/app.js");
  assertStringIncludes(html, "gsap.min.js");
  assertStringIncludes(html, "ScrollTrigger.min.js");
});

Deno.test("app.js uses globalThis for web APIs", async () => {
  const script = await Deno.readTextFile("js/app.js");

  assert(!script.includes("window."));
  assertStringIncludes(script, "globalThis.gsap");
  assertStringIncludes(script, "globalThis.setInterval");
  assertStringIncludes(script, "globalThis.alert");
});
