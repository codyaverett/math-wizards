// API route for quiz submission

import { Handlers } from "$fresh/server.ts";
import { quizService } from "../../../../services/quiz.service.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const { id } = ctx.params;
      const quizId = parseInt(id);

      const { answers } = await req.json();

      if (!answers || typeof answers !== "object") {
        return Response.json({
          success: false,
          error: "Invalid answers format",
        }, { status: 400 });
      }

      const result = await quizService.calculateScore(quizId, answers);

      return Response.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      return Response.json({
        success: false,
        error: error.message || "Error calculating quiz score",
      }, { status: 500 });
    }
  },
};
