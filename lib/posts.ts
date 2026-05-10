import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import type { Post, PostMeta } from './types';
import { slugifyTag } from './slug';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const POST_FILE_EXTENSION = '.md';
const POST_TEMPLATE_PREFIX = '_';
const POST_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

function generateSlug(filename: string): string {
    // Remove date prefix and extension: 2025-12-10-my-post.md -> my-post
    return filename.replace(POST_DATE_PREFIX, '').replace(/\.md$/, '');
}

function generateId(filename: string): string {
    return generateSlug(filename);
}

function listPostFiles(): string[] {
    return fs.readdirSync(postsDirectory)
        .filter((file) => file.endsWith(POST_FILE_EXTENSION) && !file.startsWith(POST_TEMPLATE_PREFIX));
}

function buildPostFromFile(filename: string): Post {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const id = generateId(filename);
    const slug = generateSlug(filename);
    const wordCount = content.split(/\s+/).length;

    return {
        id,
        slug,
        title: data.title || 'Untitled',
        seoTitle: data.seoTitle,
        subtitle: data.subtitle,
        excerpt: data.excerpt || `${content.slice(0, 200)}...`,
        content,
        date: data.date || new Date().toISOString().split('T')[0],
        modifiedDate: data.modifiedDate,
        category: data.category || 'Uncategorized',
        readTime: data.readTime || Math.ceil(wordCount / 200),
        tags: data.tags || [],
        keywords: data.keywords,
        image: data.image,
    } as Post;
}

// Memoize to prevent duplicate reads during the same page generation
export const getAllPosts = cache((): Post[] => {
    const posts = listPostFiles().map(buildPostFromFile);

    // Sort by date (newest first)
    return posts.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
});

function toPostMeta(post: Post): PostMeta {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        seoTitle: post.seoTitle,
        subtitle: post.subtitle,
        excerpt: post.excerpt,
        date: post.date,
        modifiedDate: post.modifiedDate,
        category: post.category,
        readTime: post.readTime,
        tags: post.tags,
        keywords: post.keywords,
        image: post.image,
    };
}

export const getAllPostsMeta = cache((): PostMeta[] => getAllPosts().map(toPostMeta));

export function getPostBySlug(slug: string): Post | undefined {
    return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): PostMeta[] {
    const normalizedTag = tag.toLowerCase();
    return getAllPostsMeta().filter((post) =>
        post.tags.some((postTag) => postTag.toLowerCase() === normalizedTag)
    );
}

export function getTagBySlug(slug: string): string | undefined {
    return getAllTags().find((tag) => slugifyTag(tag) === slug);
}

export function getPostsByTagSlug(slug: string): PostMeta[] {
    const tag = getTagBySlug(slug);
    return tag ? getPostsByTag(tag) : [];
}

export const getAllTags = cache((): string[] => {
    const tagSet = new Set<string>();
    getAllPosts().forEach((post) => {
        post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
});
