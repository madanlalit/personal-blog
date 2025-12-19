import fs from "fs";
import path from "path";

const GITHUB_USERNAME = "madanlalit";
const OUTPUT_FILE = path.join(process.cwd(), "public", "starred-repos.json");

async function updateStarredRepos() {
    try {
        console.log(`Fetching starred repos for ${GITHUB_USERNAME}...`);

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=100`,
        );

        if (!response.ok) {
            throw new Error(
                `GitHub API responded with ${response.status}: ${response.statusText}`,
            );
        }

        const data = await response.json();

        // Map to only the fields we need
        const repos = data.map((repo, index) => ({
            id: `STARRED-${String(index + 1).padStart(2, "0")}`,
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
        }));

        const output = {
            lastUpdated: Date.now(),
            repos,
        };

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
        console.log(`✅ Success! Saved ${repos.length} starred repos to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error("❌ Failed to fetch starred repos:", error);
        process.exit(1);
    }
}

updateStarredRepos();
