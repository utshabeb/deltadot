import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, truncate, timeAgo } from '../utils.js';
export function TopBar({ workspace, base, release, repoCount, syncingCount, doneCount, lastSync, frame, width }) {
    const ws = truncate(workspace.replace(/^\/Users\/[^/]+\//, '~/'), 28);
    const sep = ' │ ';
    let syncPart;
    if (syncingCount > 0) {
        syncPart = `${SPINNER[frame % SPINNER.length]} syncing ${doneCount}/${repoCount}`;
    }
    else if (lastSync) {
        syncPart = `✓ synced ${timeAgo(lastSync)}`;
    }
    else {
        syncPart = 'not synced';
    }
    const line = ` ■ DeltaDot ${sep}${ws} ${sep}${base} → ${release} ${sep}${repoCount} repos ${sep}${syncPart}`;
    const display = line.length > width ? line.slice(0, width - 1) : line + ' '.repeat(width - line.length);
    return (_jsx(Box, { width: width, height: 1, minHeight: 1, children: _jsx(Text, { color: "yellowBright", bold: true, children: display }) }));
}
//# sourceMappingURL=TopBar.js.map