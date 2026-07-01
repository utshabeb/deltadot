import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { pad, timeAgo } from '../utils.js';
export function PRChanges({ pr, width, }) {
    const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const commitSummary = `${pr.additions ?? 0} additions · ${pr.deletions ?? 0} deletions · ${pr.changedFiles ?? 0} files · ${pr.commitsCount ?? commits.length} commits`;
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Section, { title: "PR Changes", children: [_jsx(Text, { dimColor: true, children: commitSummary }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "whiteBright", children: `Source: ${pr.sourceBranch || 'n/a'} -> Target: ${pr.targetBranch || 'n/a'}` }) }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", children: `Author: ${pr.author || 'n/a'} · State: ${pr.state}` }) })] }), _jsx(Section, { title: `Commits (${commits.length})`, children: commits.length > 0 ? commits.map((commit) => _jsx(CommitCard, { commit: commit, width: width }, commit.hash + commit.date)) : _jsx(EmptyState, { text: "No commits" }) })] }));
}
function Section({ title, children }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsx(Box, { children: _jsx(Text, { dimColor: true, bold: true, children: `── ${title}` }) }), _jsx(Box, { flexDirection: "column", children: children })] }));
}
function CommitCard({ commit, width }) {
    const hashW = 8;
    const messageWidth = Math.max(16, width - hashW - 2);
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsxs(Box, { children: [_jsx(Text, { color: "yellowBright", bold: true, children: pad(commit.hash, hashW) }), _jsx(Text, { children: "  " }), _jsx(Box, { width: messageWidth, children: _jsx(Text, { color: "white", wrap: "wrap", children: commit.message || '(empty)' }) })] }), _jsx(Box, { paddingLeft: hashW + 2, children: _jsx(Text, { dimColor: true, children: `by ${commit.author}${commit.date ? ` · ${relativeTimeLabel(commit.date)}` : ''}` }) })] }));
}
function EmptyState({ text }) {
    return _jsx(Text, { dimColor: true, children: text });
}
function dateValue(dateStr) {
    const value = new Date(dateStr).getTime();
    return Number.isNaN(value) ? 0 : value;
}
function relativeTimeLabel(dateStr) {
    const label = timeAgo(dateStr);
    return label === 'now' ? 'now' : `${label} ago`;
}
//# sourceMappingURL=PRChanges.js.map