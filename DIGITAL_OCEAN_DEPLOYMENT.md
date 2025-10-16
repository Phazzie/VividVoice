# Digital Ocean Deployment Guide for VividVoice

## Overview
VividVoice is currently configured for Firebase App Hosting but can be deployed to Digital Ocean. This guide covers both deployment strategies.

## Current State
- **Primary Target**: Firebase App Hosting (configured via `apphosting.yaml`)
- **Alternative**: Digital Ocean App Platform
- **Framework**: Next.js 15.3.3 (App Router)
- **Build Tool**: Next.js with Turbopack

---

## Option 1: Digital Ocean App Platform (Recommended)

### Prerequisites
1. Digital Ocean account
2. GitHub repository connected to Digital Ocean
3. Environment variables configured

### Step 1: App Platform Setup

1. **Create New App** in Digital Ocean Console
2. **Connect Repository**: Link to `Phazzie/VividVoice`
3. **Configure Build Settings**:
   ```yaml
   Build Command: npm run build
   Run Command: npm start
   Environment: Node.js 20.x
   HTTP Port: 3000
   ```

### Step 2: Environment Variables

Add these in Digital Ocean App Platform Console under **App Settings > App-Level Environment Variables**:

```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project_id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<project_id>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<app_id>

# Google AI
GOOGLE_GENAI_API_KEY=<your_google_ai_key>

# ElevenLabs (Optional)
ELEVENLABS_API_KEY=<your_elevenlabs_key>

# Production Settings
NODE_ENV=production
```

### Step 3: App Spec Configuration

Create `.do/app.yaml` (Digital Ocean App Spec):

```yaml
name: vividvoice
region: nyc
services:
  - name: web
    github:
      repo: Phazzie/VividVoice
      branch: master
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    http_port: 3000
    instance_count: 1
    instance_size_slug: basic-xs
    routes:
      - path: /
    envs:
      - key: NODE_ENV
        value: production
      # Add other environment variables here
```

### Step 4: Health Check Endpoint

Digital Ocean requires a health check. The Next.js app automatically provides one at the root `/`.

### Step 5: Scaling Configuration

For production, consider:
- **Instance Size**: Start with `basic-s` ($12/month)
- **Horizontal Scaling**: Enable auto-scaling (1-3 instances)
- **Database**: Use managed PostgreSQL if needed for user data

---

## Option 2: Digital Ocean Droplet (Docker)

### Prerequisites
- Docker and Docker Compose installed locally
- Digital Ocean Droplet with Docker

### Step 1: Create Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Step 2: Update next.config.ts

Add standalone output:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

### Step 3: Deploy to Droplet

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Clone repository
git clone https://github.com/Phazzie/VividVoice.git
cd VividVoice

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your credentials

# Build and run with Docker
docker build -t vividvoice .
docker run -p 3000:3000 --env-file .env.local vividvoice
```

### Step 4: Nginx Reverse Proxy

Configure Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Current Firebase Configuration

The project is already configured for Firebase App Hosting:

### Files
- `apphosting.yaml`: Firebase App Hosting configuration
- `.github/workflows/deploy.yml`: Automated deployment workflow
- `firebase.json`: Firebase Hosting configuration
- `.firebaserc`: Firebase project configuration

### To Deploy to Firebase

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize (if needed)**:
   ```bash
   firebase init hosting
   ```

4. **Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### GitHub Actions Auto-Deploy

The repository has CI/CD configured. Simply:
1. Add GitHub Secrets: `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID`
2. Push to `master` branch
3. Deployment happens automatically

---

## Troubleshooting

### Build Failures
- **Issue**: ESLint warnings fail build
- **Fix**: Temporarily enabled `ignoreDuringBuilds` in `next.config.ts`
- **Long-term**: Fix ESLint warnings with `npm run lint:fix`

### Environment Variables
- **Issue**: Missing environment variables
- **Fix**: Copy `.env.example` to `.env.local` and fill in values
- **Production**: Set via Digital Ocean Console or GitHub Secrets

### Security Vulnerabilities
Run `npm audit fix` to update vulnerable dependencies.

---

## Cost Estimates

### Digital Ocean App Platform
- **Basic**: $5-12/month (512MB-1GB RAM)
- **Professional**: $12-24/month (1-2GB RAM)
- **With Database**: Add $15/month for managed DB

### Firebase Hosting
- **Free Tier**: 10GB storage, 360MB/day transfer
- **Paid**: $0.026/GB storage, $0.15/GB transfer

### Recommendation
Start with **Digital Ocean App Platform** ($12/month) for predictable costs and easy scaling.

---

## Next Steps

1. ✅ Fix remaining production blockers
2. ⬜ Choose deployment target (Digital Ocean or Firebase)
3. ⬜ Set up environment variables
4. ⬜ Configure domain and SSL
5. ⬜ Set up monitoring and alerts
6. ⬜ Test deployment in staging environment
7. ⬜ Deploy to production

---

## Support

For issues, check:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Digital Ocean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
