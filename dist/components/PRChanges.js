import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { pad, timeAgo } from '../utils.js';
export function PRChanges({ pr, width, reviewFocus, reviewFileFocusIdx, reviewExpandedFiles, reviewFilesCollapsed, }) {
    const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const commitSummary = `${pr.additions ?? 0} additions · ${pr.deletions ?? 0} deletions · ${pr.changedFiles ?? 0} files · ${pr.commitsCount ?? commits.length} commits`;
    const files = [...(pr.files ?? [])].sort((a, b) => a.path.localeCompare(b.path));
    const isFilesFocused = reviewFocus === 'files';
    const filesTitle = reviewFilesCollapsed
        ? `+Changed Files (${files.length})`
        : `-Changed Files (${files.length})`;
    const helpText = isFilesFocused && !reviewFilesCollapsed
        ? ' [a:expand all | A:collapse all | j/k:nav | ↵:toggle]'
        : '';
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Section, { title: "PR Changes", children: [_jsx(Text, { dimColor: true, children: commitSummary }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "whiteBright", children: `Source: ${pr.sourceBranch || 'n/a'} -> Target: ${pr.targetBranch || 'n/a'}` }) }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", children: `Author: ${pr.author || 'n/a'} · State: ${pr.state}` }) })] }), _jsx(Section, { title: `Commits (${commits.length})`, children: commits.length > 0 ? commits.map((commit) => _jsx(CommitCard, { commit: commit, width: width }, commit.hash + commit.date)) : _jsx(EmptyState, { text: "No commits" }) }), _jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsxs(Box, { children: [_jsx(Text, { color: "whiteBright", bold: true, children: filesTitle }), _jsx(Text, { dimColor: true, children: helpText })] }), !reviewFilesCollapsed && (_jsx(Box, { flexDirection: "column", marginTop: 0, children: files.length > 0 ? (files.map((file, idx) => {
                            const isSelected = isFilesFocused && idx === reviewFileFocusIdx;
                            const isExpanded = reviewExpandedFiles.includes(file.path);
                            const indicator = isExpanded ? '▼' : '▶';
                            // Status formatting
                            let statusChar = 'M';
                            let statusColor = 'yellowBright';
                            if (file.status === 'added') {
                                statusChar = 'A';
                                statusColor = 'greenBright';
                            }
                            else if (file.status === 'deleted') {
                                statusChar = 'D';
                                statusColor = 'redBright';
                            }
                            else if (file.status === 'renamed') {
                                statusChar = 'R';
                                statusColor = 'cyanBright';
                            }
                            // Row colors
                            const rowColor = isSelected ? 'yellowBright' : 'white';
                            const additionText = `+${file.additions}`;
                            const deletionText = `-${file.deletions}`;
                            // Render diff patch lines if expanded
                            const diffLines = isExpanded && file.patch
                                ? file.patch.split('\n')
                                : [];
                            return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: isSelected ? 'yellowBright' : 'dimColor', children: indicator }), _jsx(Box, { width: Math.max(20, width - 24), children: _jsx(Text, { color: rowColor, bold: isSelected, wrap: "truncate-start", children: file.path }) }), _jsx(Text, { color: "greenBright", children: pad(additionText, 5) }), _jsx(Text, { color: "redBright", children: pad(deletionText, 5) }), _jsx(Text, { color: statusColor, bold: true, children: statusChar })] }), isExpanded && (_jsx(Box, { flexDirection: "column", paddingLeft: 2, marginTop: 0, marginBottom: 1, children: diffLines.length > 0 ? (diffLines.map((line, li) => {
                                            let lineColor = 'white';
                                            if (line.startsWith('+') && !line.startsWith('+++')) {
                                                lineColor = 'green';
                                            }
                                            else if (line.startsWith('-') && !line.startsWith('---')) {
                                                lineColor = 'red';
                                            }
                                            else if (line.startsWith('@@')) {
                                                lineColor = 'cyanBright';
                                            }
                                            else if (line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('--- a/') || line.startsWith('+++ b/')) {
                                                lineColor = 'dimColor';
                                            }
                                            return (_jsx(Text, { color: lineColor, wrap: "wrap", children: line || ' ' }, `${file.path}-diff-${li}`));
                                        })) : (_jsx(Text, { dimColor: true, children: "No diff content available" })) }))] }, file.path));
                        })) : (_jsx(EmptyState, { text: "No changed files" })) }))] })] }));
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