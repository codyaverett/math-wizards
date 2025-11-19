# Development Guide

## Getting Started

### Prerequisites

- Deno 1.40.0 or later
- Git
- Code editor (VS Code recommended)

### Installation

1. **Install Deno**
   ```bash
   # macOS/Linux
   curl -fsSL https://deno.land/install.sh | sh

   # Windows (PowerShell)
   irm https://deno.land/install.ps1 | iex
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maths-wizards.git
   cd maths-wizards
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   ```

4. **Initialize database**
   ```bash
   deno task migrate
   deno task seed
   ```

5. **Start development server**
   ```bash
   deno task dev
   ```

6. **Open browser**
   ```
   http://localhost:8000
   ```

## Project Configuration

### deno.json

```json
{
  "lock": true,
  "tasks": {
    "check": "deno fmt --check && deno lint && deno check **/*.ts",
    "dev": "deno run --watch=static/,routes/ --allow-all dev.ts",
    "build": "deno run -A dev.ts build",
    "start": "deno run --allow-all main.ts",
    "migrate": "deno run --allow-all scripts/migrate.ts",
    "seed": "deno run --allow-all scripts/seed.ts",
    "test": "deno test --allow-all",
    "test:watch": "deno test --watch --allow-all"
  },
  "imports": {
    "$fresh/": "https://deno.land/x/fresh@1.6.1/",
    "preact": "https://esm.sh/preact@10.19.2",
    "preact/": "https://esm.sh/preact@10.19.2/",
    "@preact/signals": "https://esm.sh/*@preact/signals@1.2.1",
    "@preact/signals-core": "https://esm.sh/@preact/signals-core@1.5.0",
    "$std/": "https://deno.land/std@0.208.0/",
    "sqlite": "https://deno.land/x/sqlite@v3.8/mod.ts",
    "markdown-it": "https://esm.sh/markdown-it@14.0.0",
    "highlight.js": "https://esm.sh/highlight.js@11.9.0",
    "zod": "https://deno.land/x/zod@v3.22.4/mod.ts"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

## Development Workflow

### 1. Create a New Feature Branch

```bash
git checkout -b feature/lesson-system
```

### 2. Make Changes

Follow the project structure:
- Routes in `src/routes/`
- Services in `src/services/`
- Components in `src/components/`
- Types in `src/models/`

### 3. Test Your Changes

```bash
# Run tests
deno task test

# Run linter
deno lint

# Format code
deno fmt

# Type check
deno check src/main.ts
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add lesson difficulty toggle"
```

### 5. Push and Create PR

```bash
git push origin feature/lesson-system
```

## Code Style Guide

### TypeScript

```typescript
// Use explicit types
function getLessonById(id: number): Promise<Lesson | null> {
  // ...
}

