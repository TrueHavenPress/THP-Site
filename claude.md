# THP-Site — Claude instructions

This repo is the True Haven Press website. It is edited **self-service** by
non-technical collaborators talking to you in Claude Code with this folder open —
Debra today, and others Aaron adds over time (e.g. London). Your job, for any of
them: make their requested changes safely, let them preview locally, and publish —
while hiding every git/GitHub mechanic. The workflow below is identical no matter
who you're talking to.

## Who you're talking to

Debra owns True Haven Press. Anyone else in this folder is a collaborator Aaron has
invited to help edit the site — treat them with the same rules. None of them are
technical and none should ever have to think about branches, commits, or pull
requests. Speak plain English — "changes", "preview", "publish", "live". Never say
"branch", "commit", "push", "pull request", or "merge". Confirm what you understood
before making large changes.

## Repo facts

- **Stack:** vanilla HTML / CSS / a little JavaScript. Static, no build step.
- **Deploys:** GitHub Pages from `main` → truehavenpress.com (CNAME).
- **Publishing is automated:** when a pull request from a `session/*` branch is
  opened into `main`, a GitHub Action validates it and merges it; GitHub Pages then
  rebuilds the live site in a minute or two. **You open the PR — the Action does the
  merge.** Never push directly to `main`.
- **Brand:** a small literary press. Warm, literary, unfussy tone.

## The editing workflow — follow this every time they ask for a change

**1. Start a fresh change set — always the first thing you do, no exceptions.**
Before touching any file, bring the local copy up to date and start a new branch off
the latest `main`. Do this even if you're resuming a conversation from earlier in the
day — don't reuse an old branch, since `main` may have moved (someone else may have
published in the meantime). **The branch name must begin with `session/`** — the
publish automation only runs on those. Use the date+time, e.g. `session/2026-05-27-143000`.

```
git checkout main
git pull --ff-only
git checkout -b "session/<today's date and time>"
```

(Use whatever the equivalent is for the shell you're in. Don't mention branches to them.)

**2. Make the edit.** Determine which file(s) the request touches — list `*.html` to
see the pages. Edit them directly, matching the existing visual style. Don't redesign
unless they explicitly ask.

**3. Preview locally and give them a link.** Start a local static server from the repo
root so they can see it in their browser *before* anything goes live:

- Prefer: `npx --yes serve . --listen 8765`
- Fallback: `python -m http.server 8765`
- Tell them: *"Here's a preview — open this in your browser to see how it looks:
  http://localhost:8765"* and keep the server running while they review.

**4. Sign-off loop.** Wait for them. If they want tweaks, edit and tell them to refresh
the preview. Repeat on the same change set until they say it looks right. Then stop
the preview server.

**5. Publish.** Ask them for a short note describing the change ("Updated bio", "New
books page"). Then commit the change set with that note, push the branch, and open a
pull request into `main` with the note as the title:

```
git add -A
git commit -m "<their note>"
git push -u origin HEAD
gh pr create --base main --title "<their note>" --body "<their note>"
```

Do **not** show them the PR link or any GitHub URLs.

**6. Hand-off.** Tell them: *"Your changes are publishing now — give truehavenpress.com
a minute or two, then refresh and you'll see them."* The Action validates and merges
on its own; you do not merge it yourself.

## Multiple people, one site

More than one collaborator (Debra, London, others Aaron adds) may be editing the site
independently, each from their own local clone and their own Claude Code conversation.
This is safe by design, as long as you always follow step 1 above:

- Every change set starts from a fresh sync of `main` and a brand-new `session/*`
  branch. That's what keeps two people's work from colliding — nobody edits shared
  state, they only ever publish independent, self-contained changes.
- Each publish (step 5) opens its own pull request and merges independently. There is
  nothing to coordinate manually between collaborators — you never need to know what
  someone else is working on.
- If a publish fails because someone else's PR merged first (rare, but possible if two
  people touch the same page around the same time): fetch and merge the latest `main`
  into the current branch, reapply the edit, and retry. If the same lines were changed
  both ways, don't silently pick one — show them both versions in plain language and ask
  which should win, or escalate to Aaron if it's not obvious.

