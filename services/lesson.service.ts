// Lesson service - Business logic for lessons

import { query, queryOne, execute, incrementViewCount } from "../db/database.ts";
import type {
  Lesson,
  LessonCategory,
  LessonSection,
  PracticeProblem,
  DifficultyLevel,
} from "../models/lesson.ts";

export class LessonService {
  /**
   * Get all lesson categories
   */
  async getAllCategories(): Promise<LessonCategory[]> {
    return query<LessonCategory>(
      `SELECT * FROM lesson_categories ORDER BY sort_order ASC`
    );
  }

  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string): Promise<LessonCategory | null> {
    return queryOne<LessonCategory>(
      `SELECT * FROM lesson_categories WHERE slug = ?`,
      [slug]
    );
  }

  /**
   * Get lessons by category
   */
  async getLessonsByCategory(
    categoryId: number,
    publishedOnly = true
  ): Promise<Lesson[]> {
    const sql = publishedOnly
      ? `SELECT * FROM lessons WHERE category_id = ? AND is_published = 1 ORDER BY sort_order ASC`
      : `SELECT * FROM lessons WHERE category_id = ? ORDER BY sort_order ASC`;

    return query<Lesson>(sql, [categoryId]);
  }

  /**
   * Get a lesson by slug
   */
  async getLessonBySlug(
    categorySlug: string,
    lessonSlug: string
  ): Promise<Lesson | null> {
    const lesson = queryOne<Lesson>(
      `SELECT l.*, c.name as category_name
       FROM lessons l
       JOIN lesson_categories c ON l.category_id = c.id
       WHERE c.slug = ? AND l.slug = ? AND l.is_published = 1`,
      [categorySlug, lessonSlug]
    );

    if (lesson) {
      // Increment view count
      incrementViewCount("lessons", lesson.id);
    }

    return lesson;
  }

  /**
   * Get lesson sections by lesson ID and difficulty
   */
  async getLessonSections(
    lessonId: number,
    difficulty?: DifficultyLevel
  ): Promise<LessonSection[]> {
    let sql = `SELECT * FROM lesson_sections WHERE lesson_id = ?`;
    const params: unknown[] = [lessonId];

    if (difficulty) {
      sql += ` AND difficulty_level = ?`;
      params.push(difficulty);
    }

    sql += ` ORDER BY sort_order ASC`;

    return query<LessonSection>(sql, params);
  }

  /**
   * Get practice problems for a lesson
   */
  async getPracticeProblems(
    lessonId: number,
    difficulty?: DifficultyLevel
  ): Promise<PracticeProblem[]> {
    let sql = `SELECT * FROM practice_problems WHERE lesson_id = ?`;
    const params: unknown[] = [lessonId];

    if (difficulty) {
      sql += ` AND difficulty_level = ?`;
      params.push(difficulty);
    }

    sql += ` ORDER BY sort_order ASC`;

    return query<PracticeProblem>(sql, params);
  }

  /**
   * Check if an answer is correct
   */
  async checkAnswer(
    problemId: number,
    userAnswer: string
  ): Promise<{ correct: boolean; explanation?: string }> {
    const problem = queryOne<PracticeProblem>(
      `SELECT answer, explanation FROM practice_problems WHERE id = ?`,
      [problemId]
    );

    if (!problem) {
      throw new Error("Problem not found");
    }

    // Parse the stored answer
    const correctAnswer = JSON.parse(problem.answer);

    // Compare answers based on problem type
    const correct = this.compareAnswers(correctAnswer, userAnswer);

    return {
      correct,
      explanation: correct ? problem.explanation : undefined,
    };
  }

  /**
   * Compare user answer with correct answer
   */
  private compareAnswers(correct: unknown, user: string): boolean {
    if (typeof correct === "number") {
      // Numeric answer - allow small floating point differences
      const userNum = parseFloat(user);
      return Math.abs(userNum - correct) < 0.001;
    }

    if (typeof correct === "string") {
      // String answer - case insensitive comparison
      return correct.toLowerCase().trim() === user.toLowerCase().trim();
    }

    if (Array.isArray(correct)) {
      // Multiple choice - check if user answer is in array
      return correct.some((ans) =>
        String(ans).toLowerCase() === user.toLowerCase()
      );
    }

    return false;
  }

  /**
   * Get a hint for a problem
   */
  async getHint(problemId: number, level: number): Promise<string | null> {
    const problem = queryOne<PracticeProblem>(
      `SELECT hints FROM practice_problems WHERE id = ?`,
      [problemId]
    );

    if (!problem || !problem.hints) {
      return null;
    }

    const hints = JSON.parse(problem.hints) as string[];
    return hints[level - 1] ?? null;
  }

  /**
   * Search lessons
   */
  async searchLessons(query: string, limit = 10): Promise<Lesson[]> {
    return query<Lesson>(
      `SELECT l.*, c.name as category_name
       FROM lessons l
       JOIN lesson_categories c ON l.category_id = c.id
       WHERE (l.title LIKE ? OR l.description LIKE ?)
         AND l.is_published = 1
       ORDER BY l.view_count DESC
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, limit]
    );
  }

  /**
   * Get recent lessons
   */
  async getRecentLessons(limit = 5): Promise<Lesson[]> {
    return query<Lesson>(
      `SELECT l.*, c.name as category_name
       FROM lessons l
       JOIN lesson_categories c ON l.category_id = c.id
       WHERE l.is_published = 1
       ORDER BY l.created_at DESC
       LIMIT ?`,
      [limit]
    );
  }

  /**
   * Get popular lessons
   */
  async getPopularLessons(limit = 5): Promise<Lesson[]> {
    return query<Lesson>(
      `SELECT l.*, c.name as category_name
       FROM lessons l
       JOIN lesson_categories c ON l.category_id = c.id
       WHERE l.is_published = 1
       ORDER BY l.view_count DESC
       LIMIT ?`,
      [limit]
    );
  }
}

// Export singleton instance
export const lessonService = new LessonService();
