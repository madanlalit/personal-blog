import type { Metadata } from 'next';
import { getAllPostsMeta, getAllTags } from '@/lib/posts';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = {
    title: 'Archive',
    description: 'Browse all blog posts organized by date. Search, filter by tags, and explore the complete archive.',
};

export default function ArchivePage() {
    const posts = getAllPostsMeta();
    const tags = getAllTags();

    return <ArchiveClient initialPosts={posts} allTags={tags} />;
}
