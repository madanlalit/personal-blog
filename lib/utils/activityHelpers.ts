import type { Post } from '../types';

/**
 * Calculate weekly activity based on actual post dates
 * Returns an array of 52 numbers (one per week) representing post counts
 */
export function calculateWeeklyActivity(posts: Post[]): number[] {
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Initialize 52 weeks with 0 posts
    const weeks: number[] = new Array(52).fill(0);

    posts.forEach(post => {
        const postDate = new Date(post.date);

        // Only count posts from the last year
        if (postDate < oneYearAgo || postDate > now) return;

        // Calculate which week this post belongs to
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        const weeksAgo = Math.floor((now.getTime() - postDate.getTime()) / msPerWeek);

        if (weeksAgo >= 0 && weeksAgo < 52) {
            // Index from end (week 51 = most recent)
            weeks[51 - weeksAgo]++;
        }
    });

    return weeks;
}

/**
 * Convert post counts to opacity values for heatmap display
 */
export function getHeatmapOpacities(posts: Post[]): number[] {
    const counts = calculateWeeklyActivity(posts);
    const maxCount = Math.max(...counts, 1); // Avoid division by zero

    return counts.map(count => {
        if (count === 0) return 0.15; // Dim for no posts
        // Scale opacity based on activity level
        return 0.3 + (count / maxCount) * 0.7;
    });
}
