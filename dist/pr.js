import { run } from './git.js';
import { timeAgo } from './utils.js';
import { fetchPRsByProvider, fetchPRDetailByProvider } from './services/api.js';
export async function getRemoteOwnerRepo(repoPath) {
    try {
        const raw = await run('git remote get-url origin', repoPath);
        const s = raw.trim();
        const httpsMatch = s.match(/^https:\/\/[^/]+\/([^/]+)\/([^/.]+)/);
        if (httpsMatch)
            return { owner: httpsMatch[1], repo: httpsMatch[2] };
        const sshMatch = s.match(/^git@[^:]+:([^/]+)\/([^/.]+)/);
        if (sshMatch)
            return { owner: sshMatch[1], repo: sshMatch[2] };
        return null;
    }
    catch {
        return null;
    }
}
export function getProvider(remoteUrl) {
    const s = remoteUrl.toLowerCase();
    if (s.includes('bitbucket'))
        return 'bitbucket';
    if (s.includes('gitlab'))
        return 'gitlab';
    return 'github';
}
export async function fetchPRs(owner, repo, provider, token, repoName) {
    return fetchPRsByProvider(owner, repo, provider, token, repoName);
}
export async function fetchPRDetail(owner, repo, prNumber, provider, token) {
    return fetchPRDetailByProvider(owner, repo, prNumber, provider, token);
}
export function detectProviderFromRemote(remoteUrl) {
    const s = remoteUrl.toLowerCase();
    if (s.includes('bitbucket'))
        return 'bitbucket';
    if (s.includes('gitlab'))
        return 'gitlab';
    return 'github';
}
export function formatPRDate(dateStr) {
    if (!dateStr)
        return '';
    return timeAgo(dateStr);
}
//# sourceMappingURL=pr.js.map