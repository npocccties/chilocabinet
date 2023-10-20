import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DisplayBadgeCount } from "@/components/ui/card/DisplayBadgeCount";
import { SearchForm } from "@/components/ui/SearchForm";
import { VcList } from "@/components/ui/VcList";
import { SearchFormItem } from "@/types/data";
import { badgeListActions } from "@/share/store/badgeList/main";

import { useAppState, useAppValue, useSetAppState } from "@/share/store/appState/main";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";

export const BadgeList = () => {

  const appState = useAppValue();

  if ( appState.viewPage != "BadgeList" ) {
    return ( <></> );
  }

  return (
    <>
      ＜バッジリスト一覧コンポーネント＞
    </>
  );
};