import type { PR, PRDetail } from '../types.js';
export declare function fetchGitHubPRs(owner: string, repo: string, token: string, repoName?: string): Promise<PR[]>;
export declare function fetchGitHubPRDetail(owner: string, repo: string, prNumber: number, token: string): Promise<PRDetail>;
//# sourceMappingURL=github.d.ts.map