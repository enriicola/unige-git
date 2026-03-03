'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '#components/common/Spinner';
import { Button } from '#components/common/Button';
import { Badge } from '#components/common/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';

import useProfile from '#js/useProfile';

const formatMaxTwoDecimals = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return '0';
  return parsed.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const { getProfile, loading } = useProfile();

  const loadProfile = useCallback(async () => {
    setError(null);
    const res = await getProfile();
    if (res?.success === false) {
      setProfile(null);
      setError(res?.message || 'Unable to load profile data.');
      return;
    }
    setProfile(res?.data || null);
  }, [getProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  // console.log(profile);
  const history = useMemo(
    () => profile?.challengeHistory ?? [],
    [profile?.challengeHistory]
  );
  const visibleHistory = useMemo(() => {
    if (showAllHistory) return history;
    return history.slice(0, 3);
  }, [history, showAllHistory]);

  const hasMoreHistory = history.length > 3;

  const badgeCount = useMemo(() => {
    const challengeBadges = profile?.badges?.milestone?.length ?? 0;
    const reviewBadges = profile?.badges?.codeReview?.length ?? 0;
    const qualityBadges = profile?.badges?.reviewQuality?.length ?? 0;
    return challengeBadges + reviewBadges + qualityBadges;
  }, [profile]);
  const router = useRouter();
  const nextTitleName = profile?.title?.nextTitle ?? null;

  const errorText =
    typeof error === 'string'
      ? error
      : (error?.message ?? 'Something went wrong.');

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>👤My Profile</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Track your progress, achievements, and performance.
          </p>
        </div>
      </div>

      {loading && !profile && !error && (
        <div className='flex justify-center'>
          <Spinner label='Loading profile…' />
        </div>
      )}

      {error && (
        <Card className='border border-destructive/30 bg-destructive/5 text-destructive'>
          <CardContent className='py-4'>
            <p className='text-sm'>{errorText}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !profile && (
        <Card>
          <CardContent className='py-6'>
            <p className='text-sm text-muted-foreground'>
              No profile data found.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && profile && (
        <div className='space-y-6'>
          <div className='grid gap-4 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                      Username
                    </p>
                    <p className='mt-1 font-semibold text-foreground'>
                      {profile.user.username}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                      Email
                    </p>
                    <p className='mt-1 font-semibold text-foreground break-all'>
                      {profile.user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between '>
                  <div>
                    <CardTitle className='mb-2'>Current Skill Title</CardTitle>
                    <CardDescription>
                      Your highest unlocked title
                    </CardDescription>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='rounded-2xl border border-border bg-muted/40 p-5'>
                  <p className='text-2xl font-bold text-foreground'>
                    {profile?.title?.name ?? '—'}
                  </p>
                  <p className='text-sm text-muted-foreground mt-1 italic'>
                    “{profile?.title?.description ?? 'No title yet'}”
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    <Badge variant='outline'>
                      Next: {nextTitleName ?? '—'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='mb-2'>Earned Badges</CardTitle>
                  <CardDescription>
                    {badgeCount} badge{badgeCount === 1 ? '' : 's'} earned so
                    far
                  </CardDescription>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => router.push('/student/rewards/')}
                >
                  How to earn more
                </Button>
              </div>
            </CardHeader>

            <CardContent className='space-y-6'>
              <BadgeSection
                title='Challenge milestones'
                items={profile.badges.milestone}
                emptyText='No milestone badges yet.'
              />

              <BadgeSection
                title='Peer review badges'
                items={profile.badges.codeReview}
                emptyText='No peer review badges yet.'
              />

              <BadgeSection
                title='Review quality badges'
                items={profile.badges.reviewQuality}
                emptyText='No review quality badges yet.'
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Statistics</CardTitle>
              <CardDescription>
                Long-term performance across challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                <StatCard
                  label='Total Challenges'
                  value={profile.stats.totalChallenges}
                  subtext='Completed'
                />
                <StatCard
                  label='Average Total Score'
                  value={`${formatMaxTwoDecimals(profile.stats.avgTotalScore)}/100`}
                  subtext='Overall performance'
                />
                <StatCard
                  label='Avg Coding Phase'
                  value={`${formatMaxTwoDecimals(profile.stats.avgImplementation)}/50`}
                  subtext='Code quality'
                />
                <StatCard
                  label='Avg Peer Review'
                  value={`${formatMaxTwoDecimals(profile.stats.avgCodeReview)}/50`}
                  subtext='Review accuracy'
                />
                <StatCard
                  label='Reviews Given'
                  value={profile.stats.reviewsGiven}
                  subtext='Total reviews submitted'
                />
                <StatCard
                  label='Review Accuracy'
                  value={`${formatMaxTwoDecimals(profile.stats.reviewAccuracy)}%`}
                  subtext='Correct reviews'
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <CardTitle className='mb-2'>Challenge History</CardTitle>
                  <CardDescription>
                    {showAllHistory
                      ? 'All challenges you participated in'
                      : 'Your most recent challenges'}
                  </CardDescription>
                </div>
                {hasMoreHistory ? (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setShowAllHistory((v) => !v)}
                  >
                    {showAllHistory
                      ? 'Show less'
                      : `View all (${history.length})`}
                  </Button>
                ) : null}
              </div>
            </CardHeader>

            <CardContent className='space-y-3'>
              {history.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No completed challenges yet.
                </p>
              ) : (
                visibleHistory.map((c) => (
                  <ChallengeHistoryRow
                    key={c.id}
                    title={`Challenge ${c.title}`}
                    createdAt={c.createdAt}
                    onOpen={() =>
                      router.push(`/student/challenges/${c.id}/result`)
                    }
                  />
                ))
              )}

              <div className='rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground'>
                <span className='font-semibold text-foreground'>💡Tip:</span>{' '}
                Open a challenge detailed breakdown to see the full scoring
                calculation.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
function StatCard({ label, value, subtext }) {
  return (
    <div className='rounded-xl border border-border bg-card p-4'>
      <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
        {label}
      </p>
      <p className='mt-2 text-2xl font-bold text-foreground'>{value}</p>
      {subtext ? (
        <p className='mt-1 text-xs text-muted-foreground'>{subtext}</p>
      ) : null}
    </div>
  );
}

function BadgeCard({ iconKey, name, earnedAt }) {
  return (
    <div className='rounded-xl border border-border bg-card p-4 flex items-start gap-3'>
      <div className='w-10 h-10 rounded-lg border border-border bg-muted/40 flex items-center justify-center shrink-0'>
        <img
          src={`/badge/${iconKey}.png`}
          alt={name}
          className='max-w-full max-h-full object-contain'
        />
      </div>
      <div className='min-w-0'>
        <p className='font-semibold text-foreground truncate'>{name}</p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          {new Date(earnedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
function EmptyText({ children }) {
  return <p className='text-sm text-muted-foreground'>{children}</p>;
}
function SectionHeaderRow({ title, right }) {
  return (
    <div className='flex items-center justify-between'>
      <p className='font-semibold text-foreground'>{title}</p>
      {right}
    </div>
  );
}

function BadgeSection({ title, items, emptyText }) {
  return (
    <div className='space-y-3'>
      <SectionHeaderRow
        title={title}
        right={<Badge variant='outline'>{items.length} earned</Badge>}
      />

      {items.length === 0 ? (
        <EmptyText>{emptyText}</EmptyText>
      ) : (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((b) => (
            <BadgeCard
              key={`${b.key}-${b.earnedAt}`}
              iconKey={b.iconKey}
              name={b.name}
              earnedAt={b.earnedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
function ChallengeHistoryRow({ title, createdAt, onOpen }) {
  return (
    <div className='rounded-xl border border-border bg-card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0'>
        <p className='font-semibold text-foreground truncate'>{title}</p>
        <p className='text-xs text-muted-foreground mt-1'>
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <Button type='button' variant='primary' size='sm' onClick={onOpen}>
        View detailed breakdown
      </Button>
    </div>
  );
}
