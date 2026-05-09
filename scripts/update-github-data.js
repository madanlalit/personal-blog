import fs from "fs";
import path from "path";

const GITHUB_USERNAME = "madanlalit";
const OUTPUT_FILE = path.join(process.cwd(), "public", "github-data.json");
const CONTRIBUTIONS_API_URL = "https://github-contributions-api.jogruber.de/v4";

async function updateData() {
  try {
    console.log(`Fetching contribution calendar for ${GITHUB_USERNAME}...`);

    const response = await fetch(
      `${CONTRIBUTIONS_API_URL}/${GITHUB_USERNAME}?y=last`,
      {
        headers: {
          "User-Agent": "node.js-fetch-script",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Contribution API returned ${response.status}`);
    }

    const data = await response.json();

    const output = {
      lastUpdated: Date.now(),
      source: CONTRIBUTIONS_API_URL,
      total: data.total?.lastYear ?? 0,
      contributions: Array.isArray(data.contributions) ? data.contributions : [],
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✅ Success! Data saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to fetch GitHub data:", error);
    process.exit(1);
  }
}

updateData();
