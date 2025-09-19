const DEFAULT_SETTINGS = {
    showPreview: true,
    displayStyle: true,
    rememberDirection: true,
    preferShorthands: true,
    texFracToTypstSlash: true,
    texInftyToTypstOo: false,
    directionToTypst: true,
};

const SETTINGS_KEY = 'typing-practice-settings';


export function load_settings() {
    const settings_str = localStorage.getItem(SETTINGS_KEY);
    const user_settings = settings_str ? JSON.parse(settings_str) : {};
    return Object.assign(DEFAULT_SETTINGS, user_settings);
}

export function remember_to_save_settings_before_unload(fnGetSettings) {
    window.addEventListener('beforeunload', function () {
        const settings = fnGetSettings();
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    });
}


