# Architecture Overview

## System Architecture

Maths Wizards follows a modern, server-side rendered architecture with progressive enhancement via HTMX.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  HTML + Pico CSS + HTMX                          │  │
│  │  ┌────────────┐  ┌──────────────┐               │  │
│  │  │ CodeMirror │  │ Minimal JS   │               │  │
│  │  └────────────┘  └──────────────┘               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/HTMX
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Fresh (Deno) Server                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Routes Layer                        │  │
│  │  ┌────────┐  ┌──────┐  ┌─────┐  ┌──────────┐   │  │
│  │  │Lessons │  │ Blog │  │ API │  │   FAQ    │   │  │
│  │  └────────┘  └──────┘  └─────┘  └──────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Services Layer                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │ Lessons  │  │   Blog   │  │  Code Exec   │  │  │
│  │  └──────────┘  └──────────┘  └──────────────┘  │  │
│  │  ┌──────────┐  ┌──────────┐                    │  │
│  │  │  Email   │  │  Quiz    │                    │  │
│  │  └──────────┘  └──────────┘                    │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Database Layer                         │  │
│  │              (SQLite)                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ File System
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Content Files                              │
│  ┌──────────────┐  ┌──────────────────────────────┐   │
│  │ Lessons JSON │  │   Blog Markdown Files        │   │
│  └──────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
maths-wizards/
├── deno.json                 # Deno configuration & dependencies
├── deno.lock                 # Dependency lock file
├── docker-compose.yml        # Docker orchestration
├── Dockerfile               # Container definition
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
│
├── src/
│   ├── main.ts             # Application entry point
│   ├── config.ts           # Configuration management
│   │
│   ├── routes/             # Fresh route handlers
│   │   ├── index.tsx       # Home page
│   │   ├── lessons/
│   │   │   ├── index.tsx   # Lesson listing
│   │   │   └── [category]/
│   │   │       └── [slug].tsx  # Individual lesson
│   │   ├── blog/
│   │   │   ├── index.tsx   # Blog listing
│   │   │   └── [slug].tsx  # Blog post
│   │   ├── faq.tsx         # FAQ page
│   │   └── api/            # API endpoints for HTMX
│   │       ├── lessons/
│   │       │   ├── toggle-difficulty.ts
│   │       │   └── submit-practice.ts
│   │       ├── quiz/
│   │       │   ├── submit.ts
│   │       │   └── check-answer.ts
│   │       ├── code/
│   │       │   └── execute.ts
│   │       ├── email/
│   │       │   └── subscribe.ts
│   │       └── questions/
│   │           └── submit.ts
│   │
│   ├── islands/            # Interactive Fresh islands
│   │   ├── CodeEditor.tsx  # Code playground
│   │   ├── QuizQuestion.tsx
│   │   └── DifficultyToggle.tsx
│   │
│   ├── components/         # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LessonCard.tsx
│   │   ├── BlogCard.tsx
│   │   └── AdUnit.tsx
│   │
│   ├── services/           # Business logic
│   │   ├── lesson.service.ts
│   │   ├── blog.service.ts
│   │   ├── email.service.ts
│   │   ├── question.service.ts
│   │   ├── quiz.service.ts
│   │   └── code-execution.service.ts
│   │
│   ├── db/                 # Database layer
│   │   ├── database.ts     # SQLite connection
│   │   ├── schema.sql      # Database schema
│   │   └── migrations/
│   │
│   ├── models/             # TypeScript types/interfaces
│   │   ├── lesson.ts
│   │   ├── blog.ts
│   │   ├── email.ts
│   │   ├── question.ts
│   │   └── quiz.ts
│   │
│   ├── static/             # Static assets
│   │   ├── css/
│   │   │   ├── pico.min.css
│   │   │   └── custom.css
│   │   ├── js/
│   │   │   ├── htmx.min.js
│   │   │   ├── codemirror/
│   │   │   └── main.js
│   │   └── images/
│   │
│   └── utils/              # Utility functions
│       ├── markdown.ts     # Markdown parser
│       ├── template.ts     # Template helpers
│       ├── validation.ts   # Input validation
│       └── sanitize.ts     # HTML sanitization
│
├── content/                # Content files
│   ├── lessons/           # Lesson content
│   │   ├── basic-math/
│   │   ├── ti-calculators/
│   │   ├── ti-basic/
│   │   └── assembly-ti/
│   └── blog/              # Blog posts
│       └── *.md
│
├── data/                  # SQLite database
│   └── maths-wizards.db
│
├── docs/                  # Documentation
│   ├── technical-plan.md
│   ├── database-schema.md
│   ├── architecture.md
│   ├── deployment.md
│   └── development.md
│
├── tests/                 # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/               # Utility scripts
    ├── migrate.ts
    ├── seed.ts
    └── deploy.ts
