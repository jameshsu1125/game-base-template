// Utility to get runtime overrides for a game from localStorage or window property
// Usage: getOverrides(localStorageKey: string, windowProperty: string)
// Returns: object (may be empty)

// its actually GameBuilderKey, but for repository requirements, we are not gonna import it
// To start that project as standalone, we shouldn't need GameBuilderKey
export default function getOverrides(localStorageKey: string): {
    assets: Record<string, string>;
    text: Record<string, string>;
} {
    let overrides = { assets: {}, text: {} };
    try {
        const ls =
            typeof window !== "undefined" ? window.localStorage : undefined;
        if (ls && ls.getItem(localStorageKey)) {
            overrides = JSON.parse(ls.getItem(localStorageKey) || "{}");
        }
    } catch (e) {
        // Ignore JSON parse errors
    }
    return overrides;
}

