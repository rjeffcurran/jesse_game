Now implement precisely as planned, in full.

Implementation Requirements:

- Write elegant, minimal, modular code.
- Adhere strictly to existing code patterns, conventions, and best practices.
- Include thorough, clear comments/documentation within the code.
- As you implement each step:
  - Update the markdown tracking document with emoji status and overall progress percentage dynamically.

## Committing Changes

When creating commits, always include the Linear ticket ID in the commit message so changes automatically link to the ticket in Linear (GitHub ↔ Linear integration is active).

Format:
```
<type>: <short description>

<Linear ticket ID>  ← e.g. CON-123
```

To auto-close the ticket on PR merge, use:
```
fixes CON-123
```

If the user has not provided a Linear ticket ID, ask before committing.

## Updating the Plan in Linear

When all steps are complete, update the plan comment on the Linear issue to reflect final status. Use `mcp__linear__save_comment` with the comment `id` (not `issueId`) to update the existing comment in place rather than posting a new one. The comment ID is available from when the plan was originally saved. Do this automatically without being asked.

- If all steps succeeded: mark progress `100%`, all tasks `🟩`
- If any steps failed or were skipped: keep those tasks `🟥`, note the errors inline under the relevant step, and set progress to reflect actual completion (e.g. `80%`)