# Lalit Madan

![Lalit Madan personal blog preview](public/lm.png)

Personal blog built with Next.js, React, and TypeScript, featuring a retro terminal-inspired interface for posts, projects, experience, and interactive commands.

## Features

- **Blog Engine**: Write and display blog posts using Markdown.
- **Retro UI/UX**: A nostalgic user interface that mimics old-school computer terminals.
- **Terminal Commands**: Interactive command-line interface to navigate the blog.
- **Games**: Includes a classic Snake game.
- **Easter Eggs**: Discover hidden secrets like the Konami code.
- **SEO Optimized**: Includes metadata, canonical URLs, structured data, robots.txt, and a dynamic sitemap.
- **RSS Feed**: Automatically generates an `rss.xml` file for content syndication.
- **Syntax Highlighting**: Code blocks in posts are highlighted for readability.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Markdown](https://github.com/remarkjs/react-markdown) for rendering Markdown content
- [Mermaid](https://mermaid.js.org/) for diagrams
- [Framer Motion](https://www.framer.com/motion/) for animations
- [ESLint](https://eslint.org/) for code linting

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/madanlalit/personal-blog.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd personal-blog
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

The application will be available at `http://localhost:3000` unless Next.js selects another port.

## Available Scripts

- `npm run dev`: Runs the Next.js development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server after a build.
- `npm run lint`: Lints the code using ESLint.
- `npm run update-data`: Refreshes GitHub contributions and public repository data in `public/`.

## License

Distributed under the MIT License. See `LICENSE` for more information.
