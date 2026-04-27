import type { Metadata } from 'next';
import { getAllPostsMeta, getAllTags } from '@/lib/posts';
import { createPageMetadata } from '@/lib/seo';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Archive',
    description: 'Browse Lalit Madan\'s complete archive of posts about AI agents, context engineering, automation, and software engineering.',
    path: '/archive',
    keywords: ['AI agents blog', 'context engineering blog', 'software engineering articles', 'automation'],
});

export default function ArchivePage() {
    const posts = getAllPostsMeta();
    const tags = getAllTags();

    return <ArchiveClient initialPosts={posts} allTags={tags} />;
}
