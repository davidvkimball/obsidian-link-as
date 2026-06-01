import { App, FuzzyMatch, FuzzySuggestModal, Modal, Setting, TFile } from 'obsidian';

/**
 * Fuzzy picker over every Markdown note, displayed by its title (the Property
 * Over File Name property when available, otherwise the file name).
 */
export class NotePickerModal extends FuzzySuggestModal<TFile> {
	constructor(
		app: App,
		private readonly onChoose: (file: TFile) => void,
		private readonly getTitle: (file: TFile) => string,
	) {
		super(app);
		this.setPlaceholder('Pick a note to link to…');
	}

	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	getItemText(file: TFile): string {
		// Match on both the title and the path so either can be searched.
		return `${this.getTitle(file)} ${file.path}`;
	}

	renderSuggestion(match: FuzzyMatch<TFile>, el: HTMLElement): void {
		const file = match.item;
		el.createDiv({ text: this.getTitle(file) });
		el.createDiv({ text: file.path, cls: 'link-as-suggestion-path' });
	}

	onChooseItem(file: TFile): void {
		this.onChoose(file);
	}
}

/**
 * Prompts for the display text when the command is run with no selection.
 * Leaving it empty falls back to the picked note's title.
 */
export class DisplayTextModal extends Modal {
	private value = '';

	constructor(app: App, private readonly onSubmit: (displayText: string) => void) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.createEl('h3', { text: 'Link text' });

		new Setting(contentEl)
			.setName('Display text')
			.setDesc("Text to show for the link. Leave empty to use the note's title.")
			.addText((text) => {
				text.setPlaceholder('Display text…');
				text.onChange((value) => (this.value = value));
				text.inputEl.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						event.preventDefault();
						this.submit();
					}
				});
				window.setTimeout(() => text.inputEl.focus(), 0);
			});

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText('Continue')
				.setCta()
				.onClick(() => this.submit()),
		);
	}

	private submit(): void {
		this.close();
		this.onSubmit(this.value);
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
