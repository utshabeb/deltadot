export function bearerHeaders(token) {
    return token ? { Authorization: token } : {};
}
export function githubHeaders(token) {
    return {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
        ...(token ? { Authorization: token } : {}),
    };
}
export function uniqueStrings(values) {
    return [...new Set(values.filter(Boolean))];
}
//# sourceMappingURL=shared.js.map