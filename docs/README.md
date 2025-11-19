# Maths Wizards Documentation

Welcome to the Maths Wizards documentation. This directory contains comprehensive guides for developing, deploying, and maintaining the Maths Wizards educational website.

## Documentation Index

### 📋 [Technical Plan](./technical-plan.md)
Overview of the project, tech stack decisions, features, and implementation phases.

**Contents:**
- Project overview
- Tech stack rationale
- Key features
- Architecture decisions
- Implementation phases
- Success metrics

### 🗄️ [Database Schema](./database-schema.md)
Complete database schema documentation with all tables, fields, and relationships.

**Contents:**
- Table definitions
- Field descriptions
- Relationships and foreign keys
- Indexes for performance
- Data types and constraints

### 🏗️ [Architecture](./architecture.md)
System architecture, design patterns, and data flow.

**Contents:**
- System architecture diagram
- Project structure
- Design patterns (Island Architecture, Service Layer, etc.)
- Data flow examples
- Security considerations
- Performance optimization
- Scalability considerations

### 🚀 [Deployment Guide](./deployment.md)
Step-by-step deployment instructions for various platforms.

**Contents:**
- Docker deployment
- VPS deployment (DigitalOcean, Linode, etc.)
- Deno Deploy
- Railway
- Fly.io
- Database backup and restore
- Monitoring and logging
- Scaling strategies
- Security checklist
- Troubleshooting

### 💻 [Development Guide](./development.md)
Development setup, workflow, and best practices.

**Contents:**
- Getting started
- Project configuration
- Development workflow
- Code style guide
- Testing
- Creating components and routes
- Working with HTMX
- Creating content (lessons, blog posts)
- Debugging tips
- Common issues

## Quick Start

### For Developers

1. Read [Development Guide](./development.md) to set up your environment
2. Review [Architecture](./architecture.md) to understand the system
3. Check [Database Schema](./database-schema.md) for data structures
4. Follow [Technical Plan](./technical-plan.md) for feature implementation

### For DevOps

1. Read [Deployment Guide](./deployment.md) for hosting options
2. Review [Architecture](./architecture.md) for infrastructure requirements
3. Set up monitoring and backups as described in deployment docs

### For Content Creators

1. See [Development Guide](./development.md) section on "Creating Content"
2. Use JSON format for lessons
3. Use Markdown format for blog posts
4. Follow content structure examples

## Project Overview

**Maths Wizards** is an educational website focused on:
- Mathematics fundamentals
- TI calculator usage and programming
- Interactive lessons with multiple difficulty levels
- Code playgrounds for TI-Basic and Assembly
- Educational blog
- Community engagement through questions and email list

**Tech Stack:**
- Frontend: HTMX + Pico CSS
- Backend: Deno with Fresh framework
- Database: SQLite
- Deployment: Docker containers

## Key Features

1. **Interactive Lessons**
   - Toggleable difficulty levels
   - Practice problems with instant feedback
   - Quizzes and assessments
   - Code playgrounds

2. **Content Management**
   - Markdown-based blog
   - JSON-structured lessons
   - Easy content updates

3. **User Engagement**
   - Email list signup
   - Question submission
   - FAQ page
   - No authentication required

4. **Monetization**
   - Google AdSense integration
   - Strategic ad placement

## Contributing

When contributing to this project:

1. Create a feature branch
2. Follow code style guidelines (see Development Guide)
3. Write tests for new features
4. Update documentation as needed
5. Submit a pull request

## Support

For issues or questions:
- Check the troubleshooting sections in relevant docs
- Review common issues in Development Guide
- Create an issue in the GitHub repository

## License

[Add license information here]

## Changelog

Track major changes and updates to the project here or in a separate CHANGELOG.md file.
