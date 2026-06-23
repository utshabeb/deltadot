import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
export function CommandBar({ mode, query, onChange, onSubmit, onCancel, width }) {
    const prefix = mode === 'command' ? ':' : '/';
    return (_jsx(Box, { width: width, height: 3, minHeight: 3, children: _jsxs(Box, { flexGrow: 1, borderStyle: "single", borderColor: "dimColor", paddingLeft: 1, height: 3, minHeight: 3, children: [_jsx(Text, { color: "cyanBright", bold: true, children: prefix }), _jsx(TextInput, { value: query, onChange: onChange, onSubmit: onSubmit, focus: true }), !query && mode === 'search' && _jsx(Text, { color: "white", children: "type to filter, Esc to clear" })] }) }));
}
//# sourceMappingURL=CommandBar.js.map