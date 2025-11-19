# Multi-stage Dockerfile for Maths Wizards
# Optimized for production deployment with Fresh framework

FROM denoland/deno:1.40.0 AS base

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY deno.json deno.lock* ./

# Cache dependencies
RUN deno cache --reload \
  https://deno.land/x/fresh@1.7.3/mod.ts

# Production stage
FROM denoland/deno:1.40.0

# Set working directory
WORKDIR /app

# Set production environment
ENV DENO_ENV=production
ENV PORT=8000

# Copy all application files
COPY . .

# Cache all dependencies and compile
RUN deno cache --reload main.ts dev.ts

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Run database migrations
RUN deno run --unstable-ffi --allow-read --allow-write --allow-ffi --allow-env scripts/migrate.ts

# Seed database with initial data
RUN deno run --unstable-ffi --allow-read --allow-write --allow-ffi --allow-env scripts/seed.ts

# Expose the application port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD deno eval "await fetch('http://localhost:8000').then(r => r.ok ? Deno.exit(0) : Deno.exit(1)).catch(() => Deno.exit(1))"

# Run the application
CMD ["deno", "run", "-A", "main.ts"]
