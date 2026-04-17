import { assert, assertStringIncludes } from "jsr:@std/assert";

Deno.test("index.html loads app.js, gsap, and supabase scripts", async () => {
  const html = await Deno.readTextFile("index.html");

  assertStringIncludes(html, "js/app.js");
  assertStringIncludes(html, "gsap.min.js");
  assertStringIncludes(html, "ScrollTrigger.min.js");
  assertStringIncludes(html, "@supabase/supabase-js");
  assertStringIncludes(html, "js/supabase-service.js");
});

Deno.test("app.js uses globalThis for web APIs", async () => {
  const script = await Deno.readTextFile("js/app.js");

  assert(!script.includes("window."));
  assertStringIncludes(script, "globalThis.gsap");
  assertStringIncludes(script, "globalThis.setInterval");
  assertStringIncludes(script, "globalThis.alert");
});

Deno.test("editor.js references Supabase save flow", async () => {
  const script = await Deno.readTextFile("js/editor.js");

  assertStringIncludes(script, "saveCloudContent");
  assertStringIncludes(script, "uploadImage");
  assertStringIncludes(script, "buildShareUrl");
});
