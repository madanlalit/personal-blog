import fs from "fs";
import path from "path";
import { SITE_CONFIG } from "../lib/config";

const SITE_URL = SITE_CONFIG.url;
const OUTPUT_FILE = path.join(process.cwd(), "public", "sitemap.xml");
const POSTS_INDEX = path.join(process.cwd(), "public", "posts", "index.json");

interface SitemapEntry {
    url: string;
    lastmod?: string;
    changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
}

interface PostMeta {
    slug: string;
    date: string;
}

function getPosts(): PostMeta[] {
    try {
        if (!fs.existsSync(POSTS_INDEX)) {
            console.warn(`⚠️ Posts index not found at ${POSTS_INDEX}. Run 'npm run generate-posts' first.`);
            return [];
        }
        const content = fs.readFileSync(POSTS_INDEX, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        console.error("Error reading posts index:", error);
        return [];
    }
}

function generateSitemap(): void {
    const today = new Date().toISOString().split("T")[0];

    // Static pages
    const entries: SitemapEntry[] = [
        { url: "/", changefreq: "weekly", priority: 1.0, lastmod: today },
        { url: "/about", changefreq: "monthly", priority: 0.8, lastmod: today },
        { url: "/archive", changefreq: "weekly", priority: 0.7, lastmod: today },
        { url: "/projects", changefreq: "monthly", priority: 0.7, lastmod: today },
        { url: "/experience", changefreq: "monthly", priority: 0.6, lastmod: today },
    ];

    // Dynamic blog posts
    const posts = getPosts();
    for (const post of posts) {
        entries.push({
            url: `/post/${post.slug}`,
            lastmod: post.date, // Use the actual post date
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
    <lastmod>${entry.lastmod || today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
            )
            .join("\n")}
</urlset>`;

    fs.writeFileSync(OUTPUT_FILE, xml);
    console.log(`✅ Sitemap generated at ${OUTPUT_FILE} with ${entries.length} URLs`);
}

generateSitemap();
