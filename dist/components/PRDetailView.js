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
    const leftWidth = stacked ? contentWidth : Math.floor(contentWidth * 0.4);
    const rightWidth = stacked ? contentWidth : contentWidth - leftWidth - gap;
    const columnGap = 1;
    const overviewWidth = stacked ? leftWidth : Math.max(18, Math.floor(leftWidth * 0.42));
    const metaWidth = stacked ? leftWidth : Math.max(14, Math.floor(leftWidth * 0.25));
    const reviewersWidth = stacked ? leftWidth : Math.max(16, leftWidth - overviewWidth - metaWidth - columnGap * 2);
    const stateColor = pr.state === 'open' ? 'greenBright' : pr.state === 'merged' ? 'magentaBright' : 'redBright';
    const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const comments = [...(pr.comments ?? [])].sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt));
    const descriptionText = normalizeDescription(pr.description ?? '');
    const descriptionLines = wrapText(descriptionText, Math.max(20, leftWidth - 4));
    const descriptionWordCount = descriptionText.trim().split(/\s+/).filter(Boolean).length;
    const descriptionViewport = stacked ? 8 : 10;
    const descriptionMaxScroll = Math.max(0, descriptionLines.length - descriptionViewport);
    const clampedDescriptionScroll = Math.min(descriptionScroll, descriptionMaxScroll);
    const visibleDescriptionLines = descriptionLines.slice(clampedDescriptionScroll, clampedDescriptionScroll + descriptionViewport);
    const overviewFields = (labelW) => (_jsxs(_Fragment, { children: [_jsx(Field, { label: "Repo:", value: pr.repoName ?? 'n/a', labelW: labelW, valueColor: "magentaBright" }), _jsx(Field, { label: "Author:", value: pr.author || 'n/a', labelW: labelW, valueColor: "cyanBright" }), _jsx(Field, { label: "State:", value: pr.state, labelW: labelW, valueColor: stateColor }), _jsx(Field, { label: "Draft:", value: pr.draft ? 'yes' : 'no', labelW: labelW, valueColor: pr.draft ? 'yellowBright' : 'whiteBright' }), _jsx(Field, { label: "Source:", value: pr.sourceBranch || 'n/a', labelW: labelW, valueColor: "whiteBright" }), _jsx(Field, { label: "Target:", value: pr.targetBranch || 'n/a', labelW: labelW, valueColor: "whiteBright" }), _jsx(Field, { label: "Created:", value: formatDate(pr.createdAt), labelW: labelW, valueColor: "whiteBright" }), _jsx(Field, { label: "Updated:", value: formatDate(pr.updatedAt), labelW: labelW, valueColor: "whiteBright" })] }));
    const metaFields = (labelW) => (_jsxs(_Fragment, { children: [_jsx(ListField, { label: "Labels:", values: pr.labels ?? [], labelW: labelW, valueColor: "magentaBright" }), _jsx(Field, { label: "Merged by:", value: pr.mergedBy || (pr.state === 'merged' ? 'unknown' : 'not merged'), labelW: labelW, valueColor: "whiteBright" }), _jsx(Field, { label: "Merged at:", value: pr.mergedAt ? formatDate(pr.mergedAt) : (pr.state === 'merged' ? 'unknown' : 'n/a'), labelW: labelW, valueColor: "whiteBright" }), _jsx(Field, { label: "Merge sha:", value: pr.mergeCommitSha ? truncate(pr.mergeCommitSha, 12) : 'n/a', labelW: labelW, valueColor: "whiteBright" })] }));
    const reviewerFields = (labelW) => (_jsxs(_Fragment, { children: [_jsx(ListField, { label: "Req:", values: pr.requestedReviewers ?? pr.reviewers ?? [], labelW: labelW, valueColor: "whiteBright" }), _jsx(ListField, { label: "Appr:", values: pr.approvedBy ?? [], labelW: labelW, valueColor: "greenBright" }), _jsx(ListField, { label: "Chg:", values: pr.changesRequestedBy ?? [], labelW: labelW, valueColor: "redBright" }), _jsx(ListField, { label: "Cmt:", values: pr.commentedBy ?? [], labelW: labelW, valueColor: "yellowBright" }), _jsx(ListField, { label: "Assg:", values: pr.assignees ?? [], labelW: labelW, valueColor: "cyanBright" })] }));
    return (_jsxs(Box, { flexDirection: "column", paddingTop: 0, children: [_jsxs(Box, { paddingLeft: indent, paddingTop: 1, flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: `PR #${pr.number}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: stateColor, bold: true, children: pr.state }), pr.draft ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: "  " }), _jsx(Text, { color: "yellowBright", bold: true, children: "draft" })] })) : null] }), _jsx(Box, { children: _jsx(Text, { color: "whiteBright", bold: true, wrap: "wrap", children: pr.title || '(no title)' }) })] }), _jsx(Box, { paddingLeft: indent, height: 1, children: _jsx(Text, { dimColor: true, children: '─'.repeat(Math.max(10, width - indent * 2)) }) }), _jsxs(Box, { paddingLeft: indent, flexDirection: stacked ? 'column' : 'row', children: [_jsxs(Box, { width: leftWidth, marginRight: stacked ? 0 : gap, flexDirection: "column", children: [stacked ? (_jsxs(_Fragment, { children: [_jsx(Section, { title: "Overview", children: overviewFields(10) }), _jsx(Section, { title: "Meta", children: metaFields(10) }), _jsx(Section, { title: "Reviewers", children: reviewerFields(8) })] })) : (_jsxs(Box, { flexDirection: "row", children: [_jsx(Box, { width: overviewWidth, marginRight: columnGap, flexDirection: "column", children: _jsx(Section, { title: "Overview", children: overviewFields(8) }) }), _jsx(Box, { width: metaWidth, marginRight: columnGap, flexDirection: "column", children: _jsx(Section, { title: "Meta", children: metaFields(10) }) }), _jsx(Box, { width: reviewersWidth, flexDirection: "column", children: _jsx(Section, { title: "Reviewers", children: reviewerFields(6) }) })] })), _jsx(Box, { children: _jsx(Field, { label: "URL:", value: pr.url || 'n/a', labelW: 8, valueColor: "blueBright", wrap: "truncate-end" }) }), _jsxs(Box, { marginTop: 1, children: [_jsx(Text, { dimColor: true, bold: true, children: '── Stats ' }), _jsx(Text, { color: "greenBright", bold: true, children: `+${pr.additions ?? 0}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "redBright", bold: true, children: `-${pr.deletions ?? 0}` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.changedFiles ?? 0} files` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.commitsCount ?? pr.commits?.length ?? 0} commits` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.commentsCount ?? 0} comments` }), _jsx(Text, { children: "  " }), _jsx(Text, { color: "whiteBright", children: `${pr.reviewCommentsCount ?? 0} review comments` })] }), descriptionText ? (_jsx(Section, { title: descriptionWordCount > 500 ? `Description [${clampedDescriptionScroll + 1}/${descriptionMaxScroll + 1}]` : 'Description', children: _jsx(Box, { flexDirection: "column", height: descriptionViewport, children: visibleDescriptionLines.length > 0 ? visibleDescriptionLines.map((line, i) => (_jsx(Text, { color: "white", wrap: "truncate-end", children: line }, `${clampedDescriptionScroll}-${i}`))) : _jsx(Text, { color: "white", children: " " }) }) })) : null] }), _jsxs(Box, { width: rightWidth, flexDirection: "column", children: [_jsx(Section, { title: `Commits (${commits.length})`, children: commits.length > 0 ? commits.map((commit) => _jsx(CommitCard, { commit: commit, width: rightWidth }, commit.hash + commit.date)) : _jsx(EmptyState, { text: "No commits" }) }), _jsx(Section, { title: `Comments (${comments.length})`, children: comments.length > 0 ? comments.map((comment) => _jsx(CommentCard, { comment: comment, width: rightWidth }, comment.id)) : _jsx(EmptyState, { text: "No comments" }) })] })] })] }));
}
function Section({ title, children }) {
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsx(Box, { children: _jsx(Text, { dimColor: true, bold: true, children: `── ${title}` }) }), _jsx(Box, { flexDirection: "column", children: children })] }));
}
function Field({ label, value, labelW, valueColor = 'whiteBright', wrap = 'truncate-end', }) {
    return (_jsxs(Box, { children: [_jsx(Text, { color: "cyanBright", bold: true, children: pad(label, labelW) }), _jsx(Text, { color: valueColor, wrap: wrap, children: value })] }));
}
function ListField({ label, values, labelW, valueColor = 'whiteBright', }) {
    return _jsx(Field, { label: label, value: values.length > 0 ? values.join(', ') : 'none', labelW: labelW, valueColor: valueColor });
}
function CommitCard({ commit, width }) {
    const hashW = 8;
    const messageWidth = Math.max(16, width - hashW - 2);
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 0, children: [_jsxs(Box, { children: [_jsx(Text, { color: "yellowBright", bold: true, children: pad(commit.hash, hashW) }), _jsx(Text, { children: "  " }), _jsx(Box, { width: messageWidth, children: _jsx(Text, { color: "white", wrap: "wrap", children: commit.message || '(empty)' }) })] }), _jsx(Box, { paddingLeft: hashW + 2, children: _jsx(Text, { dimColor: true, children: `by ${commit.author}${commit.date ? ` · ${relativeTimeLabel(commit.date)}` : ''}` }) })] }));
}
function CommentCard({ comment, width }) {
    const label = comment.type === 'pending' ? 'pending' : comment.type === 'review' ? 'review' : 'comment';
    const labelColor = comment.type === 'pending' ? 'yellowBright' : comment.type === 'review' ? 'magentaBright' : 'cyanBright';
    const labelW = 8;
    const contentWidth = Math.max(16, width - labelW - 2);
    const commentLines = wrapText(comment.body || '(empty)', contentWidth);
    const firstLine = commentLines[0] ?? '(empty)';
    const remainingLines = commentLines.slice(1);
    return (_jsx(Box, { marginBottom: 0, children: _jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: labelColor, bold: true, children: pad(label, labelW) }), _jsx(Text, { color: "white", wrap: "wrap", children: firstLine })] }), remainingLines.map((line, i) => (_jsxs(Box, { paddingLeft: labelW, children: [_jsx(Text, { children: '  ' }), _jsx(Text, { color: "white", wrap: "wrap", children: line })] }, `cmt-wrap-${comment.id}-${i}`))), comment.path ? (_jsxs(Box, { paddingLeft: labelW, children: [_jsx(Text, { children: '  ' }), _jsx(Text, { dimColor: true, wrap: "truncate-end", children: comment.path })] })) : null, _jsxs(Box, { paddingLeft: labelW, children: [_jsx(Text, { children: '  ' }), _jsx(Text, { dimColor: true, children: relativeTimeLabel(comment.createdAt) })] })] }) }));
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
function relativeTimeLabel(dateStr) {
    if (!dateStr)
        return '';
    const label = timeAgo(dateStr);
    return label === 'now' ? 'now' : `${label} ago`;
}
function normalizeDescription(text) {
    if (!text)
        return '';
    let out = text.replace(/\r\n/g, '\n');
    if (looksLikeHtml(out)) {
        out = out
            .replace(/<\s*br\s*\/?\s*>/gi, '\n')
            .replace(/<\s*\/\s*(p|div|section|article|header|footer|tr|ul|ol|li|blockquote|pre|h[1-6])\s*>/gi, '\n')
            .replace(/<\s*(p|div|section|article|header|footer|tr|ul|ol|li|blockquote|pre|h[1-6])[^>]*>/gi, '')
            .replace(/<\s*li[^>]*>/gi, '• ')
            .replace(/<[^>]+>/g, '');
    }
    return decodeHtmlEntities(out)
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
function looksLikeHtml(text) {
    return /<[^>]+>/.test(text);
}
function decodeHtmlEntities(text) {
    return text
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'");
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