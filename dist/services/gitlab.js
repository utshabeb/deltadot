export async function fetchGitLabPRs(owner, repo, token, repoName) {
    const headers = {};
    if (token) {
        headers.Authorization = token;
    }
    const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests?state=opened&per_page=50`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`GitLab API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error('Unexpected GitLab API response: Expected array');
    }
    return data.map((item) => ({
        number: item.iid,
        title: item.title,
        author: item.author?.username ?? '',
        state: item.state === 'opened' ? 'open' : item.state,
        sourceBranch: item.source_branch,
        targetBranch: item.target_branch,
        createdAt: item.created_at,
        url: item.web_url,
        repoName: repoName ?? '',
    }));
}
export async function fetchGitLabPRDetail(owner, repo, prNumber, token) {
    const headers = {};
    if (token) {
        headers.Authorization = token;
    }
    const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests/${prNumber}`;
    const commitsUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}/merge_requests/${prNumber}/commits`;
    const [res, commitsRes] = await Promise.all([
        fetch(url, { headers }),
        fetch(commitsUrl, { headers }).catch(() => null)
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
        additions: 0,
        deletions: 0,
        changedFiles: 0,
        commitsCount: commits.length,
        commits,
    };
}
//# sourceMappingURL=gitlab.js.map