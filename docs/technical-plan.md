# Maths Wizards - Technical Plan

## Overview

Maths Wizards is an educational website focused on helping people level up their math skills with practical applications, particularly focused on TI calculator programming and mathematics fundamentals.

## Tech Stack

- **Frontend**: HTMX + Pico CSS (minimal CSS framework)
- **Backend**: Deno with Fresh framework
- **Database**: SQLite
- **Deployment**: Docker container
- **Content**: Markdown for blog posts, JSON for lessons

## Key Features

### 1. Interactive Lessons System
- Toggleable difficulty levels (beginner, intermediate, advanced)
- Toggleable explanation depth
- Practice problems with instant feedback
- Quizzes and assessments
- Code playgrounds/editors for TI-Basic and Assembly
- Text and video content support

### 2. Lesson Categories

1. **Basic Mathematics**
   - Arithmetic
   - Algebra
   - Geometry
   - Trigonometry
   - Calculus

2. **TI Calculator Functions**
   - Common functions and operations
   - Problem-solving techniques
   - Calculator tips and tricks

3. **Mathematics for Programming**
   - Binary/hexadecimal systems
   - Algorithms and complexity
   - Data structures math

4. **TI-Basic Programming**
   - Syntax and fundamentals
   - Program examples
   - Best practices

5. **Assembly for TI Calculators**
   - Z80 assembly basics
   - Hardware interaction
   - Optimization techniques

6. **Making Games for TI Calculators**
   - Game development fundamentals
   - Graphics and sprites
   - Input handling
   - Complete game examples

### 3. Blog System
- Markdown-based blog posts
- Syntax highlighting for code
- Tagging and categorization
- Post listing and individual views

### 4. User Interaction
- Email list signup (stored in SQLite)
- User question submission
- No authentication required initially

### 5. Additional Pages
- FAQ page
- About page
- Contact page

### 6. Ad Integration
- Google AdSense integration capability
- Strategic ad placement

## Architecture Decisions

### Why Fresh over Oak?

**Fresh Advantages:**
1. File-based routing - cleaner structure for content-heavy sites
2. Island Architecture - perfect for HTMX integration with minimal JS
3. Built-in SSR - better SEO for educational content
4. Preact integration - can use React components if needed
5. Zero config - faster development
6. TypeScript-first - better type safety
7. Automatic code splitting - better performance

### Why HTMX?

1. Minimal JavaScript footprint
2. HTML-driven interactivity
3. Perfect for server-side rendering
4. Excellent for progressive enhancement
5. Simple to learn and maintain

### Why Pico CSS?

1. Lightweight (~10KB)
2. Semantic HTML styling
3. Beautiful defaults
4. Minimal learning curve
5. Responsive out of the box

### Why SQLite?

1. Zero configuration
2. Serverless
3. Perfect for read-heavy workloads
4. Easy backups (single file)
5. Sufficient for thousands of concurrent users
6. Can migrate to PostgreSQL if needed

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Project setup and structure
- Database schema and migrations
- Basic routing structure
- Core services layer

### Phase 2: Lesson System (Week 2)
- Lesson listing and detail pages
- Difficulty toggle functionality
- Practice problem system
- Quiz system

### Phase 3: Code Playgrounds (Week 3)
- TI-Basic editor and execution
- Assembly editor and validation
- Syntax highlighting
- Security sandboxing

### Phase 4: Content & Blog (Week 4)
- Blog system implementation
- Markdown rendering
- Initial lesson content
- Sample blog posts

### Phase 5: Polish & Deploy (Week 5)
- FAQ page
- Email signup
- Ad integration
- Docker configuration
- Deployment

## Success Metrics

1. Page load time < 2 seconds
2. Lighthouse score > 90
3. Mobile-friendly (responsive design)
4. Zero security vulnerabilities
5. 100% type safety (TypeScript)
6. SEO optimized (meta tags, sitemap, robots.txt)
