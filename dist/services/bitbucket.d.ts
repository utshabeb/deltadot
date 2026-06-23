import type { PR, PRDetail } from '../types.js';
export declare function fetchBitbucketPRs(owner: string, repo: string, token: string, repoName?: string): Promise<PR[]>;
export declare function fetchBitbucketPRDetail(owner: string, repo: string, prNumber: number, token: string): Promise<PRDetail>;
//# sourceMappingURL=bitbucket.d.ts.map