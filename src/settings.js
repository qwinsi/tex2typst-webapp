export const DEFAULT_SETTINGS = {
    showLatexPreview: true,
    showTypstPreview: false,
    displayStyle: true,
    rememberDirection: true,
    preferShorthands: true,
    texFracToTypstSlash: true,
    texInftyToTypstOo: false,
    directionToTypst: true,
};


export class SettingsManager {
    storageKey;
    defaultSettings;
    constructor(storageKey, defaultSettings) {
        this.storageKey = storageKey;
        this.defaultSettings = defaultSettings;
    }
    loadSettings() {
        const settings_str = localStorage.getItem(this.storageKey);
        const user_settings = settings_str ? JSON.parse(settings_str) : {};
        const settings = Object.assign({}, this.defaultSettings);
        return Object.assign(settings, user_settings);
    }
    saveSettings(settings) {
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
}


