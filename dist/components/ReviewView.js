import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER } from '../utils.js';
import { JiraDescription } from './JiraDescription.js';
import { PRChanges } from './PRChanges.js';
export function ReviewView({ pr, jira, loading, error, frame, width, descriptionScroll, collapsed, terminalHeight, reviewFocus, reviewFileFocusIdx, reviewExpandedFiles, reviewFilesCollapsed, }) {
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
    return (_jsxs(Box, { flexDirection: "column", children: [error ? (_jsx(Box, { paddingLeft: indent, paddingTop: 1, children: _jsxs(Text, { color: "redBright", children: ["\u26A0 Review error: ", error] }) })) : null, _jsxs(Box, { paddingLeft: indent, paddingTop: 1, flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: `Review #${pr.number}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", bold: true, wrap: "wrap", children: jira?.key ?? 'no jira key found' })] }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, wrap: "wrap", children: pr.title || '(no title)' }) })] }), _jsx(Box, { paddingLeft: indent, height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(Math.max(10, width - indent * 2)) }) }), _jsxs(Box, { paddingLeft: indent, flexDirection: stacked ? 'column' : 'row', children: [_jsx(Box, { width: leftWidth, marginRight: stacked ? 0 : gap, flexDirection: "column", children: _jsx(JiraDescription, { jira: jira, descriptionScroll: descriptionScroll, collapsed: collapsed, terminalHeight: terminalHeight, width: leftWidth }) }), _jsx(Box, { width: rightWidth, flexDirection: "column", children: _jsx(PRChanges, { pr: pr, width: rightWidth, reviewFocus: reviewFocus, reviewFileFocusIdx: reviewFileFocusIdx, reviewExpandedFiles: reviewExpandedFiles, reviewFilesCollapsed: reviewFilesCollapsed }) })] })] }));
}
//# sourceMappingURL=ReviewView.js.map