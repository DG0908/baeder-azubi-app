"""
Removes all Supabase dual-mode branches from dataService.js.
Keeps only the NestJS (USE_SECURE_API) path, drops supabase param.

Strategy: use brace-depth counting to extract exactly the content of the
  if (USE_SECURE_API) { ... }
block, write it in-place, then skip to the closing brace of the OUTER function.

The outer function close is always at indent level 0 (top-level arrow functions).
"""
import re

with open('src/lib/dataService.js', 'r', encoding='utf-8') as f:
    src = f.read()

lines = src.splitlines(keepends=True)
out = []
i = 0
total = len(lines)


def find_block_end(lines, start):
    """Find the line index of the matching closing } for the { on lines[start]."""
    depth = 0
    for j in range(start, len(lines)):
        for ch in lines[j]:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return j
    return len(lines) - 1


while i < total:
    line = lines[i]
    stripped = line.rstrip()

    # ── Remove: const USE_SECURE_API = ...
    if re.match(r'^const USE_SECURE_API\s*=', stripped):
        i += 1
        continue

    # ── Remove: export { USE_SECURE_API }
    if re.match(r'^export\s*\{\s*USE_SECURE_API\s*\}', stripped):
        i += 1
        continue

    # ── Remove isSecureBackendApiEnabled import  (already gone, but safety)
    if 'isSecureBackendApiEnabled' in line and line.strip().startswith('import'):
        i += 1
        continue

    # ── Fix function signatures: remove supabase as first parameter
    if re.search(r'\basync\s*\(\s*supabase\b', line) or re.search(r'=>\s*async\s*\(\s*supabase\b', line):
        line = re.sub(r'\(\s*supabase\s*,\s*', '(', line)
        line = re.sub(r'\(\s*supabase\s*\)', '()', line)

    # ── Handle: if (USE_SECURE_API) { ... }
    if re.match(r'\s*if\s*\(USE_SECURE_API\)\s*\{', stripped):
        # How indented is this if?  (should always be 2 for our functions)
        if_indent = len(line) - len(line.lstrip())
        content_indent = if_indent + 2  # content is 2 deeper

        # Find where this if-block ends
        end_of_if = find_block_end(lines, i)

        # Extract inner content (strip the if-wrapper)
        inner_lines = lines[i + 1 : end_of_if]  # excludes the `}` line

        # Write the inner content, each line de-indented by 2
        for cl in inner_lines:
            if cl.strip() == '':
                out.append('\n')
            else:
                if cl.startswith(' ' * content_indent):
                    out.append(cl[2:])  # remove 2 leading spaces
                else:
                    out.append(cl)

        # Now we need to skip everything after the if-block's closing `}`
        # until the outer function's closing `};` at column 0.
        # The outer close is `};` at indent = if_indent - 2 (i.e. 0 for top-level)
        outer_indent = max(0, if_indent - 2)
        outer_close_plain  = ' ' * outer_indent + '};'
        outer_close_brace  = ' ' * outer_indent + '}'
        outer_close_semi   = ' ' * outer_indent + '  };'  # nested helper edge case

        j = end_of_if + 1
        while j < total:
            sl = lines[j].rstrip()
            if sl == outer_close_plain or sl == outer_close_brace:
                out.append(lines[j])
                i = j + 1
                break
            j += 1
        else:
            i = end_of_if + 1
        continue

    out.append(line)
    i += 1

result = ''.join(out)

# ── Clean up orphaned loadUserBadges / saveUserStats / etc. that have
#    no USE_SECURE_API branch — replace them with stubs.
#    These functions are Supabase-only and the backend doesn't have equivalents.
#    They must remain exported (they're imported in App.jsx) but can be stubs.

STUB_REPLACEMENTS = [
    # loadUserBadges — no NestJS equivalent, return empty
    (
        r'export const loadUserBadges = async \([^)]*\) => \{[^}]*\};',
        'export const loadUserBadges = async () => [];'
    ),
]

# Update docblock
result = result.replace(
    'Data Service Layer — Dual-mode adapter for Supabase ↔ NestJS API.',
    'Data Service Layer — NestJS API adapter.'
)
result = result.replace(
    ' * Every function returns data in the SAME shape that App.jsx / views expect,\n'
    ' * regardless of which backend is active. When VITE_ENABLE_SECURE_BACKEND_API\n'
    ' * is true, the NestJS endpoints (via secureApi.js) are used; otherwise\n'
    ' * Supabase is called directly.\n'
    ' *\n'
    ' * This module is the single place where NestJS → frontend mapping happens\n'
    ' * for App.jsx data loading. Individual views that have their own Supabase\n'
    ' * imports will get their own adapters later.',
    ' * Every function returns data in the shape that App.jsx / views expect.'
)

with open('src/lib/dataService.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(result)

print("Done.")
remaining = [l for l in result.splitlines() if 'USE_SECURE_API' in l]
print(f"Remaining USE_SECURE_API lines: {len(remaining)}")
for r in remaining:
    print(f"  {r.rstrip()}")

supabase_refs = [(idx+1, l.rstrip()) for idx, l in enumerate(result.splitlines())
                 if 'supabase' in l and not l.strip().startswith('//') and not l.strip().startswith('*')]
print(f"\nRemaining supabase refs (non-comment): {len(supabase_refs)}")
for lineno, l in supabase_refs[:30]:
    print(f"  {lineno}: {l}")
