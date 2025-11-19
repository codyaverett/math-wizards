// API route for checking practice problem answers

import { Handlers } from "$fresh/server.ts";
import { lessonService } from "../../../services/lesson.service.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const formData = await req.formData();
      const problemIdStr = formData.get("problem_id")?.toString();
      const answer = formData.get("answer")?.toString();

      if (!problemIdStr || !answer) {
        return new Response(
          `<div class="feedback error">
            <p>✗ Missing required fields.</p>
          </div>`,
          {
            status: 400,
            headers: { "Content-Type": "text/html" },
          }
        );
      }

      const problemId = parseInt(problemIdStr);
      const result = await lessonService.checkAnswer(problemId, answer);

      if (result.correct) {
        return new Response(
          `<div class="feedback success">
            <p>✓ Correct!</p>
            ${result.explanation ? `<p>${result.explanation}</p>` : ""}
          </div>`,
          {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }
        );
      } else {
        return new Response(
          `<div class="feedback error">
            <p>✗ Try again!</p>
          </div>`,
          {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }
        );
      }
    } catch (error) {
      console.error("Check answer error:", error);
      return new Response(
        `<div class="feedback error">
          <p>✗ An error occurred checking your answer.</p>
        </div>`,
        {
          status: 500,
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  },
};