```

## Key Design Patterns

### 1. Island Architecture (Fresh)

Fresh uses an "island architecture" where:
- Most of the page is static HTML (fast, SEO-friendly)
- Interactive components are "islands" of interactivity
- Perfect for HTMX integration

```tsx
// routes/lessons/[category]/[slug].tsx
export default function LessonPage({ data }) {
  return (
    <div>
      {/* Static content */}
      <h1>{data.lesson.title}</h1>

      {/* Interactive island */}
      <DifficultyToggle lessonId={data.lesson.id} />

      {/* Static content */}
      <div>{data.lesson.description}</div>
    </div>
  );
}
```

### 2. HTMX Request/Response Pattern

```html
<!-- Client sends request -->
<button
  hx-get="/api/lessons/content?id=123&level=beginner"
  hx-target="#lesson-body"
  hx-swap="innerHTML">
  Beginner
</button>

<!-- Server returns HTML fragment -->
<div id="lesson-body">
  <h2>Beginner Level Content</h2>
  <p>...</p>
</div>
```

### 3. Service Layer Pattern

All business logic is encapsulated in services:

```typescript
// services/lesson.service.ts
export class LessonService {
  async getLessonBySlug(category: string, slug: string): Promise<Lesson> {
    // Database query logic
  }

  async checkAnswer(problemId: number, answer: string): Promise<Result> {
    // Answer validation logic
  }
}
```

### 4. Repository Pattern (Database Layer)

Database access is abstracted:

```typescript
// db/database.ts
export class Database {
  private db: DB;

  async query(sql: string, params: any[]): Promise<any[]> {
    return this.db.query(sql, params);
  }
}
```

## Data Flow

### Example: User Toggles Difficulty Level

1. **User clicks "Intermediate" button** (HTMX handles request)
   ```html
   <button hx-get="/api/lessons/toggle?id=123&level=intermediate">
   ```

2. **Request hits API route** (`routes/api/lessons/toggle-difficulty.ts`)
   ```typescript
   export const handler: Handlers = {
     async GET(req, ctx) {
       const url = new URL(req.url);
       const id = url.searchParams.get("id");
       const level = url.searchParams.get("level");

       const service = new LessonService(db);
       const sections = await service.getSectionsByLevel(id, level);

       return ctx.render({ sections });
     }
   };
   ```

3. **Service queries database**
   ```typescript
   async getSectionsByLevel(lessonId: number, level: string) {
     return this.db.query(
       "SELECT * FROM lesson_sections WHERE lesson_id = ? AND difficulty_level = ?",
       [lessonId, level]
     );
   }
   ```

4. **Server returns HTML fragment**
   ```html
   <div class="lesson-content">
     <!-- Intermediate level content -->
   </div>
   ```

5. **HTMX swaps content** (client-side, no page reload)

## Security Considerations

### 1. Code Execution Sandboxing

```typescript
// services/code-execution.service.ts
export async function executeTIBasic(code: string): Promise<Result> {
  // Time limits
  const timeout = 5000; // 5 seconds max

  // Input validation
  if (!isValidTIBasic(code)) {
    throw new Error("Invalid code");
  }

  // Execute in isolated subprocess
  const result = await runSandboxed(code, timeout);

  return result;
}
```

### 2. Input Validation

```typescript
// utils/validation.ts
import { z } from "zod";

export const EmailSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const QuestionSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().optional(),
  question: z.string().min(10).max(1000),
});
```

### 3. SQL Injection Prevention

Always use parameterized queries:

```typescript
// ✓ Good
db.query("SELECT * FROM lessons WHERE id = ?", [id]);

// ✗ Bad
db.query(`SELECT * FROM lessons WHERE id = ${id}`);
```

### 4. XSS Prevention

```typescript
// utils/sanitize.ts
import { sanitize } from "deno_sanitize";

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: ["p", "strong", "em", "code", "pre"],
    allowedAttributes: {},
  });
}
```

## Performance Optimization

### 1. Database Indexing

See `database-schema.md` for index definitions.

### 2. Static Asset Caching

```typescript
// Fresh automatically handles static asset caching
// Custom cache headers can be added:
return new Response(content, {
  headers: {
    "Cache-Control": "public, max-age=86400",
  },
});
```

### 3. Content Delivery

- Minified CSS/JS
- Compressed assets
- Lazy loading for code editors
- Progressive image loading

### 4. Database Query Optimization

- Use SELECT only needed columns
- Implement pagination
- Cache frequently accessed data
- Use database indexes effectively

## Scalability Considerations

### Current Capacity (SQLite)

- Handles 10,000+ concurrent readers
- 1 writer at a time (sufficient for content-heavy site)
- Database file size: grows with content

### Migration Path (if needed)

1. **PostgreSQL**: For higher write throughput
2. **Redis**: For session management and caching
3. **CDN**: For static asset delivery
4. **Load Balancer**: For horizontal scaling

### Monitoring

```typescript
// Implement health check endpoint
export const handler: Handlers = {
  GET() {
    return new Response(JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: db.isConnected(),
    }));
  },
};
```
