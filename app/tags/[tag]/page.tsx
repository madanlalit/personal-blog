import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTags, getPostsByTagSlug, getTagBySlug } from '@/lib/posts';
import { createPageMetadata } from '@/lib/seo';
import { slugifyTag } from '@/lib/slug';
import { Tag } from 'lucide-react';

interface Props {
    params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
    const tags = getAllTags();
    return tags.map((tag) => ({
        tag: slugifyTag(tag),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tag: tagSlug } = await params;
    const tag = getTagBySlug(tagSlug);

    if (!tag) {
        return { title: 'Tag Not Found' };
    }

    return {
        ...createPageMetadata({
            title: `Posts tagged "${tag}"`,
            description: `Read posts by Lalit Madan about ${tag}, including practical notes on AI agents, software engineering, automation, and developer workflows.`,
            path: `/tags/${tagSlug}`,
            keywords: [tag, `${tag} blog`, 'Lalit Madan'],
        }),
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function TagPage({ params }: Props) {
    const { tag: tagSlug } = await params;
    const tag = getTagBySlug(tagSlug);
    const posts = getPostsByTagSlug(tagSlug);

    if (!tag || posts.length === 0) {
        notFound();
    }

    return (
        <div className="tag-archive fade-in" style={{ padding: 'var(--space-lg)' }}>
            <header style={{ marginBottom: 'var(--space-lg)' }}>
                <Link href="/archive" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)', display: 'inline-block' }}>
                    ← Back to Archive
                </Link>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={24} />
                    Posts tagged &ldquo;{tag}&rdquo;
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        style={{
                            padding: 'var(--space-md)',
                            border: '1px solid var(--border)',
                            display: 'block',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-small)', marginBottom: 'var(--space-xs)' }}>
                            {post.date} • {post.readTime}m read
                        </div>
                        <h2 style={{ margin: 0, fontSize: 'var(--font-size-subtitle)' }}>{post.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-xs) 0 0' }}>{post.excerpt}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
