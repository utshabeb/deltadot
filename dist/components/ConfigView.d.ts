import React from 'react';
import type { ConfigField } from '../types.js';
export declare function ConfigView({ draft, focusedField, validationError, width, onChange, onSave, onCancel, }: {
    draft: Record<ConfigField, string>;
    focusedField: ConfigField;
    validationError: string;
    width: number;
    onChange: (field: ConfigField, val: string) => void;
    onSave: () => void;
    onCancel: () => void;
}): React.JSX.Element;
//# sourceMappingURL=ConfigView.d.ts.map