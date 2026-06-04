# Link As

Link selected text to any note, keeping it as the display text.

Obsidian can wrap a selection in `[[ ]]`, but it uses your text as the *search target*, not as the display. Link As lets you keep your wording and point it at whatever note you choose, without writing anything to the target note. Particularly helpful alongside [Property Over File Name](https://github.com/davidvkimball/obsidian-property-over-file-name), which lets the note picker show titles instead of file names.

## Made for Vault CMS

Part of the [Vault CMS](https://github.com/davidvkimball/vault-cms) project.

## Features

- Link a text selection to any note, keeping the selection as the inline display text.
- Or run it with nothing selected and type the display text (or leave it empty to use the note's title).
- Never writes to the target note's properties (inline links only).
- Respects your link format (wikilink or Markdown, shortest path) and omits a redundant alias when it just repeats the file name.
- Property Over File Name aware: the note picker lists notes by their title property.

## Installation

### Community Plugins Search

1. In Obsidian, go to Settings → Community plugins (enable it if you haven't already).
2. Search for [Link As](https://obsidian.md/plugins?id=link-as) and click Install, then Enable.

### Manual

1. Download the latest release from the [Releases page](https://github.com/davidvkimball/obsidian-link-as/releases) and navigate to your vault's `.obsidian/plugins/` directory.
2. Create a folder called `link-as` and place `manifest.json` and `main.js` inside it.
3. In Obsidian, go to Settings → Community plugins and enable "Link As."

## Usage

Run the command **Link As: link text to a note** (suggested hotkey: `Ctrl/Cmd+Shift+K`).

- **With text selected**: your selection becomes the display text. Pick a note and it becomes `[[note|your selection]]`.
- **With nothing selected**: type the display text (or leave it empty to use the note's title), then pick a note.

Nothing is written to the target note's properties. If [Property Over File Name](https://github.com/davidvkimball/obsidian-property-over-file-name) is installed, the picker shows notes by their title property, and an empty display falls back to that title.

## Credits

Inspired by [Link with Alias](https://github.com/pvojtechovsky/obsidian-link-with-alias) by Pavel Vojtěchovský. Link As keeps the select-and-link flow but never writes aliases to the target note.

## License

[MIT](LICENSE)
