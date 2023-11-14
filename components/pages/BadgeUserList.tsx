import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAppState_Page } from "@/share/store/appState/main";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";

export const BadgeUserList = () => {

  const [appStatePage, setAppStatePage] = useAppState_Page();

  if ( appStatePage.page != "BadgeUserList" ) {
    return ( <></> );
  }

  return (
    <>
      ＜バッジ提出者一覧コンポーネント＞
    </>
  );
};
