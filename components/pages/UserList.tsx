import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay, Spinner } from "@chakra-ui/react";

import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_UserList,
  useAppState_UserListNotApp,
  useAppState_UserListUpload,
  useAppState_Dialog,
} from "@/share/store/appState/main";


//<-- 学習者一覧画面コンポーネント -->

export const UserList = () => {

  const [statePageOrg, setStatePage] = useAppState_Page();
  const [userListOrg, setUserList] = useAppState_UserList();
  const [userListNotAppOrg, setUserListNotApp] = useAppState_UserListNotApp();
  const [userListUploadOrg, setUserListUpload] = useAppState_UserListUpload();
  const [stateDialogOrg, setStateDialog] = useAppState_Dialog();
  const [resultDialog, setResultDialog] = useState(null);

  let statePage = statePageOrg;
  let userList = userListOrg;
  let userListNotApp = userListNotAppOrg;
  let userListUpload = userListUploadOrg;
  let stateDialog = stateDialogOrg;

  let startComm = false;
  let startOpenFile = false;

  //<---- 画面遷移時の処理 ---->

  if((statePage.page == AppPage.UserList || statePage.page == AppPage.UserListNotApp) && statePage.event == AppEvent.OpenPage) {
    statePage = {...statePage, event: null };
    startComm = true;
    statePage = {...statePage, event: AppEvent.CommGetUserList, lock: true };
    userList = { connecting: true, success: false, list: null };
    userListNotApp = { connecting: true, success: false, list: null };
  } 

  //<---- ダイアログCLOSE時の処理 ---->

  if(statePage.page == AppPage.UserList && statePage.lock == false && resultDialog != null) {

    //CSVアップロード確認ダイアログを閉じる => ダウンロード処理を開始
    if(resultDialog.type == 4 && resultDialog.yesno === true) {
      startOpenFile = true;
      statePage = {...statePage, event: AppEvent.OpenUploadCSV, lock: true};
    }

    //CSVアップロード確認ダイアログを閉じる => 学習者リスト表示を更新
    if(resultDialog.type == 5) {
      startComm = true;
      statePage = {...statePage, event: AppEvent.CommGetUserList, lock: true };
      userList = { connecting: true, success: false, list: null };
      userListNotApp = { connecting: true, success: false, list: null };
    }
  }

  //<---- レンダリング後の状態遷移・通信処理の起動 ---->

  useEffect(() => {
    if(resultDialog != null) {
      setResultDialog(null);
    }

    if(userList != userListOrg){
      setUserList(userList);
      setUserListNotApp(userListNotApp);
    }

    if(userListNotApp != userListNotAppOrg){
      setUserListNotApp(userListNotApp);
    }

    if(statePage != statePageOrg){
      setStatePage(statePage);
    }

    //<---- 学習者リスト取得 ---->

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

        const userID = (resp.data == null ? null : resp.data.userID);
        const userIDNotApp = (resp.data == null ? null : resp.data.userIDNotApp);

        if(userID == null || userIDNotApp == null) {
          console.log("ERROR: コンポーネント(UserList) サーバデータ取得エラー(学習者一覧情報) 受信データ欠損");
          console.log(resp);
        }

        const updateUserID = {
          list: userID,
          connecting: false,
          success: (userID != null),  
        };

        const updateUserIDNotApp = {
          list: userIDNotApp,
          connecting: false,
          success: (userIDNotApp != null),
        };

        setUserList(updateUserID);
        setUserListNotApp(updateUserIDNotApp);
        setStatePage({...statePage, event: null, lock: false});
      })
      .catch((error) => {

        console.log("ERROR: コンポーネント(UserList) サーバデータ取得エラー(学習者一覧情報)");
        console.log(error);

        const updateUserID = {
          list: null,
          connecting: false,
          success: false,
        };

        setUserList(updateUserID);
        setUserListNotApp(updateUserID);
        setStatePage({...statePage, event: null, lock: false});
      })
    } 

    //<---- CSVアップロードファイル選択ダイアログ表示 ---->

    if(startOpenFile == true) {
      uploacCSV(statePage, setStatePage, userListUpload, setUserListUpload, stateDialog, setStateDialog);
    }
  });

  // <---- 表出力内容を作成 ---->

  const tableData = useMemo((() => {
      if(userList.list == null) {
        return null;
      }
      else {
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
          date = date.split('T')[0].replaceAll('-', '/'); 
          return {userEMail: o.userEMail, userID: o.userID, submittedAt: date};
        });
      }
    },
    [userListNotApp.list]
  );

  // <---- 表出力内容を作成 ---->

  let showTable = false;
  let showTableNotApp = false;
  let showUploadCsv = false;
  let enableUploadCsv = false;
  let showUpdateCsv = false
  let messageTxt = null;
  let useSpinner = false;

  if ( statePage.page != AppPage.UserList && statePage.page != AppPage.UserListNotApp) {
    return ( <></> );
  }

  if( startComm || userList.connecting == true) {
    useSpinner = true;
  }

  else if( userList.success == false || tableData == null ) {
    messageTxt = '＜データ取得失敗＞';
  }

  else if(statePage.event == AppEvent.CommUploadCSV) {
    showUploadCsv = true;    
    useSpinner = true;
  }

  else if(statePage.page == AppPage.UserList) {
    showUploadCsv = true;
  }

  if(showUploadCsv == true && statePage.event == null && statePage.lock == false) {
    enableUploadCsv = true;
  }

  if(statePage.page == AppPage.UserList && tableData != null){
    if(tableData.length > 0) {
      showTable = true;
    }
    else if(messageTxt == null) {
      messageTxt = "学習者が登録されていません";
    }
  }

  if(statePage.page == AppPage.UserListNotApp && tableDataNotApp != null){
    if(tableDataNotApp.length > 0) {
      showTableNotApp = true;
    }
  }

  //<---- 学習者リストアップロードボタンハンドラ ---->

  const onClickUpload = () => {
    if(enableUploadCsv) {
      setStateDialog({...stateDialog, type: 4, setResult: setResultDialog, title: null, msg: null});
      setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    }
  }

  //<---- 画面表示 ---->

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
          {process.env.NEXT_PUBLIC_USERLIST_TITLE + "　学習者一覧"}
        </Box>
        { showUploadCsv == false ? (<></>) : (
          <Box>
            <Button color={"white"}
              fontSize={"12px"}
              backgroundColor={"teal"}
              onClick={onClickUpload}
            >
              学習者リストアップロード
            </Button>
          </Box>
        )}
        { messageTxt == null ? (<></>) : (
          <Box m={[10,100]} fontWeight={"bold"} fontSize={"16px"}>
            {messageTxt}
          </Box>
        )}
        { useSpinner == false ? (<></>) :
          <Spinner m={[10,100]} thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        }
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
                  { size: 400, header: 'ID', accessorKey: 'userID', enableSorting: false },
                  { size: 400, header: '氏名', accessorKey: 'userName', enableSorting: false },
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
                initialState={{density: 'comfortable', showGlobalFilter: true}}
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
                muiTableProps={{
                  sx: {
                    tableLayout: 'fixed',
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
                  { minSize: 400, header: 'ID', accessorKey: 'userID', enableColumnActions: false, enableSorting: false },
                  { minSize: 400, header: 'Emailアドレス', accessorKey: 'userEMail', enableColumnActions: false, enableSorting: false },
                  { minSize: 150, header: '提出日', accessorKey: 'submittedAt' },
                ]}
                data={tableDataNotApp == null ? [] : tableDataNotApp}
                enableGlobalFilterModes
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableColumnFilters={false}
                enableHiding={false}
                enableColumnActions={true}
                initialState={{density: 'comfortable', showGlobalFilter: true}}
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
                muiTableBodyCellProps = {(cell) => ({
                  sx: {
                    'color': 'red',
                  },
                })}
                muiTableProps={{
                  sx: {
                    tableLayout: 'fixed',
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

//<---- CSVファイルアップロード処理 ---->

async function uploacCSV(statePage, setStatePage, userListUpload, setUserListUpload, stateDialog, setStateDialog)
{
  let handle = null;
  let file = null;
  let text = null;
  let lines = null;
  let listArray = [];
  let msg = null;

  try {
    [handle] = await (window as any).showOpenFilePicker({
      types: [{accept: {'*/*': ['.csv']}}]
    });

    file = await handle.getFile()
    text = await file.text();      
  }
  catch (err) { //no act
  }

  if(handle == null) {
    setStatePage({...statePage, event: null, lock: false});
    return;  //ユーザーによるファイル選択キャンセル
  }

  if(text == null) {
    setStateDialog({...stateDialog, type: 10, title: "エラー", msg: "ファイルのOPENに失敗しました。"});
    setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    return;
  }

  //ユーザーIDフォーマットチェック正規表現  
  //const regstr = '^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$';

  lines = text.split(/\r\n|\n/);
  for (let i = 0; i < lines.length && msg == null; ++i) {

    let cells = parseCsvLine(lines[i]);

    if(i + 1 == lines.length && cells.length == 1 && cells[0].match(' *')) {
      //最終行が空文の場合何も処理しない
    }
    else if(cells.length >= 2) {
      if(cells[0].match(' +')) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'ID'が未設定です`;
      }
      else if(cells[1].match(' +')) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'氏名'が未設定です`;
      }
      else if(cells[0].length > 254) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'ID'が文字数上限（254）を超えています。`;
      }
      else if(cells[1].length > 256) {
        msg = `CSVファイルフォーマット異常(${i+1}行目)：'氏名'が文字数上限（256）を超えています。`;
      }
      else {
        for(let checkline=0; checkline<=listArray.length; checkline++) {
          if(checkline == listArray.length) {
            listArray.push({ id: cells[0], name: cells[1] });
            break;
          }
          else if(listArray[checkline].id == cells[0]){
            msg = `CSVファイルフォーマット異常(${checkline+1}行目, ${i+1}行目)：'ID'が重複しています。`;
            break;
          }
        }
      }
    } 
    else {
      //最終行を除いて項目数が2個ない場合はエラーとする
      msg = `CSVファイルフォーマット異常(${i+1}行目)：項目が不足しています。`;
    }
  }

  if(msg == null && (listArray == null || listArray.length <= 0)) {
    msg = `CSVファイルフォーマット異常：有効なデータがありません。`;
  }

  if(msg != null) {
    setStateDialog({...stateDialog, type: 10, title: "エラー", msg: msg});
    setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    return;
  }

  statePage = {...statePage, event: AppEvent.CommUploadCSV, lock: true};
  setStatePage(statePage);

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

    if(success == null || success == false) {
      msg = "ERROR: コンポーネント(UserList) 学習者リスト更新サーバー処理結果エラー, " + resp.data.msg;
      console.log(msg);
      setStateDialog({...stateDialog, type: 10, title: "エラー", msg: "学習者リストの更新に失敗しました。\r\n" + msg});
      setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    }
    else {
      setStateDialog({...stateDialog, type: 5, title: "確認", msg: "学習者リストを更新しました。"});
      setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    }    

    userListUpload = {
      connecting: false,
      success: success,
      msg: msg,
      exp: exp,
    };

    setUserListUpload(userListUpload);
    return;
  })
  .catch((error) => {
    let msg = "ERROR: コンポーネント(UserList) 学習者リスト更新サーバー通信エラー";
    try {
      msg = msg + '\r\n' + error.response.data.msg;
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

    setStateDialog({...stateDialog, type: 10, title: "エラー", msg: "学習者リストの更新に失敗しました。\r\n" + msg});
    setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    setUserListUpload(userListUpload);
  });
}
  
//<---- CSVフォーマット文字列コンバート ---->

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
