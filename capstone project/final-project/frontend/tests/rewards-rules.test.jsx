import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import useRewards from '#js/useRewards';
import RewardsRulesPage from '../app/student/rewards/page';

const mockGetRules = vi.fn();

vi.mock('#js/useRewards', () => ({
  default: vi.fn(),
}));

const mockData = {
  badgesByCategory: {
    challenge_milestone: [
      {
        key: 'c1',
        name: 'Challenge 1',
        description: 'Desc 1',
        category: 'challenge_milestone',
        metric: 'challenges_completed',
        threshold: 1,
        iconKey: 'icon1',
      },
    ],
    review_milestone: [],
    review_quality: [],
  },
  titles: [
    {
      key: 't1',
      name: 'Newbie',
      description: 'Just started',
      rank: 1,
      minChallenges: 0,
      minAvgScore: 0,
      minBadges: 0,
    },
  ],
};

describe('RewardsRulesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRewards).mockReturnValue({
      getRules: mockGetRules.mockResolvedValue({
        success: true,
        data: mockData,
      }),
      loading: false,
    });
  });

  it('renders overview tab by default', async () => {
    render(<RewardsRulesPage />);

    expect(await screen.findByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Progress timeline')).toBeInTheDocument();
    expect(screen.getByText('🎯 What are achievements?')).toBeInTheDocument();

    // Verify presence of static educational content
    expect(
      screen.getByText(
        /As you complete challenges and participate in peer reviews/
      )
    ).toBeInTheDocument();
    expect(screen.getByText('🏅 Badges')).toBeInTheDocument();
    expect(screen.getByText('📈 Skill titles')).toBeInTheDocument();
  });

  it('switches to badges tab and displays badges', async () => {
    render(<RewardsRulesPage />);

    const badgesTab = screen.getByRole('button', { name: 'Badges' });
    fireEvent.click(badgesTab);

    expect(await screen.findByText('Badge system')).toBeInTheDocument();
    expect(screen.getByText('Challenge Milestones')).toBeInTheDocument();
    expect(screen.getByText('Challenge 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
  });

  it('switches to titles tab and displays titles', async () => {
    render(<RewardsRulesPage />);

    const titlesTab = screen.getByRole('button', { name: 'Skill Titles' });
    fireEvent.click(titlesTab);

    expect(await screen.findByText('How titles work')).toBeInTheDocument();
    expect(screen.getByText('Newbie')).toBeInTheDocument();
    expect(screen.getByText('Just started')).toBeInTheDocument();
    expect(screen.getByText('Rank 1')).toBeInTheDocument();
  });

  it('shows error message on API failure', async () => {
    mockGetRules.mockResolvedValueOnce({
      success: false,
      message: 'API Error',
    });

    render(<RewardsRulesPage />);

    expect(await screen.findByText('API Error')).toBeInTheDocument();
  });

  it('displays loading state', async () => {
    vi.mocked(useRewards).mockReturnValue({
      getRules: () => new Promise(() => {}),
      loading: true,
    });

    render(<RewardsRulesPage />);
    expect(screen.getByText('Loading achievement rules…')).toBeInTheDocument();
  });

  it('shows empty state when no data is returned', async () => {
    vi.mocked(useRewards).mockReturnValue({
      getRules: vi.fn().mockResolvedValue({ success: true, data: null }),
      loading: false,
    });

    render(<RewardsRulesPage />);
    expect(await screen.findByText('No rules found yet.')).toBeInTheDocument();
  });

  it('renders specific badge details correctly', async () => {
    render(<RewardsRulesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Badges' }));

    expect(
      await screen.findByText(
        (content, element) =>
          element.tagName.toLowerCase() === 'span' && content.includes('Rule:')
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/challenges completed/)).toBeInTheDocument();

    // Verify Badge Image Rendering

    const badgeImage = screen.getByAltText('Challenge 1');

    expect(badgeImage).toBeInTheDocument();

    expect(badgeImage).toHaveAttribute('src', '/badge/icon1.png');
  });

  it('renders "No badges" message for empty categories', async () => {
    render(<RewardsRulesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Badges' }));

    // Our mockData has empty 'review_milestone' and 'review_quality'

    // The UI should render the category header but show a "No badges" message

    // Check for Review Milestones header

    expect(await screen.findByText('Review Milestones')).toBeInTheDocument();

    // Check specifically for the "No badges" text within the cards

    // Since there are multiple "No badges..." messages (one per empty category), we use getAllByText

    const noBadgesMessages = screen.getAllByText('No badges in this category.');

    expect(noBadgesMessages.length).toBeGreaterThanOrEqual(2); // review_milestone and review_quality
  });

  it('renders title requirements correctly', async () => {
    render(<RewardsRulesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Skill Titles' }));

    expect(await screen.findByText('0+ challenges')).toBeInTheDocument();
    expect(screen.getByText('0%+ avg score')).toBeInTheDocument();
    expect(screen.getByText('0+ badges')).toBeInTheDocument();
  });

  it('formats badge rule requirements correctly with accuracy', async () => {
    // Custom mock data for this test
    const customMockData = {
      badgesByCategory: {
        review_quality: [
          {
            key: 'q1',
            name: 'Eagle Eye',
            description: 'Find bugs',
            category: 'review_quality',
            metric: 'errors_found',
            threshold: 10,
            accuracyRequired: 0.95,
            iconKey: 'eagle',
          },
        ],
        challenge_milestone: [],
        review_milestone: [],
      },
      titles: [],
    };

    vi.mocked(useRewards).mockReturnValue({
      getRules: mockGetRules.mockResolvedValue({
        success: true,
        data: customMockData,
      }),
      loading: false,
    });

    render(<RewardsRulesPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Badges' }));

    // Check for "10 errors found + 95% accuracy"
    // The component logic: `${b.threshold} ` + METRIC_LABELS[b.metric] + ` + ${(b.accuracyRequired * 100).toFixed(0)}% accuracy`
    // "10 errors found + 95% accuracy"

    // We look for the container or text that includes this composite string.
    // Since it's composed of multiple text nodes/variables, precise matching might need a regex or function.
    expect(await screen.findByText(/10 errors found/)).toBeInTheDocument();
    expect(screen.getByText(/\+ 95% accuracy/)).toBeInTheDocument();
  });
});
