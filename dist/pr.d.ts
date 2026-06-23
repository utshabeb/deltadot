import type { PR, PRDetail, Provider } from './types.js';
export declare function getRemoteOwnerRepo(repoPath: string): Promise<{
    owner: string;
    repo: string;
} | null>;
export declare function getProvider(remoteUrl: string): Provider;
export declare function fetchPRs(owner: string, repo: string, provider: Provider, token: string, repoName?: string): Promise<PR[]>;
export declare function fetchPRDetail(owner: string, repo: string, prNumber: number, provider: Provider, token: string): Promise<PRDetail>;
export declare function detectProviderFromRemote(remoteUrl: string): Provider;
export declare function formatPRDate(dateStr: string): string;
//# sourceMappingURL=pr.d.ts.map