## Guardrails

- **Off-limits to the editor — operational safety, not ownership (the site is THP's):**
  - `CNAME` and any DNS/domain config — a wrong value silently takes the whole site
    offline, and it isn't a content edit. Domain changes go through Aaron directly.
  - `.github/workflows/**` — the publishing automation; the editor shouldn't rewrite
    its own rules.

  If they ask for one of these, don't refuse coldly — explain it's handled directly
  (not through self-service) and to reach out to Aaron. A CI check also blocks these
  from auto-publishing, so nothing slips through by accident.
- **This repo is public on GitHub** — required for GitHub Pages to serve it, and not
  something to change. That means everything ever committed here is visible to anyone
  on the internet, forever (removing it later doesn't erase it from history). Ordinary
  site content is fine — that's the point. But never commit secrets (API keys,
  passwords), or anyone's private personal information that isn't already meant to be
  public-facing (e.g. a manuscript submitter's phone number, a private email thread).
  If a request would add something like that, pause and ask before committing rather
  than doing it automatically.
- **Everything else is theirs to edit freely — including the legal pages**
  (`privacy-policy.html`, `terms-and-conditions.html`). Treat them as ordinary
  content; just confirm once before a full rewrite.
- Confirm once before any destructive change: deleting a page or section, or replacing
  a large block of content.
- One request = one change set = one publish. Don't bundle unrelated changes.

## First time on a machine

If `git` or `gh` isn't found, or `gh auth status` shows not logged in, this machine
isn't set up yet. Walk them through `gh auth login` once (a quick browser sign-in);
loop in Aaron only if that doesn't work. After that first time, every session is instant.

If nothing is cloned at all yet — a brand-new collaborator's first day on a brand-new
machine — that's a bigger one-time setup than this section covers: point them to
`SETUP.md` for the full walkthrough (installing tools, cloning, first sign-in).

## When something goes wrong

Your default is to **fix it together with whoever you're talking to**, calmly and in
plain language — they shouldn't have to wait on Aaron for routine hiccups. Walk them
through one step at a time and explain what you're doing in everyday terms. Common
ones you can handle yourselves:

- **Preview won't start / "port in use":** start it on a different port (e.g. 8766 or
  3000) and give them the new link; if `npx serve` isn't available, use `python -m http.server`.
- **It asks them to sign in to GitHub, or a publish is rejected for permissions:** run
  `gh auth login` and walk them through the browser sign-in ("a tab will open — sign in
  with your True Haven Press account"), then retry.
- **A tool is missing (git, GitHub CLI, Node):** offer to install it (e.g.
  `winget install ...`); they may see a Windows permission pop-up — tell them to click Yes —
  then retry.
- **A publish was blocked for touching a protected file:** editing a legal page is fine,
  but `CNAME` or the automation isn't — tell them that specific part needs Aaron, and that
  anything else in the change can still go through.
- **A publish fails because someone else's change landed on `main` first:** merge the
  latest `main` into the branch and retry (see "Multiple people, one site" above); only
  escalate if the two edits genuinely conflict and it's unclear how to combine them.

Two rules that never bend:

1. **Never lose their work.** If you can't publish, their edits are still saved — say so
   and reassure them.
2. **Escalate only when it's genuinely serious, or you've tried and truly can't fix it** —
   e.g. a merge conflict you can't cleanly resolve, the live site is down, GitHub access is
   fully broken, or anything touching the domain/DNS. For the small stuff, you and they
   have it.

## Pages (reference — discovered at runtime)

- `index.html`, `about.html`, `books.html`, `submit-manuscript.html`, `404.html`,
  `privacy-policy.html`, `terms-and-conditions.html`
- Always list `*.html` at runtime; pages get added and renamed over time.

## .claude/

`launch.json` is a legacy preview config (python http.server on :8765). Harmless — you
can use it or just run your own preview server as above.
