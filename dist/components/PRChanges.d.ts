import React from 'react';
import type { PRDetail } from '../types.js';
export declare function PRChanges({ pr, width, reviewFocus, reviewFileFocusIdx, reviewExpandedFiles, reviewFilesCollapsed, }: {
    pr: PRDetail;
    width: number;
    reviewFocus: 'description' | 'files';
    reviewFileFocusIdx: number;
    reviewExpandedFiles: string[];
    reviewFilesCollapsed: boolean;
}): React.JSX.Element;
//# sourceMappingURL=PRChanges.d.ts.map