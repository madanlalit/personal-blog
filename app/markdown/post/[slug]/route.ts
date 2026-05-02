import { notFound } from 'next/navigation';

import { SITE_CONFIG } from '@/lib/config';
import { markdownResponse } from '@/lib/markdownResponse';
import { getPostBySlug } from '@/lib/posts';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return markdownResponse(`---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.excerpt)}
date: ${JSON.stringify(post.date)}
category: ${JSON.stringify(post.category)}
tags: ${JSON.stringify(post.tags)}
canonical: ${JSON.stringify(`${SITE_CONFIG.url}/post/${post.slug}`)}
---

# ${post.title}

${post.subtitle ? `_${post.subtitle}_\n\n` : ''}Published: ${post.date}

Category: ${post.category}

Read time: ${post.readTime} min

${post.content}
`);
}

export async function HEAD() {
    return markdownResponse('');
}
