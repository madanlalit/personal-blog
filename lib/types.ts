export interface Post {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    readTime: number;
    tags: string[];
}

export interface PostMeta {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: number;
    tags: string[];
}
