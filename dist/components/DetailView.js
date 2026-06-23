import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, pad } from '../utils.js';
export function DetailView({ detail, frame, width }) {
    const indent = 3;
    if (!detail) {
        const spin = SPINNER[frame % SPINNER.length];
        return (_jsxs(Box, { paddingLeft: indent, paddingTop: 2, gap: 2, height: 1, children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { color: "yellow", children: "Loading commit detail\u2026" })] }));
    }
    const labelW = 10;
    const statLines = detail.stat.split('\n').filter(Boolean);
    return (_jsxs(Box, { flexDirection: "column", paddingTop: 0, children: [_jsxs(Box, { paddingLeft: indent, paddingTop: 1, height: 1, children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad('Hash:', labelW) }), _jsx(Text, { color: "yellowBright", children: detail.hash })] }), _jsxs(Box, { paddingLeft: indent, height: 1, children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad('Author:', labelW) }), _jsx(Text, { color: "cyanBright", children: detail.author })] }), _jsxs(Box, { paddingLeft: indent, height: 1, children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad('Date:', labelW) }), _jsx(Text, { color: "whiteBright", children: detail.date })] }), _jsx(Box, { paddingLeft: indent, paddingTop: 1, height: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: detail.subject }) }), detail.body ? (_jsx(Box, { paddingLeft: indent, paddingTop: 1, flexDirection: "column", children: detail.body.split('\n').map((line, i) => (_jsx(Box, { height: 1, children: _jsx(Text, { color: "white", wrap: "wrap", children: line }) }, i))) })) : null, statLines.length > 0 && (_jsxs(Box, { flexDirection: "column", paddingTop: 1, children: [_jsx(Box, { paddingLeft: indent, height: 1, children: _jsx(Text, { dimColor: true, bold: true, children: '── Changed Files' }) }), statLines.map((line, i) => {
                        const parts = line.split(/(\+[\d,]+|-[\d,]+)/g);
                        return (_jsx(Box, { paddingLeft: indent + 1, height: 1, children: parts.map((part, j) => /^\+\d/.test(part) ? _jsx(Text, { color: "greenBright", bold: true, children: part }, j)
                                : /^-\d/.test(part) ? _jsx(Text, { color: "redBright", bold: true, children: part }, j)
                                    : _jsx(Text, { color: "whiteBright", children: part }, j)) }, i));
                    })] }))] }));
}
//# sourceMappingURL=DetailView.js.map