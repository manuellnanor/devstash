# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.**

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Target Users](#target-users)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Data Models & Prisma Schema](#data-models--prisma-schema)
5. [Features](#features)
6. [Item Types Reference](#item-types-reference)
7. [URL Structure](#url-structure)
8. [UI/UX Design System](#uiux-design-system)
9. [Monetization](#monetization)
10. [AI Features](#ai-features)
11. [System Architecture Diagram](#system-architecture-diagram)

---

## Problem Statement

Developers spread their essential knowledge across too many places:

| Where it lives now | What it is |
|--------------------|------------|
| VS Code / Notion | Code snippets |
| AI chat history | Prompts & system messages |
| Buried project folders | Context files |
| Browser bookmarks | Useful links |
| Random folders | Docs & notes |
| `.txt` files | Commands |
| GitHub Gists | Project templates |
| `bash_history` | Terminal commands |

**Result:** context switching, lost knowledge, inconsistent workflows.

**DevStash** replaces all of this with a single, unified, fast-access hub.

---

## Target Users

| User | Primary Need |
|------|-------------|
| 🧑‍💻 **Everyday Developer** | Fast access to snippets, prompts, commands, links |
| 🤖 **AI-first Developer** | Store prompts, system messages, context files, workflows |
| 🎓 **Content Creator / Educator** | Organise code blocks, explanations, course notes |
| 🏗️ **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Architecture & Tech Stack

```
┌─────────────────────────────────────────┐
│               Next.js 16 App            │
│  (SSR pages + API routes, one repo)     │
├───────────────┬─────────────────────────┤
│  Frontend     │  Backend (API Routes)   │
│  React 19     │  Prisma 7 ORM           │
│  Tailwind v4  │  NextAuth v5            │
│  ShadCN UI    │  OpenAI gpt-4o-mini     │
└───────┬───────┴──────────┬──────────────┘
        │                  │
   ┌────▼────┐       ┌─────▼──────┐
   │ Neon DB │       │Cloudflare  │
   │Postgres │       │    R2      │
   └─────────┘       └────────────┘
```

### Stack Summary

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 16 / React 19 | SSR + API routes, one codebase |
| **Language** | TypeScript | Full type safety |
| **Database** | Neon PostgreSQL | Cloud Postgres |
| **ORM** | Prisma 7 | See schema below — migrations only, never `db push` |
| **Auth** | NextAuth v5 | Email/password + GitHub OAuth |
| **File Storage** | Cloudflare R2 | File and image uploads (Pro) |
| **AI** | OpenAI `gpt-4o-mini` | Tagging, summaries, explain code, prompt optimizer |
| **Styling** | Tailwind CSS v4 + ShadCN UI | Dark mode default |
| **Caching** | Redis | Optional — evaluate as needed |

> ⚠️ **DB Rule:** Never use `prisma db push`. Always create and run migrations (`prisma migrate dev` → `prisma migrate deploy`).

---

## Data Models & Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USER ───────────────────────────────────────────────

model User {
  id                    String       @id @default(cuid())
  name                  String?
  email                 String?      @unique
  emailVerified         DateTime?
  image                 String?
  password              String?      // hashed, for email/password auth

  // Pro / billing
  isPro                 Boolean      @default(false)
  stripeCustomerId      String?      @unique
  stripeSubscriptionId  String?      @unique

  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  // Relations
  accounts              Account[]
  sessions              Session[]
  items                 Item[]
  itemTypes             ItemType[]
  collections           Collection[]
  tags                  Tag[]
}

// ─── NEXTAUTH TABLES ─────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── ITEM TYPE ────────────────────────────────────────────

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet", "prompt", "command", etc.
  icon     String  // Lucide icon name e.g. "Code", "Sparkles"
  color    String  // Hex e.g. "#3b82f6"
  isSystem Boolean @default(false) // system types cannot be modified

  userId String? // null for system types
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items       Item[]
  collections Collection[] @relation("CollectionDefaultType")

  @@unique([name, userId]) // prevent duplicate custom type names per user
}

// ─── ITEM ────────────────────────────────────────────────

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?

  // Content — one of text or file
  contentType ContentType // TEXT | FILE
  content     String?     @db.Text // text content (snippet, prompt, note, etc.)
  fileUrl     String?     // Cloudflare R2 URL
  fileName    String?     // original filename
  fileSize    Int?        // bytes

  url         String?     // for link type items

  // Metadata
  language    String?     // e.g. "typescript", "python" (for code snippets)
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)
  lastUsedAt  DateTime?   // updated on access for "recently used"

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relations
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId  String
  itemType    ItemType    @relation(fields: [itemTypeId], references: [id])

  tags        TagsOnItems[]
  collections ItemCollection[]
}

enum ContentType {
  TEXT
  FILE
}

// ─── COLLECTION ───────────────────────────────────────────

model Collection {
  id          String   @id @default(cuid())
  name        String   // e.g. "React Patterns", "Context Files"
  description String?
  isFavorite  Boolean  @default(false)

  defaultTypeId String?    // suggested type for new items in this collection
  defaultType   ItemType?  @relation("CollectionDefaultType", fields: [defaultTypeId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  items       ItemCollection[]
}

// ─── JOIN TABLE: Items ↔ Collections ────────────────────

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

// ─── TAGS ─────────────────────────────────────────────────

model Tag {
  id    String        @id @default(cuid())
  name  String

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items TagsOnItems[]

  @@unique([name, userId])
}

model TagsOnItems {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

---

## Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that controls display, routing, and behaviour.

- Items open in a **quick-access drawer** (no full page navigation)
- Items can be **pinned** (float to top), **favourited**, and tracked as **recently used**
- Text items use a **Markdown editor**
- File/Image items use a **file uploader** (Cloudflare R2, Pro only)
- Users can **import code from a file**
- Items can be **exported** as JSON or ZIP (Pro)

### B. Collections

- Group items of any type together
- An item can belong to **multiple collections** (many-to-many via `ItemCollection`)
- Collections have a `defaultTypeId` for new items
- Collections can be **favourited**

**Examples:**

| Collection | Typical Item Types |
|------------|-------------------|
| React Patterns | snippet, note |
| Context Files | file |
| Python Snippets | snippet |
| Interview Prep | snippet, note, link |

### C. Search

Full-text search across:

- Item **title**
- Item **content**
- **Tags**
- Item **type**

### D. Authentication

- Email / password
- GitHub OAuth
- Powered by **NextAuth v5**

### E. Other Features

| Feature | Detail |
|---------|--------|
| Favourites | Collections and individual items |
| Pin to top | Items can be pinned within a view |
| Recently used | `lastUsedAt` updated on access |
| Import from file | Code import for snippet/command types |
| Markdown editor | For all text-type items |
| File upload | File/Image types (Pro, via R2) |
| Export | JSON or ZIP (Pro) |
| Multi-collection | Add/remove items across multiple collections |
| Collection membership | View which collections an item belongs to |
| Dark mode | Default; light mode optional |

---

## Item Types Reference

### System Types (cannot be modified)

| Icon | Name | Color | Hex | Route | Content Type |
|------|------|-------|-----|-------|--------------|
| `<Code />` | snippet | Blue | `#3b82f6` | `/items/snippets` | TEXT |
| `<Sparkles />` | prompt | Purple | `#8b5cf6` | `/items/prompts` | TEXT |
| `<Terminal />` | command | Orange | `#f97316` | `/items/commands` | TEXT |
| `<StickyNote />` | note | Yellow | `#fde047` | `/items/notes` | TEXT |
| `<File />` | file | Gray | `#6b7280` | `/items/files` | FILE (Pro) |
| `<ImageIcon />` | image | Pink | `#ec4899` | `/items/images` | FILE (Pro) |
| `<Link />` | link | Emerald | `#10b981` | `/items/links` | URL |

> All icons from [Lucide React](https://lucide.dev/icons/).

### Custom Types (Pro — coming later)

Users will be able to define their own types with a custom name, icon, and color.

---

## URL Structure

```
/                          → Dashboard / home
/items                     → All items
/items/snippets            → Snippets
/items/prompts             → Prompts
/items/commands            → Commands
/items/notes               → Notes
/items/files               → Files (Pro)
/items/images              → Images (Pro)
/items/links               → Links
/collections               → All collections
/collections/[id]          → Individual collection
/search?q=...              → Search results
/settings                  → User settings
/settings/billing          → Billing / upgrade
/api/items                 → Items CRUD
/api/collections           → Collections CRUD
/api/upload                → File upload → R2
/api/ai/tag                → AI auto-tag
/api/ai/summarize          → AI summary
/api/ai/explain            → AI explain code
/api/ai/optimize-prompt    → AI prompt optimizer
```

---

## UI/UX Design System

### Layout

```
┌──────────────────────────────────────────────────────┐
│  Topbar (search, user avatar, quick-add button)      │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  Sidebar     │  Main Content Area                    │
│              │                                       │
│  Item Types  │  Collections grid (color-coded cards) │
│  ─────────── │  ↓                                    │
│  📄 Snippets │  Items grid (color-coded border cards)│
│  ✨ Prompts  │                                       │
│  > Commands  │  [Item opens in drawer →]             │
│  📝 Notes    │                                       │
│  🔗 Links    │                                       │
│  ─────────── │                                       │
│  Collections │                                       │
│  (latest 5)  │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

- Sidebar is **collapsible** (becomes a drawer on mobile)
- **Desktop-first**, mobile usable
- Collection cards: background tinted by the most common item type within
- Item cards: border coloured by type

### Design Principles

| Principle | Reference |
|-----------|-----------|
| Modern, minimal, dev-focused | Linear, Raycast |
| Dark mode by default | VS Code, GitHub |
| Clean typography, generous whitespace | Notion |
| Subtle borders and shadows | ShadCN defaults |
| Syntax highlighting in code blocks | Shiki / highlight.js |

### Micro-interactions

- Smooth drawer open/close transitions
- Hover states on collection and item cards
- Toast notifications for all CRUD actions
- Loading skeletons on data fetch
- Optimistic UI updates where possible

---

## Monetization

### Free Tier

| Limit | Value |
|-------|-------|
| Items | 50 total |
| Collections | 3 |
| Item types | All except file & image |
| Search | Basic (title + tags) |
| File uploads | ✗ |
| AI features | ✗ |

### Pro Tier — $8/month or $72/year

| Feature | Value |
|---------|-------|
| Items | Unlimited |
| Collections | Unlimited |
| Item types | All, including file & image |
| Search | Full-text across content |
| File & Image uploads | ✓ via Cloudflare R2 |
| AI auto-tagging | ✓ |
| AI code explanation | ✓ |
| AI prompt optimizer | ✓ |
| Export (JSON / ZIP) | ✓ |
| Priority support | ✓ |
| Custom types | Coming later |

> **Development note:** During active development, all users have access to Pro features. The `isPro` flag and limits are enforced in production only.

---

## AI Features

All AI features use **OpenAI `gpt-4o-mini`** via API routes. Pro only in production.

| Feature | Endpoint | What it does |
|---------|----------|-------------|
| **Auto-tag** | `POST /api/ai/tag` | Suggests relevant tags based on item title + content |
| **Summarize** | `POST /api/ai/summarize` | Generates a short description for any item |
| **Explain Code** | `POST /api/ai/explain` | Plain-English breakdown of a code snippet |
| **Prompt Optimizer** | `POST /api/ai/optimize-prompt` | Rewrites AI prompts to be clearer and more effective |

---

## System Architecture Diagram

```
                        ┌──────────┐
                        │  User    │
                        └────┬─────┘
                             │ HTTPS
                        ┌────▼─────────────────────┐
                        │     Next.js 16 App        │
                        │  ┌──────────┐ ┌────────┐  │
                        │  │  Pages   │ │  API   │  │
                        │  │  (SSR)   │ │ Routes │  │
                        │  └──────────┘ └───┬────┘  │
                        └──────────────────┬┘────────┘
                                           │
              ┌────────────────────────────┼───────────────────┐
              │                            │                   │
       ┌──────▼──────┐             ┌───────▼──────┐   ┌───────▼──────┐
       │  Neon Postgres│            │ Cloudflare R2 │   │  OpenAI API  │
       │  (via Prisma) │            │  File Storage │   │ gpt-4o-mini  │
       └──────────────┘            └──────────────┘   └──────────────┘
              │
       ┌──────▼──────┐
       │  NextAuth v5 │
       │  (sessions,  │
       │   accounts)  │
       └─────────────┘
```

---

## Key Decisions & Notes

- **Migrations only** — `prisma migrate dev` in development, `prisma migrate deploy` in CI/production. Never `db push`.
- **One repo** — Next.js handles both frontend and backend for minimal overhead.
- **Drawer pattern** — Items never navigate to a new page; they open in a right-side drawer for speed.
- **Item → Collections is many-to-many** — `ItemCollection` join table with `addedAt` timestamp.
- **Tags are per-user** — scoped by `userId`, not global, to avoid namespace collisions.
- **System types are seeded** — `isSystem: true`, `userId: null`. Seed script should run on first deploy.
- **File limits** — enforce file size and type restrictions on the API route before uploading to R2.
- **`lastUsedAt`** — updated whenever an item is opened, powering the "recently used" view without a separate table.
