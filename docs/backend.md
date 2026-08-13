# DisputeX Backend Documentation

The DisputeX backend is a robust REST API service developed with **TypeScript**, **Node.js**, **Express**, and **Prisma ORM**. It is structured according to clean, layered architectural principles to ensure a strict separation of concerns, scalability, and easy testability.

---

## 1. Directory Structure & Architecture Layers

The backend follows a layered request-response pattern:

```text
backend/
├── config/               # App and environment configurations (DB, Port, Cloud services)
├── controllers/          # Request handlers: parses inputs, calls services, sends HTTP responses
├── services/             # Core business logic orchestrators
│   ├── auth.service.ts   # User authentication logic, password hashing, and JWT generation
│   ├── dispute.service.ts# Dispute retrieval, status transition, and statistics
│   ├── evidence.service.ts # Evidence validation, file naming, and upload orchestration
│   └── pdf.service.ts    # Compilation of evidence and audit history into PDF documents
├── repositories/         # Direct database interactions using Prisma Client
├── models/               # Domain model contracts and entities
├── routes/               # API Router routing declarations
├── middleware/           # Auth validation, body checkers, and global error handling
├── storage/              # Integration layer for external file hosting (Cloudinary)
├── validators/           # Input constraints enforcement structures
└── server.ts / app.ts    # Application entry point and configurations
```

---

## 2. API Endpoint Architecture

All endpoints are versioned and partitioned by domain. Base prefix: `/api`:

### Authentication (`/auth`)
- **POST `/auth/register`**: Registers a new merchant.
- **POST `/auth/login`**: Authenticates users (Merchant or Admin) and issues a JWT token.

### Disputes (`/disputes`)
- **GET `/disputes`**: Retrieves all disputes filtered by merchant context.
- **GET `/disputes/:id`**: Gets full dispute details, timeline logs, and merchant ownership.
- **GET `/disputes/:id/pdf`**: Invokes the `pdfService` to compile a dispute package and downloads it as an A4 document.

### Evidence (`/evidence`)
- **POST `/evidence/upload`**: Validates file types (PDF, JPEG, PNG), names files deterministically, uploads them to secure storage, updates database references, and logs activity trails.

---

## 3. Notable Services

### Evidence Upload & Storage (`evidence.service.ts` & `storage.service.ts`)
- Leverages a secure upload pipeline. Files are sent as Buffers from Express controllers to the `storageService`.
- Uses **Cloudinary** (configured for secure CDN hosting) to stream files from memory, returning a secure URL link.
- Mutates the Dispute status, creates a new timeline event, and prevents double uploads once evidence is locked.

### PDF Document Generation (`pdf.service.ts`)
- Uses **`pdfkit`** to dynamically design and generate highly professional dispute packages on-the-fly.
- Compiles critical metadata: Dispute amount/reason/status, Merchant information, Secure evidence URL, and a detailed audit trail timeline.
- Designed with premium styling: custom headers, dark color branding theme, margins, geometric bullets, and confidentiality footnotes.
