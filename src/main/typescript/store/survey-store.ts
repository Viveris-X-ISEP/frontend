import { create } from "zustand";

interface SurveyState {
  // Timestamp of last survey submission - used to trigger refetch in dependent hooks
  lastSubmissionTimestamp: number | null;

  // Mark survey as just completed (triggers refetch in useSurveyStatus)
  markSurveyCompleted: () => void;

  // Reset state (e.g., on logout)
  reset: () => void;
}

export const useSurveyStore = create<SurveyState>()((set) => ({
  lastSubmissionTimestamp: null,

  markSurveyCompleted: () => set({ lastSubmissionTimestamp: Date.now() }),

  reset: () => set({ lastSubmissionTimestamp: null }),
}));
