# Getting set up (one time only)

This is a one-time, maybe 10-minute setup — and you do it by talking to Claude, the
same way you'll talk to it every time after this to change something on the site. See
[README.md](README.md) for what that day-to-day conversation looks like.

## Before you start

You'll need the **Claude Code** app on your computer. If it's not already there,
download it from [claude.com/claude-code](https://claude.com/claude-code) and open it
— that's the only part that happens outside a conversation with Claude.

## Step 1: Accept the email invite

Check your email for an invitation to the True Haven Press team on GitHub (GitHub is
where the site's files live) and accept it. If you don't already have a GitHub
account, accepting will offer to create one for you — go ahead.

**Remember which GitHub account you used** — you'll sign in with that same one in the
next step.

## Step 2: Open Claude Code and paste this in

Once you're in Claude Code, copy this whole block and send it as your first message:

> I'm London, and I've just accepted an invite to the True Haven Press GitHub team.
> Please get my computer set up to work on the True Haven Press website:
> check whether Git and the GitHub CLI are installed, and install them if not; sign me
> into GitHub (I'll pick the account I used to accept the invite); and then get me my
> own copy of the site's files from TrueHavenPress/THP-Site. Put it in a plain local
> folder — not inside OneDrive, Dropbox, Google Drive, or any other cloud-backup
> folder, since those sometimes try to sync files while we're actively changing them
> and that can quietly overwrite or lose edits. Somewhere simple like a folder directly
> under my user folder is fine. Walk me through anything you need me to click along the
> way, and tell me exactly what to do once it's done.

Claude takes it from there. Along the way you might see:

- **A browser tab asking you to sign into GitHub** — sign in with the account from
  Step 1.
- **A Windows pop-up asking for permission to install something** — click Yes.

Neither of those is anything to worry about — just follow along, and ask Claude if
anything is unclear.

## Step 3: Open your new folder

When Claude tells you it's done, it will have created a folder called `THP-Site`
somewhere on your computer (Claude will tell you exactly where). Open that folder in
Claude Code — that's your personal working copy of the site's files, and it's the
folder you'll open every time from now on.

From here, you're set up the same as everyone else: open Claude Code in that folder,
say what you'd like to change, preview it, and publish when you're happy. See
[README.md](README.md) for what that actually feels like.

**Why isn't this folder inside OneDrive or Dropbox?** On purpose. GitHub is already
the real, permanent copy of every page — this local folder is just a quick working
spot to make edits before they publish. Cloud-backup services sometimes sync files
mid-edit, which can collide with what's happening and cause changes to vanish or get
overwritten. Keeping it plain and local avoids that entirely, and nothing is lost by
skipping the backup — GitHub already has it covered.

## One thing worth knowing

The True Haven Press site's files live in a **public** place on GitHub — that's just
how the site works, not something you need to manage. It just means anything ever
saved there can, in principle, be seen by anyone, permanently. So: never ask Claude to
add something private — a password, someone's personal phone number, anything from a
manuscript submission you wouldn't want a stranger to see. If you're ever unsure, ask
Claude, or check with Aaron.

## If something doesn't work

Tell Claude — it can walk you through almost anything that comes up during setup, the
same way it walks you through everyday edits: a missing tool, needing to sign in
again, whatever it is. If it's genuinely stuck, text Aaron.

---

### Technical reference (what Claude is actually doing in Step 2 — you don't need to run any of this yourself)

```
winget install --id Git.Git -e
winget install --id GitHub.cli -e
gh auth login
gh repo clone TrueHavenPress/THP-Site
```
