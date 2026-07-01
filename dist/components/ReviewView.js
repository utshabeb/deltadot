import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, pad, timeAgo } from '../utils.js';
export function ReviewView({ pr, jira, loading, error, frame, width, descriptionScroll, collapsed, terminalHeight, }) {
    const indent = 3;
    if (!pr) {
        if (error) {
            return (_jsx(Box, { paddingLeft: indent, paddingTop: 2, flexGrow: 1, children: _jsxs(Text, { color: "redBright", children: ["\u26A0 Review error: ", error] }) }));
        }
        const spin = SPINNER[frame % SPINNER.length];
        return (_jsx(Box, { paddingLeft: indent, paddingTop: 2, flexGrow: 1, flexDirection: "column", children: _jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "yellowBright", children: "Loading review view\u2026" })] }) }));
    }
    if (loading) {
        const spin = SPINNER[frame % SPINNER.length];
        return (_jsx(Box, { paddingLeft: indent, paddingTop: 2, flexGrow: 1, flexDirection: "column", children: _jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "yellowBright", children: "Loading review view\u2026" })] }) }));
    }
    const contentWidth = Math.max(60, width - indent * 2);
    const stacked = contentWidth < 110;
    const gap = 2;
    const leftWidth = stacked ? contentWidth : Math.floor(contentWidth * 0.45);
    const rightWidth = stacked ? contentWidth : contentWidth - leftWidth - gap;
    const jiraDesc = (jira?.description || '').trim();
    const jiraLines = wrapText(jiraDesc || 'No Jira description available.', Math.max(20, leftWidth - 4));
    const jiraViewport = Math.max(6, terminalHeight - 18);
    const jiraMaxScroll = Math.max(0, jiraLines.length - jiraViewport);
    const clampedJiraScroll = Math.min(descriptionScroll, jiraMaxScroll);
    const visibleJiraLines = jiraLines.slice(clampedJiraScroll, clampedJiraScroll + jiraViewport);
    const showProgress = jiraLines.length > jiraViewport;
    const progressText = showProgress ? ` [${clampedJiraScroll + 1}/${jiraMaxScroll + 1}]` : '';
    const descTitle = collapsed ? '+Description' : `-Description${progressText}`;
    const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const commitSummary = `${pr.additions ?? 0} additions · ${pr.deletions ?? 0} deletions · ${pr.changedFiles ?? 0} files · ${pr.commitsCount ?? commits.length} commits`;
    return (_jsxs(Box, { flexDirection: "column", children: [error ? (_jsx(Box, { paddingLeft: indent, paddingTop: 1, children: _jsxs(Text, { color: "redBright", children: ["\u26A0 Review error: ", error] }) })) : null, _jsxs(Box, { paddingLeft: indent, paddingTop: 1, flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: `Review #${pr.number}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", bold: true, wrap: "wrap", children: jira?.key ?? 'no jira key found' })] }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, wrap: "wrap", children: pr.title || '(no title)' }) })] }), _jsx(Box, { paddingLeft: indent, height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(Math.max(10, width - indent * 2)) }) }), _jsxs(Box, { paddingLeft: indent, flexDirection: stacked ? 'column' : 'row', children: [_jsxs(Box, { width: leftWidth, marginRight: stacked ? 0 : gap, flexDirection: "column", children: [_jsx(Section, { title: "Jira Task", children: jira ? (_jsxs(_Fragment, { children: [_jsx(Field, { label: "Summary:", value: jira.summary || 'n/a', labelW: 10, valueColor: "whiteBright" }), _jsx(Field, { label: "Status:", value: jira.status || 'n/a', labelW: 10, valueColor: "greenBright" }), _jsx(Field, { label: "Type:", value: jira.issueType || 'n/a', labelW: 10, valueColor: "magentaBright" }), _jsx(Field, { label: "Assignee:", value: jira.assignee || 'unassigned', labelW: 10, valueColor: "cyanBright" }), _jsx(Field, { label: "Reporter:", value: jira.reporter || 'unknown', labelW: 10, valueColor: "cyanBright" }), _jsx(Field, { label: "URL:", value: jira.url || 'n/a', labelW: 10, valueColor: "blueBright", wrap: "truncate-end" })] })) : (_jsx(Text, { dimColor: true, children: 'No Jira issue found or task provider is disabled.' })) }), jira ? (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, children: descTitle }) }), !collapsed && (_jsx(Box, { flexDirection: "column", children: visibleJiraLines.map((line, i) => (_jsx(Text, { color: "white", wrap: "wrap", children: line || ' ' }, `${clampedJiraScroll}-${i}`))) }))] })) : null] }), _jsxs(Box, { width: rightWidth, flexDirection: "column", children: [_jsxs(Section, { title: "PR Changes", children: [_jsx(Text, { dimColor: true, children: commitSummary }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "whiteBright", children: `Source: ${pr.sourceBranch || 'n/a'} -> Target: ${pr.targetBranch || 'n/a'}` }) }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", children: `Author: ${pr.author || 'n/a'} · State: ${pr.state}` }) })] }), _jsx(Section, { title: `Commits (${commits.length})`, children: commits.length > 0 ? commits.map((commit) => _jsx(CommitCard, { commit: commit, width: rightWidth }, commit.hash + commit.date)) : _jsx(EmptyState, { text: "No commits" }) })] })] })] }));
}
function Section({ title, children }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsx(Box, { children: _jsx(Text, { dimColor: true, bold: true, children: `── ${title}` }) }), _jsx(Box, { flexDirection: "column", children: children })] }));
}
function Field({ label, value, labelW, valueColor = 'whiteBright', wrap = 'truncate-end', }) {
    return (_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad(label, labelW) }), _jsx(Text, { color: valueColor, wrap: wrap, children: value })] }));
}
function CommitCard({ commit, width }) {
    const hashW = 8;
    const messageWidth = Math.max(16, width - hashW - 2);
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsxs(Box, { children: [_jsx(Text, { color: "yellowBright", bold: true, children: pad(commit.hash, hashW) }), _jsx(Text, { children: "  " }), _jsx(Box, { width: messageWidth, children: _jsx(Text, { color: "white", wrap: "wrap", children: commit.message || '(empty)' }) })] }), _jsx(Box, { paddingLeft: hashW + 2, children: _jsx(Text, { dimColor: true, children: `by ${commit.author}${commit.date ? ` · ${relativeTimeLabel(commit.date)}` : ''}` }) })] }));
}
function EmptyState({ text }) {
    return _jsx(Text, { dimColor: true, children: text });
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
function dateValue(dateStr) {
    const value = new Date(dateStr).getTime();
    return Number.isNaN(value) ? 0 : value;
}
function relativeTimeLabel(dateStr) {
    const label = timeAgo(dateStr);
    return label === 'now' ? 'now' : `${label} ago`;
}
//# sourceMappingURL=ReviewView.js.map