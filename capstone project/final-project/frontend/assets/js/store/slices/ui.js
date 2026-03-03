import { createSlice } from '@reduxjs/toolkit';
import { clearUser, logoutUser } from './auth';

const initialState = {
  theme: null,
  challengeDrafts: {},
  challengeTimers: {},
  challengeCountdowns: {},
  peerReviewExits: {},
  solutionFeedbackVisibility: {},
  codeReviewVotesVisibility: {},
};

const getDraftEntry = (userDrafts, key) =>
  userDrafts[key] || {
    imports: '',
    studentCode: '',
    lastCompiled: null,
    lastSuccessful: null,
    signature: null,
  };

const upsertUserEntry = (map, userId, key, updater) => {
  const userMap = map[userId] || {};
  const entry = getDraftEntry(userMap, key);
  return {
    ...map,
    [userId]: {
      ...userMap,
      [key]: updater(entry),
    },
  };
};

const removeUserKey = (map, userId, key) => {
  const userMap = map[userId];
  if (!userMap || !userMap[key]) return map;
  const next = { ...userMap };
  delete next[key];
  if (!Object.keys(next).length) {
    const rest = { ...map };
    delete rest[userId];
    return rest;
  }
  return {
    ...map,
    [userId]: next,
  };
};

const upsertUserValue = (map, userId, key, value) => {
  const userMap = map[userId] || {};
  return {
    ...map,
    [userId]: {
      ...userMap,
      [key]: value,
    },
  };
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => ({
      ...state,
      theme: action.payload,
    }),
    setDraftCode: (state, action) => {
      const { userId, key, imports, studentCode, signature } =
        action.payload || {};
      if (!userId || !key) return state;
      return {
        ...state,
        challengeDrafts: upsertUserEntry(
          state.challengeDrafts,
          userId,
          key,
          (entry) => ({
            ...entry,
            imports: imports ?? entry.imports,
            studentCode: studentCode ?? entry.studentCode,
            signature: signature ?? entry.signature,
          })
        ),
      };
    },
    setLastCompiledCode: (state, action) => {
      const { userId, key, code, imports, studentCode, signature } =
        action.payload || {};
      const nextImports = imports ?? '';
      const nextStudentCode = studentCode ?? code ?? '';
      if (!userId || !key) return state;
      if (!nextImports && !nextStudentCode) return state;
      return {
        ...state,
        challengeDrafts: upsertUserEntry(
          state.challengeDrafts,
          userId,
          key,
          (entry) => ({
            ...entry,
            lastCompiled: {
              imports: nextImports,
              studentCode: nextStudentCode,
            },
            signature: signature ?? entry.signature,
          })
        ),
      };
    },
    setLastSuccessfulCode: (state, action) => {
      const { userId, key, code, imports, studentCode, signature } =
        action.payload || {};
      const nextImports = imports ?? '';
      const nextStudentCode = studentCode ?? code ?? '';
      if (!userId || !key) return state;
      if (!nextImports && !nextStudentCode) return state;
      return {
        ...state,
        challengeDrafts: upsertUserEntry(
          state.challengeDrafts,
          userId,
          key,
          (entry) => ({
            ...entry,
            lastSuccessful: {
              imports: nextImports,
              studentCode: nextStudentCode,
            },
            signature: signature ?? entry.signature,
          })
        ),
      };
    },
    migrateChallengeKey: (state, action) => {
      const { userId, fromKey, toKey } = action.payload || {};
      if (!userId || !fromKey || !toKey || fromKey === toKey) return state;
      const userDrafts = state.challengeDrafts[userId];
      if (!userDrafts || !userDrafts[fromKey] || userDrafts[toKey]) {
        return state;
      }
      const migratedDrafts = removeUserKey(
        state.challengeDrafts,
        userId,
        fromKey
      );
      return {
        ...state,
        challengeDrafts: upsertUserEntry(
          migratedDrafts,
          userId,
          toKey,
          () => userDrafts[fromKey]
        ),
      };
    },
    clearChallengeDraft: (state, action) => {
      const { userId, key } = action.payload || {};
      if (!userId || !key) return state;
      return {
        ...state,
        challengeDrafts: removeUserKey(state.challengeDrafts, userId, key),
      };
    },
    setChallengeStartTime: (state, action) => {
      const { userId, challengeId, startTime } = action.payload || {};
      if (!userId || !challengeId || !startTime) return state;
      const userTimers = state.challengeTimers[userId] || {};
      return {
        ...state,
        challengeTimers: {
          ...state.challengeTimers,
          [userId]: {
            ...userTimers,
            [challengeId]: startTime,
          },
        },
      };
    },
    clearChallengeTimer: (state, action) => {
      const { userId, challengeId } = action.payload || {};
      if (!userId || !challengeId) return state;
      return {
        ...state,
        challengeTimers: removeUserKey(
          state.challengeTimers,
          userId,
          challengeId
        ),
      };
    },
    setChallengeCountdown: (state, action) => {
      const { userId, challengeId, value } = action.payload || {};
      if (!userId || !challengeId || typeof value !== 'number') return state;
      return {
        ...state,
        challengeCountdowns: upsertUserValue(
          state.challengeCountdowns,
          userId,
          challengeId,
          value
        ),
      };
    },
    clearChallengeCountdown: (state, action) => {
      const { userId, challengeId } = action.payload || {};
      if (!userId || !challengeId) return state;
      return {
        ...state,
        challengeCountdowns: removeUserKey(
          state.challengeCountdowns,
          userId,
          challengeId
        ),
      };
    },
    setPeerReviewExit: (state, action) => {
      const { userId, challengeId, value } = action.payload || {};
      if (!userId || !challengeId || typeof value !== 'boolean') return state;
      return {
        ...state,
        peerReviewExits: upsertUserValue(
          state.peerReviewExits || {},
          userId,
          challengeId,
          value
        ),
      };
    },
    setSolutionFeedbackVisibility: (state, action) => {
      const { userId, challengeId, value } = action.payload || {};
      if (!userId || !challengeId || typeof value !== 'boolean') return state;
      return {
        ...state,
        solutionFeedbackVisibility: upsertUserValue(
          state.solutionFeedbackVisibility || {},
          userId,
          challengeId,
          value
        ),
      };
    },
    setCodeReviewVotesVisibility: (state, action) => {
      const { userId, challengeId, value } = action.payload || {};
      if (!userId || !challengeId || typeof value !== 'boolean') return state;
      return {
        ...state,
        codeReviewVotesVisibility: upsertUserValue(
          state.codeReviewVotesVisibility || {},
          userId,
          challengeId,
          value
        ),
      };
    },
    clearPeerReviewExit: (state, action) => {
      const { userId, challengeId } = action.payload || {};
      if (!userId || !challengeId) return state;
      return {
        ...state,
        peerReviewExits: removeUserKey(
          state.peerReviewExits || {},
          userId,
          challengeId
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => ({
        ...state,
        challengeDrafts: {},
        challengeCountdowns: {},
        peerReviewExits: {},
        solutionFeedbackVisibility: {},
        codeReviewVotesVisibility: {},
      }))
      .addCase(clearUser, (state) => ({
        ...state,
        challengeDrafts: {},
        challengeCountdowns: {},
        peerReviewExits: {},
        solutionFeedbackVisibility: {},
        codeReviewVotesVisibility: {},
      }));
  },
});

export const {
  setTheme,
  setDraftCode,
  setLastCompiledCode,
  setLastSuccessfulCode,
  migrateChallengeKey,
  clearChallengeDraft,
  setChallengeStartTime,
  setChallengeCountdown,
  setPeerReviewExit,
  setSolutionFeedbackVisibility,
  setCodeReviewVotesVisibility,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
