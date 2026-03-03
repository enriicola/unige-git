'use client';

import { useCallback, useEffect, useState } from 'react';
import useRewards from '#js/useRewards';
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

const CATEGORY_LABELS = {
  challenge_milestone: 'Challenge Milestones',
  review_milestone: 'Review Milestones',
  review_quality: 'Review Quality',
};
const STATIC_CONTENT = {
  overview: {
    cards: [
      {
        title: '🎯 What are achievements?',
        description:
          'As you complete challenges and participate in peer reviews, you’ll earn badges and progress through skill titles.',
      },
      {
        title: '🏅 Badges',
        description:
          'Badges are permanent milestones. You can earn them for completing challenges, completing reviews, and review quality.',
        bullets: [
          'Challenge milestones (3, 5, 10, …)',
          'Review milestones (3, 5, 10, 15, 20, 25, …)',
          'Quality badges (accuracy + finding errors)',
        ],
      },
      {
        title: '📈 Skill titles',
        description:
          'Titles represent overall progress and never decrease. Only the highest eligible title is active.',
        bullets: [
          'Challenges completed',
          'Average score across all challenges',
          'Badges earned',
        ],
      },
    ],
    timeline: [
      {
        title: '📝 Complete challenges',
        desc: 'Submit solutions and finish the full peer review loop.',
      },
      {
        title: '🎉 Earn achievements',
        desc: 'Unlock badges and advance through skill titles.',
      },
      {
        title: '👀 View your progress',
        desc: 'Check your profile to see earned achievements.',
      },
      {
        title: '🏆 Show off',
        desc: 'Badges and title appear on the leaderboard.',
      },
    ],
  },

  badges: {
    intro:
      'Badges are permanent achievements. Milestone badges track consistency; quality badges reward careful reviewing.',
    example: {
      title: 'Example: earning your first badge',
      desc: 'After completing your 3rd challenge, you’ll see a celebration modal and the badge will be added permanently to your profile.',
    },
    notes: [
      'Badges are awarded automatically when you meet the rule.',
      'Each milestone badge is earned once.',
      'Quality badges require both quantity and accuracy (when applicable).',
    ],
  },

  titles: {
    intro:
      'Skill titles advance based on three factors. All three requirements must be met to unlock a new title.',
    notes: [
      'Titles never decrease.',
      'Average score is calculated from all completed challenges.',
      'All badge categories count toward “badges earned”.',
    ],
    example: {
      title: 'Example: progress to Specialist',
      desc: 'You might meet score + badge requirements, but still need a few more completed challenges.',
    },
  },
};

const METRIC_LABELS = {
  challenges_completed: 'challenges completed',
  reviews_completed: 'reviews completed',
  correct_reviews: 'correct reviews',
  errors_found: 'errors found',
};

