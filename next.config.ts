import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Using Vercel's native SSG - no need for `output: 'export'`
  // This allows automatic image optimization and simpler route handling
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"; title="API catalog"',
              '</.well-known/mcp/server-card.json>; rel="service-meta"; type="application/json"; title="MCP server card"',
              '</.well-known/agent-skills/index.json>; rel="service-meta"; type="application/json"; title="Agent skills index"',
              '</llms.txt>; rel="service-meta"; type="text/plain"; title="LLMs guide"',
              '</sitemap.xml>; rel="service-meta"; type="application/xml"; title="Sitemap"',
              '</rss.xml>; rel="alternate"; type="application/rss+xml"; title="RSS feed"',
            ].join(', '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
