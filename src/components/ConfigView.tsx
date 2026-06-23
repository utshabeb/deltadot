import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { CONFIG_FIELDS, CONFIG_LABELS } from '../types.js';
import type { ConfigField } from '../types.js';
import { pad } from '../utils.js';

export function ConfigView({
  draft, focusedField, validationError, width,
  onChange, onSave, onCancel,
}: {
  draft: Record<ConfigField, string>;
  focusedField: ConfigField;
  validationError: string;
  width: number;
  onChange: (field: ConfigField, val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const indent = 3;
  const labelW = 22;

  return (
    <Box flexDirection="column" width={width} paddingBottom={1}>
      <Box paddingLeft={indent} height={1} minHeight={1}>
        <Text color="whiteBright" bold>Edit Configuration</Text>
      </Box>
      <Box height={1}>
        <Text dimColor>{'─'.repeat(width)}</Text>
      </Box>
      {CONFIG_FIELDS.map((field) => {
        const isFocused = field === focusedField;
        return (
          <Box key={field} paddingLeft={indent} height={1} minHeight={1} marginTop={1}>
            <Text color={isFocused ? 'cyanBright' : 'white'} bold wrap="truncate-end">
              {isFocused ? '▸ ' : '  '}{pad(CONFIG_LABELS[field], labelW)}:
            </Text>
            {isFocused ? (
              <Box flexGrow={1} paddingLeft={1}>
                <TextInput
                  value={draft[field]}
                  onChange={(val) => onChange(field, val)}
                  onSubmit={onSave}
                  focus={true}
                />
              </Box>
            ) : (
              <Text color="whiteBright" wrap="truncate-end"> {draft[field]}</Text>
            )}
          </Box>
        );
      })}
      {validationError && (
        <Box marginTop={1} paddingLeft={indent}>
          <Text color="redBright" bold>⚠  {validationError}</Text>
        </Box>
      )}
    </Box>
  );
}
