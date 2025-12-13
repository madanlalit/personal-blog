import type { Post } from '../types.ts';

export const mockPosts: Post[] = [
    {
        id: '1',
        title: 'The Future of Web Development: A Minimalist Approach',
        subtitle: 'Why simplicity and focus are becoming the new standards in modern web design',
        excerpt: 'In an era of increasing complexity, there\'s something profound about returning to simplicity. This post explores how minimalist design principles are shaping the future of web development, and why less is often more when it comes to creating meaningful digital experiences.',
        content: `In an era of increasing complexity, there's something profound about returning to simplicity. As web technologies continue to evolve at a breakneck pace, a counter-movement has emerged—one that champions clarity, focus, and intentional design over feature bloat and visual noise.

## The Problem with Complexity

Modern websites often suffer from what I call "feature creep syndrome." Given the tools we have, it's easy to add *just one more thing*.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

### Core Principles

1. **Clarity Over Cleverness**: The best interfaces are invisible.
2. **Performance as a Feature**: A minimalist approach isn't just about aesthetics—it's about performance.
3. **Content-First Design**: The design should serve the content.

### Code Example

Here is a simple minimalist component in React:

\`\`\`tsx
const MinimalButton = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      background: 'transparent',
      border: '1px solid currentColor',
      padding: '0.5rem 1rem'
    }}
  >
    {children}
  </button>
);
\`\`\`
    `,
        date: 'December 10, 2025',
        category: 'Technology',
        readTime: 8,
        tags: ['Web Development', 'Design', 'Minimalism']
    },
    {
        id: '2',
        title: 'On Writing and Thinking Clearly',
        excerpt: 'Clear writing is clear thinking. In this essay, I explore the deep connection between the words we choose and the thoughts we form.',
        content: `
# The Connection Between Writing and Thinking

Writing isn't just a way to communicate what you've already thought; it's a tool for **thinking itself**.

## The Feedback Loop

When you try to put a fuzzy idea into words, you're forced to clarify it.

- *Vague thoughts* become concrete sentences.
- *Assumptions* are exposed.
- *Gaps* in logic reveal themselves.

> "I write to discover what I know." — Flannery O'Connor

## Practical Tips

1. Write every day.
2. Edit ruthlessly.
3. Read widely.
        `,
        date: 'December 5, 2025',
        category: 'Ideas',
        readTime: 6,
        tags: ['Writing', 'Thinking', 'Communication']
    },
    {
        id: '3',
        title: 'Building Better Habits',
        excerpt: 'Transformation doesn\'t happen overnight. It happens through consistent, small actions compounded over time.',
        content: `
# The Power of Tiny Gains

If you improve by 1% every day for a year, you'll end up **37 times** better by the time you're done.

## The Habit Loop

1. **Cue**: Trigger the behavior.
2. **Craving**: Motivation to act.
3. **Response**: The habit itself.
4. **Reward**: Satisfaction.

\`\`\`javascript
function buildHabit(action) {
    while(alive) {
        do(action);
        improve(0.01);
    }
}
\`\`\`
        `,
        date: 'Nov 28, 2025',
        category: 'Life',
        readTime: 5,
        tags: ['Habits', 'Productivity']
    },
    {
        id: '4',
        title: 'Terminal Magic',
        excerpt: 'A love letter to the CLI and why it remains the most powerful tool for developers.',
        content: `
# Why the Terminal Wins

Graphics are great, but text is universal.

## Essential Commands

| Command | Description |
|---------|-------------|
| \`ls\`    | List files |
| \`cd\`    | Change directory |
| \`grep\`  | Search text |

## The Zen of CLI

There is a peace in the blinking cursor. It waits for you. It doesn't nag.

\`\`\`bash
echo "Hello World" > life.txt
cat life.txt
\`\`\`
        `,
        date: 'Nov 20, 2025',
        category: 'Tech',
        readTime: 4,
        tags: ['CLI', 'Terminal', 'Dev']
    }
];

export const socialLinks = [
    { platform: 'Twitter', url: '#', icon: '𝕏', label: 'Twitter' },
    { platform: 'GitHub', url: '#', icon: '⚡', label: 'GitHub' },
    { platform: 'LinkedIn', url: '#', icon: 'in', label: 'LinkedIn' },
    { platform: 'Email', url: '#', icon: '✉', label: 'Email' }
];
