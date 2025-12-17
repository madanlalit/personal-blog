export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime?: number;
  tags?: string[];
}