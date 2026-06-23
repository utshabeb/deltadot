import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { resolve } from 'path';
import { existsSync, statSync } from 'fs';
import type { View, AppConfig, RepoState, CommitDetail, ConfigField, InputMode, PR, Provider, PRDetail } from './types.js';
import { CONFIG_FIELDS } from './types.js';
import { analyzeRepo, fetchCommitDetail } from './git.js';
import { getRemoteUrl, getCommitUrl, getCompareUrl, openInBrowser } from './remote.js';
import { getRemoteOwnerRepo, fetchPRs, fetchPRDetail } from './pr.js';
import { findGitRepos, saveCache, saveGlobalConfig } from './config.js';
import { TopBar } from './components/TopBar.js';
import { BottomBar } from './components/BottomBar.js';
import { CommandBar } from './components/CommandBar.js';
import { RepoList } from './components/RepoList.js';
import { CommitsView } from './components/CommitsView.js';
import { DetailView } from './components/DetailView.js';
import { ConfigView } from './components/ConfigView.js';
import { PRsView } from './components/PRsView.js';
import { PRDetailView } from './components/PRDetailView.js';

export function Dashboard({ initialConfig, initialRepos, initialLastSync, initialPRs = [] }: {
  initialConfig: AppConfig;
  initialRepos: RepoState[];
  initialLastSync: string;
  initialPRs?: PR[];
}) {
  const { stdout } = useStdout();
  const width = stdout?.columns ?? 100;

  const COMMANDS = ['list', 'prs', 'commits', 'config', 'sync', 'q'];

  const [cfg, setCfg] = useState<AppConfig>(initialConfig);
  const [repos, setRepos]               = useState<RepoState[]>(initialRepos);
  const [view, setView]                 = useState<View>('list');
  const [selectedRepo, setSelectedRepo] = useState(0);
  const [selectedCommit, setSelectedCommit] = useState(0);
  const [detail, setDetail]             = useState<CommitDetail | null>(null);
  const [frame, setFrame]               = useState(0);
  const [lastSync, setLastSync]         = useState(initialLastSync);

  // ── unified input bar (search + command)
  const [inputMode, setInputMode] = useState<InputMode>('none');
  const [inputQuery, setInputQuery] = useState('');

  // ── browser open error
  const [browserError, setBrowserError] = useState('');

  // ── branch column visibility (default hidden)
  const [showBranch, setShowBranch] = useState(false);

  // ── PR list state
  const [prs, setPRs] = useState<PR[]>(initialPRs);
  const [selectedPR, setSelectedPR] = useState(0);
  const [prLoading, setPRLoading] = useState(false);
  const [prError, setPRError] = useState('');

  const prsRef = useRef(prs);
  useEffect(() => { prsRef.current = prs; }, [prs]);

  const reposRef = useRef(repos);
  useEffect(() => { reposRef.current = repos; }, [repos]);

  // ── PR detail state
  const [prDetail, setPRDetail] = useState<PRDetail | null>(null);
  const [prDetailLoading, setPRDetailLoading] = useState(false);
  const [prDetailError, setPRDetailError] = useState('');
  const [prDescriptionScroll, setPRDescriptionScroll] = useState(0);

  // ── config editing state
  const [configDraft, setConfigDraft]   = useState<Record<ConfigField, string>>({
    workspace:    initialConfig.workspace,
    base:         initialConfig.base,
    release:      initialConfig.release,
    syncInterval: String(initialConfig.syncInterval),
    token:        initialConfig.token,
    provider:     initialConfig.provider,
  });
  const [configFocus, setConfigFocus]   = useState<ConfigField>('workspace');
  const [configError, setConfigError]   = useState('');

  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  // ── search query for list/PR filtering (persists across input bar close)
  const [searchQuery, setSearchQuery] = useState('');

  const syncingCount = repos.filter((r) => r.status === 'loading' || r.status === 'stale' || r.status === 'syncing').length;
  const doneCount = repos.length - syncingCount;
  const syncingRepoNames = repos
    .filter((r) => r.status === 'loading' || r.status === 'stale' || r.status === 'syncing')
    .map((r) => r.name);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const sortedPRs = [...prs].sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt));

  const filteredRepos = normalizedSearch
    ? repos.filter((r) => r.name.toLowerCase().includes(normalizedSearch))
    : repos;

  const filteredPRs = normalizedSearch
    ? sortedPRs.filter((pr) => matchesPRSearch(pr, normalizedSearch))
    : sortedPRs;

  const selectedFilteredPos = filteredRepos.indexOf(repos[selectedRepo]!);
  const selectedFilteredPRPos = filteredPRs.indexOf(sortedPRs[selectedPR]!);

  const visibleSelectedPR = filteredPRs[selectedFilteredPRPos >= 0 ? selectedFilteredPRPos : 0] ?? null;

  const navigateFiltered = useCallback((dir: 1 | -1) => {
    const visible = repos.filter((r) =>
      !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (visible.length === 0) return;
    const cur = visible.indexOf(repos[selectedRepo]!);
    const next = (cur + dir + visible.length) % visible.length;
    setSelectedRepo(repos.indexOf(visible[next]!));
  }, [repos, searchQuery, selectedRepo]);

  const navigateFilteredToEnd = useCallback((dir: 1 | -1) => {
    const visible = repos.filter((r) =>
      !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (visible.length === 0) return;
    const idx = dir === 1 ? visible.length - 1 : 0;
    setSelectedRepo(repos.indexOf(visible[idx]!));
  }, [repos, searchQuery]);

  const navigateFilteredPR = useCallback((dir: 1 | -1) => {
    const visible = normalizedSearch ? filteredPRs : sortedPRs;
    if (visible.length === 0) return;
    const cur = visible.indexOf(sortedPRs[selectedPR]!);
    const next = cur === -1 ? (dir === 1 ? 0 : visible.length - 1) : (cur + dir + visible.length) % visible.length;
    setSelectedPR(sortedPRs.indexOf(visible[next]!));
  }, [filteredPRs, normalizedSearch, sortedPRs, selectedPR]);

  const navigateFilteredPRToEnd = useCallback((dir: 1 | -1) => {
    const visible = normalizedSearch ? filteredPRs : sortedPRs;
    if (visible.length === 0) return;
    const idx = dir === 1 ? visible.length - 1 : 0;
    setSelectedPR(sortedPRs.indexOf(visible[idx]!));
  }, [filteredPRs, normalizedSearch, sortedPRs]);

  useEffect(() => {
    if (view === 'prs' && normalizedSearch && filteredPRs.length > 0 && selectedFilteredPRPos === -1) {
      setSelectedPR(sortedPRs.indexOf(filteredPRs[0]!));
    }
  }, [view, normalizedSearch, filteredPRs, selectedFilteredPRPos, sortedPRs]);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => f + 1);
      try { performance.clearMeasures(); } catch { /* noop */ }
    }, 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!browserError) return;
    const id = setTimeout(() => setBrowserError(''), 3000);
    return () => clearTimeout(id);
  }, [browserError]);

  const runFullSync = useCallback(async (paths: string[], base: string, release: string, workspace: string, markStale: boolean) => {
    setRepos((prev) => prev.map((r) => ({ ...r, status: markStale ? ('stale' as const) : ('loading' as const) })));
    const settled: RepoState[] = new Array(paths.length);
    const CONCURRENCY = 4;
    let idx = 0;
    let running = 0;
    await new Promise<void>((resolve) => {
      const launchNext = () => {
        if (idx >= paths.length && running === 0) { resolve(); return; }
        while (running < CONCURRENCY && idx < paths.length) {
          const current = idx++;
          running++;
          analyzeRepo(paths[current], base, release).then((result) => {
            settled[current] = result;
            setRepos((prev) => prev.map((r, i) => (i === current ? result : r)));
          }).catch((err) => {
            const name = paths[current].split('/').pop() ?? paths[current];
            const failure: RepoState = { name, path: paths[current], status: 'error', diffCommits: [], latestCommits: [], latestVersion: null, latestVersionDate: null, currentBranch: '', lastCommitMsg: '', lastCommitAge: '', lastCommitAuthor: '', error: String(err) };
            settled[current] = failure;
            setRepos((prev) => prev.map((r, i) => (i === current ? failure : r)));
          }).finally(() => { running--; setTimeout(launchNext, 0); });
        }
      };
      launchNext();
    });
    const now = new Date().toISOString();
    setLastSync(now);
    await saveCache({ workspace, base, release, lastFullSync: now, repos: settled as RepoState[], prs: prsRef.current });
  }, []);

  const runSingleSync = useCallback(async (idx: number) => {
    const { base, release, workspace } = cfgRef.current;
    const repoPaths = findGitRepos(workspace);
    setRepos((prev) => prev.map((r, i) => (i === idx ? { ...r, status: 'syncing' } : r)));
    try {
      const result = await analyzeRepo(repoPaths[idx] ?? '', base, release);
      setRepos((prev) => {
        const next = prev.map((r, i) => (i === idx ? result : r));
        const now = new Date().toISOString();
        saveCache({ workspace, base, release, lastFullSync: now, repos: next, prs: prsRef.current });
        setLastSync(now);
        return next;
      });
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      setRepos((prev) => {
        const failure: RepoState = { name: repoPaths[idx].split('/').pop() ?? repoPaths[idx], path: repoPaths[idx], status: 'error', diffCommits: [], latestCommits: [], latestVersion: null, latestVersionDate: null, currentBranch: '', lastCommitMsg: '', lastCommitAge: '', lastCommitAuthor: '', error: String(raw) };
        const next = prev.map((r, i) => (i === idx ? failure : r));
        const now = new Date().toISOString();
        saveCache({ workspace, base, release, lastFullSync: now, repos: next, prs: prsRef.current });
        setLastSync(now);
        return next;
      });
    }
  }, []);

  const fetchPRsForAllRepos = useCallback(async () => {
    setPRLoading(true);
    setPRError('');
    const repoList = reposRef.current.length > 0 ? reposRef.current : findGitRepos(cfgRef.current.workspace).map((p) => ({
      name: p.split('/').pop() ?? p, path: p,
    }));

    // Group current cached PRs by repoName to serve as initial state
    const repoPRsMap = new Map<string, PR[]>();
    for (const pr of prsRef.current) {
      const list = repoPRsMap.get(pr.repoName) ?? [];
      list.push(pr);
      repoPRsMap.set(pr.repoName, list);
    }

    const errors: string[] = [];
    for (const repo of repoList) {
      try {
        const orr = await getRemoteOwnerRepo(repo.path);
        if (!orr) {
          errors.push(`${repo.name}: Could not parse remote URL`);
          repoPRsMap.set(repo.name, []);
          continue;
        }
        const provider = cfgRef.current.provider;
        const token = cfgRef.current.token;
        const result = await fetchPRs(orr.owner, orr.repo, provider, token, repo.name);
        
        // Update map for this repo and update state immediately
        repoPRsMap.set(repo.name, result);
        const flattened = Array.from(repoPRsMap.values()).flat();
        setPRs(flattened);
      } catch (err: unknown) {
        errors.push(`${repo.name}: ${err instanceof Error ? err.message : String(err)}`);
        repoPRsMap.set(repo.name, []);
        const flattened = Array.from(repoPRsMap.values()).flat();
        setPRs(flattened);
      }
    }

    if (errors.length > 0) {
      setPRError(errors.join(' | '));
    }
    setPRLoading(false);

    // Save final aggregated list to cache
    const finalPRs = Array.from(repoPRsMap.values()).flat();
    const { base, release, workspace } = cfgRef.current;
    const now = new Date().toISOString();
    saveCache({ workspace, base, release, lastFullSync: now, repos: reposRef.current, prs: finalPRs });
  }, []);

  const fetchPRDetailForRepo = useCallback(async (repoPath: string, prNumber: number) => {
    setPRDetailLoading(true);
    setPRDetailError('');
    try {
      const orr = await getRemoteOwnerRepo(repoPath);
      if (!orr) { setPRDetailError('Could not parse remote URL'); setPRDetailLoading(false); return; }
      const provider = cfgRef.current.provider;
      const token = cfgRef.current.token;
      const result = await fetchPRDetail(orr.owner, orr.repo, prNumber, provider, token);
      const repoName = repoPath.split('/').pop() ?? '';
      setPRDetail({ ...result, repoName });
    } catch (err: unknown) {
      setPRDetailError(err instanceof Error ? err.message : String(err));
    }
    setPRDetailLoading(false);
  }, []);

  useEffect(() => {
    const fromCache = initialRepos.some((r) => r.status === 'stale');
    void runFullSync(findGitRepos(cfg.workspace), cfg.base, cfg.release, cfg.workspace, fromCache);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const intervalMs = cfg.syncInterval * 60 * 1000;
    const id = setInterval(() => {
      const paths = findGitRepos(cfg.workspace);
      void runFullSync(paths, cfg.base, cfg.release, cfg.workspace, false);
    }, intervalMs);
    return () => clearInterval(id);
  }, [cfg.workspace, cfg.base, cfg.release, cfg.syncInterval, runFullSync]);

  useEffect(() => {
    if (view === 'prs') {
      void fetchPRsForAllRepos();
    }
  }, [view, fetchPRsForAllRepos]);

  useEffect(() => {
    if (view === 'prdetail') {
      const pr = visibleSelectedPR;
      if (pr) {
        if (!prDetail || prDetail.number !== pr.number) {
          const repo = repos.find((r) => r.name === pr.repoName) ?? repos[selectedRepo];
          if (repo) {
            void fetchPRDetailForRepo(repo.path, pr.number);
          }
        }
      }
    }
  }, [view, visibleSelectedPR, repos, selectedRepo, fetchPRDetailForRepo, prDetail]);

  const applyConfig = useCallback(() => {
    const { workspace: ws, base, release, syncInterval: siStr } = configDraft;
    const si = parseFloat(siStr);
    if (!ws.trim()) { setConfigError('Workspace path cannot be empty'); return; }
    const resolvedWs = resolve(ws.trim());
    if (!existsSync(resolvedWs)) { setConfigError(`Path does not exist: ${resolvedWs}`); return; }
    if (!statSync(resolvedWs).isDirectory()) { setConfigError('Path is not a directory'); return; }
    if (!base.trim()) { setConfigError('Base branch cannot be empty'); return; }
    if (!release.trim()) { setConfigError('Release branch cannot be empty'); return; }
    if (isNaN(si) || si < 1) { setConfigError('Sync interval must be a number ≥ 1'); return; }
    const newCfg: AppConfig = { workspace: resolvedWs, base: base.trim(), release: release.trim(), syncInterval: si, token: configDraft.token ?? '', provider: (configDraft.provider ?? 'github') as Provider };
    setCfg(newCfg);
    cfgRef.current = newCfg;
    setConfigError('');
    void saveGlobalConfig(newCfg);
    const paths = findGitRepos(resolvedWs);
    const freshRepos: RepoState[] = paths.map((p) => ({
      name: p.split('/').pop() ?? p, path: p, status: 'loading' as const,
      diffCommits: [], latestCommits: [], latestVersion: null, latestVersionDate: null, currentBranch: '', lastCommitMsg: '', lastCommitAge: '', lastCommitAuthor: '', error: null,
    }));
    setRepos(freshRepos);
    setSelectedRepo(0);
    setView('list');
    setSearchQuery('');
    setInputMode('none');
    void runFullSync(paths, base.trim(), release.trim(), resolvedWs, false);
  }, [configDraft, runFullSync]);

  // ── execute :command
  const execCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed || trimmed === 'list') { setView('list'); return true; }
    if (trimmed === 'config') { setConfigDraft({ workspace: cfgRef.current.workspace, base: cfgRef.current.base, release: cfgRef.current.release, syncInterval: String(cfgRef.current.syncInterval), token: cfgRef.current.token, provider: cfgRef.current.provider }); setConfigFocus('workspace'); setConfigError(''); setView('config'); return true; }
    if (trimmed === 'prs') { setView('prs'); return true; }
    if (trimmed === 'commits') { setView('commits'); return true; }
    if (trimmed === 'sync') { const c = cfgRef.current; const paths = findGitRepos(c.workspace); void runFullSync(paths, c.base, c.release, c.workspace, false); return true; }
    if (trimmed === 'q') { process.exit(0); return true; }
    return false;
  }, [runFullSync]);

  // ── keyboard
  useInput((input, key) => {
    const isShiftS = input === 'S' || (key.shift && input.toLowerCase() === 's');

    // --- global quit (always works) ---
    if (input === 'q') { process.exit(0); return; }

    // --- config view overrides ---
    if (view === 'config') {
      if (key.escape) { setConfigError(''); setView('list'); return; }
      if (key.tab || key.downArrow) {
        const idx = CONFIG_FIELDS.indexOf(configFocus);
        setConfigFocus(CONFIG_FIELDS[(idx + 1) % CONFIG_FIELDS.length]!);
        return;
      }
      if (key.upArrow) {
        const idx = CONFIG_FIELDS.indexOf(configFocus);
        setConfigFocus(CONFIG_FIELDS[(idx - 1 + CONFIG_FIELDS.length) % CONFIG_FIELDS.length]!);
        return;
      }
      if (key.return) { applyConfig(); return; }
      return;
    }

    // --- hard shortcuts for list/prs ---
    if (view === 'prs' && isShiftS) {
      const c = cfgRef.current;
      const paths = findGitRepos(c.workspace);
      void (async () => {
        await runFullSync(paths, c.base, c.release, c.workspace, false);
        await fetchPRsForAllRepos();
      })();
      return;
    }
    if (view === 'list' && isShiftS) {
      const c = cfgRef.current;
      const paths = findGitRepos(c.workspace);
      void runFullSync(paths, c.base, c.release, c.workspace, false);
      return;
    }

    // --- input bar active ---
    if (inputMode !== 'none') {
      if (key.escape) {
        if (inputMode === 'search') setSearchQuery('');
        setInputMode('none');
        setInputQuery('');
        return;
      }
      if (key.return) {
        if (inputMode === 'command') {
          const ok = execCommand(inputQuery);
          if (!ok) setBrowserError(`Unknown command: ${inputQuery}`);
          setInputQuery('');
        }
        setInputMode('none');
        return;
      }
      if (key.tab && inputMode === 'command') {
        const trimmed = inputQuery.trim().toLowerCase();
        if (!trimmed) {
          setBrowserError('list | prs | commits | config | sync | q');
          return;
        }
        const matches = COMMANDS.filter(c => c.startsWith(trimmed));
        if (matches.length === 0) return;
        if (matches.length === 1) { setInputQuery(matches[0]!); return; }
        let prefix = matches[0]!;
        for (const cmd of matches) {
          let i = 0;
          while (i < prefix.length && i < cmd.length && prefix[i] === cmd[i]) i++;
          prefix = prefix.slice(0, i);
        }
        setInputQuery(prefix);
        return;
      }
      return; // let TextInput handle chars
    }

    // --- view-specific ---
    if (view === 'list') {
      if (input === ':') { setInputQuery(''); setInputMode('command'); return; }
      if (input === '/') { setInputQuery(''); setInputMode('search'); return; }
      if (key.upArrow || input === 'k') { navigateFiltered(-1); return; }
      if (key.downArrow || input === 'j') { navigateFiltered(1); return; }
      if (input === 'g') { navigateFilteredToEnd(-1); return; }
      if (input === 'G') { navigateFilteredToEnd(1); return; }
      if (key.return || input === 'l' || input === 'L') {
        if (selectedFilteredPos === -1) return;
        const selected = repos[selectedRepo];
        if (!selected) return;
        if (selected.status === 'error' && selected.error) {
          setSelectedCommit(0);
          const fakeRepo: RepoState = { ...selected, latestCommits: [{ hash: 'error', subject: selected.error, author: '', age: '' }] };
          setRepos((prev) => prev.map((r, i) => (i === selectedRepo ? fakeRepo : r)));
          setView('commits');
        } else if (selected.missingRelease) {
          setSelectedCommit(0);
          const fakeRepo: RepoState = { ...selected, latestCommits: [{ hash: 'missing-release', subject: `Release branch not found: origin/${cfgRef.current.release}`, author: '', age: '' }] };
          setRepos((prev) => prev.map((r, i) => (i === selectedRepo ? fakeRepo : r)));
          setView('commits');
        } else {
          setSelectedCommit(0);
          setView('commits');
        }
        return;
      }
      if (input === 'c') { setSelectedCommit(0); setView('commits'); return; }
      if (input === 's') { void runSingleSync(selectedRepo); return; }
      if (input === 'e') {
        setConfigDraft({ workspace: cfgRef.current.workspace, base: cfgRef.current.base, release: cfgRef.current.release, syncInterval: String(cfgRef.current.syncInterval), token: cfgRef.current.token, provider: cfgRef.current.provider });
        setConfigFocus('workspace');
        setConfigError('');
        setView('config');
        return;
      }
      if (input === 'b') { setShowBranch((v) => !v); return; }
      if (input === 'o' || input === 'O') {
        if (selectedFilteredPos === -1) return;
        const selected = repos[selectedRepo];
        if (!selected) return;
        void (async () => {
          const remoteUrl = await getRemoteUrl(selected.path);
          if (!remoteUrl) { setBrowserError('No remote origin found'); return; }
          const url = getCompareUrl(remoteUrl, cfgRef.current.base, cfgRef.current.release);
          if (!url) { setBrowserError('Could not parse remote URL'); return; }
          const ok = await openInBrowser(url);
          if (!ok) { setBrowserError('Failed to open browser'); }
        })();
        return;
      }
      if (input === 'p' || input === 'P') {
        if (selectedFilteredPos === -1) return;
        setView('prs');
        return;
      }
    } else if (view === 'commits') {
      if (input === ':') { setInputQuery(''); setInputMode('command'); return; }
      if (input === '/') { setInputQuery(''); setInputMode('search'); return; }
      const repo = repos[selectedRepo];
      const max = (repo?.latestCommits.length ?? 1) - 1;
      if (key.upArrow || input === 'k') { setSelectedCommit((i) => Math.max(0, i - 1)); return; }
      if (key.downArrow || input === 'j') { setSelectedCommit((i) => Math.min(max, i + 1)); return; }
      if (input === 'g') { setSelectedCommit(0); return; }
      if (input === 'G') { setSelectedCommit(max); return; }
      if (key.return || input === 'l' || input === 'L') {
        const commit = repo?.latestCommits[selectedCommit];
        if (commit && repo) {
          setDetail(null); setView('detail');
          void fetchCommitDetail(repo.path, commit.hash).then(setDetail);
        }
        return;
      }
      if (input === 's') { void runSingleSync(selectedRepo); return; }
      if (input === 'o' || input === 'O') {
        const commit = repo?.latestCommits[selectedCommit];
        if (!commit || !repo) { setBrowserError('No commit selected'); return; }
        void (async () => {
          const remoteUrl = await getRemoteUrl(repo.path);
          if (!remoteUrl) { setBrowserError('No remote origin found'); return; }
          const url = getCommitUrl(remoteUrl, commit.hash);
          if (!url) { setBrowserError('Could not parse remote URL'); return; }
          const ok = await openInBrowser(url);
          if (!ok) { setBrowserError('Failed to open browser'); }
        })();
        return;
      }
      if (input === 'b' || key.escape) { setView('list'); return; }
    } else if (view === 'detail') {
      if (input === ':') { setInputQuery(''); setInputMode('command'); return; }
      if (input === '/') { setInputQuery(''); setInputMode('search'); return; }
      if (input === 'b' || key.escape || key.upArrow || key.downArrow) { setView('commits'); return; }
    } else if (view === 'prs') {
      if (input === ':') { setInputQuery(''); setInputMode('command'); return; }
      if (input === '/') { setInputQuery(''); setInputMode('search'); return; }
      if (key.upArrow || input === 'k') { navigateFilteredPR(-1); return; }
      if (key.downArrow || input === 'j') { navigateFilteredPR(1); return; }
      if (input === 'g') { navigateFilteredPRToEnd(-1); return; }
      if (input === 'G') { navigateFilteredPRToEnd(1); return; }
      if (key.return) {
        if (!visibleSelectedPR) return;
        setSelectedPR(sortedPRs.indexOf(visibleSelectedPR));
        setPRDescriptionScroll(0);
        setPRDetail(null);
        setPRDetailError('');
        setPRDetailLoading(true);
        setView('prdetail');
        return;
      }
      if (input === 'o' || input === 'O') {
        if (visibleSelectedPR?.url) void openInBrowser(visibleSelectedPR.url);
        return;
      }
      if (input === 'b' || key.escape) { setView('list'); return; }
    } else if (view === 'prdetail') {
      if (input === ':') { setInputQuery(''); setInputMode('command'); return; }
      if (input === '/') { setInputQuery(''); setInputMode('search'); return; }
      if (key.upArrow || input === 'k') { setPRDescriptionScroll((s) => Math.max(0, s - 1)); return; }
      if (key.downArrow || input === 'j') { setPRDescriptionScroll((s) => s + 1); return; }
      if (key.pageUp) { setPRDescriptionScroll((s) => Math.max(0, s - 8)); return; }
      if (key.pageDown) { setPRDescriptionScroll((s) => s + 8); return; }
      if (input === 'o' || input === 'O') {
        const pr = visibleSelectedPR;
        if (pr?.url) void openInBrowser(pr.url);
        return;
      }
      if (input === 'b' || key.escape) { setPRDescriptionScroll(0); setPRDetail(null); setView('prs'); return; }
    }
  });

  const currentRepo = repos[selectedRepo];

  return (
    <Box flexDirection="column" width={width}>
      <TopBar
        workspace={cfg.workspace}
        base={cfg.base}
        release={cfg.release}
        repoCount={repos.length}
        syncingCount={syncingCount}
        doneCount={doneCount}
        lastSync={lastSync}
        frame={frame}
        width={width}
      />
      <Box height={1} minHeight={1}>
        <Text dimColor>{'─'.repeat(width)}</Text>
      </Box>

      {/* unified input bar — always right below header */}
      {inputMode !== 'none' && (
        <CommandBar
          mode={inputMode}
          width={width}
          query={inputMode === 'search' ? searchQuery : inputQuery}
          onChange={inputMode === 'search' ? setSearchQuery : setInputQuery}
          onSubmit={() => {
            if (inputMode === 'command') {
              const ok = execCommand(inputQuery);
              if (!ok) setBrowserError(`Unknown command: ${inputQuery}`);
              setInputQuery('');
            }
            setInputMode('none');
          }}
          onCancel={() => {
            if (inputMode === 'search') setSearchQuery('');
            setInputMode('none');
            setInputQuery('');
          }}
        />
      )}

      <Box flexDirection="column" flexGrow={1} paddingTop={0}>

        {view === 'list' && (
          <RepoList
            repos={filteredRepos}
            allRepos={repos}
            selectedIdx={selectedRepo}
            searchQuery={searchQuery}
            showBranch={showBranch}
            frame={frame}
            width={width}
          />
        )}
        {view === 'commits' && currentRepo && (
          <CommitsView repo={currentRepo} base={cfg.base} release={cfg.release} selectedCommitIdx={selectedCommit} frame={frame} width={width} />
        )}
        {view === 'detail' && (
          <DetailView detail={detail} frame={frame} width={width} />
        )}
        {view === 'config' && (
          <ConfigView
            draft={configDraft}
            focusedField={configFocus}
            validationError={configError}
            width={width}
            onChange={(field, val) => setConfigDraft((prev) => ({ ...prev, [field]: val }))}
            onSave={applyConfig}
            onCancel={() => { setConfigError(''); setView('list'); }}
          />
        )}
        {view === 'prs' && (
          <PRsView
            prs={filteredPRs}
            syncingRepoNames={syncingRepoNames}
            selectedIdx={selectedFilteredPRPos}
            loading={prLoading}
            error={prError}
            frame={frame}
            width={width}
          />
        )}
        {view === 'prdetail' && (
          <PRDetailView pr={prDetail} loading={prDetailLoading} error={prDetailError} frame={frame} width={width} descriptionScroll={prDescriptionScroll} />
        )}
      </Box>

      <Box height={1} minHeight={1}>
        <Text dimColor>{'─'.repeat(width)}</Text>
      </Box>
      <BottomBar view={view} syncingCount={syncingCount} browserError={browserError} showBranch={showBranch} width={width} />
    </Box>
  );
}

function matchesPRSearch(pr: PR, query: string): boolean {
  if (!query) return true;
  const haystack = [pr.title, pr.repoName, pr.author].join(' ').toLowerCase();
  return haystack.includes(query);
}

function dateValue(dateStr: string): number {
  const value = new Date(dateStr).getTime();
  return Number.isNaN(value) ? 0 : value;
}
