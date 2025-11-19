// Blog listing page

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { blogService } from "../../services/blog.service.ts";
import type { BlogPostMeta } from "../../models/blog.ts";

interface BlogPageData {
  posts: BlogPostMeta[];
  total: number;
}

export const handler: Handlers<BlogPageData> = {
  async GET(_req, ctx) {
    const posts = await blogService.getAllPosts(10, 0);
    const total = await blogService.countPosts();
    return ctx.render({ posts, total });
  },
};

export default function BlogPage({ data }: PageProps<BlogPageData>) {
  return (
    <>
      <Head>
        <title>Blog - Maths Wizards</title>
      </Head>
      <main class="container">
        <header>
          <nav>
            <ul>
              <li><strong><a href="/">Maths Wizards</a></strong></li>
            </ul>
            <ul>
              <li><a href="/lessons">Lessons</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </nav>
        </header>

        <section>
          <hgroup>
            <h1>Blog</h1>
            <p>Latest updates and tutorials</p>
          </hgroup>
        </section>

        <section class="blog-posts">
          {data.posts.length > 0 ? (
            data.posts.map((post) => (
              <article key={post.id}>
                <h2>
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h2>
                {post.author && <p><small>By {post.author}</small></p>}
                {post.excerpt && <p>{post.excerpt}</p>}
                {post.tags_array && post.tags_array.length > 0 && (
                  <p>
                    {post.tags_array.map((tag) => (
                      <span key={tag} class="badge">{tag}</span>
                    ))}
                  </p>
                )}
                <p>
                  <a href={`/blog/${post.slug}`}>Read more →</a>
                </p>
              </article>
            ))
          ) : (
            <p>No blog posts yet. Check back soon!</p>
          )}
        </section>

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
