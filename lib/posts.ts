import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostMeta } from './types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

function generateSlug(filename: string): string {
    // Remove date prefix and extension: 2025-12-10-my-post.md -> my-post
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function generateId(filename: string): string {
    return generateSlug(filename);
}

import { cache } from 'react';

// Memoize to prevent duplicate reads during the same page generation
export const getAllPosts = cache((): Post[] => {
    const files = fs.readdirSync(postsDirectory)
        .filter(f => f.endsWith('.md') && !f.startsWith('_'));

    const posts = files.map(filename => {
        const fullPath = path.join(postsDirectory, filename);
        // Optimization: In a real "meta only" scenario, we'd avoid reading the whole file if content isn't needed.
        // But for SIMPLICITY and because matter() parses everything anyway, we just cache the result.
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const id = generateId(filename);
        const slug = generateSlug(filename);
        const wordCount = content.split(/\s+/).length;

        return {
            id,
            slug,
            title: data.title || 'Untitled',
            subtitle: data.subtitle,
            excerpt: data.excerpt || content.slice(0, 200) + '...',
            content,
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'Uncategorized',
            readTime: data.readTime || Math.ceil(wordCount / 200),
            tags: data.tags || [],
        } as Post;
    });

    // Sort by date (newest first)
    return posts.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
});

export function getAllPostsMeta(): PostMeta[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return getAllPosts().map(({ content: _, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | undefined {
    return getAllPosts().find(post => post.slug === slug);
}

export function getPostsByTag(tag: string): PostMeta[] {
    return getAllPostsMeta().filter(post =>
        post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    );
}

export function getAllTags(): string[] {
    const posts = getAllPosts();
    const tagSet = new Set<string>();
    posts.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}
