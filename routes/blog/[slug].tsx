// Individual blog post page

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { blogService } from "../../services/blog.service.ts";
import type { BlogPost } from "../../models/blog.ts";

interface BlogPostPageData {
  post: BlogPost;
}

export const handler: Handlers<BlogPostPageData> = {
  async GET(_req, ctx) {
    const { slug } = ctx.params;

    const post = await blogService.getPostBySlug(slug);
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    return ctx.render({ post });
  },
};

export default function BlogPostPage({ data }: PageProps<BlogPostPageData>) {
  const { post } = data;

  return (
    <>
      <Head>
        <title>{post.title} - Maths Wizards Blog</title>
        {post.excerpt && <meta name="description" content={post.excerpt} />}
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

        <article>
          <nav aria-label="breadcrumb">
            <ul>
              <li><a href="/blog">Blog</a></li>
              <li>{post.title}</li>
            </ul>
          </nav>

          <header>
            <h1>{post.title}</h1>
            {post.author && (
              <p>
                <small>
                  By <strong>{post.author}</strong>
                  {post.published_at && (
                    <> • {new Date(post.published_at).toLocaleDateString()}</>
                  )}
                </small>
              </p>
            )}
            {post.tags_array && post.tags_array.length > 0 && (
              <p>
                {post.tags_array.map((tag) => (
                  <span key={tag} class="badge" style="margin-right: 0.5rem;">
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </header>

          <div
            class="blog-content"
            dangerouslySetInnerHTML={{ __html: post.html || "" }}
          />
        </article>

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
