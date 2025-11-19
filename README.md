# Maths Wizards

An educational website focused on helping people level up their math skills with practical applications, including TI calculator programming.

## Features

- **Interactive Lessons** with toggleable difficulty levels
- **Practice Problems** with instant feedback
- **Code Playgrounds** for TI-Basic and Assembly
- **Quizzes and Assessments**
- **Blog System** powered by Markdown
- **Email List** signup
- **FAQ Page**

## Tech Stack

- **Frontend**: HTMX + Pico CSS
- **Backend**: Deno with Fresh framework
- **Database**: SQLite
- **Deployment**: Docker (planned)

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) 1.40.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/maths-wizards.git
cd maths-wizards
```

2. Set up the database:
```bash
deno task migrate
deno task seed
```

3. Start the development server:
```bash
deno task start
```

4. Open your browser to `http://localhost:8000`

## Available Commands

- `deno task start` - Start development server with hot reload
- `deno task migrate` - Run database migrations
- `deno task seed` - Seed database with sample data
- `deno task build` - Build for production
- `deno task preview` - Preview production build
- `deno task check` - Run linter and type checker
- `deno task test` - Run tests

## Project Structure

```
maths-wizards/
├── routes/          # Fresh routes (pages and API endpoints)
├── components/      # Reusable UI components
├── islands/         # Interactive Fresh islands
├── services/        # Business logic
├── models/          # TypeScript types/interfaces
├── db/              # Database schema and migrations
├── static/          # Static assets (CSS, JS, images)
├── content/         # Content files (lessons, blog posts)
├── scripts/         # Utility scripts
├── docs/            # Documentation
└── tests/           # Test files
```

## Documentation

See the [docs/](./docs/) directory for comprehensive documentation:

- [Technical Plan](./docs/technical-plan.md)
- [Database Schema](./docs/database-schema.md)
- [Architecture](./docs/architecture.md)
- [Development Guide](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)

## Development

### Creating New Lessons

Lessons are stored as JSON files in `content/lessons/[category]/`.  See existing examples for the structure.

### Writing Blog Posts

Blog posts are Markdown files in `content/blog/`. Add frontmatter for metadata:

```markdown
---
title: Your Post Title
author: Your Name
date: 2024-01-15
tags: [tag1, tag2]
---

Your content here...
```

### Database Changes

1. Update `db/schema.sql`
2. Run `deno task migrate`

## Phase 1 Status ✅

Phase 1 (Foundation Setup) is **complete**:

- [x] Fresh project initialized
- [x] Database schema created
- [x] Migration and seed scripts working
- [x] Configuration files set up
- [x] Static assets (Pico CSS, HTMX) integrated
- [x] Development server running

## Phase 2 Status ✅

Phase 2 (Core Backend) is **complete**:

- [x] TypeScript models and type definitions
- [x] Database connection wrapper
- [x] LessonService, BlogService, EmailService, QuizService, FAQService
- [x] API routes for HTMX interactions
- [x] All services tested and working

## Phase 3 Status ✅

Phase 3 (Frontend & HTMX) is **complete**:

- [x] Lesson category pages
- [x] Lesson detail pages with sections
- [x] Difficulty toggle with HTMX
- [x] Practice problems with instant feedback
- [x] Blog post pages with markdown rendering
- [x] Reusable Header and Footer components
- [x] Enhanced CSS styling
- [x] All routes tested and working

## Phase 4 Status ✅

Phase 4 (Interactive Features) is **complete**:

- [x] CodeEditor island component with syntax validation
- [x] Code playground for TI-Basic with syntax checking
- [x] Code playground for Assembly (Z80) with instruction validation
- [x] Quiz island component with question navigation
- [x] Quiz submission and scoring API
- [x] Playground page at `/playground`
- [x] All interactive features tested and working

## Phase 5 Status ✅

Phase 5 (Content & Polish) is **complete**:

- [x] 3 comprehensive blog posts (TI-Basic, Calculator Programming, Z80 Assembly)
- [x] 5 new lessons across multiple categories
- [x] 17 lesson sections with explanations and examples
- [x] 15 new FAQ items (20 total)
- [x] 6 practice problems with hints
- [x] Google AdSense integration with documentation
- [x] All content tested and rendering correctly

## Next Steps

### Phase 5: Content & Polish
- Add lesson content
- Write blog posts
- Populate FAQ
- Google AdSense integration

### Phase 6: Deployment
- Docker configuration
- Production deployment
- Domain setup
- SSL certificate

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `deno task check` and `deno task test`
4. Submit a pull request

## License

[Add license information]

## Contact

[Add contact information]
