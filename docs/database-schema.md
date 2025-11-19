# Database Schema

## Overview

SQLite database schema for Maths Wizards application.

## Tables

### lesson_categories

Stores lesson category information.

```sql
CREATE TABLE lesson_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `name`: Display name (e.g., "Basic Mathematics")
- `slug`: URL-friendly identifier (e.g., "basic-math")
- `description`: Category description
- `icon`: Icon identifier or emoji
- `sort_order`: Display order
- `created_at`: Timestamp

### lessons

Stores individual lesson content.

```sql
CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER,
    prerequisites TEXT,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES lesson_categories(id)
);
```

**Fields:**
- `id`: Primary key
- `category_id`: Reference to lesson_categories
- `title`: Lesson title
- `slug`: URL-friendly identifier
- `description`: Short description
- `content`: JSON structure containing lesson data
- `difficulty_level`: Minimum difficulty (beginner/intermediate/advanced)
- `estimated_time`: Time in minutes
- `prerequisites`: JSON array of lesson IDs
- `sort_order`: Display order within category
- `view_count`: Number of views
- `is_published`: Published status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### lesson_sections

Stores toggleable sections within lessons (different difficulty levels and explanation depths).

```sql
CREATE TABLE lesson_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    section_type TEXT CHECK(section_type IN ('text', 'video', 'explanation', 'example', 'practice')),
    title TEXT,
    content TEXT NOT NULL,
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Primary key
- `lesson_id`: Reference to lessons
- `section_type`: Type of section
- `title`: Section title
- `content`: Section content (text, HTML, or JSON)
- `difficulty_level`: Which difficulty this section appears in
- `sort_order`: Display order

### practice_problems

Stores practice problems for lessons.

```sql
CREATE TABLE practice_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    problem_type TEXT CHECK(problem_type IN ('multiple_choice', 'code', 'numeric', 'text')),
    answer TEXT NOT NULL,
    hints TEXT,
    explanation TEXT,
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    points INTEGER DEFAULT 10,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Primary key
- `lesson_id`: Reference to lessons
- `question`: Problem text
- `problem_type`: Type of problem
- `answer`: JSON structure with correct answer(s)
- `hints`: JSON array of progressive hints
- `explanation`: Explanation of solution
- `difficulty_level`: Problem difficulty
- `points`: Point value
- `sort_order`: Display order

### quizzes

Stores quiz metadata.

```sql
CREATE TABLE quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER,
    passing_score INTEGER DEFAULT 70,
    is_published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `lesson_id`: Optional reference to lessons
- `title`: Quiz title
- `description`: Quiz description
- `time_limit`: Time limit in minutes (optional)
- `passing_score`: Passing percentage
- `is_published`: Published status
- `created_at`: Creation timestamp

### quiz_questions

Stores quiz questions.

```sql
CREATE TABLE quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT CHECK(question_type IN ('multiple_choice', 'true_false', 'code', 'numeric')),
    options TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Primary key
- `quiz_id`: Reference to quizzes
- `question`: Question text
- `question_type`: Type of question
- `options`: JSON array for multiple choice
- `correct_answer`: Correct answer
- `explanation`: Answer explanation
- `points`: Point value
- `sort_order`: Display order

### code_playgrounds

Stores code playground templates and solutions.

```sql
CREATE TABLE code_playgrounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    language TEXT CHECK(language IN ('ti-basic', 'assembly')),
    starter_code TEXT,
    solution_code TEXT,
    test_cases TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `lesson_id`: Optional reference to lessons
- `language`: Programming language
- `starter_code`: Initial code template
- `solution_code`: Solution code (optional)
- `test_cases`: JSON array of test cases
- `created_at`: Creation timestamp

### blog_posts

Stores blog posts.

```sql
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    author TEXT,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    tags TEXT,
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `title`: Post title
- `slug`: URL-friendly identifier
- `author`: Author name
- `excerpt`: Short excerpt
- `content`: Markdown content
- `featured_image`: Image URL
- `tags`: JSON array of tags
- `view_count`: Number of views
- `is_published`: Published status
- `published_at`: Publication timestamp
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### email_subscribers

Stores email list subscribers.

```sql
CREATE TABLE email_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    is_verified BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME
);
```

**Fields:**
- `id`: Primary key
- `email`: Email address (unique)
- `name`: Subscriber name (optional)
- `is_verified`: Email verification status
- `is_active`: Active subscription status
- `subscribed_at`: Subscription timestamp
- `unsubscribed_at`: Unsubscription timestamp (if applicable)

### user_questions

Stores user-submitted questions.

```sql
CREATE TABLE user_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    lesson_id INTEGER,
    question TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'answered', 'archived')) DEFAULT 'pending',
    admin_response TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    answered_at DATETIME,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

**Fields:**
- `id`: Primary key
- `name`: Questioner name (optional)
- `email`: Questioner email (optional)
- `lesson_id`: Related lesson (optional)
- `question`: Question text
- `status`: Question status
- `admin_response`: Response from admin
- `ip_address`: IP for spam prevention
- `created_at`: Creation timestamp
- `answered_at`: Answer timestamp

### faq_items

Stores FAQ items.

```sql
CREATE TABLE faq_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `question`: FAQ question
- `answer`: FAQ answer
- `category`: Category for grouping
- `sort_order`: Display order
- `is_published`: Published status
- `view_count`: Number of views
- `created_at`: Creation timestamp

### user_progress

Tracks user progress through lessons (session-based, no auth required).

```sql
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed_sections TEXT,
    quiz_scores TEXT,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

**Fields:**
- `id`: Primary key
- `session_id`: Browser session identifier
- `lesson_id`: Reference to lessons
- `completed_sections`: JSON array of completed section IDs
- `quiz_scores`: JSON object with quiz results
- `last_accessed`: Last access timestamp

### page_views

Stores analytics data.

```sql
CREATE TABLE page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_type TEXT,
    page_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `page_type`: Type of page ('lesson', 'blog', 'home', etc.)
- `page_id`: ID of the page (if applicable)
- `ip_address`: Visitor IP
- `user_agent`: Browser user agent
- `referrer`: Referrer URL
- `viewed_at`: View timestamp

## Indexes

Performance indexes for common queries:

```sql
CREATE INDEX idx_lessons_category ON lessons(category_id);
CREATE INDEX idx_lessons_slug ON lessons(slug);
CREATE INDEX idx_lessons_published ON lessons(is_published);
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_published ON blog_posts(is_published);
CREATE INDEX idx_email_active ON email_subscribers(is_active);
CREATE INDEX idx_questions_status ON user_questions(status);
CREATE INDEX idx_progress_session ON user_progress(session_id);
```
