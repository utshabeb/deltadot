import { fetchGitHubPRs, fetchGitHubPRDetail } from './github.js';
import { fetchGitLabPRs, fetchGitLabPRDetail } from './gitlab.js';
import { fetchBitbucketPRs, fetchBitbucketPRDetail } from './bitbucket.js';
export async function fetchPRsByProvider(owner, repo, provider, token, repoName) {
    switch (provider) {
        case 'gitlab':
            return fetchGitLabPRs(owner, repo, token, repoName);
        case 'bitbucket':
            return fetchBitbucketPRs(owner, repo, token, repoName);
        case 'github':
        default:
            return fetchGitHubPRs(owner, repo, token, repoName);
    }
}
export async function fetchPRDetailByProvider(owner, repo, prNumber, provider, token) {
    switch (provider) {
        case 'gitlab':
            return fetchGitLabPRDetail(owner, repo, prNumber, token);
        case 'bitbucket':
            return fetchBitbucketPRDetail(owner, repo, prNumber, token);
        case 'github':
        default:
            return fetchGitHubPRDetail(owner, repo, prNumber, token);
    }
}
//# sourceMappingURL=api.js.map