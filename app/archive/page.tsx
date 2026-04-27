import type { Metadata } from 'next';
import { getAllPostsMeta, getAllTags } from '@/lib/posts';
import { createPageMetadata } from '@/lib/seo';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Archive',
    description: 'Browse Lalit Madan\'s complete archive of posts about AI engineering, context engineering, Python, open source, and AI agents.',
    path: '/archive',
    keywords: ['AI Engineering Blog', 'Context Engineering Blog', 'Python Blog', 'LLM Notes', 'Agentic Engineering Articles'],
});

export default function ArchivePage() {
    const posts = getAllPostsMeta();
    const tags = getAllTags();

    return <ArchiveClient initialPosts={posts} allTags={tags} />;
}
