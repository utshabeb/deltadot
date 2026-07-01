import React from 'react';
import type { JiraIssue, PRDetail } from '../types.js';
export declare function ReviewView({ pr, jira, loading, error, frame, width, descriptionScroll, collapsed, terminalHeight, }: {
    pr: PRDetail | null;
    jira: JiraIssue | null;
    loading: boolean;
    error: string;
    frame: number;
    width: number;
    descriptionScroll: number;
    collapsed: boolean;
    terminalHeight: number;
}): React.JSX.Element;
//# sourceMappingURL=ReviewView.d.ts.map