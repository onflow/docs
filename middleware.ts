export const config = {
  matcher: [
    '/blockchain-development-tutorials/:path*',
    '/build/:path*', 
    '/protocol/:path*',
    '/ecosystem/:path*',
    '/tools/:path*',
    '/evm/:path*'
  ],
};

const LLM_UA = /(Anthropic|Claude|OpenAI|ChatGPT|GPTBot|Google-Extended|Perplexity|CCBot|Cohere|Mistral|Phind|DuckAssist|Applebot)/i;

export default function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Skip if already requesting a markdown file
  if (url.pathname.endsWith('.md') || url.pathname.endsWith('.mdx')) {
    return new Response(null, { status: 200 });
  }
  
  // Skip if requesting assets
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return new Response(null, { status: 200 });
  }

  // Check if client wants markdown
  const accept = request.headers.get("accept") || "";
  const userAgent = request.headers.get("user-agent") || "";
  
  const wantsMd =
    url.searchParams.get("format") === "md" ||
    accept.includes("text/markdown") ||
    accept.includes("text/plain") ||
    LLM_UA.test(userAgent);

  if (!wantsMd) {
    return new Response(null, { status: 200 });
  }

  // Convert HTML path to markdown path
  const pathWithoutSlash = url.pathname.replace(/^\/+/, '');
  const mdPath = `/md/${pathWithoutSlash}`;
  
  // Try to serve the markdown version
  return new Response(null, {
    status: 302,
    headers: {
      'Location': mdPath,
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
}
