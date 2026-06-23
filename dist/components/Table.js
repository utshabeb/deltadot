import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { pad } from '../utils.js';
const INDENT = 3;
const SEP = ' │ ';
export function Table({ columns, width, children }) {
    const line = columns.map(c => pad(c.label, c.width)).join(SEP);
    return (_jsxs(Box, { flexDirection: "column", flexGrow: 1, children: [_jsx(Box, { paddingLeft: INDENT, height: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: line }) }), _jsx(Box, { height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(width) }) }), children] }));
}
//# sourceMappingURL=Table.js.map