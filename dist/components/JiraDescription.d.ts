import React from 'react';
import type { JiraIssue, PRDetail } from '../types.js';
export declare function JiraDescription({ jira, descriptionScroll, collapsed, terminalHeight, width, pr, reviewTab, aiReviewLoading, aiReviewError, aiScroll, }: {
    jira: JiraIssue | null;
    descriptionScroll: number;
    collapsed: boolean;
    terminalHeight: number;
    width: number;
    pr: PRDetail | null;
    reviewTab: 'jira' | 'ai';
    aiReviewLoading: boolean;
    aiReviewError: string;
    aiScroll: number;
}): React.JSX.Element;
//# sourceMappingURL=JiraDescription.d.ts.map