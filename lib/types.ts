export interface Post {
    id: string;
    slug: string;
    title: string;
    seoTitle?: string;
    subtitle?: string;
    excerpt: string;
    content: string;
    date: string;
    modifiedDate?: string;
    category: string;
    readTime: number;
    tags: string[];
    keywords?: string[];
    image?: string;
}

export interface PostMeta {
    id: string;
    slug: string;
    title: string;
    seoTitle?: string;
    subtitle?: string;
    excerpt: string;
    date: string;
    modifiedDate?: string;
    category: string;
    readTime: number;
    tags: string[];
    keywords?: string[];
    image?: string;
}
