import type { PR, PRDetail, PRCommit } from '../../types.js';
import { bearerHeaders } from './shared.js';

export async function fetchGitLabPRs(
  owner: string,
  repo: string,
  token: string,
  repoName?: string
): Promise<PR[]> {
  const headers = bearerHeaders(token);
  const projectId = encodeURIComponent(`${owner}/${repo}`);
  const url = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests?state=opened&per_page=50`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`GitLab API error ${res.status}: ${res.statusText} - ${errorBody}`);
  }

  const data = await res.json() as unknown[];
  if (!Array.isArray(data)) {
    throw new Error('Unexpected GitLab API response: Expected array');
  }

  const mrs = data.map((item: any) => ({
    number: item.iid as number,
    title: item.title as string,
    author: (item.author as any)?.username as string ?? '',
    state: (item.state as string) === 'opened' ? 'open' : (item.state as string),
    sourceBranch: item.source_branch as string,
    targetBranch: item.target_branch as string,
    createdAt: item.created_at as string,
    url: item.web_url as string,
    repoName: repoName ?? '',
    approved: false,
  }));

  return Promise.all(mrs.map(async (mr) => {
    try {
      const aUrl = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mr.number}/approvals`;
      const aRes = await fetch(aUrl, { headers });
      if (aRes.ok) {
        const approvalData = await aRes.json() as any;
        mr.approved = Boolean(approvalData.approved);
      }
    } catch { /* ignore — treat as unapproved */ }
    return mr;
  }));
}

export async function fetchGitLabPRDetail(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
): Promise<PRDetail> {
  const headers = bearerHeaders(token);
  const projectId = encodeURIComponent(`${owner}/${repo}`);

  const url = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${prNumber}`;
  const commitsUrl = `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${prNumber}/commits`;

  const [res, commitsRes] = await Promise.all([
    fetch(url, { headers }),
    fetch(commitsUrl, { headers }).catch(() => null)
  ]);

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`GitLab API error ${res.status}: ${res.statusText} - ${errorBody}`);
  }

  const item = await res.json() as any;

  let commits: PRCommit[] = [];
  if (commitsRes && commitsRes.ok) {
    try {
      const commitData = await commitsRes.json() as any[];
      if (Array.isArray(commitData)) {
        commits = commitData.map((c: any) => ({
          hash: (c.short_id as string) ?? (c.id as string)?.slice(0, 7) ?? '',
          message: (c.title as string) ?? '',
          author: (c.author_name as string) ?? '',
          date: (c.created_at as string) ?? '',
        }));
      }
    } catch {
      // Ignore
    }
  }

  return {
    number: item.iid as number,
    title: item.title as string,
    description: item.description as string,
    author: (item.author as any)?.username as string ?? '',
    state: (item.state as string) === 'opened' ? 'open' : (item.state as string),
    sourceBranch: item.source_branch as string,
    targetBranch: item.target_branch as string,
    createdAt: item.created_at as string,
    updatedAt: item.updated_at as string,
    url: item.web_url as string,
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
