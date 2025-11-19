# Deployment Guide

This guide covers deploying Maths Wizards to production using Docker, as well as alternative deployment options.

## Quick Start with Docker

### Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed ([Install Compose](https://docs.docker.com/compose/install/))
- 1GB+ RAM, 10GB+ disk space
- Domain name (optional, recommended for production)

### 5-Minute Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maths-wizards.git
   cd maths-wizards
   ```

2. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env if you want to customize settings
   # nano .env
   ```

3. **Build and launch**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment**
   ```bash
   docker-compose ps
   docker-compose logs -f web
   ```

5. **Access the site**
   - Local: `http://localhost:8000`
   - Production: `http://your-domain.com`

**That's it!** Your Maths Wizards instance is now running.

## Dockerfile

```dockerfile
FROM denoland/deno:alpine-1.40.0

WORKDIR /app

# Copy dependency files
COPY deno.json deno.lock ./

# Cache dependencies
RUN deno cache --lock=deno.lock src/main.ts

# Copy application code
COPY . .

# Build Fresh application
RUN deno task build

# Expose port
EXPOSE 8000

# Create volume for SQLite database
VOLUME ["/app/data"]

# Run application
CMD ["deno", "task", "start"]
```

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
      - ./content:/app/content
    environment:
      - DENO_ENV=production
      - DATABASE_PATH=/app/data/maths-wizards.db
      - ALLOWED_ORIGINS=https://mathswizards.com
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Environment Variables

Create a `.env` file:

```bash
# Application
PORT=8000
DENO_ENV=production
LOG_LEVEL=info

# Database
DATABASE_PATH=/app/data/maths-wizards.db

# Security
ALLOWED_ORIGINS=https://mathswizards.com,https://www.mathswizards.com
SESSION_SECRET=your-secret-key-here

# Code Execution
MAX_CODE_EXECUTION_TIME=5000
ENABLE_TI_BASIC=true
ENABLE_ASSEMBLY=true

# Ads
GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXX

# Email (future)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Production Deployment

### Option 1: VPS Deployment (DigitalOcean, Linode, etc.)

1. **Provision a VPS**
   - Minimum: 1GB RAM, 1 CPU, 25GB SSD
   - Recommended: 2GB RAM, 2 CPU, 50GB SSD

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone and deploy**
   ```bash
   git clone https://github.com/yourusername/maths-wizards.git
   cd maths-wizards
   cp .env.example .env
   # Edit .env
   docker-compose up -d
   ```

5. **Set up Nginx reverse proxy**
   ```bash
   sudo apt install nginx
   ```

   Create `/etc/nginx/sites-available/mathswizards`:
   ```nginx
   server {
       listen 80;
       server_name mathswizards.com www.mathswizards.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Static file caching
       location /static/ {
           proxy_pass http://localhost:8000;
           proxy_cache_valid 200 1d;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/mathswizards /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d mathswizards.com -d www.mathswizards.com
   ```

### Option 2: Deno Deploy

Deno Deploy is the official hosting platform for Deno applications.

1. **Install deployctl**
   ```bash
   deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts
   ```

2. **Deploy**
   ```bash
   deployctl deploy --project=maths-wizards src/main.ts
   ```

3. **Configure custom domain** in Deno Deploy dashboard

**Note**: SQLite support on Deno Deploy is limited. Consider using Deno KV instead for production.

### Option 3: Railway

Railway provides easy Docker deployment.

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Set environment variables** in Railway dashboard

### Option 4: Fly.io

Fly.io is great for Docker deployments with global edge locations.

1. **Install flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   flyctl auth login
   ```

3. **Launch app**
   ```bash
   flyctl launch
   ```

4. **Deploy**
   ```bash
   flyctl deploy
   ```

## Database Management

### Backup

```bash
# Create backup
docker-compose exec web cp /app/data/maths-wizards.db /app/data/backup-$(date +%Y%m%d).db

# Copy backup to host
docker cp maths-wizards_web_1:/app/data/backup-*.db ./backups/
```

### Restore

```bash
# Copy backup to container
docker cp ./backups/backup-20240101.db maths-wizards_web_1:/app/data/

# Restore
docker-compose exec web cp /app/data/backup-20240101.db /app/data/maths-wizards.db

# Restart
docker-compose restart web
```

### Automated Backups

Create a cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/maths-wizards && docker-compose exec -T web cp /app/data/maths-wizards.db /app/data/backup-$(date +\%Y\%m\%d).db
```

## Monitoring

### Health Check Endpoint

```typescript
// routes/health.ts
export const handler: Handlers = {
  GET() {
    return new Response(JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: checkDatabase(),
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
```

### Logging

```bash
# View logs
docker-compose logs -f web

# View last 100 lines
docker-compose logs --tail=100 web
```

### Resource Monitoring

```bash
# Container stats
docker stats maths-wizards_web_1

# Disk usage
docker-compose exec web df -h

# Database size
docker-compose exec web ls -lh /app/data/maths-wizards.db
```

## Scaling

### Vertical Scaling (Increase Resources)

1. Stop containers
2. Resize VPS
3. Restart containers

### Horizontal Scaling (Multiple Instances)

**Note**: SQLite doesn't support concurrent writes from multiple instances.

For horizontal scaling, migrate to PostgreSQL:

```yaml
# docker-compose.yml
services:
  web:
    # ... existing config
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/mathswizards
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mathswizards

volumes:
  postgres_data:
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs web

# Check if port is in use
sudo lsof -i :8000

# Rebuild container
docker-compose build --no-cache web
docker-compose up -d
```

### Database locked errors

```bash
# Check for multiple connections
docker-compose exec web lsof /app/data/maths-wizards.db

# Restart container
docker-compose restart web
```

### Out of disk space

```bash
# Check disk usage
df -h

# Clean Docker images
docker system prune -a

# Clean old backups
find /path/to/backups -mtime +30 -delete
```

## Security Checklist

- [ ] Change default secrets in `.env`
- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Set up automated backups
- [ ] Enable fail2ban for SSH protection
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Implement rate limiting
- [ ] Use strong session secrets
- [ ] Sanitize all user inputs

## Performance Optimization

### Enable Gzip Compression (Nginx)

```nginx
# Add to nginx.conf
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### Database Optimization

```sql
-- Run periodically
VACUUM;
ANALYZE;
```

### CDN Integration (Optional)

Use Cloudflare for:
- DDoS protection
- CDN caching
- SSL/TLS
- Analytics

## Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build web
docker-compose up -d

# Run migrations if needed
docker-compose exec web deno task migrate
```

### Update Dependencies

```bash
# Update deno.json versions
# Rebuild container
docker-compose build --no-cache web
docker-compose up -d
```

### Database Migrations

```bash
# Run migrations
docker-compose exec web deno task migrate

# Rollback (if script exists)
docker-compose exec web deno task migrate:rollback
```
