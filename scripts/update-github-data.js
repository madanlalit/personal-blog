import fs from "fs";
import path from "path";

const GITHUB_USERNAME = "madanlalit";
const OUTPUT_FILE = path.join(process.cwd(), "public", "github-data.json");

async function updateData() {
  try {
    console.log(`Fetching events for ${GITHUB_USERNAME}...`);

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API responded with ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    const output = {
      lastUpdated: Date.now(),
      events: data,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✅ Success! Data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to fetch GitHub data:", error);
    process.exit(1);
  }
}

updateData();
