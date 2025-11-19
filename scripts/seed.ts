#!/usr/bin/env deno run --allow-read --allow-write

import { Database } from "sqlite";

const DB_PATH = "./data/maths-wizards.db";

console.log("Seeding database with sample data...");

const db = new Database(DB_PATH);

try {
  // Insert lesson categories
  console.log("Creating lesson categories...");
  db.exec(`
    INSERT OR IGNORE INTO lesson_categories (name, slug, description, icon, sort_order) VALUES
    ('Basic Mathematics', 'basic-math', 'Arithmetic, algebra, geometry, trigonometry, and calculus fundamentals', '📐', 1),
    ('TI Calculator Functions', 'ti-calculators', 'Learn to use TI calculator functions effectively', '🧮', 2),
    ('Mathematics for Programming', 'math-programming', 'Mathematical concepts as they relate to programming', '💡', 3),
    ('TI-Basic Programming', 'ti-basic', 'Program your TI calculator with TI-Basic', '💻', 4),
    ('Assembly for TI Calculators', 'assembly-ti', 'Low-level programming for TI calculators', '⚙️', 5),
    ('Making Games for TI Calculators', 'games-ti', 'Create games for TI calculators', '🎮', 6)
  `);

  // Insert sample lessons
  console.log("Creating sample lessons...");
  db.exec(`
    INSERT OR IGNORE INTO lessons (category_id, title, slug, description, content, difficulty_level, estimated_time, is_published, sort_order) VALUES
    (1, 'Introduction to Algebra', 'intro-algebra', 'Learn the fundamental concepts of algebra', '{}', 'beginner', 30, 1, 1),
    (1, 'Basic Arithmetic', 'basic-arithmetic', 'Master addition, subtraction, multiplication, and division', '{}', 'beginner', 20, 1, 0),
    (2, 'Using the TI-83 Plus', 'using-ti-83-plus', 'Get started with your TI-83 Plus calculator', '{}', 'beginner', 25, 1, 1),
    (4, 'Hello World in TI-Basic', 'hello-world-ti-basic', 'Your first TI-Basic program', '{}', 'beginner', 15, 1, 1)
  `);

  // Insert sample lesson sections
  console.log("Creating lesson sections...");
  db.exec(`
    INSERT OR IGNORE INTO lesson_sections (lesson_id, section_type, title, content, difficulty_level, sort_order) VALUES
    (1, 'text', 'What is Algebra?', '<p>Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities.</p>', 'beginner', 1),
    (1, 'explanation', 'Variables', '<p>In algebra, we use letters (usually x, y, z) to represent unknown values called variables.</p>', 'beginner', 2),
    (1, 'example', 'Simple Equation', '<p>Solve for x: 2x + 5 = 13</p><p>Solution: x = 4</p>', 'beginner', 3)
  `);

  // Insert FAQ items
  console.log("Creating FAQ items...");
  db.exec(`
    INSERT OR IGNORE INTO faq_items (question, answer, category, sort_order) VALUES
    ('What is Maths Wizards?', 'Maths Wizards is an educational platform focused on helping people improve their mathematics skills with practical applications, including TI calculator programming.', 'General', 1),
    ('Do I need a TI calculator to use this site?', 'No! While some lessons focus on TI calculators, we have many lessons on general mathematics that don''t require a calculator.', 'General', 2),
    ('Are the lessons free?', 'Yes, all lessons are completely free to access.', 'General', 3),
    ('What programming languages are covered?', 'We cover TI-Basic and Z80 Assembly for TI calculators.', 'Programming', 4),
    ('Can I submit questions?', 'Yes! Use the question form on any lesson page to ask for help.', 'Support', 5)
  `);

  // Insert sample blog post
  console.log("Creating sample blog post...");
  const samplePost = `# Welcome to Maths Wizards

We're excited to launch Maths Wizards, a new educational platform dedicated to helping you level up your mathematics skills.

## What We Offer

- **Interactive Lessons**: Learn at your own pace with lessons at multiple difficulty levels
- **TI Calculator Programming**: Master TI-Basic and Assembly programming
- **Practical Applications**: See how math concepts apply to real-world problems

## Getting Started

Browse our [lesson catalog](/lessons) to find topics that interest you. Each lesson includes:

- Clear explanations
- Practice problems
- Quizzes to test your knowledge

Happy learning!
`;

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO blog_posts (title, slug, author, excerpt, content, tags, is_published, published_at) VALUES
    (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  stmt.run(
    'Welcome to Maths Wizards',
    'welcome-to-maths-wizards',
    'Maths Wizards Team',
    'Learn mathematics, TI calculator programming, and practical applications.',
    samplePost,
    '["announcement", "getting-started"]',
    1
  );
  stmt.finalize();

  console.log("✓ Database seeded successfully");
  console.log("✓ Sample data created:");
  console.log("  - 6 lesson categories");
  console.log("  - 4 sample lessons");
  console.log("  - 3 lesson sections");
  console.log("  - 5 FAQ items");
  console.log("  - 1 blog post");
} catch (error) {
  console.error("Seeding failed:", error);
  Deno.exit(1);
} finally {
  db.close();
}
