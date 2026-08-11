# DisputeX Frontend Documentation

DisputeX's frontend is a modern web application built on **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It is designed with feature-based encapsulation, clean separation of concern patterns, and modern aesthetic cues (sleek dark overlays, custom micro-animations like typing text and floating 3D elements).

---

## 1. Directory Structure

The frontend application is structured logically to facilitate modular development and reusable UI modules:

```text
frontend/
├── app/                  # Next.js App Router (Pages & Routing)
│   ├── admin/            # Admin dashboard and views
│   ├── dashboard/        # Merchant dashboard
│   ├── disputes/         # Dispute detailed views & actions
│   ├── evidence/         # Evidence upload & overview pages
│   ├── notifications/    # Alerts & system notifications
│   ├── profile/          # User and Merchant profile management
│   ├── settings/         # Configuration page
│   ├── layout.tsx        # Base root layout wrapper
│   └── page.tsx          # Login & Signup Landing Page
├── components/           # Reusable UI Components
│   ├── ui/               # Primitive design tokens (shadcn/ui buttons, inputs)
│   ├── disputes/         # Feature-specific modals (e.g., DisputeDetailsModal)
│   ├── TextType.tsx      # Micro-interaction: Typing text effect
│   └── Prism.tsx         # Graphic component: 3D canvas background
├── services/             # Backend API Client Wrappers
│   └── auth.service.ts   # Core client side authorization & user session service
├── features/             # Feature-specific modules
├── hooks/                # Custom React Hooks
├── lib/                  # Shared utility libraries (e.g., fetch wrappers)
└── types/                # Shared TypeScript models and interfaces
```

---

## 2. Key Pages & Routes

The application defines distinct pages for administrators and merchants:

### Authentication Page (`/`)
- **Path**: `frontend/app/page.tsx`
- **Features**: 
  - Dual-mode card (Sign-In and Sign-Up) allowing selection of user roles (`merchant` or `admin`).
  - Engaging visual aesthetics: dark background with deep blue/indigo gradients, floating 3D canvas (`Prism.tsx`), and a dynamic typing title (`TextType.tsx`).
  - Redirects authenticated users to their corresponding dashboard instantly.

### Merchant Dashboard (`/dashboard`)
- **Path**: `frontend/app/dashboard/page.tsx`
- **Features**:
  - Provides merchants with visual analytical widgets summarizing Dispute volumes (Open, Won, Lost, and Under Review status counts).
  - List of active dispute line items, sorting, and search capabilities.
  - Quick action buttons to submit evidence packages or drill down into details.

### Dispute Details Page (`/disputes/[id]`)
- **Path**: `frontend/app/disputes/[id]/page.tsx`
- **Features**:
  - Interactive timeline showing historical workflow logs of a dispute.
  - Interactive PDF package generation triggers.
  - Modals (e.g., DisputeDetailsModal) to display full evidence logs.

---

## 3. Notable UI Components & Micro-interactions

- **`Prism.tsx`**: Uses HTML5 canvas to render customizable floating 3D elements that follow rotation configurations. Provides the app with a high-fidelity, premium vibe on the entry interface.
- **`TextType.tsx`**: Simulates smooth typing/deleting animations for key branding terms to grab user attention.
- **`DisputeDetailsModal.tsx`**: A sliding dialog overlays display for inspecting specific disputes, transaction amounts, chargeback reasons, and uploaded evidence attachments directly from the dashboard lists.

---

## 4. State & Authentication Integration

Communication with the Node.js API relies on modular wrappers inside the `services/` directory:
- **Client Auth Management**: `auth.service.ts` coordinates API calls to `/auth/login` and `/auth/register`. It stores JWT tokens in `localStorage` and exposes utility functions for checking login states (`authService.isAuthenticated()`) and fetching user data.
- **Request Headers**: Standard fetch client intercepts requests to pass `Authorization: Bearer <token>` automatically, ensuring secure route handshakes.
