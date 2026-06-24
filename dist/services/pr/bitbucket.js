import { bearerHeaders } from './shared.js';
export async function fetchBitbucketPRs(owner, repo, token, repoName) {
    const headers = bearerHeaders(token);
    const url = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests?state=OPEN&pagelen=50`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Bitbucket API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const json = await res.json();
    const data = json.values;
    if (!Array.isArray(data)) {
        throw new Error('Unexpected Bitbucket API response: Expected array');
    }
    const prs = data.map((item) => {
        const authorObj = item.author;
        const sourceObj = item.source;
        const destObj = item.destination;
        const linksObj = item.links;
        const htmlLinks = linksObj?.html;
        return {
            number: item.id,
            title: item.title,
            author: (authorObj?.display_name ?? authorObj?.nickname ?? ''),
            state: item.state === 'OPEN' ? 'open' : (item.state?.toLowerCase() ?? ''),
            sourceBranch: (sourceObj?.branch?.name ?? ''),
            targetBranch: (destObj?.branch?.name ?? ''),
            createdAt: item.created_on,
            url: htmlLinks?.href ?? '',
            repoName: repoName ?? '',
            approved: false,
        };
    });
    return Promise.all(prs.map(async (pr) => {
        try {
            const aUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests/${pr.number}/approvals`;
            const aRes = await fetch(aUrl, { headers });
            if (aRes.ok) {
                const approvalData = await aRes.json();
                pr.approved = Array.isArray(approvalData.values) && approvalData.values.length > 0;
            }
        }
        catch { /* ignore — treat as unapproved */ }
        return pr;
    }));
}
export async function fetchBitbucketPRDetail(owner, repo, prNumber, token) {
    const headers = bearerHeaders(token);
    const url = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests/${prNumber}`;
    const commitsUrl = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests/${prNumber}/commits`;
    const [res, commitsRes] = await Promise.all([
        fetch(url, { headers }),
        fetch(commitsUrl, { headers }).catch(() => null)
    ]);
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Bitbucket API error ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    const item = await res.json();
    let commits = [];
    if (commitsRes && commitsRes.ok) {
        try {
            const commitData = await commitsRes.json();
            if (commitData && typeof commitData === 'object' && Array.isArray(commitData.values)) {
                commits = commitData.values.map((c) => ({
                    hash: c.hash?.slice(0, 7) ?? '',
                    message: c.message?.split('\n')[0] ?? '',
                    author: c.author?.raw?.split(' <')[0] ?? c.author?.user?.display_name ?? '',
                    date: c.date ?? '',
                }));
            }
        }
        catch {
            // Ignore
        }
    }
    const authorObj = item.author;
    const sourceObj = item.source;
    const destObj = item.destination;
    const linksObj = item.links;
    const htmlLinks = linksObj?.html;
    return {
        number: item.id,
        title: item.title,
        description: item.description,
        author: (authorObj?.display_name ?? authorObj?.nickname ?? ''),
        state: item.state === 'OPEN' ? 'open' : (item.state?.toLowerCase() ?? ''),
        sourceBranch: (sourceObj?.branch?.name ?? ''),
        targetBranch: (destObj?.branch?.name ?? ''),
        createdAt: item.created_on,
        updatedAt: item.updated_on,
        url: htmlLinks?.href ?? '',
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
//# sourceMappingURL=bitbucket.js.map