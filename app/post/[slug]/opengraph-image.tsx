import { ImageResponse } from 'next/og';
import { getPostBySlug, getAllPosts } from '@/lib/posts';

export const alt = 'Blog post preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Re-use static params from the page route
export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    const title = post?.title ?? 'Blog Post';
    const date = post?.date ?? '';
    const readTime = post?.readTime ?? '';
    const tags = post?.tags?.slice(0, 3) ?? [];

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#18191A',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '48px 56px',
                    fontFamily: 'monospace',
                    border: '2px solid #3E4451',
                    boxSizing: 'border-box',
                }}
            >
                {/* Top bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#A8B9A8', fontSize: '18px', letterSpacing: '0.08em' }}>
                        {'// LALIT MADAN'}
                    </span>
                    <span style={{ color: '#8B949E', fontSize: '16px', letterSpacing: '0.05em' }}>
                        lalitmadan.com
                    </span>
                </div>

                {/* Main content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', flex: 1, justifyContent: 'center' }}>
                    <div
                        style={{
                            color: '#D4D4D4',
                            fontSize: title.length > 50 ? '52px' : '62px',
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: '-0.01em',
                            textTransform: 'uppercase',
                            marginBottom: '32px',
                        }}
                    >
                        {title}
                    </div>

                    {/* Divider */}
                    <div style={{ width: '100%', height: '1px', background: '#3E4451', marginBottom: '24px' }} />

                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        {date && (
                            <span style={{ color: '#8B949E', fontSize: '18px' }}>{date}</span>
                        )}
                        {date && readTime && (
                            <span style={{ color: '#5C6370', fontSize: '18px' }}>•</span>
                        )}
                        {readTime && (
                            <span style={{ color: '#8B949E', fontSize: '18px' }}>{readTime} MIN READ</span>
                        )}
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    style={{
                                        color: '#A8B9A8',
                                        fontSize: '16px',
                                        border: '1px solid #3E4451',
                                        padding: '4px 14px',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    [{tag}]
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom bar */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#5C6370', fontSize: '14px', letterSpacing: '0.1em' }}>
                        {'/// SYSTEM_[B]LOGS'}
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
