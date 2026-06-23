export declare function getRemoteUrl(repoPath: string): Promise<string>;
export declare function parseRemoteUrl(raw: string): string;
export declare function getCommitUrl(remoteUrl: string, hash: string): string;
export declare function openInBrowser(url: string): Promise<boolean>;
export declare function getCompareUrl(remoteUrl: string, baseBranch: string, releaseBranch: string): string;
export declare function getPRsUrl(remoteUrl: string): string;
//# sourceMappingURL=remote.d.ts.map