import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, pad, truncate } from '../utils.js';
import { Table } from './Table.js';
export function PRsView({ prs, syncingRepoNames, selectedIdx, loading, error, frame, width }) {
    const indent = 3;
    const sep = ' │ ';
    const syncingRepos = new Set(syncingRepoNames);
    const snW = 3;
    const numW = 4;
    const repoW = prs.length > 0
        ? Math.min(Math.max(10, ...prs.map(p => (p.repoName ?? '').length)), 36)
        : 10;
    const stateW = 6;
    const branchW = prs.length > 0
        ? Math.min(Math.max(12, ...prs.map(p => (p.sourceBranch ?? '').length)), 32)
        : 18;
    const authorW = prs.length > 0
        ? Math.min(Math.max(10, ...prs.map(p => (p.author ?? '').length)), 28)
        : 10;
    const ageW = 8;
    const titleW = Math.max(10, width - indent - snW - ageW - numW - repoW - stateW - branchW - authorW - sep.length * 7);
    const columns = [
        { label: '#', width: snW },
        { label: 'TITLE', width: titleW },
        { label: 'AGE', width: ageW },
        { label: 'PR #', width: numW },
        { label: 'REPO', width: repoW },
        { label: 'STATE', width: stateW },
        { label: 'BRANCH', width: branchW },
        { label: 'AUTHOR', width: authorW },
    ];
    if (loading && prs.length === 0) {
        const spin = SPINNER[frame % SPINNER.length];
        return (_jsxs(Box, { paddingLeft: indent, paddingTop: 1, gap: 2, height: 1, children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { color: "yellowBright", children: "Loading PR\u2026" })] }));
    }
    if (error && prs.length === 0) {
        return (_jsx(Box, { paddingLeft: indent, paddingTop: 1, flexGrow: 1, children: _jsxs(Text, { color: "redBright", wrap: "truncate-end", children: ["\u26A0 ", error] }) }));
    }
    const distinctRepos = [...new Set(prs.map((p) => p.repoName).filter(Boolean))];
    const subtitle = distinctRepos.length <= 3 ? distinctRepos.join(', ') : `${distinctRepos.length} repos`;
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { paddingLeft: indent, paddingTop: 1, height: 1, gap: 1, children: [_jsxs(Text, { color: "whiteBright", bold: true, children: ["PR \u2014 ", subtitle] }), loading && (_jsxs(Text, { color: "yellowBright", bold: true, children: ["(", SPINNER[frame % SPINNER.length], " syncing\u2026)"] }))] }), error && prs.length > 0 && (_jsx(Box, { paddingLeft: indent, minHeight: 1, children: _jsxs(Text, { color: "redBright", wrap: "truncate-end", children: ["\u26A0 ", error] }) })), _jsx(Table, { columns: columns, width: width, children: prs.length === 0 ? (_jsx(Box, { flexGrow: 1, paddingLeft: indent, paddingTop: 1, children: _jsx(Text, { color: "yellowBright", children: "No open PR found" }) })) : (prs.map((pr, i) => {
                    const isSel = i === selectedIdx;
                    const isSyncing = syncingRepos.has(pr.repoName);
                    const age = pr.createdAt ? formatAge(pr.createdAt) : '';
                    const stateColor = pr.state === 'open' ? 'greenBright' : pr.state === 'merged' ? 'magentaBright' : 'redBright';
                    const snCol = pad(String(i + 1), snW);
                    const ageCol = pad(age, ageW);
                    const numCol = pad(String(pr.number), numW);
                    const repoCol = pad(truncate(pr.repoName, repoW), repoW);
                    const stateCol = pad(pr.state, stateW);
                    const branchCol = pad(truncate(pr.sourceBranch, branchW), branchW);
                    const authorCol = pad(truncate(pr.author, authorW), authorW);
                    if (isSel) {
                        return (_jsxs(Box, { paddingLeft: indent, flexDirection: "row", alignItems: "flex-start", children: [_jsx(Text, { color: "yellowBright", bold: true, children: snCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Box, { width: titleW, marginRight: 0, children: _jsxs(Text, { color: "yellowBright", bold: true, wrap: "wrap", children: [isSyncing ? `${SPINNER[frame % SPINNER.length]} ` : '', pr.title] }) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "white", children: ageCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "yellowBright", bold: true, children: numCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "magentaBright", children: repoCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: stateColor, children: stateCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "whiteBright", children: branchCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "cyanBright", children: authorCol })] }, `${pr.repoName}-${pr.number}`));
                    }
                    return (_jsxs(Box, { paddingLeft: indent, flexDirection: "row", alignItems: "flex-start", children: [_jsx(Text, { color: "cyan", children: snCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Box, { width: titleW, children: _jsxs(Text, { color: "white", wrap: "wrap", children: [isSyncing ? `${SPINNER[frame % SPINNER.length]} ` : '', pr.title] }) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "white", children: ageCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "cyan", children: numCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "magentaBright", children: repoCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: stateColor, children: stateCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "whiteBright", children: branchCol }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "cyanBright", children: authorCol })] }, `${pr.repoName}-${pr.number}`));
                })) })] }));
}
function formatAge(dateStr) {
    const ms = Date.now() - new Date(dateStr).getTime();
    if (ms < 0)
        return 'now';
    const mins = Math.floor(ms / 60000);
    if (mins < 60)
        return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24)
        return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}
//# sourceMappingURL=PRsView.js.map