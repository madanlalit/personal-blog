import { useState, useEffect, useCallback } from 'react';
import type { Post } from '../types';

// Cache for posts to avoid refetching
let postsCache: Post[] | null = null;
const postCache: Map<string, Post> = new Map();

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>(() => postsCache || []);
    const [loading, setLoading] = useState(!postsCache);

    // Fetch all posts (index only - no content)
    useEffect(() => {
        if (postsCache) return;

        fetch('/posts/index.json')
            .then(res => res.json())
            .then((data: Post[]) => {
                postsCache = data;
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load posts:', err);
                setLoading(false);
            });
    }, []);

    /**
     * @returns All posts, sorted by date descending.
     */
    const getAllPosts = useCallback((): Post[] => {
        return posts;
    }, [posts]);

    /**
     * Fetch a single post by ID (includes full content)
     */
    const getPostById = useCallback(async (id: string): Promise<Post | undefined> => {
        // Check cache first
        if (postCache.has(id)) {
            return postCache.get(id);
        }

        try {
            const res = await fetch(`/posts/${id}.json`);
            if (!res.ok) return undefined;

            const post: Post = await res.json();
            postCache.set(id, post);
            return post;
        } catch {
            return undefined;
        }
    }, []);

    /**
     * Sync version for compatibility - uses cached data only
     */
    const getPostByIdSync = useCallback((id: string): Post | undefined => {
        return postCache.get(id) || posts.find(p => p.id === id);
    }, [posts]);

    /**
     * @param tag The tag to filter posts by.
     * @returns A list of posts containing the given tag.
     */
    const getPostsByTag = useCallback((tag: string): Post[] => {
        return posts.filter(post => post.tags?.includes(tag));
    }, [posts]);

    /**
     * @returns A list of all unique tags, sorted alphabetically.
     */
    const getAllTags = useCallback((): string[] => {
        const allTags = posts.flatMap(post => post.tags || []);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.sort();
    }, [posts]);

    /**
     * @param query The search query.
     * @returns A list of posts that match the query in the title or excerpt.
     */
    const searchPosts = useCallback((query: string): Post[] => {
        if (!query) return [];
        const lowercasedQuery = query.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(lowercasedQuery) ||
            post.excerpt.toLowerCase().includes(lowercasedQuery)
        );
    }, [posts]);

    return {
        posts,
        loading,
        getAllPosts,
        getPostById,
        getPostByIdSync,
        getPostsByTag,
        getAllTags,
        searchPosts
    };
};
