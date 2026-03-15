import { NextResponse } from 'next/server';
import { getAllPostsMeta } from '@/lib/posts';

export async function GET() {
    const posts = getAllPostsMeta();
    return NextResponse.json(posts, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
