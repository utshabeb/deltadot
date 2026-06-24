// ─── Types ────────────────────────────────────────────────────────────────────
export const CONFIG_FIELDS = ['workspace', 'base', 'release', 'syncInterval', 'token', 'provider', 'taskProvider', 'jiraUrl', 'jiraEmail', 'jiraApiToken'];
export function getVisibleConfigFields(taskProvider) {
    return taskProvider === 'jira'
        ? ['workspace', 'base', 'release', 'syncInterval', 'token', 'provider', 'taskProvider', 'jiraUrl', 'jiraEmail', 'jiraApiToken']
        : ['workspace', 'base', 'release', 'syncInterval', 'token', 'provider', 'taskProvider'];
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
};
//# sourceMappingURL=types.js.map