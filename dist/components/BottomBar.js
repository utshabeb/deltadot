import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text } from 'ink';
export function BottomBar({ view, syncingCount, browserError, showBranch, width }) {
    const modeLabel = view === 'list' ? 'REPO' : view === 'commits' ? 'COMMITS' : view === 'detail' ? 'DETAIL' : view === 'prs' ? 'PR' : view === 'prdetail' ? 'PR' : view === 'review' ? 'REVIEW' : 'CONFIG';
    const binds = view === 'list' ? [['↑↓/j:k', 'nav'], ['g/G', 'top/bot'], [':', 'cmd'], ['/', 'filter'], ['↵', 'open'], ['P', 'PR'], ['o', 'PR'], ['s', 'sync'], ['S', 'sync all'], ['b', showBranch ? 'hide br' : 'branch'], ['e', 'cfg'], ['q', 'quit']]
        : view === 'commits' ? [['↑↓/j:k', 'nav'], [':', 'cmd'], ['↵', 'detail'], ['o', 'browse'], ['s', 'sync'], ['b/Esc', 'back'], ['q', 'quit']]
            : view === 'detail' ? [[':', 'cmd'], ['b/Esc', 'back'], ['q', 'quit']]
                : view === 'prs' ? [['↑↓/j:k', 'nav'], [':', 'cmd'], ['↵', 'detail'], ['R', 'review'], ['o', 'browse'], ['S', 'sync'], ['b/Esc', 'back'], ['q', 'quit']]
                    : view === 'prdetail' ? [[':', 'cmd'], ['R', 'review'], ['o', 'browse'], ['b/Esc', 'back'], ['q', 'quit']]
                        : view === 'review' ? [[':', 'cmd'], ['Tab', 'focus panes'], ['t', 'tab'], ['r', 'ai review'], ['j/k', 'scroll'], ['d/↵', 'toggle desc'], ['o', 'browse'], ['b/Esc', 'back'], ['q', 'quit']]
                            : view === 'config' ? [['Tab', 'next'], ['↑↓', 'move'], ['↵', 'save'], ['Esc', 'cancel'], ['q', 'quit']]
                                : [];
    return (_jsxs(Box, { width: width, height: 1, minHeight: 1, paddingLeft: 3, paddingRight: 2, gap: 3, children: [_jsx(Text, { color: "blueBright", bold: true, children: modeLabel }), _jsx(Text, { color: "dimColor", children: "\u2502" }), binds.map(([key, label]) => (_jsxs(Box, { gap: 1, children: [_jsx(Text, { color: "cyanBright", bold: true, children: key }), _jsx(Text, { color: "white", children: label })] }, key))), browserError && (_jsxs(_Fragment, { children: [_jsx(Text, { color: "dimColor", children: "\u2502" }), _jsxs(Text, { color: "redBright", children: ["! ", browserError] })] })), syncingCount > 0 && !browserError && (_jsxs(_Fragment, { children: [_jsx(Text, { color: "dimColor", children: "\u2502" }), _jsxs(Text, { color: "yellowBright", children: ["syncing ", syncingCount, " repo(s)"] })] }))] }));
}
//# sourceMappingURL=BottomBar.js.map