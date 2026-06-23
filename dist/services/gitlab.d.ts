import type { PR, PRDetail } from '../types.js';
export declare function fetchGitLabPRs(owner: string, repo: string, token: string, repoName?: string): Promise<PR[]>;
export declare function fetchGitLabPRDetail(owner: string, repo: string, prNumber: number, token: string): Promise<PRDetail>;
//# sourceMappingURL=gitlab.d.ts.map