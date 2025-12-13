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

export interface Theme {
  mode: 'light' | 'dark';
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
