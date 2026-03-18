---
name: code-review-auto
description: "Automated code review loop: run /code-review, fix all critical+high issues using recommended options, commit, re-review until clean. Use when you want hands-free review-fix-commit cycles."
version: 1.0.0
---

# Automated Code Review Loop

Run `/code-review` → fix critical/high issues → commit → re-review until clean.

## Core Principle

**Zero critical/high tolerance.** Loop until the codebase passes review with no Critical or High (Important) severity issues remaining.

## Arguments

- *(none)*: Review current changes on working branch
- `--max-cycles N`: Limit fix cycles (default: 3, max: 5)
- `--no-commit`: Fix issues but skip auto-commit (user commits manually)
- `--scope <glob>`: Limit review scope (e.g., `src/api/**`)

## Workflow

Read and follow the full protocol: `references/auto-review-loop-protocol.md`

### Quick Reference

```
START
│
├─ 1. Run /code-review (delegate to code-reviewer subagent)
│
├─ 2. Parse findings by severity:
│     Critical → MUST fix
│     High/Important → MUST fix
│     Medium/Minor → SKIP (log for user)
│
├─ 3. Fix all Critical + High issues
│     - Use recommended fix from reviewer
│     - Run compile check after each fix
│     - Run tests if available
│
├─ 4. Commit fixes (unless --no-commit)
│     - Use /git cm with conventional commit
│     - Message: "fix(scope): address code review findings"
│
├─ 5. Re-run /code-review
│     - If Critical/High remain → loop back to step 3
│     - If clean → DONE
│     - If max cycles reached → STOP, report remaining to user
│
└─ END: Report summary of all cycles
```

## Severity Mapping

| Reviewer Term | Action | Auto-fix? |
|---------------|--------|-----------|
| Critical | Block — fix immediately | Yes |
| High / Important | Block — fix before proceeding | Yes |
| Medium | Log — report to user | No |
| Minor / Low | Skip — cosmetic only | No |

## Commit Strategy

Each fix cycle = one commit. Message format:
```
fix(review): address code review cycle {N} findings

- Fixed: {count} critical, {count} high issues
- Remaining: {count} medium, {count} minor (not auto-fixed)
```

## Safety Rails

- **Max 3 cycles** by default (override with `--max-cycles`)
- **Never exceed 5 cycles** — if still failing, escalate to user
- **Compile check** after every fix — revert if fix breaks build
- **Test check** after every fix cycle — revert if tests fail
- **No scope creep** — only fix issues flagged by reviewer, don't refactor
- **Preserve behavior** — fixes must not change functionality

## Error Handling

| Situation | Action |
|-----------|--------|
| Fix breaks build | Revert fix, try alternative approach |
| Fix breaks tests | Revert fix, report to user |
| Max cycles reached | Stop, report remaining issues |
| No issues found | Skip — report clean |
| Reviewer fails | Fall back to manual review |

## Output Format

```
═══ Code Review Auto ═══

Cycle 1/3:
  Review: 2 critical, 3 high, 5 medium, 2 minor
  Fixed: 2 critical, 3 high
  Committed: abc1234 fix(review): address code review cycle 1 findings

Cycle 2/3:
  Review: 0 critical, 1 high, 4 medium, 2 minor
  Fixed: 0 critical, 1 high
  Committed: def5678 fix(review): address code review cycle 2 findings

Cycle 3/3:
  Review: 0 critical, 0 high, 3 medium, 2 minor
  ✓ CLEAN — no critical/high issues remaining

Summary:
  Total cycles: 3
  Fixed: 2 critical, 4 high
  Remaining: 3 medium, 2 minor (not auto-fixed)
  Commits: abc1234, def5678
═══════════════════════════
```

## Integration

- Activates `/code-review` skill for review dispatch
- Activates `/git` skill for commit operations
- Uses `code-reviewer` subagent type for reviews
- Uses `code-simplifier` subagent for complex fixes when needed

## References

- `references/auto-review-loop-protocol.md` - Full step-by-step protocol