// Use interfaces for objects
interface Lesson {
  id: number;
  title: string;
  slug: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Use const for immutable values
const MAX_RESULTS = 10;

// Use async/await over promises
async function fetchData() {
  const data = await fetch("/api/data");
  return data.json();
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `LessonCard.tsx`)
- Services: `kebab-case.service.ts` (e.g., `lesson.service.ts`)
- Types: `kebab-case.ts` (e.g., `lesson.ts`)
- Routes: `kebab-case.tsx` or `[param].tsx`

### Import Order

```typescript
// 1. Deno/Fresh imports
import { Handlers } from "$fresh/server.ts";

// 2. Third-party imports
import { z } from "zod";

// 3. Local imports
import { LessonService } from "../services/lesson.service.ts";
import type { Lesson } from "../models/lesson.ts";
```

## Database Development

### Creating Migrations

```typescript
// scripts/migrations/001_add_difficulty_field.ts
import { DB } from "sqlite";

export function up(db: DB) {
  db.execute(`
    ALTER TABLE lessons
    ADD COLUMN difficulty_level TEXT
    CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced'))
  `);
}

export function down(db: DB) {
  // SQLite doesn't support DROP COLUMN easily
  // Document the rollback process
}
```

### Running Migrations

```bash
deno task migrate
```

### Seeding Data

```typescript
// scripts/seed.ts
import { DB } from "sqlite";

const db = new DB("./data/maths-wizards.db");

// Insert categories
db.query(`
  INSERT INTO lesson_categories (name, slug, description) VALUES
  ('Basic Mathematics', 'basic-math', 'Fundamental math concepts'),
  ('TI Calculator Functions', 'ti-calculators', 'Learn TI calculator features')
`);

// Insert lessons
db.query(`
  INSERT INTO lessons (category_id, title, slug, content, is_published) VALUES
  (1, 'Algebra Basics', 'algebra-basics', '{}', 1)
`);

db.close();
```

## Testing

### Unit Tests

```typescript
// services/lesson.service.test.ts
import { assertEquals } from "$std/assert/mod.ts";
import { LessonService } from "./lesson.service.ts";

Deno.test("LessonService - get lesson by slug", async () => {
  const service = new LessonService(testDb);
  const lesson = await service.getLessonBySlug("basic-math", "algebra-basics");

  assertEquals(lesson?.title, "Algebra Basics");
});

Deno.test("LessonService - check correct answer", async () => {
  const service = new LessonService(testDb);
  const result = await service.checkAnswer(1, "42");

  assertEquals(result.correct, true);
});
```

### Integration Tests

```typescript
// routes/api/lessons.test.ts
import { assertExists } from "$std/assert/mod.ts";

Deno.test("GET /api/lessons/content returns HTML", async () => {
  const response = await fetch("http://localhost:8000/api/lessons/content?id=1");
  const html = await response.text();

  assertExists(html);
  assertEquals(response.headers.get("content-type"), "text/html");
});
```

### Running Tests

```bash
# Run all tests
deno task test

# Run specific test file
deno test src/services/lesson.service.test.ts

# Watch mode
deno task test:watch

# Coverage
deno test --coverage=coverage/
deno coverage coverage/
```

## Creating Components

### Fresh Island (Interactive)

```tsx
// islands/DifficultyToggle.tsx
import { useState } from "preact/hooks";

interface Props {
  lessonId: number;
  initialLevel: string;
}

export default function DifficultyToggle({ lessonId, initialLevel }: Props) {
  const [level, setLevel] = useState(initialLevel);

  return (
    <div class="difficulty-toggle">
      {["beginner", "intermediate", "advanced"].map((l) => (
        <button
          key={l}
          class={level === l ? "active" : ""}
          hx-get={`/api/lessons/content?id=${lessonId}&level=${l}`}
          hx-target="#lesson-body"
          onClick={() => setLevel(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
```

### Static Component

```tsx
// components/LessonCard.tsx
interface Props {
  lesson: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
  };
}

export function LessonCard({ lesson }: Props) {
  return (
    <article class="lesson-card">
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <span class="badge">{lesson.difficulty}</span>
      <a href={`/lessons/${lesson.id}`}>Start Lesson</a>
    </article>
  );
}
```

## Creating Routes

### Page Route

```tsx
// routes/lessons/[category]/[slug].tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { LessonService } from "../../../services/lesson.service.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { category, slug } = ctx.params;
    const service = new LessonService(db);
    const lesson = await service.getLessonBySlug(category, slug);

    if (!lesson) {
      return new Response("Not found", { status: 404 });
    }

    return ctx.render({ lesson });
  },
};

export default function LessonPage({ data }: PageProps) {
  return (
    <div class="lesson-page">
      <h1>{data.lesson.title}</h1>
      <div id="lesson-body">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### API Route

```typescript
// routes/api/lessons/check-answer.ts
import { Handlers } from "$fresh/server.ts";
import { LessonService } from "../../../services/lesson.service.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const problemId = parseInt(form.get("problem_id") as string);
    const answer = form.get("answer") as string;

    const service = new LessonService(db);
    const result = await service.checkAnswer(problemId, answer);

