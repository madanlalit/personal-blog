import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import PostClient from './PostClient';

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate static paths at build time
export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// Generate metadata per page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [SITE_CONFIG.author],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const allPosts = getAllPosts();
    const currentIndex = allPosts.findIndex(p => p.id === post.id);
    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    // Related posts logic
    const relatedPosts = allPosts
        .filter(p => p.id !== post.id)
        .map(p => ({
            post: p,
            score: (post.tags?.filter(tag => p.tags?.includes(tag)).length || 0) * 3 + (p.category === post.category ? 2 : 0)
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ post }) => post);

    return (
        <PostClient
            post={post}
            prevPost={prevPost}
            nextPost={nextPost}
            relatedPosts={relatedPosts}
        />
    );
}
