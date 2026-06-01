import { Editor, MarkdownFileInfo, Plugin, TFile } from 'obsidian';
import { DisplayTextModal, NotePickerModal } from './modals';

// Property Over File Name plugin id, read (optionally) so the note picker and
// the fallback display text use a note's title property instead of its filename.
const POFN_PLUGIN_ID = 'property-over-file-name';

interface PofnPlugin {
	settings?: { propertyKey?: string };
}

interface PluginsApi {
	plugins?: { plugins?: Record<string, PofnPlugin> };
}

export default class LinkAsPlugin extends Plugin {
	onload(): void {
		this.addCommand({
			id: 'link-text-to-note',
			name: 'Link text to a note',
			editorCallback: (editor, view) => this.startLinkFlow(editor, view),
		});
	}

	private startLinkFlow(editor: Editor, view: MarkdownFileInfo): void {
		const selection = editor.getSelection();
		if (selection) {
			// Selection mode: the highlighted text becomes the display text.
			this.openNotePicker(editor, view, selection);
			return;
		}
		// Type mode: ask for the display text first (may be left empty to fall
		// back to the picked note's title).
		new DisplayTextModal(this.app, (displayText) =>
			this.openNotePicker(editor, view, displayText),
		).open();
	}

	private openNotePicker(editor: Editor, view: MarkdownFileInfo, displayText: string): void {
		new NotePickerModal(
			this.app,
			(file) => this.insertLink(editor, view, file, displayText),
			(file) => this.getNoteTitle(file),
		).open();
	}

	private insertLink(editor: Editor, view: MarkdownFileInfo, file: TFile, displayText: string): void {
		// Fall back to the note's title when no display text was provided.
		const raw = displayText.trim() || this.getNoteTitle(file);
		const display = this.sanitizeAlias(raw);
		// Omit a redundant alias when it just repeats the file name.
		const alias = display && display !== file.basename ? display : undefined;
		const sourcePath = view.file?.path ?? '';
		const link = this.app.fileManager.generateMarkdownLink(file, sourcePath, undefined, alias);
		editor.replaceSelection(link);
	}

	// Collapse whitespace and strip characters that would break a wiki/markdown
	// link alias (handles multi-line selections and selections containing links).
	private sanitizeAlias(text: string): string {
		return text.replace(/[[\]|]/g, '').replace(/\s+/g, ' ').trim();
	}

	/** A note's Property Over File Name title, or its basename as a fallback. */
	getNoteTitle(file: TFile): string {
		const propertyKey = this.getPofnPropertyKey();
		if (propertyKey) {
			const value: unknown = this.app.metadataCache.getFileCache(file)?.frontmatter?.[propertyKey];
			if (typeof value === 'string') {
				const title = value.trim();
				if (title) return title;
			} else if (typeof value === 'number' || typeof value === 'boolean') {
				return String(value);
			}
		}
		return file.basename;
	}

	/** The property key configured in Property Over File Name, if installed. */
	private getPofnPropertyKey(): string | null {
		const pofn = (this.app as unknown as PluginsApi).plugins?.plugins?.[POFN_PLUGIN_ID];
		const key = pofn?.settings?.propertyKey?.trim();
		return key || null;
	}
}
