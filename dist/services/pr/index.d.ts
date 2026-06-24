import type { PR, PRDetail, Provider } from '../../types.js';
export declare function fetchPRsByProvider(owner: string, repo: string, provider: Provider, token: string, repoName?: string): Promise<PR[]>;
export declare function fetchPRDetailByProvider(owner: string, repo: string, prNumber: number, provider: Provider, token: string): Promise<PRDetail>;
//# sourceMappingURL=index.d.ts.map