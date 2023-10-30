import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

//import { DisplayBadgeCount } from "@/components/ui/card/DisplayBadgeCount";
//import { SearchForm } from "@/components/ui/SearchForm";
//import { VcList } from "@/components/ui/VcList";
//import { SearchFormItem } from "@/types/data";
//import { badgeListActions } from "@/share/store/badgeList/main";

import { useAppState, useAppValue, useSetAppState, AppControlClearReqBadgeList } from "@/share/store/appState/main";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";

export const BadgeList = () => {

  //const [Count, setCount] = React.useState<int>(0);
  //const [GetBadgeList, setGetBadgeList] = React.useState<any>();
  const [UpdatingBadgeList, setUpdatingBadgeList] =  React.useState<any>(false);
  const [BadgeList, setBadgeList] = React.useState<any>("");
  const [appState, setAppState] = useAppState();

  if ( appState.viewPage != "BadgeList" ) {
    return ( <></> );
  }

  var x = { data: null };
  //const res = //await
  //      axios.get<any>('/api/v1/badgelist').then((resp) => { x.data = resp.data; console.log(x);});

  if(appState.reqBadgeList == true) {
    if(UpdatingBadgeList == false) {
      setUpdatingBadgeList(true);
      axios.get<any>('/api/v1/badgelist')
      .then((resp) => { 
        setBadgeList(resp.data);
        setAppState(AppControlClearReqBadgeList);
        setUpdatingBadgeList(false);
      });
    }
  }

  return (
    <>
      <div>
      ＜バッジリスト一覧コンポーネント＞
      </div>
      <div>
        {JSON.stringify(BadgeList)}
      </div>
    </>
  );
};
