# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbo (main project)
- `npm run build` - Build the production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

Note: There are two separate Next.js projects in this repository:
- Main project (root directory) - Full tools application with all utilities
- `/tools-app/` directory - Minimal Next.js template (likely unused)

## Architecture Overview

This is a Japanese utility tools application built with Next.js 15 and TypeScript. The architecture follows a structured, category-based approach:

### Tool Organization Structure
- All tools are organized into categories defined in `src/lib/tools-config.ts`
- Each tool has its own page at `/src/app/tools/{tool-id}/page.tsx`
- Categories include: 文字列処理 (text processing), エンコーディング (encoding), 日付・時間 (datetime), 日本文化 (Japanese culture), 開発者ツール (dev tools), 生成ツール (generators), ユーティリティ (utilities)

### Component Structure
- `ToolLayout` component (`src/components/layout/tool-layout.tsx`) provides consistent layout for all tools
- `CopyButton` component provides copy-to-clipboard functionality
- UI components based on shadcn/ui (Radix UI + Tailwind CSS)
- Components use "new-york" style variant

### Key Dependencies
- **UI Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives via shadcn/ui
- **Icons**: Lucide React
- **Utilities**: crypto-js, date-fns, js-yaml, qrcode, uuid

### Tool Implementation Pattern
Each tool follows this pattern:
1. Uses `ToolLayout` wrapper with title and description
2. Implements real-time processing with React state and `useMemo`
3. Provides copy functionality for results
4. Includes usage instructions and help text
5. Uses card-based layout for organized display

### Japanese-Specific Features
- Application is fully localized in Japanese
- Includes specialized Japanese text processing (hiragana, katakana, kanji detection)
- Japanese cultural tools like 法要計算機 (memorial service calculator) and 和暦西暦変換 (Japanese era conversion)
- Character encoding considerations for Japanese text (UTF-8, Shift_JIS)

### File Conventions
- Tool pages: `/src/app/tools/{tool-id}/page.tsx`
- Shared components: `/src/components/`
- Configuration: `/src/lib/tools-config.ts`
- Types: `/src/types/index.ts`
- Utilities: `/src/lib/utils.ts`

When adding new tools, register them in `tools-config.ts` with appropriate category, icon, and path, then create the corresponding page component following the established pattern.