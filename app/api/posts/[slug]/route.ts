import { NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-static';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function GET(_request: Request, { params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return NextResponse.json({ error: `Post not found: ${slug}` }, { status: 404 });
    }

    return NextResponse.json(post, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
