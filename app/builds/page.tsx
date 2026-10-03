import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { createPageMetadata } from '@/lib/seo';
import BuildsClient, { type PublicRepo, type GitHubContribution } from './BuildsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Builds',
    description: 'Explore Lalit Madan\'s builds, open-source work, and experiments across AI engineering, Python, and developer tools.',
    path: '/builds',
    keywords: ['AI Engineering Builds', 'Open Source Builds', 'Python OSS Work', 'LLM Developer Tools', 'Automation Projects'],
});

const GITHUB_USERNAME = 'madanlalit';
const EXCLUDED_REPOS: string[] = [
    'arc-cli',
    'cdp-cli',
    'i-scrape',
    'iscrape',
    'parameter-golf',
    'archon',
    'opentelemetry-python',
    'gemini-cli',
    'langchain',
];
const EXCLUDED_REPO_NAMES = new Set(EXCLUDED_REPOS.map((repo) => repo.toLowerCase()));

function getBuildsData() {
    try {
        const reposPath = path.join(process.cwd(), 'public', 'public-repos.json');
        const ghPath = path.join(process.cwd(), 'public', 'github-data.json');

        const reposRaw = JSON.parse(fs.readFileSync(reposPath, 'utf8'));
        const ghData = JSON.parse(fs.readFileSync(ghPath, 'utf8'));

        const filteredRepos = (reposRaw.repos as PublicRepo[]).filter((r) => {
            const name = r.name.toLowerCase();
            const fullName = r.fullName.toLowerCase();
            return (
                r.owner.login === GITHUB_USERNAME &&
                !EXCLUDED_REPO_NAMES.has(name) &&
                !EXCLUDED_REPO_NAMES.has(fullName)
            );
        });

        return {
            repos: filteredRepos,
            contributions: (ghData.contributions ?? []) as GitHubContribution[],
            total: (ghData.total ?? 0) as number,
            lastUpdated: (ghData.lastUpdated ?? null) as number | null,
        };
    } catch (e) {
        console.error('Error loading builds data at build time:', e);
        return {
            repos: [],
            contributions: [],
            total: 0,
            lastUpdated: null,
        };
    }
}

export default function BuildsPage() {
    const { repos, contributions, total, lastUpdated } = getBuildsData();

    return (
        <BuildsClient
            initialRepos={repos}
            initialContributions={contributions}
            initialGhTotal={total}
            initialGhUpdated={lastUpdated}
        />
    );
}
