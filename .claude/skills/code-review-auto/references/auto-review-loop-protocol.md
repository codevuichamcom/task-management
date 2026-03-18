# Auto Review Loop Protocol

Step-by-step protocol for automated code review → fix → commit → re-review cycles.

## Prerequisites

Before starting the loop:
1. Ensure working directory is clean or has staged changes
2. Identify current branch and base SHA
3. Parse arguments: `--max-cycles`, `--no-commit`, `--scope`

## Protocol

### Step 1: Initialize

```
Set cycle = 1
Set maxCycles = args.maxCycles || 3  (cap at 5)
Set totalFixed = { critical: 0, high: 0 }
Set totalRemaining = { medium: 0, minor: 0 }
Set commitShas = []
```

### Step 2: Run Code Review

Activate `/code-review` skill — dispatch `code-reviewer` subagent:

```
BASE_SHA = git rev-parse HEAD~1  (or origin/main if first review)
HEAD_SHA = git rev-parse HEAD

Dispatch code-reviewer with:
  WHAT: "All changes on current branch"
  BASE_SHA, HEAD_SHA
  SCOPE: args.scope || entire diff
```

Wait for reviewer findings.

### Step 3: Parse Findings

Categorize each finding by severity:

```
criticalIssues = findings.filter(severity == "Critical")
highIssues = findings.filter(severity in ["High", "Important"])
mediumIssues = findings.filter(severity == "Medium")
minorIssues = findings.filter(severity in ["Minor", "Low"])
```

**If no critical + high issues → GOTO Step 7 (done)**

### Step 4: Fix Critical + High Issues

For each issue in `criticalIssues + highIssues`:

1. Read the affected file(s)
2. Apply the **recommended fix** from the reviewer
   - If reviewer provided specific code change → apply it
   - If reviewer provided guidance → implement minimal fix
3. After each fix, run compile check:
   ```bash
   # Use project's build command (detect from package.json, Makefile, etc.)
   pnpm build 2>&1 | tail -20  # or equivalent
   ```
4. If compile fails → revert the fix, try alternative approach
5. If alternative also fails → log as "unfixable", continue to next issue

After all fixes applied:
- Run test suite if available
- If tests fail → identify which fix broke tests, revert that fix
- Track fixed count: `totalFixed.critical += fixed_critical_count`

### Step 5: Commit (unless --no-commit)

If `--no-commit` flag → skip to Step 6.

Stage and commit using `/git cm` pattern:

```bash
git add -A
git diff --cached | grep -iE "(api[_-]?key|token|password|secret|credential)"
# If secrets found → STOP, warn user

git commit -m "$(cat <<'EOF'
fix(review): address code review cycle {N} findings

- Fixed: {X} critical, {Y} high issues
- Remaining: {M} medium, {N} minor (not auto-fixed)
EOF
)"
```

Record: `commitShas.push(newSha)`

### Step 6: Check Loop Condition

```
cycle += 1

IF cycle > maxCycles:
  → GOTO Step 7 with warning "max cycles reached"

IF unfixed critical/high issues exist:
  → GOTO Step 2 (re-review)

ELSE:
  → GOTO Step 2 (re-review to verify fixes didn't introduce new issues)
```

### Step 7: Final Report

Generate summary report:

```
═══ Code Review Auto ═══

Cycle 1/{maxCycles}:
  Review: {counts by severity}
  Fixed: {counts}
  Committed: {sha} {message}

...repeat for each cycle...

Summary:
  Total cycles: {N}
  Fixed: {X} critical, {Y} high
  Remaining: {M} medium, {N} minor (not auto-fixed)
  Commits: {sha1}, {sha2}, ...
  Status: CLEAN | MAX_CYCLES_REACHED | ESCALATED
═══════════════════════════
```

**If remaining critical/high after max cycles:**
- List each unfixed issue with file, line, description
- Recommend manual intervention

## Edge Cases

- **No changes:** Skip — "Nothing to review."
- **No issues found:** Report clean immediately.
- **Fix introduces new issue:** Re-review in next cycle catches it.
- **Circular fixes** (same file+line in 2+ cycles): Stop, escalate to user.
- **>20 critical+high:** Warn user before proceeding.
- Activates `/code-review` internally — do not re-activate manually
- Each cycle is atomic: review → fix → compile → test → commit
