import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, pad, truncate } from '../utils.js';
import { Table } from './Table.js';
export function CommitsView({ repo, base, release, selectedCommitIdx, frame, width }) {
    const indent = 3;
    const hashW = 9, authorW = 16, ageW = 10;
    const msgW = Math.max(20, width - hashW - authorW - ageW - indent - 8);
    const isLive = repo.status === 'stale' || repo.status === 'syncing' || repo.status === 'loading';
    const spin = SPINNER[frame % SPINNER.length];
    const sep = ' │ ';
    const sectionDivider = (label) => (_jsx(Box, { paddingLeft: indent, height: 1, children: _jsxs(Text, { dimColor: true, bold: true, children: ['── ', label] }) }));
    const commitCols = [
        { label: 'HASH', width: hashW },
        { label: 'AUTHOR', width: authorW },
        { label: 'AGE', width: ageW },
        { label: 'MESSAGE', width: msgW },
    ];
    const diffSection = (_jsxs(Box, { flexDirection: "column", children: [_jsx(Box, { paddingTop: 1, children: sectionDivider(`DIFF (origin/${base} .. origin/${release})`) }), isLive ? (_jsxs(Box, { paddingLeft: indent, paddingTop: 1, gap: 2, height: 1, children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { color: "yellowBright", children: "Syncing\u2026" })] })) : repo.status === 'synced' || repo.diffCommits.length === 0 ? (_jsxs(Box, { paddingLeft: indent, paddingTop: 1, gap: 1, height: 1, children: [_jsx(Text, { color: "greenBright", bold: true, children: "\u2713" }), _jsxs(Text, { color: "greenBright", children: ["origin/", release, " is caught up with origin/", base] })] })) : (_jsx(Table, { columns: commitCols, width: width, children: repo.diffCommits.map((c) => (_jsxs(Box, { paddingLeft: indent, height: 1, children: [_jsx(Text, { color: "yellowBright", children: pad(c.hash, hashW) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "white", children: pad('', authorW) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "white", children: pad('', ageW) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "whiteBright", children: truncate(c.message, msgW) })] }, c.hash))) }))] }));
    const latestSection = (_jsxs(Box, { flexDirection: "column", marginTop: 0, children: [_jsx(Box, { paddingTop: 1, children: sectionDivider(`LATEST 5 (origin/${release})`) }), isLive ? (_jsxs(Box, { paddingLeft: indent, paddingTop: 1, gap: 2, height: 1, children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { color: "yellowBright", children: "Syncing\u2026" })] })) : repo.latestCommits.length === 0 ? (_jsx(Box, { paddingLeft: indent, paddingTop: 1, height: 1, children: _jsxs(Text, { color: "yellowBright", children: ["No commits found on origin/", release] }) })) : (_jsx(Table, { columns: commitCols, width: width, children: repo.latestCommits.map((c, i) => {
                    const isSel = i === selectedCommitIdx;
                    if (isSel) {
                        return (_jsx(Box, { paddingLeft: indent, height: 1, children: _jsxs(Text, { color: "yellowBright", bold: true, wrap: "truncate-end", children: [pad(c.hash, hashW), sep, pad(truncate(c.author, authorW), authorW), sep, pad(c.age, ageW), sep, truncate(c.subject, msgW)] }) }, c.hash));
                    }
                    return (_jsxs(Box, { paddingLeft: indent, height: 1, children: [_jsx(Text, { color: "yellowBright", children: pad(c.hash, hashW) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "cyanBright", children: pad(truncate(c.author, authorW), authorW) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "whiteBright", children: pad(c.age, ageW) }), _jsx(Text, { color: "cyanBright", children: sep }), _jsx(Text, { color: "white", children: truncate(c.subject, msgW) })] }, c.hash));
                }) }))] }));
    return _jsxs(Box, { flexDirection: "column", children: [diffSection, latestSection] });
}
//# sourceMappingURL=CommitsView.js.map