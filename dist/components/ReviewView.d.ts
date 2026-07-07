import React from 'react';
import type { PRDetail, JiraIssue } from '../types.js';
export declare function ReviewView({ pr, jira, loading, error, frame, width, descriptionScroll, collapsed, terminalHeight, reviewFocus, reviewFileFocusIdx, reviewExpandedFiles, reviewFilesCollapsed, reviewTab, aiReviewLoading, aiReviewError, aiScroll, }: {
    pr: PRDetail | null;
    jira: JiraIssue | null;
    loading: boolean;
    error: string;
    frame: number;
    width: number;
    descriptionScroll: number;
    collapsed: boolean;
    terminalHeight: number;
    reviewFocus: 'description' | 'files';
    reviewFileFocusIdx: number;
    reviewExpandedFiles: string[];
    reviewFilesCollapsed: boolean;
    reviewTab: 'jira' | 'ai';
    aiReviewLoading: boolean;
    aiReviewError: string;
    aiScroll: number;
}): React.JSX.Element;
//# sourceMappingURL=ReviewView.d.ts.map