import type { JiraIssue } from '../../types.js';
export interface JiraConfig {
    url: string;
    email: string;
    apiToken: string;
}
export declare function extractJiraIssueKey(...sources: Array<string | undefined>): string | null;
export declare function fetchJiraIssue(config: JiraConfig, issueKey: string): Promise<JiraIssue>;
//# sourceMappingURL=jira.d.ts.map