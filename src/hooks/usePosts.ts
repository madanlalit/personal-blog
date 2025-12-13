import { mockPosts } from '../data/mockData';
import type { Post } from '../types';

// Sort posts by date, newest first
const sortedPosts = mockPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const usePosts = () => {
    /**
     * @returns All posts, sorted by date descending.
     */
    const getAllPosts = (): Post[] => {
        return sortedPosts;
    };

    /**
     * @param id The ID of the post to retrieve.
     * @returns The post matching the ID, or undefined if not found.
     */
    const getPostById = (id: string): Post | undefined => {
        return sortedPosts.find(post => post.id === id);
    };

    /**
     * @param tag The tag to filter posts by.
     * @returns A list of posts containing the given tag.
     */
    const getPostsByTag = (tag: string): Post[] => {
        return sortedPosts.filter(post => post.tags?.includes(tag));
    };

    /**
     * @returns A list of all unique tags, sorted alphabetically.
     */
    const getAllTags = (): string[] => {
        const allTags = sortedPosts.flatMap(post => post.tags || []);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.sort();
    };
    
    /**
     * @param query The search query.
     * @returns A list of posts that match the query in the title or content.
     */
    const searchPosts = (query: string): Post[] => {
        if (!query) {
            return [];
        }
        const lowercasedQuery = query.toLowerCase();
        return sortedPosts.filter(post =>
            post.title.toLowerCase().includes(lowercasedQuery) ||
            post.content.toLowerCase().includes(lowercasedQuery)
        );
    };

    return { getAllPosts, getPostById, getPostsByTag, getAllTags, searchPosts };
};
