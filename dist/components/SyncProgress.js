import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER } from '../utils.js';
export function SyncProgress({ done, total, frame }) {
    if (done >= total)
        return null;
    const spin = SPINNER[frame % SPINNER.length];
    return (_jsxs(Box, { paddingLeft: 3, height: 1, minHeight: 1, gap: 1, children: [_jsx(Text, { color: "yellowBright", children: spin }), _jsxs(Text, { color: "cyanBright", children: ["syncing ", done + 1, "/", total] })] }));
}
//# sourceMappingURL=SyncProgress.js.map