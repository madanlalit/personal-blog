export type RepoStatus = 'shipping' | 'shipped' | 'experiment' | 'learning' | 'maintenance' | 'archived';
export type RepoCategory = 'building' | 'shipped' | 'experiment' | 'oss';

export interface RepoNarrative {
  story: string;
  status: RepoStatus;
  category: RepoCategory;
  origin: string;
  currentState: string;
  lessons: string[];
  highlights?: string[];
}

export const REPO_NARRATIVES: Record<string, RepoNarrative> = {
  'personal-blog': {
    story:
      'This blog started as a quiet corner to write down what I was learning about LLMs and agents. It turned into a full design system experiment - a retro terminal interface that still feels readable and fast.',
    status: 'shipping',
    category: 'shipped',
    origin:
      'I was tired of bloated portfolio templates. I wanted something that felt like a developer\'s workspace - dark, fast, and intentional. The terminal theme came from spending too much time in iTerm2.',
    currentState:
      'It now runs on Next.js with 4 theme presets, Mermaid diagram support, and an interactive command-line interface. It also powers WebMCP agent discovery, which means AI agents can read and navigate it.',
    lessons: [
      'Design systems are easier to maintain when you treat CSS variables as API contracts',
      'Static sites can still be playful without sacrificing performance',
      'Writing in public forces clarity you don\'t get from private notes',
    ],
    highlights: [
      'Custom TUI-inspired design system with 4 themes',
      'Markdown-based blog with Mermaid.js support',
      'WebMCP agent discovery enabled',
    ],
  },

  'agentskills': {
    story:
      'A collection of reusable skills for AI agents, extracted from real projects rather than theoretical prompts. This repo is my answer to the question: what does an agent actually need to know to do good work?',
    status: 'shipping',
    category: 'building',
    origin:
      'After watching agents fail in predictable ways - wrong file paths, missing context, vague instructions - I realized the problem was not the model. It was the shape of the instructions. I started collecting patterns that actually worked.',
    currentState:
      'The chrome-cdp skill is the most mature one. It lets agents control a real browser via CDP, and I wrote a full case study on optimizing it from 1,500 tokens down to a leaner format without losing capability.',
    lessons: [
      'Skills should be extracted from scar tissue, not invented from theory',
      'Token efficiency matters more than you think when skills load repeatedly',
      'Flat text beats Markdown for command references',
    ],
    highlights: [
      'Browser automation skill via Chrome DevTools Protocol',
      'Optimised for low token overhead',
      'Used in production agent workflows',
    ],
  },

  'heimdall': {
    story:
      'The all-seeing agent for web automation. I built Heimdall because I wanted an agent that could actually see a webpage, understand it, and take action - not just call APIs.',
    status: 'experiment',
    category: 'building',
    origin:
      'Most browser automation tools are either too brittle (Selenium scripts) or too opaque (black-box SaaS). I wanted something in the middle: open-source, self-hosted, and genuinely agentic.',
    currentState:
      'Core loop works: screenshot → vision model → action → repeat. It can fill forms, navigate multi-step flows, and extract structured data. Still improving reliability on dynamic SPAs.',
    lessons: [
      'Vision-based agents are surprisingly capable but need good retry logic',
      'Self-hosted browser automation avoids rate limits and privacy concerns',
      'The hard part is not seeing the page - it is knowing what to do next',
    ],
    highlights: [
      'Vision-based web navigation',
      'Self-hosted with no external API dependencies for browsing',
      'Structured data extraction from arbitrary pages',
    ],
  },

  'odin': {
    story:
      'Odin is an AI agent that can see your screen and control your computer. I built it to explore what happens when you give an agent direct access to the same interface a human uses.',
    status: 'experiment',
    category: 'experiment',
    origin:
      'After working with headless browser agents, I wondered: what if the agent could see the actual screen? No DOM parsing, no API hooks - just pixels and mouse coordinates like a human.',
    currentState:
      'Proof-of-concept works on macOS. It takes screenshots, uses a vision model to interpret the screen, and outputs mouse/keyboard actions. Still early - latency is the main bottleneck.',
    lessons: [
      'Screen-level agents need very fast feedback loops to feel usable',
      'Safety guardrails are non-negotiable when an agent can click anywhere',
      'The gap between "works once" and "works reliably" is enormous',
    ],
    highlights: [
      'Screen-based computer control',
      'Vision model interpretation of arbitrary UI',
      'macOS automation via accessibility APIs',
    ],
  },

  'arc-cli': {
    story:
      'A command-line interface for generating, editing, and explaining code using natural language. Built before the current wave of coding agents, when I was still figuring out what a good CLI-to-LLM bridge should feel like.',
    status: 'maintenance',
    category: 'shipped',
    origin:
      'I wanted a tool that felt like talking to a senior engineer who lives in your terminal. No web interface, no context switching - just type what you want and get code back.',
    currentState:
      'Functional but superseded by tools like Claude Code and Codex CLI. I keep it around as a reference for how I thought about CLI UX before the big players arrived.',
    lessons: [
      'The terminal is still the best interface for focused work',
      'Streaming responses feel more natural than batch outputs',
      'Context management is harder than prompt engineering',
    ],
    highlights: [
      'Natural language to code generation',
      'Terminal-native workflow',
      'Context-aware file editing',
    ],
  },

  'progress': {
    story:
      'A Python CLI that generates wallpapers visualizing your yearly progress. I built it because I wanted a visual reminder on my desktop that time is passing and goals exist.',
    status: 'shipped',
    category: 'shipped',
    origin:
      'I saw a post about someone manually updating a spreadsheet to track yearly progress. I thought: this should be automatic, beautiful, and live on my wallpaper.',
    currentState:
      'Stable and working. It calculates day-of-year progress, renders a clean visual with custom themes, and sets it as your desktop wallpaper. I use it daily.',
    lessons: [
      'Ambient visualizations work better than dashboards you have to open',
      'Python + Pillow is surprisingly powerful for graphics',
      'Small utilities with daily touchpoints are worth more than big tools you forget',
    ],
    highlights: [
      'Automatic daily wallpaper updates',
      'Custom theme support',
      'Yearly progress visualization',
    ],
  },

  'formatkit': {
    story:
      'A minimal formatter and diff tool for JSON, XML, and YAML. Born from frustration with over-configured formatters that need a config file just to pretty-print JSON.',
    status: 'shipped',
    category: 'shipped',
    origin:
      'I was working with a lot of config files and API responses. Every formatter wanted a .rc file, plugins, or specific versions. I wanted one command: format this.',
    currentState:
      'Does exactly what it says. No dependencies beyond standard library where possible. Fast, quiet, and predictable.',
    lessons: [
      'Tools that do one thing well are underrated',
      'Zero-config is a feature, not a limitation',
      'HTML/CSS can be a surprisingly good UI layer for small utilities',
    ],
    highlights: [
      'Zero-config formatting for JSON/XML/YAML',
      'Minimal dependency footprint',
      'Fast batch processing',
    ],
  },

  'no-mouse': {
    story:
      'A macOS app that lets you control the cursor entirely with your keyboard. I built it during a period of wrist pain when I genuinely could not use a mouse for weeks.',
    status: 'experiment',
    category: 'experiment',
    origin:
      'I developed wrist tendonitis and had to stop using a mouse. Existing solutions were either too complex (Vim-like grid systems) or too limited. I wanted something I could learn in 5 minutes.',
    currentState:
      'Works well for basic navigation. Uses a grid overlay system - hit a key, the screen divides into zones, hit another key to zoom in. Not as fast as a mouse, but usable.',
    lessons: [
      'Accessibility tools benefit everyone, not just people with disabilities',
      'Swift is surprisingly pleasant for small macOS utilities',
      'Constraints breed simpler designs',
    ],
    highlights: [
      'Keyboard-only cursor control',
      'Swift-based native macOS app',
      'Built from real accessibility need',
    ],
  },

  'iscrape': {
    story:
      'A web scraper and dataset generator that recursively crawls websites and distills content into fine-tuning ready datasets. Built because I needed training data and did not want to pay for APIs.',
    status: 'experiment',
    category: 'experiment',
    origin:
      'I was experimenting with fine-tuning small language models and needed domain-specific datasets. Existing tools were either too simple (single-page scrapers) or too enterprise (expensive SaaS).',
    currentState:
      'Core crawler works with crawl4ai. Can handle redirects, subdomains, and extract clean text. The LLM distillation step works with Gemini and OpenAI. Still tuning the output quality.',
    lessons: [
      'Crawling is easy; extracting clean, useful text is hard',
      'LLMs are excellent at distilling raw HTML into structured datasets',
      'Respect robots.txt and rate limits - the web is a shared resource',
    ],
    highlights: [
      'Recursive crawling with subdomain support',
      'LLM-powered content distillation',
      'Outputs JSONL, Markdown, and JSON formats',
    ],
  },

  'cdp-cli': {
    story:
      'A thin CLI wrapper around the Chrome DevTools Protocol. I built it to test agent workflows before turning them into full skills. It is a building block, not a product.',
    status: 'learning',
    category: 'experiment',
    origin:
      'Before building the chrome-cdp skill, I needed to understand CDP myself. This CLI was my scratchpad - a place to test commands and see raw protocol responses.',
    currentState:
      'Minimal but functional. Can launch Chrome, navigate, screenshot, and evaluate JS. It is what I use when I need to debug why an agent action failed.',
    lessons: [
      'Building the primitive first makes the abstraction better',
      'CDP is powerful but poorly documented for automation use cases',
      'Small CLIs make excellent debugging companions',
    ],
  },

  'pydantic-ai': {
    story:
      'A fork of Pydantic\'s agent framework. I am studying how type-safe Python can make agent workflows more reliable. Not actively contributing yet, but learning a lot from the architecture.',
    status: 'learning',
    category: 'oss',
    origin:
      'Pydantic AI takes a fundamentally different approach to agents - structured outputs first, types as contracts. I wanted to understand how that changes the reliability story compared to string-based prompting.',
    currentState:
      'Reading the codebase, running examples, and comparing patterns to my own agent work. The dependency injection model is particularly interesting.',
    lessons: [
      'Type safety in agent frameworks prevents whole classes of runtime errors',
      'Pydantic\'s validation philosophy translates surprisingly well to agent outputs',
      'Good abstractions hide complexity without removing control',
    ],
  },

  'claude-code': {
    story:
      'A fork of Anthropic\'s Claude Code. I am studying how they built an agentic coding tool that actually understands large codebases. The terminal UX is some of the best I have seen.',
    status: 'learning',
    category: 'oss',
    origin:
      'Claude Code changed how I think about AI-assisted development. I forked it to understand the internals: how it builds context, how it handles git, how it decides what files matter.',
    currentState:
      'Deep in the codebase. The context gathering logic and the streaming UI are the two areas I am focusing on. Planning to write about what I learn.',
    lessons: [
      'Context gathering is harder than code generation',
      'Streaming UI makes agents feel responsive even when they are thinking',
      'Git integration is a feature, not an afterthought',
    ],
  },

  'langchain': {
    story:
      'A fork of the LangChain monorepo. I wanted to understand how a framework scales when it has to support hundreds of integrations without becoming impossible to maintain.',
    status: 'learning',
    category: 'oss',
    origin:
      'LangChain gets criticized for complexity, but it solves genuinely hard problems: abstraction over inconsistent APIs, state management for long-running agents, and observability. I wanted to see how they do it.',
    currentState:
      'Reading the core architecture and the graph module. The state machine approach in LangGraph is particularly relevant to my own agent work.',
    lessons: [
      'Abstraction layers are expensive but necessary for broad adoption',
      'Graph-based state machines are a natural fit for agent workflows',
      'Community contributions require very clear contribution guidelines',
    ],
  },

  'gemini-cli': {
    story:
      'A fork of Google\'s Gemini CLI. I am comparing how different companies approach the "AI in your terminal" problem - Anthropic, OpenAI, and Google all have different philosophies.',
    status: 'learning',
    category: 'oss',
    origin:
      'After using Claude Code and Codex CLI, I wanted to see Google\'s take. Their approach to multimodal input (images, audio, video) in a terminal context is interesting.',
    currentState:
      'Running through the examples and comparing the command structure to other tools. The multimodal support is ahead of the competition.',
    lessons: [
      'Multimodal terminal agents are closer than they feel',
      'Each company optimizes for their own model\'s strengths',
      'CLI UX patterns are converging but still have room for differentiation',
    ],
  },

  'Archon': {
    story:
      'A fork of Archon, an open-source harness builder for AI coding. I am interested in how deterministic testing and evaluation can make agent coding more reliable.',
    status: 'learning',
    category: 'oss',
    origin:
      'Vibe coding is fun but unreliable. Archon explores the opposite: making AI coding deterministic and repeatable through harnesses and evaluations. That tension interests me.',
    currentState:
      'Studying the harness definition format and the evaluation pipeline. Thinking about how to apply similar ideas to my own agent projects.',
    lessons: [
      'Deterministic agent behavior requires explicit test harnesses',
      'Evaluation-driven development is the next step after test-driven development',
      'Repeatability matters more than speed for production agent systems',
    ],
  },

  'cpython': {
    story:
      'A fork of the CPython repository. I wanted to understand how the language I use every day actually works - not the surface syntax, but the interpreter internals, the GC, and the compiler.',
    status: 'learning',
    category: 'oss',
    origin:
      'I have been writing Python for years but never looked under the hood. The recent free-threading work and the JIT experiments made me want to understand the interpreter better.',
    currentState:
      'Reading the ceval loop and the object model. Slowly making my way through the compiler pipeline. It is humbling how much complexity lives in "simple" Python.',
    lessons: [
      'Understanding your runtime makes you write better application code',
      'The CPython codebase is surprisingly approachable given its age',
      'Free-threading is going to change Python performance fundamentally',
    ],
  },

  'opentelemetry-python': {
    story:
      'A fork of OpenTelemetry\'s Python SDK. I am learning how observability should be built into agent systems from the ground up, not bolted on later.',
    status: 'learning',
    category: 'oss',
    origin:
      'Agents fail in subtle ways. Without good tracing, you have no idea why a chain of thought went wrong. OpenTelemetry is the standard for distributed tracing, so I am learning how to instrument agent workflows properly.',
    currentState:
      'Reading the SDK implementation and thinking about how to apply OTel concepts to agent-specific traces: tool calls, model responses, context switches.',
    lessons: [
      'Observability should be designed into agent systems, not added later',
      'Distributed tracing maps surprisingly well to agent step sequences',
      'Standard beats custom when integrating with existing infrastructure',
    ],
  },

  'exo': {
    story:
      'A fork of exo, which lets you run your own AI cluster at home with everyday devices. I am interested in decentralized inference and what happens when models run on the edge.',
    status: 'learning',
    category: 'oss',
    origin:
      'Cloud inference is convenient but expensive and privacy-sensitive. exo explores what is possible when you distribute inference across phones, laptops, and desktops you already own.',
    currentState:
      'Set it up across a MacBook and an old Linux box. The peer discovery and automatic model sharding are clever. Latency is higher than cloud, but privacy is complete.',
    lessons: [
      'Decentralized inference is viable for smaller models',
      'Network bandwidth is the real bottleneck, not compute',
      'Privacy-first AI will matter more as models get better at reasoning',
    ],
  },

  'parameter-golf': {
    story:
      'A fork of OpenAI\'s parameter golf challenge: train the smallest language model that fits in 16MB. I wanted to understand model compression and efficiency at the extreme end.',
    status: 'learning',
    category: 'oss',
    origin:
      'I spend most of my time with large models. I wanted to see what is possible at the other extreme - how small can you go and still get useful behavior?',
    currentState:
      'Experimenting with quantization and pruning techniques. The constraint forces creative architecture choices. Not competitive yet, but learning a lot.',
    lessons: [
      'Constraints force better understanding than abundance does',
      'Quantization is more art than science at the extreme end',
      'Small models have use cases that large models are wasteful for',
    ],
  },
};
