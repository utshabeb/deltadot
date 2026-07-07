export type RepoStatus = 'loading' | 'stale' | 'syncing' | 'synced' | 'behind' | 'error';
export type View = 'list' | 'commits' | 'detail' | 'config' | 'prs' | 'prdetail' | 'review';
export type InputMode = 'none' | 'search' | 'command';
export type Provider = 'github' | 'gitlab' | 'bitbucket';
export type TaskProvider = 'none' | 'jira' | 'clickup' | 'github';
export interface AppConfig {
    workspace: string;
    base: string;
    release: string;
    syncInterval: number;
    token: string;
    provider: Provider;
    taskProvider: TaskProvider;
    jiraUrl: string;
    jiraEmail: string;
    jiraApiToken: string;
    aiProvider: 'none' | 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'openrouter';
    aiApiKey: string;
    aiApiUrl: string;
    aiModel: string;
    aiSystemPrompt: string;
}
export interface CommitEntry {
    hash: string;
    message: string;
}
export interface LatestCommit {
    hash: string;
    subject: string;
    author: string;
    age: string;
}
export interface CommitDetail {
    hash: string;
    author: string;
    date: string;
    subject: string;
    body: string;
    stat: string;
}
export interface RepoState {
    name: string;
    path: string;
    status: RepoStatus;
    diffCommits: CommitEntry[];
    latestCommits: LatestCommit[];
    lastCommitMsg: string;
    lastCommitAge: string;
    lastCommitAuthor: string;
    latestVersion: string | null;
    latestVersionDate: string | null;
    currentBranch: string;
    error: string | null;
    missingRelease?: boolean;
}
export interface CacheFile {
    workspace: string;
    base: string;
    release: string;
    lastFullSync: string;
    repos: RepoState[];
    prs?: PR[];
    aiReviews?: Record<string, string>;
}
export interface PR {
    number: number;
    title: string;
    author: string;
    state: string;
    sourceBranch: string;
    targetBranch: string;
    createdAt: string;
    url: string;
    repoName: string;
    approved: boolean;
}
export interface PRCommit {
    hash: string;
    message: string;
    author: string;
    date: string;
}
export interface PRComment {
    id: string;
    type: 'issue' | 'review' | 'pending';
    author: string;
    body: string;
    createdAt: string;
    updatedAt?: string;
    path?: string;
    line?: string;
}
export interface PRDetail {
    number: number;
    title: string;
    description: string;
    author: string;
    state: string;
    draft?: boolean;
    sourceBranch: string;
    targetBranch: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    mergedBy?: string;
    mergedAt?: string;
    mergeCommitSha?: string;
    commentsCount?: number;
    reviewCommentsCount?: number;
    requestedReviewers?: string[];
    approvedBy?: string[];
    changesRequestedBy?: string[];
    commentedBy?: string[];
    assignees?: string[];
    comments: PRComment[];
    reviewers: string[];
    labels: string[];
    repoName?: string;
    additions?: number;
    deletions?: number;
    changedFiles?: number;
    commitsCount?: number;
    commits?: PRCommit[];
    files?: PRFile[];
    aiReview?: string;
}
export interface PRFile {
    path: string;
    additions: number;
    deletions: number;
    status: 'added' | 'modified' | 'deleted' | 'renamed';
    previousPath?: string;
    patch?: string;
}
export interface JiraIssue {
    key: string;
    summary: string;
    description: string;
    status: string;
    issueType: string;
    assignee: string;
    reporter: string;
    url: string;
}
export type ConfigField = 'workspace' | 'base' | 'release' | 'syncInterval' | 'token' | 'provider' | 'taskProvider' | 'jiraUrl' | 'jiraEmail' | 'jiraApiToken' | 'aiProvider' | 'aiApiKey' | 'aiApiUrl' | 'aiModel' | 'aiSystemPrompt';
export declare const CONFIG_FIELDS: ConfigField[];
export declare function getVisibleConfigFields(taskProvider: TaskProvider, aiProvider: string): ConfigField[];
export declare const CONFIG_LABELS: Record<ConfigField, string>;
//# sourceMappingURL=types.d.ts.map