import { atom, useRecoilState } from "recoil";

import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";

export const AppPage = { 
  UserList:             "UserList",
  UserListNotApp:       "UserListNotApp",
  BadgeList:            "BadgeList",
  BadgeUserList:        "BadgeUserList",
  BadgeUserListNotApp:  "BadgeUserListiNotApp",
  TopPage:              "TopPage",
} as const;

export const AppHeader = {
  UserList:       "UserList",
  BadgeList:      "BadgeList",
  TopPage:        "TopPage",
} as const;

export const AppEvent = {
  OpenPage:             "OpenPage",
  CommGetUserList:      "CommGetUserList",
  OpenFileUserList:     "OpenFileUserList",
  CommUploadUserList:   "CommUploadUserList",
  CommGetBadgeList:     "CommGetBadgeList",
  CommGetBadgeUserList: "CommGetBadgeUserList",
  CommExportCsv:        "CommExportCsv",
  CommClearDB:          "CommClearDB",
  CommUploadCSV:        "CommUploadCSV",
  OpenUploadCSV:        "OpenFileUploadCSV",
  ShowDialog:           "ShowDialog",
} as const;




export type AppStateType_Page = {
  header: string | null,
  page: string | null,
  param: string | null,
  event: string | null,
  lock: boolean,
}

export type AppStateType_UserList = {
  connecting: boolean,
  success: boolean,
  list: {
    userName: string,
    userID: string,  
 }[] | null
};

export type AppStateType_UserListNotApp = {
  connecting: boolean,
  success: boolean,
  list: {
    userID: string,
    userEMail: string,
    submittedAt: string,
  }[] | null
};

export type AppStateType_UserListUpload = {
  connecting: boolean,
  success: boolean,
  msg: string | null,
  exp: string | null,
};

export type AppStateType_BadgeList = {
  connecting: boolean,
  success: boolean,
  list: {
    badgeClassId: string,
    badgeName: string,
    badgeIssuerName: string,
    _count: {
      userID: number,
    },
  }[] | null
};

export type AppStateType_BadgeUserList = {
  connecting: boolean,
  success: boolean,
  badgeName: string,
  list: {
    userID: string,
    userName: string,
    userEMail: string,
    submittedAt: string,
    downloadedAt: string,
  }[] | null,
  listNotApp : {
    userID: string,
    userEMail: string,
    submittedAt: string,
  }[] | null
};

export type AppStateType_Dialog = {
  type: number,
  title: string | null,
  msg: string | null,
  setResult: any,
};




const AppState_Page = atom<AppStateType_Page> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_PAGE,
  default: {
    header: AppHeader.TopPage,
    page: AppPage.TopPage, 
    param: null,
    event: null,
    lock: false,
  },
});

const AppState_UserList = atom<AppStateType_UserList> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_USERLIST,  
  default: {
    connecting: false,
    success: true,
    list: null,
  },
});

const AppState_UserListNotApp = atom<AppStateType_UserListNotApp> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_USERLIST_NOTAPP,
  default: {
    connecting: false,
    success: true,
    list: null,
  },
});

const AppState_UserListUpload = atom<AppStateType_UserListUpload> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_USERLIST_UPLOAD,
  default: {
    success: false,
    connecting: false,
    msg: null,
    exp: null,
  },
});

const AppState_BadgeList = atom<AppStateType_BadgeList> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_BADGELIST,
  default: {
    connecting: false,
    success: true,
    list: null,
  },
});

const AppState_BadgeUserList = atom<AppStateType_BadgeUserList> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_BADGE_USERLIST,
  default: {
    connecting: false,
    success: true,
    badgeName: null,
    list: null,
    listNotApp: null,
  },
});

const AppState_Dialog = atom<AppStateType_Dialog> ({
  key: RECOIL_ATOMS_KEYS.APPSTATE_DIALOG,
  default: {
    type: 0,
    title: null,
    msg: null,
    setResult: null, 
  },
});




export const useAppState_Page = () => {
  return useRecoilState(AppState_Page);
};

export const useAppState_UserList = () => {
  return useRecoilState(AppState_UserList);
};

export const useAppState_UserListNotApp = () => {
  return useRecoilState(AppState_UserListNotApp);
};

export const useAppState_UserListUpload = () => {
  return useRecoilState(AppState_UserListUpload);
};

export const useAppState_BadgeList = () => {
  return useRecoilState(AppState_BadgeList);
};

export const useAppState_BadgeUserList = () => {
  return useRecoilState(AppState_BadgeUserList);
};

export const useAppState_Dialog = () => {
  return useRecoilState(AppState_Dialog);
};


