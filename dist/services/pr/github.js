import { githubHeaders, uniqueStrings } from './shared.js';
export async function fetchGitHubPRs(owner, repo, token, repoName) {
    const headers = githubHeaders(token);
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=50`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`GitHub API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error('Unexpected GitHub API response: Expected array');
    }
    const prs = data.map((item) => ({
        number: item.number,
        title: item.title,
        author: item.user?.login ?? '',
        state: item.state,
        sourceBranch: item.head?.ref ?? '',
        targetBranch: item.base?.ref ?? '',
        createdAt: item.created_at,
        url: item.html_url,
        repoName: repoName ?? '',
        approved: false,
    }));
    return Promise.all(prs.map(async (pr) => {
        try {
            const revUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews?per_page=100`;
            const revRes = await fetch(revUrl, { headers });
            if (revRes.ok) {
                const reviews = await revRes.json();
                pr.approved = Array.isArray(reviews) && reviews.some((r) => r.state === 'APPROVED');
            }
        }
        catch { /* ignore — treat as unapproved */ }
        return pr;
    }));
}
export async function fetchGitHubPRDetail(owner, repo, prNumber, token) {
    const headers = githubHeaders(token);
    const detailUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/commits`;
    const reviewsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews?per_page=100`;
    const issueCommentsUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`;
    const reviewCommentsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments?per_page=100`;
    const [res, commitsRes, reviewsRes, issueCommentsRes, reviewCommentsRes] = await Promise.all([
        fetch(detailUrl, { headers }),
        fetch(commitsUrl, { headers }).catch(() => null),
        fetch(reviewsUrl, { headers }).catch(() => null),
        fetch(issueCommentsUrl, { headers }).catch(() => null),
        fetch(reviewCommentsUrl, { headers }).catch(() => null),
    ]);
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`GitHub API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const item = await res.json();
    let commits = [];
    if (commitsRes && commitsRes.ok) {
        try {
            const commitData = await commitsRes.json();
            if (Array.isArray(commitData)) {
                commits = commitData.map((c) => ({
                    hash: c.sha?.slice(0, 7) ?? '',
                    message: c.commit?.message?.split('\n')[0] ?? '',
                    author: c.commit?.author?.name ?? c.author?.login ?? '',
                    date: c.commit?.author?.date ?? '',
                }));
            }
        }
        catch {
            // Ignore commits parse failures to prevent detail page crashes
        }
    }
    let requestedReviewers = [];
    let approvedBy = [];
    let changesRequestedBy = [];
    let commentedBy = [];
    const reviewTimelineComments = [];
    if (reviewsRes && reviewsRes.ok) {
        try {
            const reviewData = await reviewsRes.json();
            if (Array.isArray(reviewData)) {
                requestedReviewers = uniqueStrings((item.requested_reviewers ?? []).map((r) => r?.login ?? r?.name ?? '').filter(Boolean));
                approvedBy = uniqueStrings(reviewData.filter((r) => r?.state === 'APPROVED').map((r) => r?.user?.login ?? '').filter(Boolean));
                changesRequestedBy = uniqueStrings(reviewData.filter((r) => r?.state === 'CHANGES_REQUESTED').map((r) => r?.user?.login ?? '').filter(Boolean));
                commentedBy = uniqueStrings(reviewData.filter((r) => r?.state === 'COMMENTED').map((r) => r?.user?.login ?? '').filter(Boolean));
                reviewTimelineComments.push(...reviewData.flatMap((r, i) => {
                    const state = r?.state ?? '';
                    if (state !== 'PENDING' && state !== 'COMMENTED' && state !== 'APPROVED' && state !== 'CHANGES_REQUESTED')
                        return [];
                    const createdAt = r?.submitted_at ?? r?.created_at ?? '';
                    if (!createdAt && state !== 'PENDING')
                        return [];
                    const kind = state === 'PENDING' ? 'pending' : 'review';
                    return [{
                            id: `review-${state.toLowerCase()}-${r?.id ?? r?.node_id ?? createdAt ?? i}`,
                            type: kind,
                            author: r?.user?.login ?? '',
                            body: r?.body ?? '',
                            createdAt,
                            updatedAt: r?.submitted_at ?? r?.updated_at ?? undefined,
                        }];
                }));
            }
        }
        catch {
            // Ignore review parse failures to keep the detail page responsive.
        }
    }
    const assignees = uniqueStrings((item.assignees ?? []).map((a) => a?.login ?? a?.name ?? '').filter(Boolean));
    const labels = uniqueStrings((item.labels ?? []).map((l) => l?.name ?? '').filter(Boolean));
    const { comments, issueCount, reviewCount } = await loadGitHubComments(issueCommentsRes, reviewCommentsRes, reviewTimelineComments);
    return {
        number: item.number,
        title: item.title,
        description: item.body ?? '',
        author: item.user?.login ?? '',
        state: item.state,
        draft: Boolean(item.draft),
        sourceBranch: item.head?.ref ?? '',
        targetBranch: item.base?.ref ?? '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        url: item.html_url,
        mergedBy: item.merged_by?.login ?? '',
        mergedAt: item.merged_at ?? '',
        mergeCommitSha: item.merge_commit_sha ?? '',
        commentsCount: issueCount,
        reviewCommentsCount: reviewCount,
        requestedReviewers,
        approvedBy,
        changesRequestedBy,
        commentedBy,
        assignees,
        comments,
        reviewers: requestedReviewers,
        labels,
        additions: item.additions ?? 0,
        deletions: item.deletions ?? 0,
        changedFiles: item.changed_files ?? 0,
        commitsCount: item.commits ?? commits.length,
        commits,
    };
}
function loadGitHubComments(issueCommentsRes, reviewCommentsRes, reviewTimelineComments = []) {
    const issueComments = [];
    const reviewComments = [];
    return Promise.all([
        (async () => {
            if (issueCommentsRes && issueCommentsRes.ok) {
                try {
                    const data = await issueCommentsRes.json();
                    if (Array.isArray(data)) {
                        issueComments.push(...data.map((c, i) => ({
                            id: `issue-${c.id ?? c.node_id ?? c.created_at ?? i}`,
                            type: 'issue',
                            author: c.user?.login ?? '',
                            body: c.body ?? '',
                            createdAt: c.created_at ?? '',
                            updatedAt: c.updated_at ?? '',
                        })));
                    }
                }
                catch {
                    // Ignore issue comment parse failures.
                }
            }
        })(),
        (async () => {
            if (reviewCommentsRes && reviewCommentsRes.ok) {
                try {
                    const data = await reviewCommentsRes.json();
                    if (Array.isArray(data)) {
                        reviewComments.push(...data.map((c, i) => ({
                            id: `review-${c.id ?? c.node_id ?? c.created_at ?? i}`,
                            type: 'review',
                            author: c.user?.login ?? '',
                            body: c.body ?? '',
                            createdAt: c.created_at ?? '',
                            updatedAt: c.updated_at ?? '',
                            path: c.path ?? '',
                            line: c.line != null ? String(c.line) : undefined,
                        })));
                    }
                }
                catch {
                    // Ignore review comment parse failures.
                }
            }
        })(),
    ]).then(() => {
        const comments = [...issueComments, ...reviewComments, ...reviewTimelineComments].sort((a, b) => {
            const at = new Date(a.createdAt).getTime();
            const bt = new Date(b.createdAt).getTime();
            return bt - at;
        });
        return {
            comments,
            issueCount: issueComments.length,
            reviewCount: reviewComments.length,
        };
    });
}
//# sourceMappingURL=github.js.map