    // Return HTML fragment for HTMX
    const html = result.correct
      ? `<div class="feedback success">✓ Correct! ${result.explanation}</div>`
      : `<div class="feedback error">✗ Try again</div>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  },
};
```

## Working with HTMX

### Basic Pattern

```html
<!-- Trigger -->
<button
  hx-post="/api/submit"
  hx-target="#result"
  hx-swap="innerHTML">
  Submit
</button>

<!-- Target -->
<div id="result"></div>
```

### With Form Data

```html
<form hx-post="/api/lessons/answer">
  <input type="hidden" name="problem_id" value="42">
  <input type="text" name="answer">
  <button type="submit">Check</button>
</form>

<div id="feedback"></div>
```

### With Loading States

```html
<button
  hx-post="/api/process"
  hx-target="#result"
  hx-indicator="#spinner">
  Process
</button>

<div id="spinner" class="htmx-indicator">
  Loading...
</div>
```

## Creating Content

### Lesson Content (JSON)

```json
// content/lessons/basic-math/algebra-basics.json
{
  "id": "algebra-basics",
  "title": "Algebra Basics",
  "description": "Introduction to algebraic concepts",
  "sections": [
    {
      "type": "text",
      "difficulty": "beginner",
      "content": "Algebra is about finding unknown values..."
    },
    {
      "type": "example",
      "difficulty": "beginner",
      "content": "Solve for x: 2x + 5 = 13"
    },
    {
      "type": "practice",
      "difficulty": "beginner",
      "problems": [
        {
          "question": "Solve: 3x + 2 = 11",
          "answer": "3",
          "explanation": "x = (11 - 2) / 3 = 3"
        }
      ]
    }
  ]
}
```

### Blog Post (Markdown)

```markdown
---
title: Getting Started with TI-Basic
author: Math Wizard
date: 2024-01-15
tags: [ti-basic, programming, tutorial]
excerpt: Learn the fundamentals of TI-Basic programming
---

# Getting Started with TI-Basic

TI-Basic is the built-in programming language for TI graphing calculators.

## Your First Program

```ti-basic
:Disp "HELLO WORLD"
:Pause
```

This program displays "HELLO WORLD" on the screen.

## Variables

TI-Basic supports several types of variables:

- Real numbers (A-Z, θ)
- Lists (L1-L6)
- Strings (Str1-Str10)

...
```

## Debugging

### Enable Debug Logging

```typescript
// config.ts
export const DEBUG = Deno.env.get("DEBUG") === "true";

// Usage
if (DEBUG) {
  console.log("Debug info:", data);
}
```

### Database Queries

```typescript
// Enable SQL logging
db.execute("PRAGMA foreign_keys = ON");

// Log queries in development
if (DEBUG) {
  console.log("SQL:", query, params);
}
```

### HTMX Debugging

Add to HTML:

```html
<script>
  // Log all HTMX events
  document.body.addEventListener('htmx:afterRequest', function(evt) {
    console.log('HTMX request:', evt.detail);
  });
</script>
```

## Performance Tips

1. **Use database indexes** for frequently queried columns
2. **Cache static content** (lessons, blog posts)
3. **Lazy load** code editors
4. **Minimize database queries** in loops
5. **Use HTMX** to avoid full page reloads

## Common Issues

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Database Locked

```bash
# Close all database connections
# Restart dev server
deno task dev
```

### Module Not Found

```bash
# Clear cache and reload
rm -rf ~/.cache/deno
deno cache --reload src/main.ts
```

## VS Code Setup

### Recommended Extensions

- Deno (official)
- Tailwind CSS IntelliSense
- SQLite Viewer
- GitLens

### Settings

```json
{
  "deno.enable": true,
  "deno.lint": true,
  "deno.unstable": false,
  "editor.defaultFormatter": "denoland.vscode-deno",
  "editor.formatOnSave": true
}
```

## Resources

- [Fresh Documentation](https://fresh.deno.dev)
- [Deno Manual](https://deno.land/manual)
- [HTMX Documentation](https://htmx.org/docs/)
- [Pico CSS](https://picocss.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
