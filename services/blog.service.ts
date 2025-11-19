// Blog service - Business logic for blog posts

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { query, queryOne, incrementViewCount } from "../db/database.ts";
import type { BlogPost, BlogPostMeta } from "../models/blog.ts";

// Initialize markdown-it with syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch {
        // Fall through
      }
    }
    return ""; // Use external default escaping
  },
});

export class BlogService {
  /**
   * Get all published blog posts
   */
  async getAllPosts(limit = 10, offset = 0): Promise<BlogPostMeta[]> {
    const posts = query<BlogPost>(
      `SELECT id, title, slug, author, excerpt, featured_image, tags, published_at, view_count
       FROM blog_posts
       WHERE is_published = 1
       ORDER BY published_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return posts.map((post) => this.parsePostMeta(post));
  }

  /**
   * Get a blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = queryOne<BlogPost>(
      `SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1`,
      [slug]
    );

    if (!post) {
      return null;
    }

    // Increment view count
    incrementViewCount("blog_posts", post.id);

    // Render markdown to HTML
    return this.parsePost(post);
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag: string, limit = 10): Promise<BlogPostMeta[]> {
    const posts = query<BlogPost>(
      `SELECT id, title, slug, author, excerpt, featured_image, tags, published_at, view_count
       FROM blog_posts
       WHERE is_published = 1
         AND tags LIKE ?
       ORDER BY published_at DESC
       LIMIT ?`,
      [`%"${tag}"%`, limit]
    );

    return posts.map((post) => this.parsePostMeta(post));
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 5): Promise<BlogPostMeta[]> {
    return this.getAllPosts(limit, 0);
  }

  /**
   * Get popular posts
   */
  async getPopularPosts(limit = 5): Promise<BlogPostMeta[]> {
    const posts = query<BlogPost>(
      `SELECT id, title, slug, author, excerpt, featured_image, tags, published_at, view_count
       FROM blog_posts
       WHERE is_published = 1
       ORDER BY view_count DESC
       LIMIT ?`,
      [limit]
    );

    return posts.map((post) => this.parsePostMeta(post));
  }

  /**
   * Search blog posts
   */
  async searchPosts(searchQuery: string, limit = 10): Promise<BlogPostMeta[]> {
    const posts = query<BlogPost>(
      `SELECT id, title, slug, author, excerpt, featured_image, tags, published_at, view_count
       FROM blog_posts
       WHERE is_published = 1
         AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
       ORDER BY view_count DESC
       LIMIT ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, limit]
    );

    return posts.map((post) => this.parsePostMeta(post));
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const posts = query<BlogPost>(
      `SELECT tags FROM blog_posts WHERE is_published = 1 AND tags IS NOT NULL`
    );

    const tagSet = new Set<string>();
    posts.forEach((post) => {
      if (post.tags) {
        try {
          const tags = JSON.parse(post.tags) as string[];
          tags.forEach((tag) => tagSet.add(tag));
        } catch {
          // Ignore invalid JSON
        }
      }
    });

    return Array.from(tagSet).sort();
  }

  /**
   * Parse blog post meta (without rendering markdown)
   */
  private parsePostMeta(post: BlogPost): BlogPostMeta {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      author: post.author,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      tags_array: post.tags ? JSON.parse(post.tags) : [],
      published_at: post.published_at,
      view_count: post.view_count,
    };
  }

  /**
   * Parse blog post (with rendered HTML)
   */
  private parsePost(post: BlogPost): BlogPost {
    return {
      ...post,
      html: md.render(post.content),
      tags_array: post.tags ? JSON.parse(post.tags) : [],
    };
  }

  /**
   * Count total published posts
   */
  async countPosts(): Promise<number> {
    const result = queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM blog_posts WHERE is_published = 1`
    );
    return result?.count ?? 0;
  }
}

// Export singleton instance
export const blogService = new BlogService();
