import { useCallback } from "react";
import { atom, useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

import { AppState, AppStateGetters, AppStateActions } from "@/share/store/appState/types";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";

// state はそのまま export しない
const appState = atom<AppState>({
  key: RECOIL_ATOMS_KEYS.APP_STATE,
  default: {
    viewPage: "UserListNone",
    pageEvent: null,
    reqBadgeList: false,
  },
});

export const useAppState = () => {
  return useRecoilState(appState);
};

export const useAppValue = () => {
  return useRecoilValue(appState);
};

export const useSetAppState = (updateState) => {
  return  useSetRecoilState(appState);
};




export const AppControlHeaderOnClick1 = (state) => {
  const update = {...state};
  update.viewPage = "UserListNone";
  //update.viewPage = "UserList";
  //update.pageEvent = "UserListPageOpen";
  return update;
};

export const AppControlHeaderOnClick2 = (state) => {
  const update = {...state};
  update.viewPage = "BadgeList";
  update.reqBadgeList = true;
  return update;
};

export const AppControlUserListPageOpen = (state) => {
  const update = {...state};
  update.viewPage = "UserList";
  update.pageEvent = "StartGetUserData";
  return update;
};

export const AppControlUserListPageGetUserData = (state) => {
  //サーバーからユーザーリストの取得を試みる（現在は実装していないため失敗する）
  const update = {...state};
  update.viewPage = "UserListNone";
  update.pageEvent = null;
  return update;
};

export const AppControlClearReqBadgeList = (state) => {
  const update = {...state}; 
  update.reqBadgeList = false;
  return update; 
};
