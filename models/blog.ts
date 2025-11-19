// Blog-related type definitions

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author?: string;
  excerpt?: string;
  content: string; // Markdown content
  featured_image?: string;
  tags?: string; // JSON array
  view_count: number;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Parsed fields
  tags_array?: string[];
  html?: string; // Rendered HTML
}

export interface BlogPostMeta {
  id: number;
  title: string;
  slug: string;
  author?: string;
  excerpt?: string;
  featured_image?: string;
  tags_array?: string[];
  published_at?: string;
  view_count: number;
}
