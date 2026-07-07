import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, pad } from '../utils.js';
export function JiraDescription({ jira, descriptionScroll, collapsed, terminalHeight, width, pr, reviewTab, aiReviewLoading, aiReviewError, aiScroll, }) {
    const tabW = Math.floor((width - 4) / 2);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Box, { width: tabW, paddingLeft: 1, children: _jsxs(Text, { bold: true, color: reviewTab === 'jira' ? 'white' : 'dimColor', children: [reviewTab === 'jira' ? '■' : ' ', ' ', "Jira Task"] }) }), _jsx(Box, { width: tabW, children: _jsxs(Text, { bold: true, color: reviewTab === 'ai' ? 'white' : 'dimColor', children: [reviewTab === 'ai' ? '■' : ' ', ' ', "AI Code Review"] }) })] }), reviewTab === 'jira' ? (_jsx(JiraTabContent, { jira: jira, descriptionScroll: descriptionScroll, collapsed: collapsed, terminalHeight: terminalHeight, width: width })) : (_jsx(AITabContent, { pr: pr, loading: aiReviewLoading, error: aiReviewError, aiScroll: aiScroll, terminalHeight: terminalHeight, width: width }))] }));
}
function JiraTabContent({ jira, descriptionScroll, collapsed, terminalHeight, width, }) {
    const jiraDesc = (jira?.description || '').trim();
    const jiraLines = wrapText(jiraDesc || 'No Jira description available.', Math.max(20, width - 4));
    const jiraViewport = Math.max(6, terminalHeight - 18);
    const jiraMaxScroll = Math.max(0, jiraLines.length - jiraViewport);
    const clampedJiraScroll = Math.min(descriptionScroll, jiraMaxScroll);
    const visibleJiraLines = jiraLines.slice(clampedJiraScroll, clampedJiraScroll + jiraViewport);
    const showProgress = jiraLines.length > jiraViewport;
    const progressText = showProgress ? ` [${clampedJiraScroll + 1}/${jiraMaxScroll + 1}]` : '';
    const descTitle = collapsed ? '+Description' : `-Description${progressText}`;
    return (_jsxs(_Fragment, { children: [_jsx(Section, { title: "Jira Task", children: jira ? (_jsxs(_Fragment, { children: [_jsx(Field, { label: "Summary:", value: jira.summary || 'n/a', labelW: 10, valueColor: "whiteBright" }), _jsx(Field, { label: "Status:", value: jira.status || 'n/a', labelW: 10, valueColor: "greenBright" }), _jsx(Field, { label: "Type:", value: jira.issueType || 'n/a', labelW: 10, valueColor: "magentaBright" }), _jsx(Field, { label: "Assignee:", value: jira.assignee || 'unassigned', labelW: 10, valueColor: "cyanBright" }), _jsx(Field, { label: "Reporter:", value: jira.reporter || 'unknown', labelW: 10, valueColor: "cyanBright" }), _jsx(Field, { label: "URL:", value: jira.url || 'n/a', labelW: 10, valueColor: "blueBright", wrap: "truncate-end" })] })) : (_jsx(Text, { dimColor: true, children: "No Jira issue found or task provider is disabled." })) }), jira ? (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, children: descTitle }) }), !collapsed && (_jsx(Box, { flexDirection: "column", children: visibleJiraLines.map((line, i) => (_jsx(Text, { color: "white", wrap: "wrap", children: line || ' ' }, `${clampedJiraScroll}-${i}`))) }))] })) : null] }));
}
function AITabContent({ pr, loading, error, aiScroll, terminalHeight, width, }) {
    if (loading) {
        const spin = SPINNER[0];
        return (_jsxs(Box, { paddingTop: 1, children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "yellowBright", children: "Generating AI review\u2026" })] }));
    }
    if (error) {
        return (_jsx(Box, { paddingTop: 1, children: _jsxs(Text, { color: "redBright", children: ["\u26A0 ", error] }) }));
    }
    const reviewText = pr?.aiReview;
    if (!reviewText) {
        return (_jsx(Box, { paddingTop: 1, children: _jsx(Text, { dimColor: true, children: "Press 'r' to generate an AI code review." }) }));
    }
    const lines = wrapText(reviewText, Math.max(20, width - 2));
    const viewport = Math.max(6, terminalHeight - 14);
    const maxScroll = Math.max(0, lines.length - viewport);
    const clampedScroll = Math.min(aiScroll, maxScroll);
    const visible = lines.slice(clampedScroll, clampedScroll + viewport);
    const showProgress = lines.length > viewport;
    const progressText = showProgress ? ` [${clampedScroll + 1}/${maxScroll + 1}]` : '';
    return (_jsxs(Box, { flexDirection: "column", paddingTop: 1, children: [_jsx(Box, { children: _jsxs(Text, { color: "whiteBright", bold: true, children: ["AI Code Review", progressText] }) }), _jsx(Box, { flexDirection: "column", children: visible.map((line, i) => (_jsx(Text, { color: "white", wrap: "wrap", children: line || ' ' }, `${clampedScroll}-${i}`))) })] }));
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