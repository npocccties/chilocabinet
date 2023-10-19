
export type AppState = {
    viewPage: string,
    pageEvent: string,
};

export type AppStateGetters = {
  useAppState: () => AppState;
};

export type AppStateActions = {
  useFetchAppState: () => {
    fetchAppState: () => void;
  };
};
