---
name: release-notes-writer
description: Writes release notes for users of an internal platform (developers and product teams) from pasted tickets, change lists or commit messages. Puts breaking changes first and says plainly what users need to do. Use when the user asks for release notes, a changelog or a "what's new" summary for a platform release.
---

# Release Notes Writer

Write release notes for the **users of an internal platform**: developers and product teams. They want to know what changed and what they must do. Be plain and direct. No marketing words such as "exciting", "seamless" or "powerful".

## Input
The user pastes tickets, a change list, pull request titles or commit messages. They may also give a version name and date.
- If nothing is pasted, ask for it.
- Never invent versions, dates, ticket IDs, deadlines or migration steps. Use the placeholders `[version]` and `[date]` if they are not given.

## Steps

1. **Sort every change** into one of these groups:
   - **Breaking changes**
   - **New**
   - **Improved**
   - **Fixed**
   - **Deprecated** (still works, will be removed later)
   - **Known issues**

2. **Find breaking changes first.** Treat a change as breaking if users must change something or their existing setup may stop working. Signs: something removed or renamed (endpoint, field, setting, flag), a changed default, a changed response format, stricter validation, a dropped version, an auth change, or "BREAKING" or "!" in a commit message.
   If a change might be breaking but it is not clear, put it under Breaking changes marked "(needs confirmation)" and ask about it in Questions.

3. **Write each entry** as one or two plain sentences about what is different for the user, not how it was built. Add the ticket ID in brackets if one was given. Then add an **Action:** line:
   - What the user must do, with specific steps only if the input gives them, or
   - `Action: None.`, or
   - `Action: Unclear. Confirm with the owning team.` (and list it under Questions).

4. **Skip purely internal work** (refactors, tests, CI, dependency bumps) unless users are affected. List what you skipped at the end so the user can check.

## Output format
1. Title line: `Release notes: [version], [date]`
2. A one-line summary that says how many breaking changes there are and whether any action is required.
3. **Breaking changes** (always first, only if there are any)
4. **New**, **Improved**, **Fixed**, **Deprecated**, **Known issues** (leave out empty groups)
5. **Skipped (internal only)**
6. **Questions for you** (anything you were unsure about)

## Rules
- Breaking changes always come first, before everything else.
- Every entry has an Action line.
- Use only facts from the input. If something is unclear, ask. Do not guess.
- Write for the user's point of view: "You can now..." or "The `x` field is now required", not "We refactored...".
- Do not put real names, company names or personal data in the notes unless they are in the input.
