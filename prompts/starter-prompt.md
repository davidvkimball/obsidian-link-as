### Obsidian Plugin Starter Prompt

**Objective**: Build a production-ready Obsidian plugin using the [Obsidian Sample Plugin Plus](https://github.com/davidvkimball/obsidian-sample-plugin-plus) template.

**1. Bootstrap & Skills Initialization**
Before writing any code, perform these environment setup steps:
- Verify `pnpm` is installed (install if missing).
- Run `pnpm obsidian-dev-skills` to initialize the localized skill set (`.agent/skills/`). This script intelligently detects the project type, seeds a `project-specific` skill template, and automatically generates/updates `AGENTS.md`.
- Run `scripts/setup-ref-links` (use `.bat` for Windows, `.sh` for Unix) to symlink core Obsidian API and documentation references into the `.ref/` folder.

**2. Load Domain Knowledge**
Load the following skills to ensure your implementation follows current best practices. **Read these files completely before proceeding**:
- `./.agent/skills/obsidian-dev/SKILL.md` (Core Development Patterns)
- `./.agent/skills/obsidian-ops/SKILL.md` (Operations & Workflow)
- `./.agent/skills/obsidian-ref/SKILL.md` (Technical References & UX Guidelines)
- `./.agent/skills/project/SKILL.md` (Project-specific architecture)

**3. Plugin Specification**
- **Name**: Link As  <!-- ← confirm or change -->
- **ID**: link-as  <!-- ← confirm or change (must match the folder + manifest id) -->
- **Description**: Link selected or typed text to any note, keeping that text as the inline display. <!-- ← tweak wording -->
- **Author**: David V. Kimball
- **Author URL**: https://github.com/davidvkimball
- **Funding**: https://patreon.com/davidvkimball
- **Desktop Only**: No
- **External Refs (Optional)**:
  - https://github.com/pvojtechovsky/obsidian-link-with-alias — reference for the select-text → pick-note → keep-display-text flow. We deliberately do NOT copy its frontmatter-alias writing. Credit the author (Pavel Vojtěchovský) in the README.
  - Reference clones available locally under `.ref/obsidian-dev/plugins/` (`front-matter-title-reference`, `obsidian-alias-filename-history`) for property-as-title patterns.

**4. Project Instructions**

Build a focused plugin that turns text into a wikilink to a note you pick, using the text as the inline display (alias) — without ever modifying the target note's frontmatter.

**Core flow — two entry modes:**
1. **Selection mode**: with text highlighted in the editor, run the command → the highlighted text becomes the display text.
2. **Type mode**: run the command with no selection → first type/enter any string (the display text), then continue.

In both modes, after the display text is established, open a fuzzy note picker (a `FuzzySuggestModal` / Quick-Switcher-style modal over the vault's Markdown files) to choose the **target note**. On selection, insert an inline wikilink at the cursor/selection:

```
[[<target>|<display text>]]
```

**Hard requirements:**
- **Never write to the target note's frontmatter.** No alias creation, ever. The link is purely inline. (This is the key difference from Link with Alias.)
- Respect the user's wikilink settings (use the shortest unique path / configured link format for `<target>`).
- If the display text equals the target's basename, omit the redundant alias (`[[target]]`).

**Property Over File Name (POFN) integration — the differentiator:**
- The note picker renders each note by its **POFN display property** (the human-readable title), not the filename slug, so you find notes by their real title.
- In **Type mode with no string entered** (user just picks a note), default the display text to the picked note's **POFN title**, producing `[[slug|Human Title]]` automatically. Detect POFN's configured property; fall back to the file basename when absent.

**Command + hotkey:**
- Register a single command, e.g. "Link As: link text to a note".
- Suggest (do not force) the hotkey **Ctrl/Cmd+Shift+K** — the natural sibling to Obsidian's native Ctrl/Cmd+K ("Insert Markdown link"). Leave it user-assignable.

**Edge cases to handle:** empty vault; multi-line selection; selection that already contains a link; mobile parity (no desktop-only APIs).

**5. Implementation Workflow**
1. **Clarify**: Ask any necessary questions before changing code.
2. **Scaffold**: Update `manifest.json`, `package.json`, and `README.md`. Set version to `0.0.1`.
3. **Clean**: Remove all "sample plugin" boilerplate. Delete `styles.css` if it is not required for the implementation.
4. **Develop**: Implement functionality following the loaded skills—prioritizing async safety, lifecycle management (`onload`/`onunload`), and Mobile/Desktop UI consistency.
5. **Verify**:
    - Run `pnpm build`: Must result in zero errors.
    - Run `pnpm lint`: Must result in zero issues. Fix all lints without using `eslint-disable` or `any` types. However, sentence case for UI text can sometimes throw false positives. Just ignore those and move on if so.
6. **Project Continuity**:
    - **Discovery Mandate**: If `./.agent/skills/project/SKILL.md` is currently a template or lacks detail, your first task is to audit the codebase and document the core architecture, key files, and unique conventions before proceeding with implementation.
    - Summarize the final architecture and unique conventions into the `./.agent/skills/project/SKILL.md` file for future agents.

**Constraints**: Do not perform any `git` operations (commit/push) without explicit approval.
