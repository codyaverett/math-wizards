// API route for getting lesson sections by difficulty

import { Handlers } from "$fresh/server.ts";
import { lessonService } from "../../../services/lesson.service.ts";
import type { DifficultyLevel } from "../../../models/lesson.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const lessonIdStr = url.searchParams.get("lesson_id");
      const difficulty = url.searchParams.get("difficulty") as DifficultyLevel | null;

      if (!lessonIdStr) {
        return new Response("Missing lesson_id", { status: 400 });
      }

      const lessonId = parseInt(lessonIdStr);
      const sections = await lessonService.getLessonSections(
        lessonId,
        difficulty ?? undefined
      );

      // Render sections as HTML
      const html = sections.map((section) => `
        <div class="lesson-section" data-section-id="${section.id}">
          ${section.title ? `<h3>${section.title}</h3>` : ""}
          <div class="section-content">
            ${section.content}
          </div>
        </div>
      `).join("\n");

      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      console.error("Sections error:", error);
      return new Response(
        `<div class="error">Error loading sections</div>`,
        {
          status: 500,
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  },
};
