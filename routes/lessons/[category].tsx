// Lesson category page - shows all lessons in a category

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { lessonService } from "../../services/lesson.service.ts";
import type { LessonCategory, Lesson } from "../../models/lesson.ts";

interface CategoryPageData {
  category: LessonCategory;
  lessons: Lesson[];
}

export const handler: Handlers<CategoryPageData> = {
  async GET(_req, ctx) {
    const { category: categorySlug } = ctx.params;

    const category = await lessonService.getCategoryBySlug(categorySlug);
    if (!category) {
      return new Response("Category not found", { status: 404 });
    }

    const lessons = await lessonService.getLessonsByCategory(category.id);

    return ctx.render({ category, lessons });
  },
};

export default function CategoryPage({ data }: PageProps<CategoryPageData>) {
  return (
    <>
      <Head>
        <title>{data.category.name} - Maths Wizards</title>
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
          <nav aria-label="breadcrumb">
            <ul>
              <li><a href="/lessons">Lessons</a></li>
              <li>{data.category.name}</li>
            </ul>
          </nav>

          <hgroup>
            <h1>
              {data.category.icon && <span>{data.category.icon} </span>}
              {data.category.name}
            </h1>
            {data.category.description && <p>{data.category.description}</p>}
          </hgroup>
        </section>

        <section class="lessons-list">
          {data.lessons.length > 0 ? (
            <div class="grid">
              {data.lessons.map((lesson) => (
                <article key={lesson.id} class="lesson-card">
                  <h3>
                    <a href={`/lessons/${data.category.slug}/${lesson.slug}`}>
                      {lesson.title}
                    </a>
                  </h3>
                  {lesson.description && <p>{lesson.description}</p>}
                  <footer>
                    {lesson.difficulty_level && (
                      <span class="badge">{lesson.difficulty_level}</span>
                    )}
                    {lesson.estimated_time && (
                      <small> • {lesson.estimated_time} min</small>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          ) : (
            <p>No lessons available yet. Check back soon!</p>
          )}
        </section>

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
