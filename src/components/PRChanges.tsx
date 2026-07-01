import React from 'react';
import { Box, Text } from 'ink';
import type { PRDetail, PRCommit } from '../types.js';
import { pad, timeAgo } from '../utils.js';

export function PRChanges({
  pr,
  width,
}: {
  pr: PRDetail;
  width: number;
}) {
  const commits = [...(pr.commits ?? [])].sort((a, b) => dateValue(b.date) - dateValue(a.date));
  const commitSummary = `${pr.additions ?? 0} additions · ${pr.deletions ?? 0} deletions · ${pr.changedFiles ?? 0} files · ${pr.commitsCount ?? commits.length} commits`;

  return (
    <Box flexDirection="column">
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
        {commits.length > 0 ? commits.map((commit) => <CommitCard key={commit.hash + commit.date} commit={commit} width={width} />) : <EmptyState text="No commits" />}
      </Section>
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

function dateValue(dateStr: string): number {
  const value = new Date(dateStr).getTime();
  return Number.isNaN(value) ? 0 : value;
}

function relativeTimeLabel(dateStr: string): string {
  const label = timeAgo(dateStr);
  return label === 'now' ? 'now' : `${label} ago`;
}
