// Individual lesson page

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { lessonService } from "../../../services/lesson.service.ts";
import type { Lesson, LessonSection, PracticeProblem } from "../../../models/lesson.ts";

interface LessonPageData {
  lesson: Lesson;
  sections: LessonSection[];
  practiceProblems: PracticeProblem[];
}

export const handler: Handlers<LessonPageData> = {
  async GET(_req, ctx) {
    const { category, slug } = ctx.params;

    const lesson = await lessonService.getLessonBySlug(category, slug);
    if (!lesson) {
      return new Response("Lesson not found", { status: 404 });
    }

    // Get beginner level sections by default
    const sections = await lessonService.getLessonSections(lesson.id, "beginner");
    const practiceProblems = await lessonService.getPracticeProblems(lesson.id, "beginner");

    return ctx.render({ lesson, sections, practiceProblems });
  },
};

export default function LessonPage({ data }: PageProps<LessonPageData>) {
  return (
    <>
      <Head>
        <title>{data.lesson.title} - Maths Wizards</title>
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
              <li><a href={`/lessons/${data.lesson.slug.split('/')[0]}`}>
                {data.lesson.category_name}
              </a></li>
              <li>{data.lesson.title}</li>
            </ul>
          </nav>

          <hgroup>
            <h1>{data.lesson.title}</h1>
            {data.lesson.description && <p>{data.lesson.description}</p>}
          </hgroup>

          {data.lesson.estimated_time && (
            <p><small>⏱️ Estimated time: {data.lesson.estimated_time} minutes</small></p>
          )}
        </section>

        {/* Difficulty Toggle */}
        <section class="difficulty-toggle">
          <strong>Difficulty Level:</strong>
          <div class="toggle-buttons" role="group">
            <button
              class="active"
              hx-get={`/api/lessons/sections?lesson_id=${data.lesson.id}&difficulty=beginner`}
              hx-target="#lesson-content"
              hx-swap="innerHTML"
            >
              Beginner
            </button>
            <button
              hx-get={`/api/lessons/sections?lesson_id=${data.lesson.id}&difficulty=intermediate`}
              hx-target="#lesson-content"
              hx-swap="innerHTML"
            >
              Intermediate
            </button>
            <button
              hx-get={`/api/lessons/sections?lesson_id=${data.lesson.id}&difficulty=advanced`}
              hx-target="#lesson-content"
              hx-swap="innerHTML"
            >
              Advanced
            </button>
          </div>
        </section>

        {/* Lesson Content */}
        <section id="lesson-content">
          {data.sections.map((section) => (
            <div key={section.id} class="lesson-section">
              {section.title && <h3>{section.title}</h3>}
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))}
        </section>

        {/* Practice Problems */}
        {data.practiceProblems.length > 0 && (
          <section class="practice-section">
            <h2>Practice Problems</h2>
            {data.practiceProblems.map((problem, index) => (
              <article key={problem.id} class="practice-problem">
                <h4>Problem {index + 1}</h4>
                <p>{problem.question}</p>

                <form
                  hx-post="/api/lessons/check-answer"
                  hx-target={`#feedback-${problem.id}`}
                  hx-swap="innerHTML"
                >
                  <input type="hidden" name="problem_id" value={problem.id} />
                  <div class="grid">
                    <input
                      type="text"
                      name="answer"
                      placeholder="Your answer"
                      required
                    />
                    <button type="submit">Check Answer</button>
                  </div>
                </form>

                <div id={`feedback-${problem.id}`}></div>

                {/* Hint button */}
                <div class="hint-section">
                  <button
                    hx-get={`/api/lessons/hint?problem_id=${problem.id}&level=1`}
                    hx-target={`#hints-${problem.id}`}
                    hx-swap="beforeend"
                  >
                    Get a Hint
                  </button>
                  <div id={`hints-${problem.id}`}></div>
                </div>
              </article>
            ))}
          </section>
        )}

        <footer>
          <p>&copy; 2024 Maths Wizards. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
