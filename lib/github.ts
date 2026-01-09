import fs from 'fs';
import path from 'path';

export interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
        url: string;
    };
    payload: {
        ref?: string;
        commits?: Array<{
            sha: string;
            message: string;
        }>;
    };
    created_at: string;
}

export interface GitHubData {
    events: GitHubEvent[];
    lastUpdated: number;
}

export async function getGithubData(): Promise<GitHubData | null> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'github-data.json');
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            const data = JSON.parse(fileContent);

            let events: GitHubEvent[] = [];
            let lastUpdated = Date.now();

            if (Array.isArray(data)) {
                events = data;
            } else {
                events = data.events;
                lastUpdated = data.lastUpdated;
            }

            return { events, lastUpdated };
        }
    } catch (error) {
        console.error('Error reading github data:', error);
    }
    return null;
}
