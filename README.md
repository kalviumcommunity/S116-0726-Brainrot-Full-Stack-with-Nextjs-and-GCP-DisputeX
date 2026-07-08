# S[SquadNumber]-0726-[TeamName]-Full-Stack-With-Nextjs-And-GCP-Postgres-Merchant-Dispute-Portal

## Problem statement

Razorpay wants a merchant dispute portal where sellers upload evidence against chargebacks. Each dispute has a 7-day timer; merchants get daily reminders, and cases auto-escalate if no response. All evidence must be stored immutably.

## Team

| Name | Role |
|---|---|
| Shubham | Frontend |
| Yashraj  | Backend |
| Aditya | Infra / Database |

## Tech stack

- **Frontend**: Next.js
- **Backend**: Node.js API (within/alongside Next.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cloud**: GCP (Cloud SQL, Cloud Storage, Cloud Scheduler, Cloud Run)
- **CI/CD**: GitHub Actions

## Core features

- Merchant authentication and dashboard
- Dispute creation with a 7-day response deadline
- Evidence upload against each dispute
- Immutable evidence storage (GCS bucket with Object Versioning + retention policy)
- Daily automated reminders as the deadline approaches
- Automatic escalation of unresolved disputes past the deadline
- Full audit trail of every status change

## Architecture

```
Merchant → Next.js frontend → Node.js API
                                  ├── PostgreSQL (disputes, users, audit log)
                                  ├── GCS bucket (immutable evidence)
                                  └── Cloud Scheduler (daily reminder + escalation cron)
```

## Database schema (high level)

- **users** — merchant and admin accounts
- **disputes** — status, deadline, escalated_at, linked merchant
- **evidence** — dispute_id, gcs_path, checksum, uploaded_at (insert-only, never updated)
- **audit_log** — every state transition, with timestamp and actor

## Dispute lifecycle

```
open → evidence_submitted → resolved
open → escalated (if deadline passes with no evidence)
```

## Getting started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL instance (local or Cloud SQL)
- GCP project with a Cloud Storage bucket and Cloud Scheduler enabled

### Setup

```bash
git clone <repo-url>
cd <repo-folder>
npm install
cp .env.example .env   # fill in DATABASE_URL, GCS bucket name, credentials
npx prisma migrate dev
npm run dev
```

### Environment variables

```
DATABASE_URL=
GCS_BUCKET_NAME=
GCS_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=
CRON_SECRET=
```

## API endpoints (draft)

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/login | Merchant/admin login |
| GET | /api/disputes | List disputes for the logged-in merchant |
| GET | /api/disputes/:id | Get a single dispute with evidence and timeline |
| POST | /api/disputes/:id/evidence | Upload evidence (immutable) |
| POST | /api/cron/check-disputes | Triggered by Cloud Scheduler — sends reminders, escalates overdue disputes |

## CI/CD

GitHub Actions runs lint + tests on every PR, and deploys to Cloud Run on merge to `main`.

## Project status

Week 1 of 3 — schema design and initial setup in progress.
