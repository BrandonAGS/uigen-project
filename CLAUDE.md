# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies, generate Prisma client, and run migrations
npm run setup

# Development server (uses Turbopack + Node.js compatibility polyfill)
npm run dev

# Production build
npm run build

# Run tests (Vitest)
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Lint
npm run lint

# Reset database
npm run db:reset
```

Set `ANTHROPIC_API_KEY` in `.env` to enable real AI generation. Without it, the app runs with a mock provider that returns static code.

## Code Style

- Use comments sparingly — only comment complex or non-obvious code.

## Architecture

UIGen is a Next.js 15 app that lets users generate React components via chat with Claude. Components are rendered live in a sandboxed iframe using a virtual (in-memory) file system — no files are written to disk.

### Three-Panel UI Layout

`src/app/main-content.tsx` (client component) renders:
- **Left (35%):** Chat interface
- **Right (65%):** Tabbed panel — "Preview" (live iframe) or "Code" (file tree + Monaco editor)

Two context providers wrap the layout:
- `FileSystemProvider` — manages the virtual file system and handles tool calls from AI
- `ChatProvider` — wraps Vercel AI SDK's `useChat`, sends file system state with each request

### Virtual File System

`src/lib/file-system.ts` — A complete in-memory FS with CRUD, directory support, rename (recursive path updates), and JSON serialization for persistence.

`src/lib/contexts/FileSystemContext.tsx` — React context over the FS. Handles AI tool calls (`str_replace_editor`, `file_manager`) that create/edit/rename/delete files.

### AI Integration & Chat API

`src/app/api/chat/route.ts` — POST endpoint that:
1. Deserializes the virtual file system from the request
2. Calls Anthropic Claude via Vercel AI SDK with tool use enabled
3. Runs up to 40 tool steps (4 for mock); times out at 120s; max 10,000 tokens
4. Uses prompt caching (`ephemeral` cache control) for efficiency
5. Saves messages + file system state to the database for authenticated users

Tools available to Claude: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete files). Defined in `src/lib/tools/`.

System prompt is in `src/lib/prompts/generation.tsx`.

### Live Preview

`src/components/preview/PreviewFrame.tsx` — Finds the entry point (`App.jsx`/`App.tsx`/`index.jsx`/`index.tsx`) in the virtual FS, then:
1. Transforms JSX/TSX → JS using Babel standalone (`src/lib/transform/jsx-transformer.ts`)
2. Builds an ES module import map for dependency resolution
3. Injects everything into a sandboxed iframe for isolated rendering

### Authentication & Persistence

- JWT sessions via `jose` with HTTP-only secure cookies, 7-day expiry (`src/lib/auth.ts`)
- Middleware at `src/middleware.ts` checks auth on protected routes
- Database: SQLite via Prisma. Schema in `prisma/schema.prisma` — `User` and `Project` models. Projects store messages and file system state as JSON strings.
- Anonymous users can generate components; their work is tracked in `src/lib/anon-work-tracker.ts` and they're prompted to sign up.

### Routing

- `/` — Homepage: redirects authenticated users to their latest project or auto-creates one; shows landing for anonymous users
- `/[projectId]` — Project page (requires auth); loads project from DB and renders `MainContent`
- `/api/chat` — Streaming chat endpoint

### Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4, Radix UI, Shadcn/ui (New York style), Lucide icons
- Monaco Editor for code editing
- Vitest + jsdom for testing
- Prisma + SQLite


