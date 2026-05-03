import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { absoluteUrl } from '@/lib/seo';
import PostClient from './PostClient';
import ArticleJsonLd from '@/components/ArticleJsonLd';

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

    const title = post.seoTitle || post.title;
    const image = absoluteUrl(post.image || SITE_CONFIG.defaultImage);
    const keywords = [...(post.keywords || []), ...(post.tags || [])];

    return {
        title,
        description: post.excerpt,
        keywords,
        authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
        alternates: {
            canonical: absoluteUrl(`/post/${post.slug}`),
        },
        openGraph: {
            title,
            description: post.excerpt,
            url: absoluteUrl(`/post/${post.slug}`),
            type: 'article',
            publishedTime: post.date,
            modifiedTime: post.modifiedDate || post.date,
            authors: [SITE_CONFIG.author],
            tags: post.tags,
            siteName: SITE_CONFIG.title,
            locale: SITE_CONFIG.locale,
            images: [{ url: image, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: post.excerpt,
            creator: SITE_CONFIG.twitterHandle,
            images: [image],
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
        .map(({ post }) => ({ ...post, content: '' }));

    const shareUrl = `${SITE_CONFIG.url}/post/${post.slug}`;

    return (
        <>
            <ArticleJsonLd post={post} />
            <PostClient
                post={post}
                prevPost={prevPost}
                nextPost={nextPost}
                relatedPosts={relatedPosts}
                shareUrl={shareUrl}
            />
        </>
    );
}
