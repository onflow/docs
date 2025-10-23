import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  // Match docs & blog (adjust to your site's baseUrl if not "/")
  matcher: ["/docs/:path*", "/blog/:path*"],
};

const LLM_UA = /(Anthropic|Claude|OpenAI|ChatGPT|GPTBot|Google-Extended|Perplexity|CCBot|Cohere|Mistral|Phind|DuckAssist|Applebot)/i;

export default function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Clients can force markdown via Accept or query param or .md(x)
  const accept = req.headers.get("accept") || "";
  const wantsMd =
    url.searchParams.get("format") === "md" ||
    accept.includes("text/markdown") ||
    accept.includes("text/plain") || // some agents only ask for text/plain
    LLM_UA.test(req.headers.get("user-agent") || "");

  // If user already requested a .md/.mdx URL, just pass through
  if (url.pathname.endsWith(".md") || url.pathname.endsWith(".mdx")) {
    const res = NextResponse.next();
    res.headers.set("content-type", "text/markdown; charset=utf-8");
    return res;
  }

  if (!wantsMd) return NextResponse.next();

  // Rewrite /docs/foo -> /md/foo(.mdx) if it exists; otherwise try .md
  const rel = url.pathname.replace(/^\/docs\/?/, "md/").replace(/^\/blog\/?/, "md/../blog/");
  const mdxTarget = new URL(`/${rel}.mdx`, url.origin);
  const mdTarget = new URL(`/${rel}.md`, url.origin);

  // We can't statically check file existence at the edge, so try .mdx first.
  // (Both variants are emitted by the plugin if present.)
  const prefer = mdxTarget;

  const res = NextResponse.rewrite(prefer);
  res.headers.set("content-type", "text/markdown; charset=utf-8");
  // Hint alternates (mirrors Bun's ".md variant" idea)
  res.headers.append("Link", `</${rel}.mdx>; rel="alternate"; type="text/markdown"`);
  res.headers.append("Link", `</${rel}.md>; rel="alternate"; type="text/markdown"`);
  return res;
}
