export function extractJiraIssueKey(...sources) {
    const keyRe = /\b[A-Z][A-Z0-9]+-\d+\b/;
    for (const source of sources) {
        if (!source)
            continue;
        const match = source.match(keyRe);
        if (match)
            return match[0] ?? null;
    }
    return null;
}
export async function fetchJiraIssue(config, issueKey) {
    const baseUrl = normalizeBaseUrl(config.url);
    const headers = {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
    };
    const url = `${baseUrl}/rest/api/3/issue/${encodeURIComponent(issueKey)}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Jira API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const item = await res.json();
    const fields = item.fields ?? {};
    const description = adfToText(fields.description);
    return {
        key: item.key,
        summary: fields.summary ?? '',
        description,
        status: fields.status?.name ?? '',
        issueType: fields.issuetype?.name ?? '',
        assignee: fields.assignee?.displayName ?? 'unassigned',
        reporter: fields.reporter?.displayName ?? 'unknown',
        url: `${baseUrl}/browse/${encodeURIComponent(item.key)}`,
    };
}
function normalizeBaseUrl(url) {
    return url.trim().replace(/\/+$/, '');
}
function adfToText(node) {
    if (!node)
        return '';
    if (typeof node === 'string')
        return node;
    if (Array.isArray(node))
        return node.map(adfToText).join('');
    if (typeof node !== 'object')
        return '';
    if (node.type === 'text')
        return node.text ?? '';
    if (node.type === 'hardBreak')
        return '\n';
    if (node.type === 'mention')
        return node.attrs?.text ?? '';
    if (node.type === 'paragraph')
        return `${adfToText(node.content)}\n`;
    if (node.type === 'heading')
        return `${adfToText(node.content)}\n`;
    if (node.type === 'bulletList' || node.type === 'orderedList') {
        const items = Array.isArray(node.content) ? node.content : [];
        return items.map((item) => `• ${adfToText(item).trim()}`).join('\n') + '\n';
    }
    if (node.type === 'listItem')
        return `${adfToText(node.content)}`;
    return adfToText(node.content);
}
//# sourceMappingURL=jira.js.map