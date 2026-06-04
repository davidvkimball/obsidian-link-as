import { App, PluginSettingTab, Setting } from 'obsidian';
import type LinkAsPlugin from './main';

export interface LinkAsSettings {
	/** Show each note's file path as a muted second line in the note picker. */
	showPathInPicker: boolean;
}

export const DEFAULT_SETTINGS: LinkAsSettings = {
	showPathInPicker: true,
};

export class LinkAsSettingTab extends PluginSettingTab {
	// Shown beside the plugin name in the settings sidebar on older Obsidian
	// versions, and next to the plugin's results in 1.13's settings search.
	public icon = 'lucide-link';
	plugin: LinkAsPlugin;

	constructor(app: App, plugin: LinkAsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// 1.13.0+: the framework calls this and skips display(), so the setting is
	// indexed for settings search. Pre-1.13.0: this is ignored and display()
	// runs instead (Path B, both kept).
	getSettingDefinitions() {
		return [
			{
				type: 'group' as const,
				items: [
					{
						name: 'Show file path in picker',
						desc: "Show each note's path as a muted second line under its title in the note picker.",
						control: { type: 'toggle' as const, key: 'showPathInPicker' },
					},
				],
			},
		];
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName('Show file path in picker')
			.setDesc("Show each note's path as a muted second line under its title in the note picker.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showPathInPicker)
					.onChange(async (value) => {
						this.plugin.settings.showPathInPicker = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
