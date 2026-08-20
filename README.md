# LeadGuard by abcstudio

LeadGuard gives a small service business one calm place to see who needs attention, record customer outcomes, schedule follow-ups, and rescue opportunities before they go cold.

## Run locally

```bash
pnpm install
vercel link --scope team-courage --project leadguard
vercel env pull .env.local
pnpm dev
```

Open `http://localhost:3000`. The v1 demo is intentionally available without a login and uses the seeded Supabase records.

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Database changes live in `supabase/migrations`. Deployments are Git-driven from `main`; do not deploy local files with the Vercel CLI.

Production: [leadguard-taupe.vercel.app](https://leadguard-taupe.vercel.app)
