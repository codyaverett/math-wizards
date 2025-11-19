// Lesson-related type definitions

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type SectionType = "text" | "video" | "explanation" | "example" | "practice";
export type ProblemType = "multiple_choice" | "code" | "numeric" | "text";
export type QuestionType = "multiple_choice" | "true_false" | "code" | "numeric";

export interface LessonCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

export interface Lesson {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  description?: string;
  content: string; // JSON string
  difficulty_level?: DifficultyLevel;
  estimated_time?: number; // minutes
  prerequisites?: string; // JSON array of lesson IDs
  sort_order: number;
  view_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  category_name?: string;
  sections?: LessonSection[];
}

export interface LessonSection {
  id: number;
  lesson_id: number;
  section_type: SectionType;
  title?: string;
  content: string;
  difficulty_level?: DifficultyLevel;
  sort_order: number;
}

export interface PracticeProblem {
  id: number;
  lesson_id: number;
  question: string;
  problem_type: ProblemType;
  answer: string; // JSON structure
  hints?: string; // JSON array
  explanation?: string;
  difficulty_level?: DifficultyLevel;
  points: number;
  sort_order: number;
}

export interface Quiz {
  id: number;
  lesson_id?: number;
  title: string;
  description?: string;
  time_limit?: number; // minutes
  passing_score: number;
  is_published: boolean;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  question_type: QuestionType;
  options?: string; // JSON array for multiple choice
  correct_answer: string;
  explanation?: string;
  points: number;
  sort_order: number;
}

export interface CodePlayground {
  id: number;
  lesson_id?: number;
  language: "ti-basic" | "assembly";
  starter_code?: string;
  solution_code?: string;
  test_cases?: string; // JSON array
  created_at: string;
}

export interface UserProgress {
  id: number;
  session_id: string;
  lesson_id: number;
  completed_sections?: string; // JSON array
  quiz_scores?: string; // JSON object
  last_accessed: string;
}

// Helper types for parsing JSON fields
export interface ParsedAnswer {
  value: string | number;
  options?: string[]; // For multiple choice
}

export interface ParsedHint {
  level: number;
  text: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  description?: string;
}
