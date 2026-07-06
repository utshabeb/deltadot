import { bearerHeaders } from './shared.js';
export async function fetchGitLabPRs(owner, repo, token, repoName) {
    const headers = bearerHeaders(token);
    const projectId = encodeURIComponent(`${owner}/${repo}`);
    const url = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests?state=opened&per_page=50`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`GitLab API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error('Unexpected GitLab API response: Expected array');
    }
    const mrs = data.map((item) => ({
        number: item.iid,
        title: item.title,
        author: item.author?.username ?? '',
        state: item.state === 'opened' ? 'open' : item.state,
        sourceBranch: item.source_branch,
        targetBranch: item.target_branch,
        createdAt: item.created_at,
        url: item.web_url,
        repoName: repoName ?? '',
        approved: false,
    }));
    return Promise.all(mrs.map(async (mr) => {
        try {
            const aUrl = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mr.number}/approvals`;
            const aRes = await fetch(aUrl, { headers });
            if (aRes.ok) {
                const approvalData = await aRes.json();
                mr.approved = Boolean(approvalData.approved);
            }
        }
        catch { /* ignore — treat as unapproved */ }
        return mr;
    }));
}
export async function fetchGitLabPRDetail(owner, repo, prNumber, token) {
    const headers = bearerHeaders(token);
    const projectId = encodeURIComponent(`${owner}/${repo}`);
    const url = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${prNumber}`;
    const commitsUrl = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${prNumber}/commits`;
    const changesUrl = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${prNumber}/changes`;
    const [res, commitsRes, changesRes] = await Promise.all([
        fetch(url, { headers }),
        fetch(commitsUrl, { headers }).catch(() => null),
        fetch(changesUrl, { headers }).catch(() => null)
    ]);
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`GitLab API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const item = await res.json();
    let commits = [];
    if (commitsRes && commitsRes.ok) {
        try {
            const commitData = await commitsRes.json();
            if (Array.isArray(commitData)) {
                commits = commitData.map((c) => ({
                    hash: c.short_id ?? c.id?.slice(0, 7) ?? '',
                    message: c.title ?? '',
                    author: c.author_name ?? '',
                    date: c.created_at ?? '',
                }));
            }
        }
        catch {
            // Ignore
        }
    }
    let files = [];
    let additions = 0;
    let deletions = 0;
    let changedFiles = 0;
    if (changesRes && changesRes.ok) {
        try {
            const changesData = await changesRes.json();
            const changesList = changesData.changes ?? [];
            if (Array.isArray(changesList)) {
                changedFiles = changesList.length;
                files = changesList.map((c) => {
                    const patch = c.diff || '';
                    const stats = parseDiffPatch(patch);
                    additions += stats.additions;
                    deletions += stats.deletions;
                    const status = c.new_file ? 'added' : c.deleted_file ? 'deleted' : c.renamed_file ? 'renamed' : 'modified';
                    return {
                        path: c.new_path || c.old_path || '',
                        additions: stats.additions,
                        deletions: stats.deletions,
                        status,
                        previousPath: c.renamed_file ? c.old_path : undefined,
                        patch,
                    };
                });
            }
        }
        catch {
            // Ignore
        }
    }
    return {
        number: item.iid,
        title: item.title,
        description: item.description,
        author: item.author?.username ?? '',
        state: item.state === 'opened' ? 'open' : item.state,
        sourceBranch: item.source_branch,
        targetBranch: item.target_branch,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        url: item.web_url,
        comments: [],
        reviewers: [],
        labels: [],
        additions,
        deletions,
        changedFiles,
        commitsCount: commits.length,
        commits,
        files,
    };
}
function parseDiffPatch(patch) {
    let additions = 0;
    let deletions = 0;
    if (!patch)
        return { additions, deletions };
    const lines = patch.split('\n');
    for (const line of lines) {
        if (line.startsWith('+') && !line.startsWith('+++')) {
            additions++;
        }
        else if (line.startsWith('-') && !line.startsWith('---')) {
            deletions++;
        }
    }
    return { additions, deletions };
}
//# sourceMappingURL=gitlab.js.map