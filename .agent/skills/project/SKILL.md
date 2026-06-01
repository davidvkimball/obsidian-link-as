---
name: project
description: Project-specific architecture and conventions for the Link As plugin. Load when working on the link-insertion flow, the note picker, or Property Over File Name integration.
---

# Link As — Project Context

A small, single-command Obsidian plugin: link selected (or typed) text to any note, keeping that text as the inline display **without writing to the target note's frontmatter**.

## Architecture

- **`src/main.ts`** — `LinkAsPlugin`. Registers one command, `link-text-to-note` ("Link text to a note"), via `editorCallback`.
  - `startLinkFlow`: branches on `editor.getSelection()`. Non-empty → selection is the display text → note picker. Empty → `DisplayTextModal` first (type-a-string mode), then note picker.
  - `insertLink`: builds the link with `app.fileManager.generateMarkdownLink(file, sourcePath, undefined, alias)` — this respects the user's link format (wikilink vs Markdown, shortest path) and handles the alias. Inserts with `editor.replaceSelection`.
  - `sanitizeAlias`: strips `[`, `]`, `|` and collapses whitespace so multi-line selections / selections containing links produce a valid alias.
  - Redundant-alias rule: when the display text equals `file.basename`, the alias is omitted (`[[note]]`).
  - `getNoteTitle` / `getPofnPropertyKey`: POFN integration (see below).
- **`src/modals.ts`**
  - `NotePickerModal extends FuzzySuggestModal<TFile>` — items are `vault.getMarkdownFiles()`; `getItemText` matches on `title + path`; `renderSuggestion` shows the title with a muted path line (styled via `setCssStyles`, no stylesheet).
  - `DisplayTextModal extends Modal` — text input used only in type mode; empty value falls back to the picked note's title.

## Property Over File Name (POFN) integration

The differentiator. If POFN (`property-over-file-name`) is installed, read its configured property:
`app.plugins.plugins['property-over-file-name']?.settings?.propertyKey`. Resolve a note's title from `metadataCache.getFileCache(file)?.frontmatter?.[propertyKey]` (string/number/boolean only — narrow before stringifying to satisfy `no-base-to-string`). Fall back to `file.basename` when POFN is absent or the property is empty. The picker lists notes by this title; type mode with no input defaults the display to it.

## Conventions

- **No settings tab, no `styles.css`** — single command; inline styling via `setCssStyles`.
- Editor command `ctx` is typed `MarkdownView | MarkdownFileInfo`; use `MarkdownFileInfo` in helpers (only `.file?.path` is needed).
- Never write to another note's frontmatter — inline links only.

## Maintenance

- `pnpm build` (tsc + esbuild) and `pnpm lint` (eslint-plugin-obsidianmd) must both be clean. No `eslint-disable`, no `any`.
- Distributed via BRAT (`davidvkimball/obsidian-link-as`), not the community directory.
