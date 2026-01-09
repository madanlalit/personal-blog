import type { Post } from '../types';

export const groupPostsByYear = (posts: Post[]) => {
    return posts.reduce((acc, post) => {
        const year = new Date(post.date).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push(post);
        return acc;
    }, {} as Record<string, Post[]>);
};