function TabButton({ active, children, onClick }) {
  return (
    <Button
      type='button'
      variant={active ? 'primary' : 'outline'}
      size='sm'
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function RewardsRulesPage() {
  const { getRules, loading } = useRewards();
  const [rules, setRules] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const loadRules = useCallback(async () => {
    setError(null);
    const res = await getRules();
    if (res?.success === false) {
      setRules(null);
      setError(res?.message || 'Unable to load achievement rules.');
      return;
    }
    setRules(res?.data || null);
  }, [getRules]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const badgesByCategory = rules?.badgesByCategory ?? {
    challenge_milestone: [],
    review_milestone: [],
    review_quality: [],
  };

  const titles = rules?.titles ?? [];

  return (
    <div className='max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Rewards & Progress
          </p>
          <h1 className='text-3xl font-bold text-foreground'>Achievements</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Learn how to earn badges and unlock skill titles.
          </p>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <TabButton
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </TabButton>
        <TabButton
          active={activeTab === 'badges'}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </TabButton>
        <TabButton
          active={activeTab === 'titles'}
          onClick={() => setActiveTab('titles')}
        >
          Skill Titles
        </TabButton>
      </div>

      {loading && !rules && !error && (
        <div className='flex justify-center'>
          <Spinner label='Loading achievement rules…' />
        </div>
      )}

      {error && (
        <Card className='border border-destructive/30 bg-destructive/5 text-destructive'>
          <CardContent className='py-4'>
            <p className='text-sm'>{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !rules && (
        <Card>
          <CardContent className='py-6'>
            <p className='text-sm text-muted-foreground'>No rules found yet.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && rules && activeTab === 'overview' && (
        <div className='space-y-6'>
          <div className='grid gap-4 lg:grid-cols-3'>
            {STATIC_CONTENT.overview.cards.map((c) => (
              <Card key={c.title}>
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                {c.bullets?.length ? (
                  <CardContent className='text-sm text-muted-foreground'>
                    <ul className='list-disc pl-5 space-y-1'>
                      {c.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg'>Progress timeline</CardTitle>
              <CardDescription>
                How achievements fit into the loop
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {STATIC_CONTENT.overview.timeline.map((t) => (
                <div
                  key={t.title}
                  className='rounded-xl border border-border p-4'
                >
                  <p className='font-semibold'>{t.title}</p>
                  <p className='text-sm text-muted-foreground mt-1'>{t.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && rules && activeTab === 'badges' && (
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Badge system</CardTitle>
              <CardDescription>{STATIC_CONTENT.badges.intro}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='rounded-xl border border-border bg-muted/40 p-4'>
                <p className='font-semibold'>
                  {STATIC_CONTENT.badges.example.title}
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {STATIC_CONTENT.badges.example.desc}
                </p>
              </div>

              <ul className='list-disc pl-5 text-sm text-muted-foreground space-y-1'>
                {STATIC_CONTENT.badges.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {Object.entries(badgesByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                  {CATEGORY_LABELS[category] || category}
                </CardTitle>
                <CardDescription>
                  {items.length} badge{items.length === 1 ? '' : 's'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {items.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No badges in this category.
                  </p>
                ) : (
                  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                    {items.map((b) => (
                      <div
                        key={b.key}
                        className='rounded-xl border border-border bg-card p-4 flex gap-3'
                      >
                        <div className='w-12 h-12  flex justify-center items-center shrink-0'>
                          <img
                            src={`/badge/${b.iconKey}.png`}
                            alt={b.name}
                            className='max-w-full max-h-full object-contain'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p className='font-semibold text-foreground truncate'>
                            {b.name}
                          </p>
                          <p className='text-xs text-muted-foreground mt-0.5'>
                            {b.description}
                          </p>

                          <div className='mt-2 text-xs text-muted-foreground'>
                            <span className='font-semibold'>Rule:</span>{' '}
                            {b.threshold != null ? `${b.threshold} ` : ''}
                            {METRIC_LABELS[b.metric]}
                            {b.accuracyRequired != null
                              ? ` + ${(b.accuracyRequired * 100).toFixed(0)}% accuracy`
                              : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && rules && activeTab === 'titles' && (
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>How titles work</CardTitle>
              <CardDescription>{STATIC_CONTENT.titles.intro}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='rounded-xl border border-border bg-muted/40 p-4'>
                <p className='font-semibold'>
                  {STATIC_CONTENT.titles.example.title}
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {STATIC_CONTENT.titles.example.desc}
                </p>
              </div>

              <ul className='list-disc pl-5 text-sm text-muted-foreground space-y-1'>
                {STATIC_CONTENT.titles.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {titles.map((t) => (
            <Card key={t.key}>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <CardTitle className='text-lg'>{t.name}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </div>
                  <Badge>Rank {t.rank}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='outline'>{t.minChallenges}+ challenges</Badge>
                  <Badge variant='outline'> {t.minAvgScore}%+ avg score</Badge>
                  <Badge variant='outline'> {t.minBadges}+ badges</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
