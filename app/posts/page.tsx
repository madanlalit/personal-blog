import type { Metadata } from 'next';
import { getAllPostsMeta, getAllTags } from '@/lib/posts';
import { createPageMetadata } from '@/lib/seo';
import PostsClient from './PostsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Posts',
    description: 'Browse Lalit Madan\'s posts about AI engineering, context engineering, Python, open source, and AI agents.',
    path: '/posts',
    keywords: ['AI Engineering Blog', 'Context Engineering Blog', 'Python Blog', 'LLM Notes', 'Agentic Engineering Articles'],
});

export default function PostsPage() {
    const posts = getAllPostsMeta();
    const tags = getAllTags();

    return <PostsClient initialPosts={posts} allTags={tags} />;
}
