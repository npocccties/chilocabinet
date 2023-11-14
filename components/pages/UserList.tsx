import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import { CABINET_OPERATOR_TITLE } from "@/configs/constants";
import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_UserList,
  useAppState_UserListNotApp,
  useAppState_UserListUpload,
} from "@/share/store/appState/main";




export const UserList = () => {

  let [statePage, setStatePage] = useAppState_Page();
  let [userList, setUserList] = useAppState_UserList();
  let [userListNotApp, setUserListNotApp] = useAppState_UserListNotApp();
  let [userListUpload, setUserListUpload] = useAppState_UserListUpload();

  //let statePage = statePageOrg;
  //let userList = userListOrg;
  //let userListNotApp = userListNotAppOrg;
  //let userListUpload = userListUploadOrg;

  let startComm = false;
  let pageAct = false;

  console.log(statePage);
  console.log(userList);
  console.log(userListNotApp);
  console.log(userListUpload);

  if((statePage.page == AppPage.UserList || statePage.page == AppPage.UserListNotApp) && statePage.event == AppEvent.OpenPage) {
    statePage = {...statePage, event: null };
    pageAct = true;
    startComm = true;
    statePage = {...statePage, event: AppEvent.CommGetUserList, lock: true };
    userList = { connecting: true, success: false, list: null };
    userListNotApp = { connecting: true, success: false, list: null };
  } 

  if( (statePage.page ==  AppPage.UserList || statePage.page == AppPage.UserListNotApp) &&
      startComm == false &&
      statePage.event == AppEvent.CommGetUserList &&
      userList.connecting == false &&
      userListNotApp.connecting == false
  ){
    statePage = {...statePage, event: null, lock: false };
    pageAct = true;
  }

  if( statePage.page == AppPage.UserList &&
      startComm == false &&
      statePage.event == AppEvent.CommUploadUserList &&
      userListUpload.connecting == false
  ){
    if(userListUpload.success) {
      startComm = true;
      statePage = {...statePage, event: AppEvent.CommGetUserList, lock: true };
    }
    else {
      pageAct = true;
      statePage = {...statePage, event: null, lock: false };
    }
  }

  if(statePage.page == AppPage.UserListNotApp) {
    if( userListNotApp.success == false ||
        userListNotApp.connecting == true ||
        userListNotApp.list == null ||
        userListNotApp.list.length <= 0
    ){
      statePage = {...statePage, page: "UserList"};
      pageAct = true;
    }
  }

  useEffect(() => {
    if(startComm){
      setUserList(userList);
      setUserListNotApp(userListNotApp);
    }
    if(pageAct || startComm){
      setStatePage(statePage);
    }
  });

  if(startComm == true) {
    const formdata = {
      type: "download",
    };

    const headerdata = { 
      headers: {
        Accept: "application/json",
      },
    }

    axios.post<any>('/api/v1/userlist', formdata, headerdata)
    .then((resp) => {
      const user_email = (resp.data == null ? null : resp.data.user_email);
      const user_email_notapp = (resp.data == null ? null : resp.data.user_email_notapp);
      if(user_email == null || user_email_notapp == null) {
        console.log("ERROR: コンポーネント(UserList) サーバデータ取得エラー(学習者一覧情報) 受信データ欠損");
        console.log(resp);
      }

      const updateUserEMail = {
        list: user_email,
        connecting: false,
        success: (user_email != null),  
      };

      const updateUserEMailNotApp = {
        list: user_email_notapp,
        connecting: false,
        success: (user_email_notapp != null),
      };

      setUserList(updateUserEMail);
      setUserListNotApp(updateUserEMailNotApp);
    })
    .catch((error) => {
      console.log("ERROR: コンポーネント(UserList) サーバデータ取得エラー(学習者一覧情報)");
      console.log(error);
      const updateUserEMail = {
        list: null,
        connecting: false,
        success: false,
      };

      setUserList(updateUserEMail);
      setUserListNotApp(updateUserEMail);
    })
  } 

  const tableData = useMemo((() => {
      if(userList.list == null) {
        return null;
      }
      else {
        //let arr = [];
        //for(let i=0; i< userList.list.length; i++) {
        //}
        //return arr;
        return userList.list.map(o => ({...o}));
      }
    }),
    [userList.list]
  );

  const tableDataNotApp = useMemo(() => {
      if(userListNotApp.list == null) {
        return null;
      }
      else {
        return userListNotApp.list.map(o => {
          let date: string = o.submittedAt;
          date = date.split('T')[0]; 
          return {userEMail: o.userEMail, submittedAt: date};
        });
      }
    },
    [userListNotApp.list]
  );




  let showTable = false;
  let showTableNotApp = false;
  let showMessage = false;
  let enableUploadCsv = true;
  let messageTxt = "学習者が登録されていません";

  if ( statePage.page != AppPage.UserList && statePage.page != AppPage.UserListNotApp) {
    return ( <></> );
  }

  if( startComm || userList.connecting == true ) {
    showMessage = true;
    messageTxt = '＜データ取得中＞';
    enableUploadCsv = false;
  }

  else if( userList.success == false || tableData == null ) {
    showMessage = true;
    messageTxt = '＜データ取得失敗＞';
    enableUploadCsv = false;
  }

  else if(userListUpload.connecting == true) {
    enableUploadCsv = false;
  }

  else if(statePage.page == AppPage.UserListNotApp) {
    if(tableDataNotApp != null && tableDataNotApp.length > 0) {
      showTableNotApp = true;
    }
  }
  else if(tableData != null && tableData.length > 0) {
    showTable = true;
  }
  else {
    showMessage = true;
  }

  const onClickUpload = () => {
    if(enableUploadCsv) {
      uploadEMailListCsv(statePage, setStatePage, userListUpload, setUserListUpload);
    }
  }

  const defaultMaterialTheme = createTheme();
  return (
    <>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        fontSize={"12px"}
        gap={"12px"}
        textAlign={"center"}
      >
        <Box fontWeight={"bold"} fontSize={"16px"}>
          {CABINET_OPERATOR_TITLE + "　学習者一覧"}
        </Box>
        { showTableNotApp == true ? (<></>) : (
          <Box>
            <Button color={"white"}
              fontSize={"12px"}
              backgroundColor={enableUploadCsv ? "teal" : "gray"}
              onClick={onClickUpload}
            >
              emailリストアップロード
            </Button>
          </Box>
        )}
        { showMessage == false ? (<></>) : (
          <Box fontWeight={"bold"} fontSize={"16px"}>
            {messageTxt}
          </Box>
        )}
        { ((showTableNotApp == false &&
            tableDataNotApp != null &&
            tableDataNotApp.length > 0) == false) ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Box color={"red"} textDecoration={"underline"}
              onClick={() => setStatePage({...statePage, page: "UserListNotApp"})}
            >
              ※提出済みで学習者一覧に登録のないメールアドレスがあります。
            </Box>
            <Button color={"black"} fontSize={"12px"} backgroundColor={"lightgray"}
              onClick={() => setStatePage({...statePage, page: "UserListNotApp"})} 
            >
              確認する 
            </Button>
          </Flex>
        )}
        { showTableNotApp == false ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Box color={"red"} textDecoration={"underline"}>
              バッジが提出済みですが、学習者登録がなされていないメールアドレスです
            </Box>
            <Button color={"black"} fontSize={"12px"} backgroundColor={"lightgray"}
              onClick={() => setStatePage({...statePage, page: "UserList"})}
            >
              学習者一覧に戻る
            </Button>
          </Flex>            
        )}
        { (showTable == false) ? (<></>) : (
          <Box>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialReactTable
                columns={[
                  { minSize: 400, header: '氏名', accessorKey: 'userName', enableSorting: false },
                  { minSize: 400, header: 'Emailアドレス', accessorKey: 'userEMail', enableSorting: false },
                ]}
                data={tableData == null ? [] : tableData}
                enableRowNumbers
                enableGlobalFilterModes
                rowNumberMode={"original"}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableColumnFilters={false}
                enableHiding={false}
                enableColumnActions={false}
                initialState={{density: 'compact', showGlobalFilter: true}}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [
                    {label: "10件", value: 10},
                    {label: "25件", value: 25},
                    {label: "50件", value: 50},
                    {label: "100件", value: 100},
                  ],
                  labelRowsPerPage: "ページ表示数",
                }}
                muiSearchTextFieldProps={{
                  placeholder: "検索",
                  sx: { minWidth: '300px' },
                  variant: 'outlined',
                }}
                muiTableBodyProps= {{
                  sx: {
                    '& tr:nth-of-type(odd) > td': { backgroundColor: '#eee' },
                  },
                }}
              />
            </ThemeProvider>
          </Box>
        )}
        { (showTableNotApp == false) ? (<></>) : (
          <Box>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialReactTable
                columns={[
                  { minSize: 400, header: 'Emailアドレス', accessorKey: 'userEMail', enableSorting: false },
                  { minSize: 150, header: '提出日', accessorKey: 'submittedAt' },
                ]}
                data={tableDataNotApp == null ? [] : tableDataNotApp}
                enableGlobalFilterModes
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableColumnFilters={false}
                enableHiding={false}
                enableColumnActions={false}
                initialState={{density: 'compact', showGlobalFilter: true}}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [
                    {label: "10件", value: 10},
                    {label: "25件", value: 25},
                    {label: "50件", value: 50},
                    {label: "100件", value: 100},
                  ],
                  labelRowsPerPage: "ページ表示数",
                }}
                muiSearchTextFieldProps={{
                  placeholder: "検索",
                  sx: { minWidth: '300px' },
                  variant: 'outlined',
                }}
                muiTableBodyProps= {{
                  sx: {
                    '& tr:nth-of-type(odd) > td': { backgroundColor: '#eee',},
                  },
                }}
              />
            </ThemeProvider>
          </Box>
        )}
      </Flex>
    </>
  );
};




