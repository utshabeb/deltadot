import type { RepoStatus } from './types.js';
export declare const SPINNER: string[];
export declare function toUsername(raw: string): string;
export declare function timeAgo(iso: string): string;
export declare function pad(s: string, n: number): string;
export declare function truncate(s: string, n: number): string;
export declare function statusIcon(status: RepoStatus, frame: number): {
    char: string;
    color: string;
};
//# sourceMappingURL=utils.d.ts.map