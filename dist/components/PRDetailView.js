import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { SPINNER, pad, timeAgo, truncate } from '../utils.js';
export function PRDetailView({ pr, loading, error, frame, width, descriptionScroll, }) {
    const indent = 3;
    if (error) {
        return (_jsx(Box, { paddingLeft: indent, paddingTop: 2, flexGrow: 1, children: _jsxs(Text, { color: "redBright", children: ["\u26A0 Error loading PR details: ", error] }) }));
    }
    if (loading || !pr) {
        const spin = SPINNER[frame % SPINNER.length];
        return (_jsx(Box, { paddingLeft: indent, paddingTop: 2, flexGrow: 1, flexDirection: "column", children: _jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", children: spin }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "yellowBright", children: "Syncing PR detail\u2026" })] }) }));
    }
    const contentWidth = Math.max(60, width - indent * 2);
    const stacked = contentWidth < 110;
    const gap = 2;
    const leftWidth = stacked ? contentWidth : Math.floor(contentWidth * 0.58);
    const rightWidth = stacked ? contentWidth : contentWidth - leftWidth - gap;
    const innerWidth = stacked ? leftWidth : Math.floor((leftWidth - 1) / 2);
    const stateColor = pr.state === 'open' ? 'greenBright' : pr.state === 'merged' ? 'magentaBright' : 'redBright';
    const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const comments = [...(pr.comments ?? [])].sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt));
    const descriptionLines = wrapText(pr.description ?? '', Math.max(20, leftWidth - 4));
    const descriptionWordCount = (pr.description ?? '').trim().split(/\s+/).filter(Boolean).length;
    const descriptionViewport = stacked ? 8 : 10;
    const descriptionMaxScroll = Math.max(0, descriptionLines.length - descriptionViewport);
    const clampedDescriptionScroll = Math.min(descriptionScroll, descriptionMaxScroll);
    const visibleDescriptionLines = descriptionLines.slice(clampedDescriptionScroll, clampedDescriptionScroll + descriptionViewport);
    return (_jsxs(Box, { flexDirection: "column", paddingTop: 0, children: [_jsxs(Box, { paddingLeft: indent, paddingTop: 1, flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: `PR #${pr.number}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: stateColor, bold: true, children: pr.state }), pr.draft ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: "  " }), _jsx(Text, { color: "yellowBright", bold: true, children: "draft" })] })) : null] }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, wrap: "wrap", children: pr.title || '(no title)' }) })] }), _jsx(Box, { paddingLeft: indent, height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(Math.max(10, width - indent * 2)) }) }), _jsxs(Box, { paddingLeft: indent, flexDirection: stacked ? 'column' : 'row', children: [_jsxs(Box, { width: leftWidth, marginRight: stacked ? 0 : gap, flexDirection: "column", children: [_jsxs(Section, { title: "Overview", children: [_jsx(Field, { label: "Repo:", value: pr.repoName ?? 'n/a', labelW: 12, valueColor: "magentaBright" }), _jsx(Field, { label: "Author:", value: pr.author || 'n/a', labelW: 12, valueColor: "cyanBright" }), _jsx(Field, { label: "State:", value: pr.state, labelW: 12, valueColor: stateColor }), _jsx(Field, { label: "Draft:", value: pr.draft ? 'yes' : 'no', labelW: 12, valueColor: pr.draft ? 'yellowBright' : 'whiteBright' }), _jsx(Field, { label: "Source:", value: pr.sourceBranch || 'n/a', labelW: 12, valueColor: "whiteBright" }), _jsx(Field, { label: "Target:", value: pr.targetBranch || 'n/a', labelW: 12, valueColor: "whiteBright" }), _jsx(Field, { label: "Created:", value: formatDate(pr.createdAt), labelW: 12, valueColor: "whiteBright" }), _jsx(Field, { label: "Updated:", value: formatDate(pr.updatedAt), labelW: 12, valueColor: "whiteBright" }), _jsx(Field, { label: "URL:", value: pr.url || 'n/a', labelW: 12, valueColor: "blueBright", wrap: "truncate-end" })] }), _jsxs(Box, { flexDirection: stacked ? 'column' : 'row', children: [_jsx(Box, { width: innerWidth, marginRight: stacked ? 0 : 1, flexDirection: "column", children: _jsxs(Section, { title: "Reviewers", children: [_jsx(ListField, { label: "Requested:", values: pr.requestedReviewers ?? pr.reviewers ?? [], labelW: 12, valueColor: "whiteBright" }), _jsx(ListField, { label: "Approved:", values: pr.approvedBy ?? [], labelW: 12, valueColor: "greenBright" }), _jsx(ListField, { label: "Changes:", values: pr.changesRequestedBy ?? [], labelW: 12, valueColor: "redBright" }), _jsx(ListField, { label: "Commented:", values: pr.commentedBy ?? [], labelW: 12, valueColor: "yellowBright" }), _jsx(ListField, { label: "Assignees:", values: pr.assignees ?? [], labelW: 12, valueColor: "cyanBright" })] }) }), _jsx(Box, { width: innerWidth, flexDirection: "column", children: _jsxs(Section, { title: "Meta", children: [_jsx(ListField, { label: "Labels:", values: pr.labels ?? [], labelW: 12, valueColor: "magentaBright" }), _jsx(Field, { label: "Merged by:", value: pr.mergedBy || (pr.state === 'merged' ? 'unknown' : 'not merged'), labelW: 12, valueColor: "whiteBright" }), _jsx(Field, { label: "Merged at:", value: pr.mergedAt ? formatDate(pr.mergedAt) : (pr.state === 'merged' ? 'unknown' : 'n/a'), labelW: 12, valueColor: "whiteBright" }), _jsx(Field, { label: "Merge sha:", value: pr.mergeCommitSha ? truncate(pr.mergeCommitSha, 12) : 'n/a', labelW: 12, valueColor: "whiteBright" })] }) })] }), _jsxs(Box, { marginTop: 1, children: [_jsx(Text, { dimColor: true, bold: true, children: '── Stats ' }), _jsx(Text, { color: "greenBright", bold: true, children: `+${pr.additions ?? 0}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "redBright", bold: true, children: `-${pr.deletions ?? 0}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.changedFiles ?? 0} files` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.commitsCount ?? pr.commits?.length ?? 0} commits` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.commentsCount ?? 0} comments` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.reviewCommentsCount ?? 0} review comments` })] }), pr.description ? (_jsx(Section, { title: descriptionWordCount > 500 ? `Description [${clampedDescriptionScroll + 1}/${descriptionMaxScroll + 1}]` : 'Description', children: _jsx(Box, { flexDirection: "column", height: descriptionViewport, children: visibleDescriptionLines.length > 0 ? visibleDescriptionLines.map((line, i) => (_jsx(Text, { color: "white", wrap: "truncate-end", children: line }, `${clampedDescriptionScroll}-${i}`))) : _jsx(Text, { color: "white", children: " " }) }) })) : null] }), _jsxs(Box, { width: rightWidth, flexDirection: "column", children: [_jsx(Section, { title: `Commits (${commits.length})`, children: commits.length > 0 ? commits.map((commit) => _jsx(CommitCard, { commit: commit }, commit.hash + commit.date)) : _jsx(EmptyState, { text: "No commits" }) }), _jsx(Section, { title: `Comments (${comments.length})`, children: comments.length > 0 ? comments.map((comment) => _jsx(CommentCard, { comment: comment }, comment.id)) : _jsx(EmptyState, { text: "No comments" }) })] })] })] }));
}
function Section({ title, children }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Box, { children: _jsx(Text, { dimColor: true, bold: true, children: `── ${title}` }) }), _jsx(Box, { flexDirection: "column", paddingTop: 0, children: children })] }));
}
function Field({ label, value, labelW, valueColor = 'whiteBright', wrap = 'truncate-end', }) {
    return (_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad(label, labelW) }), _jsx(Text, { color: valueColor, wrap: wrap, children: value })] }));
}
function ListField({ label, values, labelW, valueColor = 'whiteBright', }) {
    return _jsx(Field, { label: label, value: values.length > 0 ? values.join(', ') : 'none', labelW: labelW, valueColor: valueColor });
}
function CommitCard({ commit }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Box, { children: [_jsx(Text, { color: "yellowBright", children: commit.hash }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "white", wrap: "truncate-end", children: commit.message })] }), _jsx(Box, { children: _jsx(Text, { dimColor: true, children: `by ${commit.author}${commit.date ? ` · ${formatDate(commit.date)}` : ''}` }) })] }));
}
function CommentCard({ comment }) {
    const label = comment.type === 'pending' ? 'pending' : comment.type === 'review' ? 'review' : 'comment';
    const labelColor = comment.type === 'pending' ? 'yellowBright' : comment.type === 'review' ? 'magentaBright' : 'cyanBright';
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Box, { children: [_jsx(Text, { color: labelColor, bold: true, children: label }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", bold: true, children: comment.author || 'unknown' }), _jsx(Text, { children: "  " }), _jsx(Text, { dimColor: true, children: timeAgo(comment.createdAt) })] }), comment.path ? (_jsx(Box, { children: _jsx(Text, { dimColor: true, children: `${comment.path}${comment.line ? `:${comment.line}` : ''}` }) })) : null, _jsx(Box, { children: _jsx(Text, { color: "white", wrap: "wrap", children: comment.body || '(empty)' }) })] }));
}
function EmptyState({ text }) {
    return (_jsx(Text, { dimColor: true, children: text }));
}
function formatDate(dateStr) {
    if (!dateStr)
        return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function wrapText(text, width) {
    if (!text)
        return [];
    const out = [];
    for (const paragraph of text.split('\n')) {
        if (!paragraph.trim()) {
            out.push('');
            continue;
        }
        const words = paragraph.split(/\s+/).filter(Boolean);
        let line = '';
        for (const word of words) {
            if (word.length > width) {
                if (line) {
                    out.push(line);
                    line = '';
                }
                let rest = word;
                while (rest.length > width) {
                    out.push(rest.slice(0, width));
                    rest = rest.slice(width);
                }
                line = rest;
                continue;
            }
            if (!line) {
                line = word;
            }
            else if ((line + ' ' + word).length <= width) {
                line += ` ${word}`;
            }
            else {
                out.push(line);
                line = word;
            }
        }
        if (line)
            out.push(line);
    }
    return out;
}
function dateValue(dateStr) {
    const value = new Date(dateStr).getTime();
    return Number.isNaN(value) ? 0 : value;
}
//# sourceMappingURL=PRDetailView.js.map