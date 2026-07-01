import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { pad } from '../utils.js';
export function JiraDescription({ jira, descriptionScroll, collapsed, terminalHeight, width, }) {
    const jiraDesc = (jira?.description || '').trim();
    const jiraLines = wrapText(jiraDesc || 'No Jira description available.', Math.max(20, width - 4));
    const jiraViewport = Math.max(6, terminalHeight - 18);
    const jiraMaxScroll = Math.max(0, jiraLines.length - jiraViewport);
    const clampedJiraScroll = Math.min(descriptionScroll, jiraMaxScroll);
    const visibleJiraLines = jiraLines.slice(clampedJiraScroll, clampedJiraScroll + jiraViewport);
    const showProgress = jiraLines.length > jiraViewport;
    const progressText = showProgress ? ` [${clampedJiraScroll + 1}/${jiraMaxScroll + 1}]` : '';
    const descTitle = collapsed ? '+Description' : `-Description${progressText}`;
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Section, { title: "Jira Task", children: jira ? (_jsxs(_Fragment, { children: [_jsx(Field, { label: "Summary:", value: jira.summary || 'n/a', labelW: 10, valueColor: "whiteBright" }), _jsx(Field, { label: "Status:", value: jira.status || 'n/a', labelW: 10, valueColor: "greenBright" }), _jsx(Field, { label: "Type:", value: jira.issueType || 'n/a', labelW: 10, valueColor: "magentaBright" }), _jsx(Field, { label: "Assignee:", value: jira.assignee || 'unassigned', labelW: 10, valueColor: "cyanBright" }), _jsx(Field, { label: "Reporter:", value: jira.reporter || 'unknown', labelW: 10, valueColor: "cyanBright" }), _jsx(Field, { label: "URL:", value: jira.url || 'n/a', labelW: 10, valueColor: "blueBright", wrap: "truncate-end" })] })) : (_jsx(Text, { dimColor: true, children: "No Jira issue found or task provider is disabled." })) }), jira ? (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, children: descTitle }) }), !collapsed && (_jsx(Box, { flexDirection: "column", children: visibleJiraLines.map((line, i) => (_jsx(Text, { color: "white", wrap: "wrap", children: line || ' ' }, `${clampedJiraScroll}-${i}`))) }))] })) : null] }));
}
function Section({ title, children }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsx(Box, { children: _jsx(Text, { dimColor: true, bold: true, children: `── ${title}` }) }), _jsx(Box, { flexDirection: "column", children: children })] }));
}
function Field({ label, value, labelW, valueColor = 'whiteBright', wrap = 'truncate-end', }) {
    return (_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad(label, labelW) }), _jsx(Text, { color: valueColor, wrap: wrap, children: value })] }));
}
function wrapText(text, width) {
    if (!text)
        return [];
    const out = [];
    for (const paragraph of text.split('\n')) {
        if (!paragraph.trim()) {
            out.push('');
            continue;
        }
        const words = paragraph.split(/\s+/).filter(Boolean);
        let line = '';
        for (const word of words) {
            if (word.length > width) {
                if (line) {
                    out.push(line);
                    line = '';
                }
                let rest = word;
                while (rest.length > width) {
                    out.push(rest.slice(0, width));
                    rest = rest.slice(width);
                }
                line = rest;
                continue;
            }
            if (!line) {
                line = word;
            }
            else if ((line + ' ' + word).length <= width) {
                line += ` ${word}`;
            }
            else {
                out.push(line);
                line = word;
            }
        }
        if (line)
            out.push(line);
    }
    return out;
}
//# sourceMappingURL=JiraDescription.js.map