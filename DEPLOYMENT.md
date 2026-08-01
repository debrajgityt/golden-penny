# Golden Penny - Production Deployment Documentation

## Overview
This document contains the deployment specification, runtime metrics, rollback procedures, and maintenance workflows for the **Golden Penny Personal Wealth OS** deployed on the production VPS via Coolify and Docker.

---

## Deployment Metadata
- **Deployment Date**: August 2, 2026
- **Git Commit Hash**: `33a17f427753580fd7885d3c9fa52d2bbe8ae27e`
- **GitHub Repository**: `https://github.com/debrajgityt/golden-penny.git`
- **Branch**: `main`
- **Coolify Application Name**: `golden-penny`
- **Coolify Application UUID**: `gp-ff155ebc0082`
- **Server IP**: `45.58.59.115`
- **Application Endpoint**: `http://45.58.59.115:3000`
- **Health Check Endpoint**: `http://45.58.59.115:3000/api/health`

---

## Configuration & Runtime
- **Build Pack**: Dockerfile (Multi-stage Node 20)
- **Build Command**: `npm run build` (`vite build && esbuild server.ts ...`)
- **Start Command**: `npm start` (`node dist/server.cjs`)
- **Exposed Port**: `3000`
- **Docker Network**: `coolify`
- **Environment Variables**:
  - `PORT=3000`
  - `NODE_ENV=production`
  - `GEMINI_API_KEY` (Configured server-side / Coolify env)

---

## Rollback Procedure
In the event of a critical issue or regression:
1. Revert to a previous stable Git commit hash:
   ```bash
   git checkout <PREVIOUS_COMMIT_HASH>
   git push origin main --force
   ```
2. Trigger redelivery on Coolify or rebuild container on VPS:
   ```bash
   cd /var/lib/docker/volumes/golden-penny
   git fetch origin && git reset --hard <PREVIOUS_COMMIT_HASH>
   docker build -t golden-penny:latest .
   docker stop golden-penny && docker rm golden-penny
   docker run -d --name golden-penny --restart always --network coolify -p 3000:3000 -e PORT=3000 -e NODE_ENV=production golden-penny:latest
   ```

---

## Future Update & Zero-Downtime Procedure
To deploy new features or patches:
1. Commit and push changes to `main` branch on GitHub:
   ```bash
   git add .
   git commit -m "feat: new feature update"
   git push origin main
   ```
2. On Coolify / VPS, pull and rebuild:
   ```bash
   cd /var/lib/docker/volumes/golden-penny && git pull origin main
   docker build -t golden-penny:latest .
   docker stop golden-penny && docker rm golden-penny
   docker run -d --name golden-penny --restart always --network coolify -p 3000:3000 -e PORT=3000 -e NODE_ENV=production golden-penny:latest
   ```
3. Run health check verification:
   ```bash
   curl -s http://127.0.0.1:3000/api/health
   ```
