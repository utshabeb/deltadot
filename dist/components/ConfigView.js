import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { CONFIG_FIELDS, CONFIG_LABELS } from '../types.js';
import { pad } from '../utils.js';
export function ConfigView({ draft, focusedField, validationError, width, onChange, onSave, onCancel, }) {
    const indent = 3;
    const labelW = 22;
    return (_jsxs(Box, { flexDirection: "column", width: width, paddingBottom: 1, children: [_jsx(Box, { paddingLeft: indent, height: 1, minHeight: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: "Edit Configuration" }) }), _jsx(Box, { height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(width) }) }), CONFIG_FIELDS.map((field) => {
                const isFocused = field === focusedField;
                return (_jsxs(Box, { paddingLeft: indent, height: 1, minHeight: 1, marginTop: 1, children: [_jsxs(Text, { color: isFocused ? 'cyanBright' : 'white', bold: true, wrap: "truncate-end", children: [isFocused ? '▸ ' : '  ', pad(CONFIG_LABELS[field], labelW), ":"] }), isFocused ? (_jsx(Box, { flexGrow: 1, paddingLeft: 1, children: _jsx(TextInput, { value: draft[field], onChange: (val) => onChange(field, val), onSubmit: onSave, focus: true }) })) : (_jsxs(Text, { color: "whiteBright", wrap: "truncate-end", children: [" ", draft[field]] }))] }, field));
            }), validationError && (_jsx(Box, { marginTop: 1, paddingLeft: indent, children: _jsxs(Text, { color: "redBright", bold: true, children: ["\u26A0  ", validationError] }) }))] }));
}
//# sourceMappingURL=ConfigView.js.map