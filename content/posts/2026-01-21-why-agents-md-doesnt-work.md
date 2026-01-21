---
title: "Why AGENTS.md Doesn't Work"
subtitle: "The uncomfortable truth about centralized agent documentation"
excerpt: "Over 60,000 projects use AGENTS.md. It's backed by OpenAI, Google, and the Linux Foundation. And yet it consistently fails in practice. Here's why."
date: "2026-01-21"
category: "AI"
readTime: 8
tags: ["AI", "Agents", "AGENTS.md", "Developer Experience"]
---

## The Promise of AGENTS.md

It seems so elegant at first. You create a markdown file `AGENTS.md` documenting how your AI agent should behave. The file contains your coding standards, architectural decisions, testing requirements, and deployment procedures. You drop it in your repo, and theoretically, any agent working on your codebase will "just know" how to operate correctly.

The concept has serious momentum. Over **60,000 open-source projects** now use AGENTS.md. It's backed by OpenAI, Google, Cursor, and Factory, and is now an official open format stewarded by the **Agentic AI Foundation** under the Linux Foundation. Tools like GitHub Copilot, VS Code, Gemini CLI, and Windsurf all support it natively.

And yet, I've tried this approach. I've seen countless teams try it. **It doesn't work, at least not reliably.**

## The Six Ways AGENTS.md Breaks Down

### 1. AGENTS.md Doesn't Scale in Complex Repositories

When multiple contributors work on the same repository, each adds their own preferences and edge cases to `AGENTS.md`. Different teams append conflicting rules for their domain. The file becomes bloated with competing guidelines, making it nearly impossible for agents to determine which rule applies when.

### 2. Every Word in AGENTS.md Directly Impacts Agent Output 

When the agent traverses to a directory, the first file it looks for is `AGENTS.md`. It reads the entire file and incorporates the rules into its context. If `AGENTS.md` isn't precise and well optimized, verbose or redundant instructions pollute the context window, leaving less room for actual code and degrading the agent's output quality. Sometimes the context provided by AGENTS.md is not relevant to the task at hand.

For example: you want to add a test script under your `tests/` folder. The agent starts at the root directory and picks up the `AGENTS.md` there which contains your entire workspace structure, testing strategy, configuration files, coding best practices, and dependency management guidelines. That single file burns 2,000+ tokens on context that's tangential to the task at hand. And the agent hasn't even reached the `tests/AGENTS.md` yet, where the actual test writing rules live.

### 3. The Token Budget Problem

Let's do some math. Frontier models ship with massive context windows. Claude Opus 4.5 offers 200K tokens, OpenAI's Codex-Max provides around 256k, and Gemini 3 Pro goes up to 1 million. Surely enough, right?

But here's what an agent loads *before writing a single line of code*:

| File                   | Purpose                      | Tokens     |
|------------------------|------------------------------|------------|
| `README.md`            | Project overview, setup      | ~600       |
| `AGENTS.md`            | Agent rules, conventions     | ~2,000     |
| `backend/AGENTS.md`    | API patterns, DB conventions | ~3,000     |
| `frontend/AGENTS.md`   | Component rules, state mgmt  | ~1,500     |
| **Static overhead**    |                              | **~7,100** |

On paper, ~7K tokens looks trivial. In practice, it's just the opening act.

#### Real Example: Adding a Dark Mode Toggle

When I ask an agent to add a feature to a Next.js blog, here's what actually gets loaded:

| What Loads                                 | Tokens     |
|--------------------------------------------|------------|
| Baseline docs (`AGENTS.md`, `README.md`)   | ~2,600     |
| Target component + related files           | ~8,500     |
| CSS files (globals + component styles)     | ~5,900     |
| Conversation history + tool logs           | ~5,000     |
| **Total consumed**                         | **~22,000**|

That's 11% of a 200K window for a *single feature* in a *small blog*. In a monorepo with 50 services, add CI configs, infra manifests, and API schemas—easily another ~15K tokens.

**The real constraint isn't context size, but attention quality.** Research shows model performance degrades significantly as context fills up ideally after 40% of usage, with information in the middle often ignored entirely (the "lost in the middle" problem). Every irrelevant instruction competes for the attention budget that should go toward your actual code.

### 4. The Relevance Problem

Here's the irony: the official [agents.md](https://agents.md) documentation explicitly advises teams to **"cover what matters"** and keep it focused on project overview, build commands, code style, testing, and so on. In other words, *the format's own creators know brevity is critical.*

But in practice? Teams dump everything into `AGENTS.md`. Security policies. Architectural history. Onboarding notes. The file bloats because there's no enforcement mechanism—just a suggestion to be concise.

Most of what ends up in `AGENTS.md` isn't relevant to most tasks. If the agent is fixing a CSS bug, it doesn't need your database migration guidelines. If it's updating dependencies, it doesn't need your API naming conventions.

But how does the agent know what's relevant before it reads the file? It doesn't. So it either:

- **Loads everything** (wasteful)
- **Loads nothing** (ignores your carefully written docs)
- **Tries to be smart** (unreliable heuristics)

### 5. The Interpretation Problem

Even if the agent finds and loads your documentation, will it interpret it correctly?

Here's an example from a real `agents.md` I wrote:

> "Prefer functional components over class components for new React code."

Sounds clear, right? But an agent might:

- Interpret "new" as "any component created during this session"
- Refactor *existing* class components unnecessarily
- Ignore the guideline entirely if it conflicts with other patterns in the codebase

AGENTS.md assumes natural language is sufficient. But agents are literal interpreters working with ambiguous prose, a recipe for inconsistent behavior.

### 6. AGENTS.md Can't Override Reality

What happens when `AGENTS.md` says one thing but the codebase does another?

Your documentation says: "Always use TypeScript strict mode."  
Your codebase has: 47 `.js` files and `strict: false` in `tsconfig.json`.

Which does the agent trust? The answer varies by agent architecture, and that inconsistency is a problem.

## The Anthropomorphism Trap

`AGENTS.md` fails because it treats LLMs like human interns. It assumes they build mental models, retain context between tasks, and use "common sense" to resolve ambiguities.

But agents don't learn; they reset. They are stateless execution engines, not junior developers. When we force-feed them prose, we waste tokens on "suggestions" when they actually need **constraints**.

**Stop writing onboarding docs for machines. Start building guardrails.**

## The Post-AGENTS.md Era

If `AGENTS.md` is dead, what replaces it? Interactive, verifiable context.

- **Don't write:** "Please lint your code."
  **Do:** meaningful errors from `eslint` that the agent can read and fix.

- **Don't write:** "We use Feature-Sliced Design."
  **Do:** A directory structure that enforces it, and a linter that screams when imports cross boundaries.

- **Don't write:** "Architecture overview."
  **Do:** A `map_codebase` tool that returns the exact dependency graph relevant to the *current* task.

The future isn't about teaching agents to read our docs. It's about building systems where "doing the right thing" is the path of least resistance.

---

If you've built an `AGENTS.md` and felt frustrated that it doesn't seem to work, you're not alone. It's not your fault. The format is well designed for what it is, a centralized, human readable guide for agent behavior.

The problem is that centralized, human readable guides are the wrong abstraction for how agents actually work.

AGENTS.md will continue to have its place, project overviews, build commands, high level conventions. But the heavy lifting of guiding agent behavior? That belongs in your linters, your tests, your type system, and your CI pipeline.

**Stop documenting for agents. Start building systems that constrain them.**
