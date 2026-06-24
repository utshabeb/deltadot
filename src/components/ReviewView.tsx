import React from 'react';
import { Box, Text } from 'ink';
import type { JiraIssue, PRDetail, PRCommit } from '../types.js';
import { SPINNER, pad, timeAgo } from '../utils.js';

export function ReviewView({
  pr,
  jira,
  loading,
  error,
  frame,
  width,
  descriptionScroll,
}: {
  pr: PRDetail | null;
  jira: JiraIssue | null;
  loading: boolean;
  error: string;
  frame: number;
  width: number;
  descriptionScroll: number;
}) {
  const indent = 3;

  if (!pr) {
    if (error) {
      return (
        <Box paddingLeft={indent} paddingTop={2} flexGrow={1}>
          <Text color="redBright">⚠ Review error: {error}</Text>
        </Box>
      );
    }
    const spin = SPINNER[frame % SPINNER.length]!;
    return (
      <Box paddingLeft={indent} paddingTop={2} flexGrow={1} flexDirection="column">
        <Box>
          <Text color="cyanBright">{spin}</Text>
          <Text>  </Text>
          <Text color="yellowBright">Loading review view…</Text>
        </Box>
      </Box>
    );
  }

  if (loading) {
    const spin = SPINNER[frame % SPINNER.length]!;
    return (
      <Box paddingLeft={indent} paddingTop={2} flexGrow={1} flexDirection="column">
        <Box>
          <Text color="cyanBright">{spin}</Text>
          <Text>  </Text>
          <Text color="yellowBright">Loading review view…</Text>
        </Box>
      </Box>
    );
  }

  const contentWidth = Math.max(60, width - indent * 2);
  const stacked = contentWidth < 110;
  const gap = 2;
  const leftWidth = stacked ? contentWidth : Math.floor(contentWidth * 0.45);
  const rightWidth = stacked ? contentWidth : contentWidth - leftWidth - gap;
  const jiraLines = wrapText(jira?.description ?? 'No Jira description available.', Math.max(20, leftWidth - 4));
  const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
  const commitSummary = `${pr.additions ?? 0} additions · ${pr.deletions ?? 0} deletions · ${pr.changedFiles ?? 0} files · ${pr.commitsCount ?? commits.length} commits`;

  return (
    <Box flexDirection="column">
      {error ? (
        <Box paddingLeft={indent} paddingTop={1}>
          <Text color="redBright">⚠ Review error: {error}</Text>
        </Box>
      ) : null}
      <Box paddingLeft={indent} paddingTop={1} flexDirection="column">
        <Box>
          <Text color="cyanBright" bold>{`Review #${pr.number}`}</Text>
          <Text>  </Text>
          <Text color="whiteBright" bold wrap="wrap">{jira?.key ?? 'no jira key found'}</Text>
        </Box>
        <Box>
          <Text color="whiteBright" bold wrap="wrap">{pr.title || '(no title)'}</Text>
        </Box>
      </Box>

      <Box paddingLeft={indent} height={1}>
        <Text dimColor>{'─'.repeat(Math.max(10, width - indent * 2))}</Text>
      </Box>

      <Box paddingLeft={indent} flexDirection={stacked ? 'column' : 'row'}>
        <Box width={leftWidth} marginRight={stacked ? 0 : gap} flexDirection="column">
          <Section title="Jira Task">
            {jira ? (
              <>
                <Field label="Summary:" value={jira.summary || 'n/a'} labelW={10} valueColor="whiteBright" />
                <Field label="Status:" value={jira.status || 'n/a'} labelW={10} valueColor="greenBright" />
                <Field label="Type:" value={jira.issueType || 'n/a'} labelW={10} valueColor="magentaBright" />
                <Field label="Assignee:" value={jira.assignee || 'unassigned'} labelW={10} valueColor="cyanBright" />
                <Field label="Reporter:" value={jira.reporter || 'unknown'} labelW={10} valueColor="cyanBright" />
                <Field label="URL:" value={jira.url || 'n/a'} labelW={10} valueColor="blueBright" wrap="truncate-end" />
              </>
            ) : (
              <Text dimColor>{'No Jira issue found or task provider is disabled.'}</Text>
            )}
          </Section>

          {jira ? (
            <Box flexDirection="column" marginTop={1}>
              <Box>
                <Text color="whiteBright" bold>Description</Text>
              </Box>
              <Box flexDirection="column">
                {jiraLines.map((line, i) => (
                  <Text key={`${i}`} color="white" wrap="wrap">{line || ' '}</Text>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>

        <Box width={rightWidth} flexDirection="column">
          <Section title="PR Changes">
            <Text dimColor>{commitSummary}</Text>
            <Box marginTop={1}>
              <Text color="whiteBright">{`Source: ${pr.sourceBranch || 'n/a'} -> Target: ${pr.targetBranch || 'n/a'}`}</Text>
            </Box>
            <Box>
              <Text color="whiteBright">{`Author: ${pr.author || 'n/a'} · State: ${pr.state}`}</Text>
            </Box>
          </Section>

          <Section title={`Commits (${commits.length})`}>
            {commits.length > 0 ? commits.map((commit) => <CommitCard key={commit.hash + commit.date} commit={commit} width={rightWidth} />) : <EmptyState text="No commits" />}
          </Section>
        </Box>
      </Box>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box flexDirection="column" marginBottom={0}>
      <Box>
        <Text dimColor bold>{`── ${title}`}</Text>
      </Box>
      <Box flexDirection="column">
        {children}
      </Box>
    </Box>
  );
}

function Field({
  label,
  value,
  labelW,
  valueColor = 'whiteBright',
  wrap = 'truncate-end',
}: {
  label: string;
  value: string;
  labelW: number;
  valueColor?: any;
  wrap?: 'wrap' | 'truncate-end' | 'truncate-middle' | 'truncate-start';
}) {
  return (
    <Box>
      <Text color="cyanBright" bold>{pad(label, labelW)}</Text>
      <Text color={valueColor} wrap={wrap}>{value}</Text>
    </Box>
  );
}

function CommitCard({ commit, width }: { commit: PRCommit; width: number }) {
  const hashW = 8;
  const messageWidth = Math.max(16, width - hashW - 2);
  return (
    <Box flexDirection="column" marginBottom={0}>
      <Box>
        <Text color="yellowBright" bold>{pad(commit.hash, hashW)}</Text>
        <Text>  </Text>
        <Box width={messageWidth}>
          <Text color="white" wrap="wrap">{commit.message || '(empty)'}</Text>
        </Box>
      </Box>
      <Box paddingLeft={hashW + 2}>
        <Text dimColor>{`by ${commit.author}${commit.date ? ` · ${relativeTimeLabel(commit.date)}` : ''}`}</Text>
      </Box>
    </Box>
  );
}

function EmptyState({ text }: { text: string }) {
  return <Text dimColor>{text}</Text>;
}

function wrapText(text: string, width: number): string[] {
  if (!text) return [];
  const out: string[] = [];

  for (const paragraph of text.split('\n')) {
    if (!paragraph.trim()) {
      out.push('');
      continue;
    }

    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = '';
    for (const word of words) {
      if (word.length > width) {
        if (line) {
          out.push(line);
          line = '';
        }
        let rest = word;
        while (rest.length > width) {
          out.push(rest.slice(0, width));
          rest = rest.slice(width);
        }
        line = rest;
        continue;
      }

      if (!line) {
        line = word;
      } else if ((line + ' ' + word).length <= width) {
        line += ` ${word}`;
      } else {
        out.push(line);
        line = word;
      }
    }

    if (line) out.push(line);
  }

  return out;
}

function dateValue(dateStr: string): number {
  const value = new Date(dateStr).getTime();
  return Number.isNaN(value) ? 0 : value;
}

function relativeTimeLabel(dateStr: string): string {
  const label = timeAgo(dateStr);
  return label === 'now' ? 'now' : `${label} ago`;
}
