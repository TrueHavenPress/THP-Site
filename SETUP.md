# Getting set up (one time only)

Getting set up is quick, and you won't be doing it alone — Aaron (and Claude) walk
through it with you the first time. After this, changing something on the site is
just a conversation — see [README.md](README.md) for what that looks like day to day.

## What happens

- You'll get an email invitation to join the True Haven Press team on GitHub — that's
  the service that stores the site's files. Accepting it is the only part that's
  really "yours" to do; everything after that, Aaron and Claude set up together with
  you.
- A couple of small, invisible helper programs get installed on your computer. You
  won't ever open or think about them again after this.
- Claude Code gets installed — this is the app you'll actually talk to every time you
  want to change something.
- You end up with your own personal copy of the site's files, sitting quietly in a
  folder on your computer, ready for Claude to work with whenever you open it.

None of this requires you to type commands, understand what a "repository" is, or
learn any new software beyond opening an app and having a conversation.

## What you'll actually do

1. **Open the email invite** from GitHub and accept it. (No account yet? It'll offer
   to make you one — takes a minute.)
2. **Sit down with Aaron (or Claude) once**, in person or on a call, while everything
   else gets installed and connected. One-time, maybe 15 minutes.
3. **From then on**, whenever you want to change something on the site: open Claude
   Code and talk to it. That's the whole routine — see [README.md](README.md).

## One thing worth knowing

The True Haven Press site's files live in a **public** place on GitHub — that's just
how the site works, not something you need to manage. It just means anything ever
saved there can, in principle, be seen by anyone, permanently. So: never ask Claude to
add something private — a password, someone's personal phone number, anything from a
manuscript submission you wouldn't want a stranger to see. If you're ever unsure, ask
Claude, or check with Aaron.

## If something doesn't work

Tell Claude — it can walk you through almost anything that comes up, the same way it
walks you through everyday edits. If it's genuinely stuck, text Aaron.

---

### Technical reference (for Aaron / Claude to run during the sit-down — not for London)

```
winget install --id Git.Git -e
winget install --id GitHub.cli -e
gh auth login
gh repo clone TrueHavenPress/THP-Site
```
Then open the resulting `THP-Site` folder in Claude Code.
