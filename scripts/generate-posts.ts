import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');
const OUTPUT_DIR = path.join(process.cwd(), 'public/posts');

interface PostMeta {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: number;
    tags: string[];
}

interface PostFull extends PostMeta {
    content: string;
}

function generateSlug(filename: string): string {
    // Remove date prefix and extension: 2025-12-10-my-post.md -> my-post
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function generateId(filename: string): string {
    // Use slug as ID for cleaner URLs
    return generateSlug(filename);
}

async function generatePosts() {
    console.log('📝 Generating posts from markdown files...');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Read all markdown files (exclude templates starting with _)
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));

    if (files.length === 0) {
        console.log('⚠️ No markdown files found in content/posts/');
        return;
    }

    const index: PostMeta[] = [];

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const id = generateId(file);
        const slug = generateSlug(file);

        const postMeta: PostMeta = {
            id,
            slug,
            title: data.title || 'Untitled',
            subtitle: data.subtitle,
            excerpt: data.excerpt || content.slice(0, 200) + '...',
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'Uncategorized',
            readTime: data.readTime || Math.ceil(content.split(/\s+/).length / 200),
            tags: data.tags || []
        };

        const postFull: PostFull = {
            ...postMeta,
            content
        };

        // Write individual post file
        const postPath = path.join(OUTPUT_DIR, `${id}.json`);
        fs.writeFileSync(postPath, JSON.stringify(postFull, null, 2));
        console.log(`  ✅ Generated: ${id}.json`);

        index.push(postMeta);
    }

    // Sort by date (newest first)
    index.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Write index file
    const indexPath = path.join(OUTPUT_DIR, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.log(`\n📚 Generated index.json with ${index.length} posts`);
}

generatePosts().catch(console.error);
