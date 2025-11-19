// Quiz service - Business logic for quizzes

import { query, queryOne } from "../db/database.ts";
import type { Quiz, QuizQuestion } from "../models/lesson.ts";

export class QuizService {
  /**
   * Get a quiz by ID
   */
  async getQuizById(quizId: number): Promise<Quiz | null> {
    const quiz = queryOne<Quiz>(
      `SELECT * FROM quizzes WHERE id = ? AND is_published = 1`,
      [quizId]
    );

    if (!quiz) {
      return null;
    }

    // Get questions
    quiz.questions = await this.getQuizQuestions(quizId);

    return quiz;
  }

  /**
   * Get quizzes by lesson ID
   */
  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    return query<Quiz>(
      `SELECT * FROM quizzes WHERE lesson_id = ? AND is_published = 1`,
      [lessonId]
    );
  }

  /**
   * Get quiz questions
   */
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return query<QuizQuestion>(
      `SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY sort_order ASC`,
      [quizId]
    );
  }

  /**
   * Get a single question
   */
  async getQuestion(questionId: number): Promise<QuizQuestion | null> {
    return queryOne<QuizQuestion>(
      `SELECT * FROM quiz_questions WHERE id = ?`,
      [questionId]
    );
  }

  /**
   * Check if an answer is correct
   */
  async checkAnswer(
    questionId: number,
    userAnswer: string
  ): Promise<{ correct: boolean; explanation?: string; points: number }> {
    const question = await this.getQuestion(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const correct = this.compareAnswers(
      question.question_type,
      question.correct_answer,
      userAnswer,
      question.options
    );

    return {
      correct,
      explanation: correct ? question.explanation : undefined,
      points: correct ? question.points : 0,
    };
  }

  /**
   * Compare user answer with correct answer based on question type
   */
  private compareAnswers(
    questionType: string,
    correctAnswer: string,
    userAnswer: string,
    options?: string
  ): boolean {
    switch (questionType) {
      case "multiple_choice": {
        // Parse options and find the correct one
        return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
      }

      case "true_false": {
        return correctAnswer.toLowerCase() === userAnswer.toLowerCase();
      }

      case "numeric": {
        const correct = parseFloat(correctAnswer);
        const user = parseFloat(userAnswer);
        return Math.abs(correct - user) < 0.001;
      }

      case "code": {
        // For code questions, exact match (trimmed)
        return correctAnswer.trim() === userAnswer.trim();
      }

      default:
        return false;
    }
  }

  /**
   * Calculate quiz score
   */
  async calculateScore(
    quizId: number,
    answers: Record<number, string>
  ): Promise<{
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    results: Array<{ questionId: number; correct: boolean; points: number }>;
  }> {
    const quiz = await this.getQuizById(quizId);

    if (!quiz || !quiz.questions) {
      throw new Error("Quiz not found");
    }

    let score = 0;
    let totalPoints = 0;
    const results: Array<{ questionId: number; correct: boolean; points: number }> = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;

      const userAnswer = answers[question.id];
      if (userAnswer !== undefined) {
        const result = await this.checkAnswer(question.id, userAnswer);
        score += result.points;
        results.push({
          questionId: question.id,
          correct: result.correct,
          points: result.points,
        });
      } else {
        results.push({
          questionId: question.id,
          correct: false,
          points: 0,
        });
      }
    }

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= quiz.passing_score;

    return {
      score,
      totalPoints,
      percentage,
      passed,
      results,
    };
  }
}

// Export singleton instance
export const quizService = new QuizService();
