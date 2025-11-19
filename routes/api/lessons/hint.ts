// API route for getting hints

import { Handlers } from "$fresh/server.ts";
import { lessonService } from "../../../services/lesson.service.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const problemIdStr = url.searchParams.get("problem_id");
      const levelStr = url.searchParams.get("level");

      if (!problemIdStr || !levelStr) {
        return new Response(
          `<div class="hint error">Missing parameters</div>`,
          {
            status: 400,
            headers: { "Content-Type": "text/html" },
          }
        );
      }

      const problemId = parseInt(problemIdStr);
      const level = parseInt(levelStr);

      const hint = await lessonService.getHint(problemId, level);

      if (hint) {
        return new Response(
          `<div class="hint">
            <strong>Hint ${level}:</strong> ${hint}
          </div>`,
          {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }
        );
      } else {
        return new Response(
          `<div class="hint">No more hints available.</div>`,
          {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }
        );
      }
    } catch (error) {
      console.error("Hint error:", error);
      return new Response(
        `<div class="hint error">Error loading hint</div>`,
        {
          status: 500,
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  },
};
