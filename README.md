# Pathway (Phase 1)
React + TypeScript + Vite + Tailwind CSS 3 + React Router 6.

    npm install
    npm run dev        # dev server
    npm run build      # type-check + production build

Data lives in `src/data`. All access goes through `src/lib/characterRepository.ts` (async),
so a Supabase implementation can replace it without touching pages or components.
