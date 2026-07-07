import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { existsSync, statSync } from 'fs';
import { readdirSync } from 'fs';
export function globalConfigPath() {
    return join(homedir(), '.deltadot', 'config.json');
}
export async function loadGlobalConfig() {
    try {
        const raw = await readFile(globalConfigPath(), 'utf8');
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
export async function saveGlobalConfig(cfg) {
    try {
        const dir = join(homedir(), '.deltadot');
        await mkdir(dir, { recursive: true });
        await writeFile(globalConfigPath(), JSON.stringify(cfg, null, 2), 'utf8');
    }
    catch { /* non-fatal */ }
}
export function cachePath(workspacePath) {
    return join(workspacePath, '.deltadot-cache.json');
}
export async function loadCache(workspacePath) {
    try {
        const raw = await readFile(cachePath(workspacePath), 'utf8');
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export async function saveCache(data) {
    try {
        await writeFile(cachePath(data.workspace), JSON.stringify(data, null, 2), 'utf8');
    }
    catch { /* non-fatal */ }
}
export function findGitRepos(workspacePath) {
    try {
        const entries = readdirSync(workspacePath, { withFileTypes: true });
        return entries
            .filter((e) => e.isDirectory() && existsSync(join(workspacePath, e.name, '.git')))
            .map((e) => join(workspacePath, e.name));
    }
    catch {
        return [];
    }
}
export function resolveInitialRepos(repoPaths, cache, finalCfg) {
    let initialLastSync = '';
    if (cache && cache.base === finalCfg.base && cache.release === finalCfg.release) {
        const initialRepos = repoPaths.map((p) => {
            const name = p.split('/').pop() ?? p;
            const cached = cache.repos.find((r) => r.name === name);
            return cached
                ? { ...cached, status: 'stale', currentBranch: cached.currentBranch ?? '', latestVersionDate: cached.latestVersionDate ?? null }
                : { name, path: p, status: 'loading', diffCommits: [], latestCommits: [], latestVersion: null, latestVersionDate: null, currentBranch: '', lastCommitMsg: '', lastCommitAge: '', lastCommitAuthor: '', error: null };
        });
        initialLastSync = cache.lastFullSync;
        return { initialRepos, initialLastSync };
    }
    const initialRepos = repoPaths.map((p) => ({
        name: p.split('/').pop() ?? p, path: p, status: 'loading',
        diffCommits: [], latestCommits: [], latestVersion: null, latestVersionDate: null, currentBranch: '', lastCommitMsg: '', lastCommitAge: '', lastCommitAuthor: '', error: null,
    }));
    return { initialRepos, initialLastSync };
}
export function resolveCliConfig(cliOpts, savedCfg) {
    const finalCfg = {
        workspace: resolve(cliOpts.path ?? savedCfg.workspace ?? '.'),
        base: cliOpts.base ?? savedCfg.base ?? 'main',
        release: cliOpts.release ?? savedCfg.release ?? 'R10',
        syncInterval: cliOpts.syncInterval ? parseFloat(cliOpts.syncInterval)
            : (savedCfg.syncInterval ?? 30),
        token: cliOpts.token ?? savedCfg.token ?? '',
        provider: (cliOpts.provider ?? savedCfg.provider ?? 'github'),
        taskProvider: savedCfg.taskProvider ?? 'none',
        jiraUrl: savedCfg.jiraUrl ?? '',
        jiraEmail: savedCfg.jiraEmail ?? '',
        jiraApiToken: savedCfg.jiraApiToken ?? '',
        aiProvider: (savedCfg.aiProvider ?? 'none'),
        aiApiKey: savedCfg.aiApiKey ?? '',
        aiApiUrl: savedCfg.aiApiUrl ?? '',
        aiModel: savedCfg.aiModel ?? 'gpt-4o',
        aiSystemPrompt: savedCfg.aiSystemPrompt ?? 'You are a senior software engineer conducting a code review. Review the provided PR changes against the Jira ticket description. Focus on correctness, performance, edge cases, and code style. Provide concise, actionable feedback.',
    };
    if (!existsSync(finalCfg.workspace)) {
        console.error(`Error: workspace path does not exist — ${finalCfg.workspace}`);
        return null;
    }
    if (!statSync(finalCfg.workspace).isDirectory()) {
        console.error(`Error: workspace path is not a directory — ${finalCfg.workspace}`);
        return null;
    }
    return finalCfg;
}
//# sourceMappingURL=config.js.map