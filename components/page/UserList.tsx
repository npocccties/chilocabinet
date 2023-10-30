import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

//import { DisplayBadgeCount } from "@/components/ui/card/DisplayBadgeCount";
//import { SearchForm } from "@/components/ui/SearchForm";
//import { VcList } from "@/components/ui/VcList";
//import { SearchFormItem } from "@/types/data";
//import { badgeListActions } from "@/share/store/badgeList/main";

import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import {
    useAppState,
    AppControlUserListPageOpen,
    AppControlUserListPageGetUserData,
} from "@/share/store/appState/main";

export const UserList = () => {

  const [appState, setAppState] = useAppState();

  if ( appState.viewPage != "UserList" ) {
    return ( <></> );
  }

  if( appState.pageEvent == "UserListPageOpen" ) {
    setAppState(AppControlUserListPageOpen);
    return ( <>＜キャビネットユーザー一覧コンポーネント：ユーザーデータ取得中＞</> );
  }

  if( appState.pageEvent == "StartGetUserData" ) {
    setAppState(AppControlUserListPageGetUserData);
    return ( <></> );
  }

  return (
    <>
      ＜キャビネットユーザー一覧コンポーネント＞
    </>
  );
};
