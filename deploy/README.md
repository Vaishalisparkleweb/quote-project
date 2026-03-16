# Deploy to mern-demo.sparkleweb.co.in

This folder contains config for deploying the Quote Backend API to **mern-demo.sparkleweb.co.in** via GitHub Actions CI/CD.

## How it works

1. **On push to `main`**: GitHub Actions runs tests, builds Docker images, pushes them to Docker Hub, then SSHs to your server and runs the deploy script.
2. **On the server**: Nginx listens on port 80 for `mern-demo.sparkleweb.co.in` and reverse-proxies to the backend services.

## GitHub repository secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username (e.g. `vaishali8160`) |
| `DOCKERHUB_TOKEN` | Docker Hub access token (Settings → Security → Access Tokens) |
| `DEPLOY_HOST` | Server hostname or IP (e.g. `mern-demo.sparkleweb.co.in` or your server IP) |
| `DEPLOY_USER` | SSH user (e.g. `root` or `ubuntu`) |
| `SSH_PRIVATE_KEY` | Full private key content for SSH (no passphrase recommended for automation) |

## Server requirements

1. **Docker** and **Docker Compose** (v2: `docker compose`) installed.
2. **Port 80** free for Nginx.
3. **DNS**: `mern-demo.sparkleweb.co.in` must point to this server’s IP.
4. **SSH**: The key you put in `SSH_PRIVATE_KEY` must be in the server’s `~/.ssh/authorized_keys` for `DEPLOY_USER`.

## First-time server setup

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Create app directory (CI will copy files here)
sudo mkdir -p /opt/quote-backend/deploy
sudo chown $USER:$USER /opt/quote-backend /opt/quote-backend/deploy
```

After the first pipeline run, the workflow will copy `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/nginx.conf`, and `deploy/deploy.sh` to `/opt/quote-backend` and run the deploy script.

## API base URL

- **Production**: `https://mern-demo.sparkleweb.co.in` (use HTTPS via your reverse proxy/load balancer or add SSL in Nginx).
- Paths: `/api/auth`, `/api/users`, `/api/category`, `/api/sub-category`, `/api/quote`, `/api/quote-type`.

## Manual deploy

If you have the repo on the server:

```bash
cd /path/to/Quote-Backend
./deploy/deploy.sh
```

Or after CI has copied files:

```bash
cd /opt/quote-backend
./deploy/deploy.sh
```
