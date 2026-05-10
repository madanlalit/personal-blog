export type RepoStatus = 'shipping' | 'experiment' | 'learning' | 'maintenance';

export interface RepoNarrative {
  story: string;
  status: RepoStatus;
  highlights: string[];
}

export const REPO_NARRATIVES: Record<string, RepoNarrative> = {
  'personal-blog': {
    story:
      'Built as a playground to experiment with Next.js, design systems, and writing in public. This blog doubles as a living document of what I learn while building AI agents and tools.',
    status: 'shipping',
    highlights: [
      'Custom TUI-inspired design system with 4 themes',
      'Markdown-based blog with Mermaid.js support',
      'WebMCP agent discovery enabled',
    ],
  },
};
