# Commit Task

Commit and push all changes, then link commits to the relevant Linear issue.

## Steps

1. **Review staged/unstaged changes**
   - Run `git status` and `git diff` to understand what will be committed
   - Flag any files that look like temp files, secrets, or unintentional inclusions — do not commit them
   - If anything is ambiguous, ask before proceeding

2. **Write the commit message**
   - Follow the existing commit style in `git log`
   - Focus on the "why", not just the "what"
   - Scope to the Linear issue ID if one is active (e.g. `feat(RJE-5): ...`)
   - Always append: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

3. **Stage and commit**
   - Stage specific files by name — never `git add -A` or `git add .` blindly
   - Commit using a HEREDOC to preserve formatting

4. **Push**
   - Push to the current branch's upstream
   - If no upstream is set, use `git push --set-upstream origin <branch>`

5. **Apply Supabase migrations (if relevant)**
   - Skip this step entirely if the commit contains no files under `supabase/migrations/`
   - If migrations are present:
     1. Run `supabase status` to show which project is linked — confirm it looks correct before proceeding
     2. Run `supabase db push` to apply all pending migrations
     3. Report success or surface any errors
   - The Git commit containing the migration files is the linkable artifact for Linear — no separate Supabase link is needed. The commit link added in step 6 covers the migrations.

6. **Link commits to Linear**
   - Use `mcp__linear__save_issue` with the `links` and `state` parameters to attach commits and mark done in a single call
   - Commit URL format: `https://github.com/<owner>/<repo>/commit/<sha>`
   - If no Linear issue is active in context, ask for the issue ID before pushing
   - Mark the issue `Done` if all plan tasks are complete
   - **IMPORTANT:** `links` must be passed as a structured JSON array, not a string. Example:
     ```
     links: [{"url": "https://github.com/org/repo/commit/abc123", "title": "feat: my change"}]
     state: "Done"
     ```
   - Using `state: "Done"` (the name) works directly — no need to look up the status ID first
