import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import { useAppState_Page, useAppState_BadgeList } from "@/share/store/appState/main";




export const BadgeList = () => {

  const [statePage, setStatePage] = useAppState_Page();
  const [badgeList, setBadgeList] = useAppState_BadgeList();

  let updateStatePage = {...statePage};
  let updateBadgeList = {...badgeList};
  let pageAct = false;
  let startComm = false;

  if(statePage.page == "BadgeList" && statePage.event == "OpenPage") {
    updateStatePage.event = null;
    pageAct = true;

    if(badgeList.connecting == false) {
      updateStatePage.event = "Connecting";
      updateStatePage.lock = true;

      startComm = true;
      updateBadgeList.connecting = true;
      updateBadgeList.success = false;
      updateBadgeList.list = null;
    }
  }

  if(updateStatePage.page ==  "BadgeList" && startComm == false && badgeList.connecting == false) {
    if(updateStatePage.event == "Connecting" && badgeList.connecting == false) {
      updateStatePage.event = null;
      updateStatePage.lock = false;
      pageAct = true;
    }
  }

  useEffect(() => {if(startComm){setBadgeList(updateBadgeList);}});
  useEffect(() => {if(pageAct){setStatePage(updateStatePage);}});

  if(statePage.page != "BadgeList") {
    return ( <></> );
  }

  console.log('start get BadgeList ' + startComm);

  if(startComm == true) {
    console.log("start get BadgeList !");
    axios.get<any>('/api/v1/badgelist')
    .then((resp) => { 
      const update = {
        list: resp.data.groupResult,
        connecting: false,
        success: true,
      };
      setBadgeList(update);
    });
  }

  return (
    <>
      <div>
      ＜バッジリスト一覧コンポーネント＞
      </div>
      <div>
        {JSON.stringify(badgeList.list)}
      </div>
    </>
  );
};
