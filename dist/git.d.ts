import type { CommitDetail, RepoState } from './types.js';
export declare function run(cmd: string, cwd: string): Promise<string>;
export declare function analyzeRepo(repoPath: string, base: string, release: string): Promise<RepoState>;
export declare function fetchCommitDetail(repoPath: string, hash: string): Promise<CommitDetail>;
//# sourceMappingURL=git.d.ts.map