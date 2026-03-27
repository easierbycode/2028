import { App, staticFiles } from "fresh";

export const app = new App()
  // COEP/COOP headers for SharedArrayBuffer if needed
  .use(async (ctx) => {
    const res = await ctx.next();
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    return res;
  })
  // Serve static files (game assets, lib, src, etc.)
  .use(staticFiles())
  // File-system based routes
  .fsRoutes();

if (import.meta.main) {
  await app.listen();
}
