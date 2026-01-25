# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing two applications:
- **Backend**: `backend/` - Laravel 12 REST API with OAuth2 authentication
- **Frontend**: `frontend/` - Next.js 16 with React 19

## Development Commands

### Backend (backend/)

```bash
docker compose up -d    # Start Docker containers (MySQL, Redis, etc.)
docker compose exec app php artisan migrate    # Run migrations
docker compose exec app php artisan test       # Run Pest tests
docker compose exec app composer install       # Install dependencies
./vendor/bin/pint       # Code formatting (Laravel Pint)
```

**API URL:** http://localhost:8090/api/v1

### Frontend (frontend/)

```bash
npm install             # Install dependencies (first time)
npm run dev             # Development server (localhost:3000)
npm run build           # Production build
npm run lint            # ESLint
```

**Frontend URL:** http://localhost:3000

### Running Single Tests

```bash
# From backend/
php artisan test --filter=TestClassName
php artisan test --filter=test_method_name
php artisan test tests/Feature/Api/V1/AuthControllerTest.php
```

## Architecture

### Backend - Service-Repository Pattern

```
Controllers → Services → Repositories → Models → Database
     ↓
  Resources (JSON transformation)
     ↓
  ApiResponse trait (standardized JSON format)
```

**Key directories:**
- `app/Http/Controllers/Api/V1/` - API controllers (Auth, User, Profile)
- `app/Services/` - Business logic with interface contracts
- `app/Repositories/` - Data access layer with BaseRepository
- `app/Http/Resources/Api/V1/` - JSON transformers
- `app/Http/Requests/Api/V1/` - Form Request validation classes
- `routes/api.php` - All API routes (v1 prefix)

**Standard API Response Format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { "pagination": ... }
}
```

### Frontend - Next.js App Router

**State Management:**
- TanStack React Query - Server state, API caching
- Zustand - Client/UI state
- TanStack React Form - Form management

**Path alias:** `@/*` maps to project root

### Authentication

OAuth2 via Laravel Passport. Bearer token in Authorization header.

**Flow:**
1. Register/Login → `POST /api/v1/auth/register` or `/login`
2. Returns access_token
3. Protected routes: `Authorization: Bearer {token}`

### Key Packages

**Backend:**
- Laravel Passport - OAuth2
- Spatie Media Library - File/avatar management
- Spatie Query Builder - API filtering/sorting
- L5-Swagger - OpenAPI docs at `/api/documentation`
- Pest - Testing framework

**Frontend:**
- TanStack React Query v5
- TanStack React Form v1
- Zustand v5
- Tailwindcss v4

## API Endpoints

All prefixed with `/api/v1/`

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`
- `GET /auth/me`, `PUT /auth/me`
- `GET|POST /users`, `GET|PUT|DELETE /users/{id}`
- `GET|PUT /profile`, `POST|DELETE /profile/avatar`

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| API (Nginx) | 8090 | Laravel REST API |
| phpMyAdmin | 8091 | Database management |
| Mailpit | 8092 | Email testing UI |
| RabbitMQ | 8093 | Message queue management |
| MySQL | 3317 | Database |
| Redis | 6389 | Cache |
| RabbitMQ AMQP | 5682 | Message queue |

## Database

- User → UserProfile (1:1, auto-created on user creation)
- User → Address (polymorphic via HasAddress trait)
- User → Media (Spatie Media Library for avatars/documents)

## Git Configuration

**Repository:** `git@github-oaa:oaa-dev/laravel-react-project.git`

This project uses a custom SSH host alias for the `oaa-dev` GitHub account. Add this to `~/.ssh/config`:

```
Host github-oaa
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_oaa_dev
  IdentitiesOnly yes
```

Then clone or set remote using:
```bash
git clone git@github-oaa:oaa-dev/laravel-react-project.git
# or for existing repo:
git remote set-url origin git@github-oaa:oaa-dev/laravel-react-project.git
```