async function uploadEMailListCsv(statePage, setStatePage, userListUpload, setUserListUpload)
{
  const checkYes = window.confirm(
    "学習者一覧をCSVファイルから登録します。" +
    "この操作を行うと現在登録してある学習者一覧は削除されます。" +
    "実行してよろしいですか。"
  );

  let handle = null;
  let file = null;
  let text = null;
  let lines = null;
  let listArray = null;
  let msg = null;

  if(checkYes) {
    try {
      [handle] = await (window as any).showOpenFilePicker({
        types: [{accept: {'*/*': ['.csv']}}]
      });

      file = await handle.getFile()
      text = await file.text();      
    }
    catch (err) { //no act
    }
  } 

  console.log(handle);
  console.log(file);
  console.log(text);

  if(handle == null) {
    return;  //ユーザーによるファイル選択キャンセル
  }

  if(text == null) {
    window.alert("ファイルのオープンに失敗しました。");
    return;
  }

  //ファイルフォーマットチェック  
  const regstr = '^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$';

  lines = text.split(/\r\n|\n/);
  for (let i = 0; i < lines.length && msg == null; ++i) {
    let cells = parseCsvLine(lines[i]);
    if(i == 0) {
      if(cells.length != 2 || cells[0] != '学習者' || cells[1].toLowerCase() != 'emailアドレス') {
         msg = `CSVファイルフォーマット異常(1行目)：1行目の項目は「学習者」「Emailアドレス」と記述してください。`;
      }
      else {
        listArray = []; 
      }
    }
    else if(cells.length >= 2) {
      if(cells[0].length > 256) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'学習者'が文字数上限（256）を超えています。`;
      }
      else if(cells[1].length > 254) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'EMailアドレス'が文字数上限(254)を超えています。`;
      }
      else if(cells[1].match(regstr) == null) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'EMailアドレス'文字列が不正です。`; 
      }
      else {
        listArray.push({ name: cells[0], email: cells[1] });
      }
    } 
    else if(i + 1 < lines.length) {
      //最終行を除いて項目数が2個ないがある場合はエラーとする
      msg = `CSVファイルフォーマット異常(${i+1}行目)：項目が不足しています。`;
    }
  }

  if(msg == null && (listArray == null || listArray.length <= 0)) {
    msg = `CSVファイルフォーマット異常：有効なデータがありません。`;
  }

  if(msg != null) {
    window.alert(msg);
    return;
  }

  userListUpload = {...userListUpload, connecting: true, success: false, msg: null, exp: null};
  statePage = {...statePage, lock: true, event: AppEvent.CommUploadUserList};
  setUserListUpload(userListUpload);
  setStatePage(statePage);
 
  const formdata = {
    type: "upload",
    upload: listArray,
  };

  const headerdata = {
    headers: {
      Accept: "application/json",
    },
  }

  axios.post<any>('/api/v1/userlist', formdata, headerdata)
  .then((resp) => {
    let success = (resp.data != null && resp.data.success != null && resp.data.success == true);
    let msg = (resp.data != null && resp.data.msg != null) ? resp.data.msg : null;
    let exp = (resp.data != null && resp.data.exp != null) ? resp.data.exp : null;

    console.log(msg);
    console.log(exp);

    if(success == null || success == false) {
      msg = "ERROR: コンポーネント(UserList) 学習者リスト更新サーバー処理結果エラー, " + resp.data.msg;
      //console.log(msg);
      //console.log(exp);
      window.alert("学習者リストの更新に失敗しました。\n" + msg);
    }
    else {
      window.alert("学習者リストを更新しました。");
    }    

    userListUpload = {
      connecting: false,
      success: success,
      msg: msg,
      exp: exp,
    };

     setUserListUpload(userListUpload);
  })
  .catch((error) => {
    let msg = "ERROR: コンポーネント(UserList) 学習者リスト更新サーバー通信エラー";
    try {
      msg = msg + '\n' + error.response.data.msg;
    }
    catch(exp) { // no act
    }

    console.log(msg);
    console.log(error);

    userListUpload = {
      connecting: false,
      success: false,
      msg: msg,
      exp: error,
    };

    window.alert("学習者リストの更新に失敗しました。\n" + msg);
    setUserListUpload(userListUpload);
  });
}
  

function parseCsvLine(line)
{
  return line.split(',').reduce(([data, isInQuotes], text) => {
    if (isInQuotes) {
      data[data.length - 1] += ',' + text.replace(/"+/g, m => '"'.repeat(m.length / 2))
      return [data, !(text.match(/"*$/)[0].length % 2)]
    } else {
      const match = text.match(/^("?)((.*?)("*))$/)
      data.push(match[1] ? match[2].replace(/"+/g, m => '"'.repeat(m.length / 2)) : match[2])
      return [data, match[1] && !(match[4].length % 2)]
    }
  }, [[]])[0];
}

