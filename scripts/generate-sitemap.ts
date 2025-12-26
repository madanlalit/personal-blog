import fs from "fs";
import path from "path";

const SITE_URL = "https://lalitmadan.com";
const OUTPUT_FILE = path.join(process.cwd(), "public", "sitemap.xml");
const POSTS_DIR = path.join(process.cwd(), "public", "posts");

interface SitemapEntry {
    url: string;
    lastmod?: string;
    changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
}

function getPostSlugs(): string[] {
    try {
        const files = fs.readdirSync(POSTS_DIR);
        return files
            .filter((f) => f.endsWith(".json") && f !== "index.json")
            .map((f) => f.replace(".json", ""));
    } catch {
        return [];
    }
}

function generateSitemap(): void {
    const today = new Date().toISOString().split("T")[0];

    // Static pages
    const entries: SitemapEntry[] = [
        { url: "/", changefreq: "weekly", priority: 1.0 },
        { url: "/about", changefreq: "monthly", priority: 0.8 },
        { url: "/archive", changefreq: "weekly", priority: 0.7 },
        { url: "/projects", changefreq: "monthly", priority: 0.7 },
        { url: "/experience", changefreq: "monthly", priority: 0.6 },
    ];

    // Dynamic blog posts
    const posts = getPostSlugs();
    for (const slug of posts) {
        entries.push({
            url: `/post/${slug}`,
            changefreq: "monthly",
            priority: 0.9,
        });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
            .map(
                (entry) => `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
            )
            .join("\n")}
</urlset>`;

    fs.writeFileSync(OUTPUT_FILE, xml);
    console.log(`✅ Sitemap generated at ${OUTPUT_FILE}`);
}

generateSitemap();
