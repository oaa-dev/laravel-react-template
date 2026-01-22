# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing two applications:
- **Backend**: `laravel-template-api/` - Laravel 12 REST API with OAuth2 authentication
- **Frontend**: `my-next-app/` - Next.js 16 with React 19

## Development Commands

### Backend (laravel-template-api/)

```bash
composer setup          # First-time setup
composer dev            # Run all services (PHP server, queue, logs, npm dev)
composer test           # Run Pest tests
./vendor/bin/pint       # Code formatting (Laravel Pint)
```

### Frontend (my-next-app/)

```bash
npm run dev             # Development server (localhost:3000)
npm run build           # Production build
npm run lint            # ESLint
```

### Running Single Tests

```bash
# From laravel-template-api/
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

Backend: laravel-app (PHP 8.3), laravel-web (Nginx:8080), mysql (3307), redis, rabbitmq, phpmyadmin (8081), mailpit

Frontend: nextjs (3000)

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
