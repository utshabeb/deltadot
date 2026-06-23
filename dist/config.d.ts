import type { AppConfig, CacheFile, RepoState } from './types.js';
export declare function globalConfigPath(): string;
export declare function loadGlobalConfig(): Promise<Partial<AppConfig>>;
export declare function saveGlobalConfig(cfg: AppConfig): Promise<void>;
export declare function cachePath(workspacePath: string): string;
export declare function loadCache(workspacePath: string): Promise<CacheFile | null>;
export declare function saveCache(data: CacheFile): Promise<void>;
export declare function findGitRepos(workspacePath: string): string[];
export declare function resolveInitialRepos(repoPaths: string[], cache: CacheFile | null, finalCfg: AppConfig): {
    initialRepos: RepoState[];
    initialLastSync: string;
};
export declare function resolveCliConfig(cliOpts: {
    path?: string;
    base?: string;
    release?: string;
    syncInterval?: string;
    token?: string;
    provider?: string;
}, savedCfg: Partial<AppConfig>): AppConfig | null;
//# sourceMappingURL=config.d.ts.map