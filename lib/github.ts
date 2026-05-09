import fs from 'fs';
import path from 'path';

export interface GitHubEvent {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubData {
    contributions: GitHubEvent[];
    lastUpdated: number;
    total?: number;
    source?: string;
}

export async function getGithubData(): Promise<GitHubData | null> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'github-data.json');
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            const data = JSON.parse(fileContent);

            let contributions: GitHubEvent[] = [];
            let lastUpdated = Date.now();
            let total = 0;
            let source: string | undefined;

            if (Array.isArray(data)) {
                contributions = data;
            } else {
                contributions = data.contributions;
                lastUpdated = data.lastUpdated;
                total = data.total ?? 0;
                source = data.source;
            }

            return { contributions, lastUpdated, total, source };
        }
    } catch (error) {
        console.error('Error reading github data:', error);
    }
    return null;
}
