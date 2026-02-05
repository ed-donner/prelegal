# Prelegal

A platform for drafting common legal agreements.

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Running the Application

**Mac/Linux:**
```bash
./scripts/start-mac.sh    # or start-linux.sh
```

**Windows:**
```powershell
.\scripts\start-windows.ps1
```

The application will be available at http://localhost:8000

### Stopping the Application

**Mac/Linux:**
```bash
./scripts/stop-mac.sh    # or stop-linux.sh
```

**Windows:**
```powershell
.\scripts\stop-windows.ps1
```

## Development

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```
Available at http://localhost:3000

### Backend Only
```bash
cd backend
uv sync
uv run uvicorn main:app --reload
```
Available at http://localhost:8000

## Project Structure

```
prelegal/
  backend/         # FastAPI backend
  frontend/        # Next.js frontend
  scripts/         # Start/stop scripts
  templates/       # Legal document templates
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/signup` - Signup (placeholder)
- `POST /api/auth/signin` - Signin (placeholder)
- `GET /api/auth/me` - Current user (placeholder)

## License

See LICENSE file.
