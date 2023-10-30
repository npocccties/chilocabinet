
export type AppState = {
  viewPage: string,
  pageEvent: string,
  reqBadgeList: boolean,
};

export type AppStateGetters = {
  useAppState: () => AppState;
};

export type AppStateActions = {
  useFetchAppState: () => {
    fetchAppState: () => void;
  };
};
