// ─── Types ────────────────────────────────────────────────────────────────────
export const CONFIG_FIELDS = ['workspace', 'base', 'release', 'syncInterval', 'token', 'provider', 'taskProvider', 'jiraUrl', 'jiraEmail', 'jiraApiToken', 'aiProvider', 'aiApiKey', 'aiApiUrl', 'aiModel', 'aiSystemPrompt'];
export function getVisibleConfigFields(taskProvider, aiProvider) {
    const fields = ['workspace', 'base', 'release', 'syncInterval', 'token', 'provider', 'taskProvider'];
    if (taskProvider === 'jira') {
        fields.push('jiraUrl', 'jiraEmail', 'jiraApiToken');
    }
    fields.push('aiProvider');
    if (aiProvider && aiProvider !== 'none') {
        fields.push('aiApiKey', 'aiApiUrl', 'aiModel', 'aiSystemPrompt');
    }
    return fields;
}
export const CONFIG_LABELS = {
    workspace: 'Workspace Path',
    base: 'Base Branch',
    release: 'Release Branch',
    syncInterval: 'Sync Interval (min)',
    token: 'API Token',
    provider: 'Provider',
    taskProvider: 'Task Provider',
    jiraUrl: 'Jira URL',
    jiraEmail: 'Jira Email',
    jiraApiToken: 'Jira API Token',
    aiProvider: 'AI Provider',
    aiApiKey: 'AI API Key',
    aiApiUrl: 'AI API URL',
    aiModel: 'AI Model',
    aiSystemPrompt: 'AI System Prompt',
};
//# sourceMappingURL=types.js.map