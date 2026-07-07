import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { CONFIG_LABELS } from '../types.js';
import { pad } from '../utils.js';
export function ConfigView({ draft, focusedField, validationError, width, onChange, onSave, onCancel, }) {
    const indent = 3;
    const labelW = 22;
    const taskProvider = (draft.taskProvider || 'none');
    const aiProvider = (draft.aiProvider || 'none');
    const renderField = (field, labelWidth = labelW) => {
        const isFocused = field === focusedField;
        return (_jsxs(Box, { paddingLeft: indent, height: 1, minHeight: 1, marginTop: 1, children: [_jsxs(Text, { color: isFocused ? 'cyanBright' : 'white', bold: true, wrap: "truncate-end", children: [isFocused ? '▸ ' : '  ', pad(CONFIG_LABELS[field], labelWidth), ":"] }), isFocused ? (_jsx(Box, { flexGrow: 1, paddingLeft: 1, children: _jsx(TextInput, { value: draft[field], onChange: (val) => onChange(field, val), onSubmit: onSave, focus: true }) })) : (_jsxs(Text, { color: "whiteBright", wrap: "truncate-end", children: [" ", draft[field]] }))] }, field));
    };
    return (_jsxs(Box, { flexDirection: "column", width: width, paddingBottom: 1, children: [_jsx(Box, { paddingLeft: indent, height: 1, minHeight: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: "Edit Configuration" }) }), _jsx(Box, { height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(width) }) }), _jsx(Box, { paddingLeft: indent, marginTop: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: "Workspace & Sync" }) }), ['workspace', 'base', 'release', 'syncInterval'].map((field) => renderField(field)), _jsx(Box, { paddingLeft: indent, marginTop: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: "Git API Config" }) }), ['token', 'provider'].map((field) => renderField(field)), _jsx(Box, { paddingLeft: indent, marginTop: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: "Issue / Task Providers" }) }), renderField('taskProvider'), taskProvider === 'jira' && (_jsxs(_Fragment, { children: [renderField('jiraUrl', 16), renderField('jiraEmail', 16), renderField('jiraApiToken', 16)] })), _jsx(Box, { paddingLeft: indent, marginTop: 1, children: _jsx(Text, { color: "whiteBright", bold: true, children: "AI Code Review" }) }), renderField('aiProvider'), aiProvider !== 'none' && (_jsxs(_Fragment, { children: [renderField('aiApiKey', 16), renderField('aiApiUrl', 16), renderField('aiModel', 16), renderField('aiSystemPrompt', 16)] })), validationError && (_jsx(Box, { marginTop: 1, paddingLeft: indent, children: _jsxs(Text, { color: "redBright", bold: true, children: ["\u26A0  ", validationError] }) }))] }));
}
//# sourceMappingURL=ConfigView.js.map