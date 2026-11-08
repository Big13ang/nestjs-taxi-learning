# Day 1 prep — do today (Sun 8 Nov), ~15 min, so Mon 9 Nov 21:00 isn't blocked

First session: **Mon 9 Nov, 21:00–00:00 Asia/Tehran** — Ch 1 lessons 1–3
(Intro 7m, Library vs Framework + Install 14m, Generics 26m).
Build: scaffold the app, strict TypeScript.

## 1. Toolchain check — paste into your Mac terminal, one block

```bash
node -v; npm -v; pnpm -v; npx --yes @nestjs/cli --version
docker --version; docker ps 2>&1 | head -3
redis-cli ping 2>&1; psql --version 2>&1
```

What good looks like:

| Tool | Need it Monday? | Good |
|---|---|---|
| Node | **Yes** | **22.23.4+ or 24.22.1+** — those are the versions with the Node2Shell (CVE-2026-111497) Brotli fix. Node 20 gets no fix, so if `node -v` says 20.x, upgrade before Monday rather than during the session. |
| pnpm | **Yes** | Any recent 9.x/10.x. The course project (Ch 4) is a PNPM monorepo, so install now: `corepack enable && corepack prepare pnpm@latest --activate` |
| Nest CLI | **Yes** | Comes via `npx` on first use — no global install needed. |
| Docker | Later | Needed from Week 2 (Postgres/TypeORM) and Week 4. If it's not running today, just note it — don't burn Sunday fixing it. |
| Postgres / Redis locally | Later | Same — Week 2/3. `redis-cli ping` answering `PONG` is a bonus, not a Monday blocker. |

If Node is the only thing wrong, fix just that today. Everything else can wait for its week.

## 2. Monday scaffold — run this at 21:00, inside your repo folder

```bash
# inside nestjs-taxi-learning/
npx @nestjs/cli new taxi-app --package-manager pnpm --strict --skip-git
cd taxi-app && pnpm run start:dev
# expect: Nest application successfully started, listening on localhost:3000
```

`--skip-git` matters: the parent `nestjs-taxi-learning` folder is the git repo,
so the app inside it must not initialise its own repo.

## 3. If the GitHub repo still isn't visible — don't let it block Monday

Status as of Sun 8 Nov ~06:50 Tehran (last connector re-check): `Big13ang/nestjs-taxi-learning`
still returns 404 to the connector and the repo list is still 37 — nothing pushed,
Pages not live. It may exist under a different name/owner, or creation didn't finish.

Workaround, no waiting required:

1. Scaffold and build locally on your Mac as above; commit locally (`git init` only
   if the folder isn't a repo yet, then `git add . && git commit -m "week 1: scaffold"`).
2. When you have the exact repo URL (`github.com/<owner>/<name>`), send it to Muse —
   the push + Pages setup from the already-built local scaffold is then one step.
3. Your notes workflow is unaffected: send raw notes in chat as usual; Muse decorates
   them into `docs/` locally and they go live with the first push.

## 4. Don't do today

- Don't start Chapter 1 early — Week 1 is already the heaviest (454 min).
- Don't port anything to InShop mid-course — keep a transfer list, apply after 6 Dec.
- Don't reinstall your whole toolchain. One failing check above = fix that one thing.
