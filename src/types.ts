// ─── Types ────────────────────────────────────────────────────────────────────

export type RepoStatus = 'loading' | 'stale' | 'syncing' | 'synced' | 'behind' | 'error';
export type View = 'list' | 'commits' | 'detail' | 'config' | 'prs' | 'prdetail';
export type InputMode = 'none' | 'search' | 'command';
export type Provider = 'github' | 'gitlab' | 'bitbucket';

export interface AppConfig {
  workspace: string;
  base: string;
  release: string;
  syncInterval: number;
  token: string;
  provider: Provider;
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
  
  // New fields
  additions?: number;
  deletions?: number;
  changedFiles?: number;
  commitsCount?: number;
  commits?: PRCommit[];
}

export type ConfigField = 'workspace' | 'base' | 'release' | 'syncInterval' | 'token' | 'provider';

export const CONFIG_FIELDS: ConfigField[] = ['workspace', 'base', 'release', 'syncInterval', 'token', 'provider'];

export const CONFIG_LABELS: Record<ConfigField, string> = {
  workspace:    'Workspace Path',
  base:         'Base Branch',
  release:      'Release Branch',
  syncInterval: 'Sync Interval (min)',
  token:        'API Token',
  provider:     'Provider',
};
