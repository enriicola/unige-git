import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import NewChallengePage from '../app/new-challenge/page';
import { getMockedStoreWrapper } from './test-redux-provider';

// Helper function to get a future datetime string in the UI format (h:mm AM/PM, dd/MM/yyyy)
const getFutureDateTime = (hoursFromNow = 1) => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours12}:${minutes} ${ampm}, ${day}/${month}/${year}`;
};

const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/new-challenge',
}));

const mockGetMatchSettingsReady = vi.fn();
vi.mock('#js/useMatchSetting', () => ({
  default: () => ({
    loading: false,
    getMatchSettingsReady: mockGetMatchSettingsReady,
  }),
}));

const mockCreateChallenge = vi.fn();
vi.mock('#js/useChallenge', () => ({
  default: () => ({
    loadingChallenge: false,
    createChallenge: mockCreateChallenge,
  }),
}));

const mockAuthState = {
  user: { id: 1, role: 'teacher' },
  isLoggedIn: true,
  loading: false,
};

vi.mock('#js/store/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector) =>
    selector({
      auth: mockAuthState,
    }),
  useAppStore: () => ({}),
}));

vi.mock('#js/store/slices/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchUserInfo: () => async () => ({}),
  };
});

describe('Create Challenge Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMatchSettingsReady.mockResolvedValue({
      success: true,
      data: [
        { id: 1, problemTitle: 'Ready Problem 1', status: 'ready' },
        { id: 2, problemTitle: 'Ready Problem 2', status: 'ready' },
      ],
    });
  });

  it('AC: Displays only ready match settings', async () => {
    mockGetMatchSettingsReady.mockResolvedValue({
      success: true,
      data: [{ id: 1, problemTitle: 'Ready Problem 1', status: 'ready' }],
    });
    render(<NewChallengePage />, { wrapper: getMockedStoreWrapper() });
    expect(await screen.findByText('Ready Problem 1')).toBeInTheDocument();
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('button');
    expect(rows).toHaveLength(1);
  });

  it('AC: Match setting row can be toggled on/off', async () => {
    const user = userEvent.setup();
    render(<NewChallengePage />, { wrapper: getMockedStoreWrapper() });
    const checkboxes = await screen.findAllByLabelText('select setting', {
      selector: 'input[type="checkbox"]',
    });
    const checkbox = checkboxes[0];
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('AC: Teacher cannot create a challenge unless at least one match setting is selected', async () => {
    const user = userEvent.setup();
    render(<NewChallengePage />, { wrapper: getMockedStoreWrapper() });

    await screen.findByText('Ready Problem 1');

    await user.type(screen.getByLabelText(/Challenge Name/i), 'Test Challenge');

    const startDateTime = getFutureDateTime(1); // 1 hour from now
    const endDateTime = getFutureDateTime(3); // 3 hours from now

    fireEvent.change(screen.getByLabelText(/Start Date\/Time/i), {
      target: { value: startDateTime },
    });
    fireEvent.change(screen.getByLabelText(/End Date\/Time/i), {
      target: { value: endDateTime },
    });

    await user.clear(screen.getByLabelText('Coding Phase Duration (min)'));
    await user.type(screen.getByLabelText('Coding Phase Duration (min)'), '60');

    await user.clear(
      screen.getByLabelText('Duration Peer Review Duration (min)')
    );
    await user.type(
      screen.getByLabelText('Duration Peer Review Duration (min)'),
      '60'
    );

    fireEvent.submit(screen.getByTestId('challenge-form'));

    expect(
      await screen.findByText(/Select at least one match setting/i)
    ).toBeInTheDocument();
  });

  it('AC: Challenge created successfully when valid fields and match setting selected', async () => {
    const user = userEvent.setup();
    mockCreateChallenge.mockResolvedValue({
      success: true,
      challenge: { id: 123 },
    });

    render(<NewChallengePage />, { wrapper: getMockedStoreWrapper() });

    await user.type(
      screen.getByLabelText(/Challenge Name/i),
      'Valid Challenge'
    );

    const startDateTime = getFutureDateTime(1); // 1 hour from now
    const endDateTime = getFutureDateTime(3); // 3 hours from now

    fireEvent.change(screen.getByLabelText(/Start Date\/Time/i), {
      target: { value: startDateTime },
    });
    fireEvent.change(screen.getByLabelText(/End Date\/Time/i), {
      target: { value: endDateTime },
    });

    await user.clear(screen.getByLabelText('Coding Phase Duration (min)'));
    await user.type(screen.getByLabelText('Coding Phase Duration (min)'), '60');

    await user.clear(
      screen.getByLabelText('Duration Peer Review Duration (min)')
    );
    await user.type(
      screen.getByLabelText('Duration Peer Review Duration (min)'),
      '60'
    );

    const checkbox = await screen.findAllByLabelText('select setting');
    await user.click(checkbox[0]);

    fireEvent.submit(screen.getByTestId('challenge-form'));

    expect(mockCreateChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Valid Challenge',
        duration: 60,
        durationPeerReview: 60,
        matchSettingIds: [1],
        status: 'public',
        startDatetime: expect.any(String),
        endDatetime: expect.any(String),
      })
    );

    expect(
      await screen.findByText(/Challenge created successfully/i)
    ).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/challenges');
      },
      { timeout: 5000 }
    );
  }, 10000);

  it('Validates time window (End date must accommodate duration)', async () => {
    const user = userEvent.setup();
    render(<NewChallengePage />);

    await screen.findByText('Ready Problem 1');

    await user.type(screen.getByLabelText(/Challenge Name/i), 'Test Challenge');

    const startDateTime = getFutureDateTime(1); // 1 hour from now

    fireEvent.change(screen.getByLabelText(/Start Date\/Time/i), {
      target: { value: startDateTime },
    });

    await user.clear(screen.getByLabelText('Coding Phase Duration (min)'));
    await user.type(screen.getByLabelText('Coding Phase Duration (min)'), '60');

    await user.clear(
      screen.getByLabelText('Duration Peer Review Duration (min)')
    );
    await user.type(
      screen.getByLabelText('Duration Peer Review Duration (min)'),
      '60'
    );

    // Set endDatetime LAST, after all other fields, so it doesn't get auto-updated
    // End time is only 1 hour after start, but we need 2 hours (60min challenge + 60min review)
    // So it should fail validation (needs start + 2 hours minimum)
    const invalidEndDateTime = getFutureDateTime(2); // Only 2 hours from now (1 hour after start)
    fireEvent.change(screen.getByLabelText(/End Date\/Time/i), {
      target: { value: invalidEndDateTime },
    });

    const checkbox = await screen.findAllByLabelText('select setting');
    await user.click(checkbox[0]);

    fireEvent.submit(screen.getByTestId('challenge-form'));

    // Verify the API was not called due to client-side validation
    expect(mockCreateChallenge).not.toHaveBeenCalled();
  });
});
