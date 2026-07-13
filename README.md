# DisputeX

DisputeX is an enterprise-grade dispute management platform designed for chargeback evidence collection, merchant workflows, and automated escalation.

## Architecture Overview

The repository is structured into three primary layers:

- `frontend/` ? feature-based frontend application and shared UI modules.
- `backend/` ? layered backend with controllers, services, repositories, and supporting infrastructure.
- `database/` ? schemas, migrations, seed data, and backup documentation for persistence.

Supporting directories:

- `docs/` ? architecture, API, database, and development guide documentation.
- `tests/` ? sample unit and integration test scaffolding.

## Folder Responsibilities

### `frontend/`

Organized by feature and shared abstractions to enable independent frontend development.

- `app/` ? application entry points and pages.
- `assets/` ? static assets and asset exports.
- `components/` ? reusable UI components grouped by common, layout, evidence, notifications, timeline, settings, and ui primitives.
- `features/` ? feature modules for evidence, notifications, timeline, and settings.
- `hooks/` ? shared React hooks and UI state helpers.
- `services/` ? API wrappers and frontend service abstractions.
- `lib/` ? shared utilities such as fetchers.
- `constants/` ? application-wide constants.
- `utils/` ? helper functions and validation utilities.
- `styles/` ? theme and styling contracts.
- `types/` ? shared TypeScript type definitions.

### `backend/`

Structured as a layered architecture for separation of concerns.

- `controllers/` ? request handlers and API controller entry points.
- `services/` ? orchestration and business service layer.
- `repositories/` ? data access and persistence abstractions.
- `models/` ? domain model contracts.
- `routes/` ? API route definitions and composition.
- `middleware/` ? request lifecycle middleware, auth, validation, and error handling.
- `validators/` ? backend input validation.
- `config/` ? application and environment configuration.
- `jobs/` ? scheduled jobs and background tasks.
- `storage/` ? storage service abstractions for file and evidence handling.
- `interfaces/` ? shared request, response, and error interfaces.
- `utils/` ? logging, response helpers, and utility helpers.
- `types/` ? backend-specific type definitions.

### `database/`

Contains schema definitions, migration scaffolding, seed scripts, and backup guidance.

- `schemas/` ? dispute, evidence, notification, activity, and user schema files.
- `migrations/` ? database versioning and migration stubs.
- `seed/` ? initial dataset and environment seed scripts.
- `backups/` ? backup strategy notes and restore guidance.

### `docs/`

Contains core project documentation:

- `architecture.md` ? architecture overview and responsibilities.
- `api.md` ? API contract and endpoint descriptions.
- `database.md` ? database schema, migration, and backup documentation.
- `development-guide.md` ? developer setup and contribution workflows.

### `tests/`

Contains starter test scaffolding for:

- `tests/frontend/` ? frontend unit tests.
- `tests/backend/` ? backend unit tests.
- `tests/integration/` ? full end-to-end and integration tests.

## Development Notes

This repository layout is scaffolded for future development. No business logic is implemented yet; each directory contains starter files so multiple developers can begin work independently.
