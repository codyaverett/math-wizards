// Lessons listing page

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { lessonService } from "../../services/lesson.service.ts";
import type { LessonCategory } from "../../models/lesson.ts";

interface LessonsPageData {
  categories: LessonCategory[];
}

export const handler: Handlers<LessonsPageData> = {
  async GET(_req, ctx) {
    const categories = await lessonService.getAllCategories();
    return ctx.render({ categories });
  },
};

export default function LessonsPage({ data }: PageProps<LessonsPageData>) {
  return (
    <>
      <Head>
        <title>Lessons - Maths Wizards</title>
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
            <h1>Lessons</h1>
            <p>Choose a category to start learning</p>
          </hgroup>
        </section>

        <section class="categories">
          <div class="grid">
            {data.categories.map((category) => (
              <article key={category.id}>
                <h3>
                  {category.icon && <span>{category.icon} </span>}
                  <a href={`/lessons/${category.slug}`}>{category.name}</a>
                </h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
