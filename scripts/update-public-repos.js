import fs from "fs";
import path from "path";

const GITHUB_USERNAME = "madanlalit";
const OUTPUT_FILE = path.join(process.cwd(), "public", "public-repos.json");

async function fetchPublicRepos() {
    const repos = [];

    for (let page = 1; ; page++) {
        console.log(`Fetching repos page ${page}...`);

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    "User-Agent": "node.js-fetch-script",
                },
            },
        );

        if (!response.ok) {
            throw new Error(
                `GitHub API responded with ${response.status}: ${response.statusText}`,
            );
        }

        const pageRepos = await response.json();
        if (pageRepos.length === 0) break;

        repos.push(...pageRepos);

        if (pageRepos.length < 100) break;
    }

    return repos;
}

async function updatePublicRepos() {
    try {
        console.log(`Fetching public repos for ${GITHUB_USERNAME}...`);

        const data = await fetchPublicRepos();

        // Map to only the fields we need
        const repos = data.map((repo, index) => ({
            id: `REPO-${String(index + 1).padStart(2, "0")}`,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "No description available",
            language: repo.language || "Unknown",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            topics: repo.topics || [],
            owner: {
                login: repo.owner.login,
                avatarUrl: repo.owner.avatar_url,
            },
            archived: repo.archived,
            fork: repo.fork,
            homepage: repo.homepage || null,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
        }));

        const output = {
            lastUpdated: Date.now(),
            repos,
        };

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
        console.log(`✅ Success! Saved ${repos.length} public repos to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error("❌ Failed to fetch public repos:", error);
        process.exit(1);
    }
}

updatePublicRepos();
