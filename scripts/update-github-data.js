import fs from "fs";
import path from "path";

const GITHUB_USERNAME = "madanlalit";
const OUTPUT_FILE = path.join(process.cwd(), "public", "github-data.json");

async function updateData() {
  try {
    console.log(`Fetching events for ${GITHUB_USERNAME}...`);

    let allEvents = [];
    for (let page = 1; page <= 3; page++) {
      console.log(`Fetching page ${page}...`);
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100&page=${page}`,
        {
          headers: {
            "User-Agent": "node.js-fetch-script",
          },
        }
      );

      if (!response.ok) {
        console.warn(`Page ${page} failed: ${response.status}`);
        break;
      }

      const pageData = await response.json();
      if (pageData.length === 0) break;
      allEvents = allEvents.concat(pageData);
    }

    const output = {
      lastUpdated: Date.now(),
      events: allEvents,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✅ Success! Data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to fetch GitHub data:", error);
    process.exit(1);
  }
}

updateData();
