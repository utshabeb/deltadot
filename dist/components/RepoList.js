import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { pad, truncate, statusIcon, timeAgo } from '../utils.js';
import { Table } from './Table.js';
export function RepoList({ repos, allRepos, selectedIdx, searchQuery, showBranch, frame, width }) {
    const indent = 3;
    const sep = ' │ ';
    const numW = 3;
    const nameW = Math.max(14, Math.floor(width * 0.2));
    const contentWidths = allRepos.map((repo) => {
        const behindCount = repo.status === 'behind' ? repo.diffCommits.length : 0;
        let diffStr;
        if (repo.status === 'loading' || repo.status === 'stale' || repo.status === 'syncing')
            diffStr = 'syncing';
        else if (repo.status === 'error')
            diffStr = 'error';
        else if (repo.missingRelease)
            diffStr = 'no release';
        else if (repo.status === 'behind')
            diffStr = `${behindCount} behind`;
        else
            diffStr = 'synced';
        const versionDisplay = repo.latestVersion && repo.latestVersionDate
            ? `${repo.latestVersion} (${timeAgo(repo.latestVersionDate)})`
            : (repo.latestVersion ?? '');
        return {
            diff: diffStr.length,
            version: versionDisplay.length,
            author: repo.lastCommitAuthor.length,
            age: repo.lastCommitAge.length,
        };
    });
    const diffW = Math.min(Math.max(4, ...contentWidths.map(c => c.diff), 1), 12);
    const versionW = Math.min(Math.max(7, ...contentWidths.map(c => c.version), 1), 28);
    const authorW = Math.min(Math.max(6, ...contentWidths.map(c => c.author), 1), 24);
    const ageW = Math.min(Math.max(3, ...contentWidths.map(c => c.age), 1), 14);
    const msgW = Math.max(8, width - indent - numW - nameW - diffW - versionW - authorW - ageW - sep.length * 6);
    if (repos.length === 0) {
        return (_jsx(Box, { paddingLeft: indent, paddingTop: 1, children: _jsxs(Text, { color: "yellowBright", children: ["No repos match filter", searchQuery ? `: "${searchQuery}"` : ''] }) }));
    }
    const columns = [
        { label: '#', width: numW },
        { label: 'NAME', width: nameW },
        { label: 'DIFF', width: diffW },
        { label: 'VERSION', width: versionW },
        { label: 'AUTHOR', width: authorW },
        { label: 'AGE', width: ageW },
        { label: 'LAST COMMIT', width: msgW },
    ];
    return (_jsx(Box, { flexDirection: "column", children: _jsx(Table, { columns: columns, width: width, children: repos.map((repo) => {
                const origIdx = allRepos.indexOf(repo);
                const isSel = origIdx === selectedIdx;
                const icon = statusIcon(repo.status, frame + origIdx * 2);
                const behindCount = repo.status === 'behind' ? repo.diffCommits.length : 0;
                let diffStr;
                if (repo.status === 'loading' || repo.status === 'stale' || repo.status === 'syncing')
                    diffStr = 'syncing';
                else if (repo.status === 'error')
                    diffStr = 'error';
                else if (repo.missingRelease)
                    diffStr = 'no release';
                else if (repo.status === 'behind')
                    diffStr = `${behindCount} behind`;
                else
                    diffStr = 'synced';
                const lastMsg = repo.error
                    ? truncate(repo.error, msgW)
                    : truncate(repo.lastCommitMsg || repo.lastCommitMsg, msgW);
                const age = repo.lastCommitAge || '';
                const author = repo.status === 'loading' || repo.status === 'stale' || repo.status === 'syncing'
                    ? '' : repo.lastCommitAuthor;
                const branchStr = showBranch && repo.currentBranch ? ` (${repo.currentBranch})` : '';
                const nameDisplay = repo.name + branchStr;
                const nameCol = pad(icon.char + ' ' + truncate(nameDisplay, Math.max(1, nameW - 2)), nameW);
                const versionDisplay = repo.latestVersion && repo.latestVersionDate
                    ? `${repo.latestVersion} (${timeAgo(repo.latestVersionDate)})`
                    : (repo.latestVersion ?? '');
                if (isSel) {
                    return (_jsx(Box, { paddingLeft: indent, height: 1, minHeight: 1, children: _jsxs(Text, { color: "yellowBright", bold: true, wrap: "truncate-end", children: [pad(String(origIdx + 1), numW), sep, nameCol, sep, pad(diffStr, diffW), sep, pad(versionDisplay, versionW), sep, pad(author, authorW), sep, pad(age, ageW), sep, lastMsg] }) }, repo.name));
                }
                const isDim = repo.missingRelease;
                let diffColor;
                if (repo.status === 'behind')
                    diffColor = 'redBright';
                else if (repo.status === 'error')
                    diffColor = 'yellowBright';
                else
                    diffColor = 'greenBright';
                const diffEl = _jsx(Text, { color: diffColor, dimColor: isDim || undefined, children: pad(diffStr, diffW) });
                return (_jsxs(Box, { paddingLeft: indent, height: 1, minHeight: 1, children: [_jsx(Text, { color: "cyan", dimColor: isDim || undefined, children: pad(String(origIdx + 1), numW) }), _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: sep }), _jsx(Text, { color: icon.color, dimColor: isDim || undefined, children: icon.char }), _jsx(Text, { dimColor: isDim || undefined, children: ' ' }), _jsxs(Box, { width: nameW - 2, height: 1, children: [_jsx(Text, { color: "whiteBright", bold: true, dimColor: isDim || undefined, wrap: "truncate-end", children: repo.name }), showBranch && repo.currentBranch && _jsxs(Text, { color: "greenBright", dimColor: isDim || undefined, children: [" (", repo.currentBranch, ")"] })] }), _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: sep }), diffEl, _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: sep }), _jsx(Text, { color: "greenBright", dimColor: isDim || undefined, children: pad(versionDisplay, versionW) }), _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: sep }), _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: pad(author, authorW) }), _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: sep }), _jsx(Text, { color: "white", dimColor: isDim || undefined, children: pad(age, ageW) }), _jsx(Text, { color: "cyanBright", dimColor: isDim || undefined, children: sep }), repo.error
                            ? _jsx(Text, { color: "yellowBright", dimColor: isDim || undefined, children: lastMsg })
                            : _jsx(Text, { color: "white", dimColor: isDim || undefined, children: lastMsg })] }, repo.name));
            }) }) }));
}
//# sourceMappingURL=RepoList.js.map