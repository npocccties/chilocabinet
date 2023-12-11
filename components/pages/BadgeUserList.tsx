import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Link, Flex, Box, Button, Spinner } from "@chakra-ui/react";

import { EXPORT_CSV_VER } from "@/configs/constants"

import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_BadgeUserList,
  useAppState_Dialog,
} from "@/share/store/appState/main";

//<---- バッジ提出者一覧画面コンポーネント ---->

export const BadgeUserList = () => {

  const [statePageOrg, setStatePage] = useAppState_Page();
  const [badgeUserListOrg, setBadgeUserList] = useAppState_BadgeUserList();
  const [stateDialogOrg, setStateDialog] = useAppState_Dialog();
  const [resultDialog, setResultDialog] = useState(null);
  const [fileHandle, setFileHandle] = useState(null);

  let statePage = statePageOrg;
  let badgeUserList = badgeUserListOrg;
  let stateDialog = stateDialogOrg;

  let startComm = false;
  let startCommCsv = false;

  //<---- 画面遷移時の処理 ---->

  if( (statePage.page == AppPage.BadgeUserList) && 
      (statePage.event == AppEvent.OpenPage)
  ){
    startComm = true;
    statePage = {...statePage, event: AppEvent.CommGetBadgeUserList, lock: true};
    badgeUserList = { success: false, connecting: true, list: null, listNotApp: null, badgeName: null };
  }

  //<---- ダイアログCLOSE時の処理 ---->

  if(statePage.page == AppPage.BadgeUserList && statePage.lock == false && resultDialog != null) {
    if(resultDialog.type == 3 && resultDialog.yesno === true) {
      startCommCsv = true;
      statePage = {...statePage, event: AppEvent.CommExportCsv, lock: true};
    }
  }

  //<---- 能力バッジ別提出ユーザー一覧取得通信終了時の状態遷移 ---->

  if( (statePage.page == AppPage.BadgeUserList) &&
      (startComm == false) &&
      (statePage.event == AppEvent.CommGetBadgeUserList) &&
      (badgeUserList.connecting == false)
  ){
    statePage = {...statePage, event: null, lock: false};
  }

  //<---- レンダリング後の状態遷移・通信処理の起動 ---->

  useEffect(() => {
    if(resultDialog != null) {
      setResultDialog(null);
    }
    if(stateDialog != stateDialogOrg) {
      setStateDialog(stateDialog);
    }
    if(badgeUserList != badgeUserListOrg) {
      setBadgeUserList(badgeUserList);
    }
    if(statePage != statePageOrg){
      setStatePage(statePage);
    }

    //<-- バッジ別提出ユーザー取得 -->

    if(startComm == true) {
      const formdata = {
        badge_class_id: statePage.param,
      };

      const headerdata = {
        headers: {
          Accept: "application/json",
        },
      }

      axios.post<any>('/api/v1/badge_userlist', formdata, headerdata)
      .then((resp) => { 
        let update = {
          list: null,
          listNotApp: null,
          badgeName: null,
          connecting: false,
          success: false,
        };

        if(resp.data != null && resp.data.badgeName && resp.data.list != null && resp.data.listNotApp) {
          update = {
            list: resp.data.list,
            listNotApp: resp.data.listNotApp,
            badgeName: resp.data.badgeName,
            connecting: false,
            success: true,
          };
        }
        else {
          console.log("ERROR: コンポーネント(BadgeUserList) サーバデータ取得エラー(バッジ提出者一覧情報) データ欠損");
          console.log(resp.data.msg);
        }

        setBadgeUserList(update);
      })
      .catch((err) => {
        console.log("ERROR: コンポーネント(BadgeUserList) サーバデータ取得エラー(能力バッジ提出者一覧情報)");
        console.log(err);

        let update = {
          list: null,
          listNotApp: null,
          badgeName: null,
          connecting: false,
          success: false,
        };

        
        setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
        setBadgeUserList(update);
      });
    }

    //<-- バッジ提出者一覧取得(CSV出力用) -->

    if(startCommCsv == true) {
      const formdata = {
        badge_class_id: [ statePage.param ],
        export: true,
      };

      const headerdata = {
        headers: {
          Accept: "application/json",
        },
      }

      //CSV出力データ取得
      axios.post<any>('/api/v1/badge_userlist', formdata, headerdata)
      .then((resp) => {

        //CSV形式に変換
        const convert = (s) => {
          return s == null ? '' :
            s.replace(/\\/g, '\\')
             .replace(/\r/g, '\\r')
             .replace(/\n/g, '\\n')
             .replace(/\t/g, '\\t')
             .replace(/"/g,'""')
             .replace(/(.*[,"'`\\].*)/, '"$1"');
        }

        //<---- CSVファイル出力 ---->

        const exportCSV = async (records) => {

          let data = records.map((o) => {
             return [
               EXPORT_CSV_VER,
               convert(o.userID),
               convert(o.badgeName),
               convert(o.badgeDescription),
               convert(o.badgeIssuerName),
               convert(o.badgeIssuedOn),
             ].join(','); 
          }).join('\r\n');

          let header = "CSVバージョン,ID,バッジ名,バッジ説明,バッジ発行者名,バッジ発行日\r\n";
          let bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
          let blob = new Blob([bom, header, data], {type: 'text/csv'});

          //ブラウザからファイル保存
          let url = (window.URL || window.webkitURL).createObjectURL(blob);
          let link = document.createElement('a');
          link.download = 'バッジ提出者一覧.csv';
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        if(resp.data.exportData != null && resp.data.exportData.length > 0) {
          setStatePage({...statePage, event: null, lock: false});
          exportCSV(resp.data.exportData);
        }
        else {
          setStateDialog({...stateDialog, type: 10, title: "確認", msg: "0件のデータを取得しました。提出された対象バッジはありません。"});
          setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
        }
      })
      .catch((err) => {
        console.log("ERROR: コンポーネント(BadgeUserList) サーバデータ取得エラー(能力バッジ提出者一覧(CSVエクスポート))");
        console.log(err);
        setStateDialog({...stateDialog, type: 10, title: "エラー", msg: "サーバーからの情報取得に失敗しました。\r\n" +
          "\r\nstatus: " + err.response.status +
          "\r\nmsg: " + err.response.data.msg
        });
        setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
      });
    }
  });  

  //<-- 画面表示するテーブルデータ作成 -->

  //登録ユーザー
  const tableData = useMemo(() => {
      if(badgeUserList.list == null) {
        return null;
      }
      else {
        return badgeUserList.list.map(o => {
          return {
            id: o.userID,
            name: o.userName,
            mail: o.userEMail,
            submittedAt: o.submittedAt == null ? null : o.submittedAt,
            submittedDate: o.submittedAt == null ? null : o.submittedAt.split('T')[0].replaceAll('-', '/'),
            downloadedAt: o.downloadedAt == null ? null : o.downloadedAt,
            downloadedDate: o.downloadedAt == null ? null : o.downloadedAt.split('T')[0].replaceAll('-', '/'),
            downloaded: o.downloadedAt == null ? '未' : '-',
          };
        });
      }
    },
    [badgeUserList.list]
  );

  //未登録ユーザー 
  const tableDataNotApp = useMemo(() => {
      if(badgeUserList.listNotApp == null) {
        return null;
      }
      else {
        return badgeUserList.listNotApp.map(o => {
          return {
            id: o.userID,
            submittedAt: o.submittedAt == null ? null : o.submittedAt,
            submittedDate: o.submittedAt == null ? null : o.submittedAt.split('T')[0].replaceAll('-', '/'),
            mail: o.userEMail,
          };
        });
      }
    },
    [badgeUserList.listNotApp]
  );

  // <---- ハンドラCSVダウンロードボタン押下 ---->

  const onClickDownloadCsv = () => {
    if(statePage.page == AppPage.BadgeUserList && statePage.lock == false) {
      setStateDialog({...stateDialog, type: 3, setResult: setResultDialog, title: null, msg: null});
      setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    }
  }

  // <---- 画面表示条件 ---->

  let useSpinner = false;
  let messageTxt = null;
  let showTable = false;
  let showTableNotApp = false;
  let showBackButton = false;
  let showTableNotAppButton = false;
  let service = "";

  if(statePage.param != null) {
    let m = statePage.param.match(/^https?:\/\/([^/]+)(\/.*)?$/);
    if(m != null && m[1] != null) {
      service = m[1];
    }
  }

  if ( statePage.page != AppPage.BadgeUserList && statePage.page != AppPage.BadgeUserListNotApp ) {
    return ( <></> );
  }

  if( startComm || badgeUserList.connecting == true || statePage.event == AppEvent.CommExportCsv) {
    useSpinner = true;
  }

  else if( badgeUserList.success == false || tableData == null ) {
    messageTxt = '＜データ取得失敗＞';
    showBackButton = true;
  }

  else if(statePage.page == AppPage.BadgeUserListNotApp &&
    tableDataNotApp != null &&
    tableDataNotApp.length > 0
  ){
    showTableNotApp = true;
  }

  else if(tableData.length == 0) {
    messageTxt = "＜提出されたバッジデータがありません＞";
    showBackButton = true;
    if(tableDataNotApp != null && tableDataNotApp.length > 0) {
      showTableNotAppButton = true;
    }
  }

  else {
    showTable = true;
    showBackButton = true;
    if(tableDataNotApp != null && tableDataNotApp.length > 0) {
      showTableNotAppButton = true;
    }
  }

  // <---- 画面表示 ---->

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

      <Flex
        direction={"column"}
        alignItems={"left"}
        textAlign={"left"}
      >
        <Box fontSize={"12px"}>
          { //サービス名表示
            service 
          }
        </Box>
        <Box fontWeight={"bold"} fontSize={"22px"}>
          { //バッジ名表示
            badgeUserList.badgeName
          }
        </Box>
      </Flex>

        { //タイトル表示
          statePage.page != AppPage.BadgeUserList ? (<></> ) :
          <Box fontWeight={"bold"} fontSize={"22px"}>
            {"バッジ提出者一覧"}
          </Box>
        }

        { //通信中スピナ表示
          useSpinner == false ? (<></>) :
          <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        }

        { //未登録emailのバッジが提出済みの場合の画面遷移ボタン表示 
          showTableNotAppButton == false ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"12pt"}>
            <Box color="blue" textDecoration={"underline"}>
              <Link _hover={{fontWeight: "bold"}} onClick={() => setStatePage({...statePage, page: AppPage.BadgeUserListNotApp})}>
                ※提出済みで学習者一覧に登録のないメールアドレスがあります。
              </Link>
            </Box>
            <Button color={"black"}  backgroundColor={"lightgray"} fontSize={"12px"} h={"22px"} my={"8px"} 
              onClick={() => setStatePage({...statePage, page: AppPage.BadgeUserListNotApp})} 
            >
              確認する 
            </Button>
          </Flex>
        )}

        { //戻るボタン CSVダウンロード表示
          (showBackButton == false) ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Button color={"black"} fontSize={"12px"} backgroundColor={"lightgray"}
              onClick={() => setStatePage({...statePage, page: AppPage.BadgeList})}
            >
             戻る
            </Button>
            { showTable == false ? <></> :
              <>
                <Box></Box>
                <Button color={"white"} fontSize={"12px"} backgroundColor={"teal"}
                  onClick={onClickDownloadCsv}
                >
                  CSVダウンロード
                </Button>
              </>
            }
          </Flex>
        )}

        { //戻るボタン表示(バッジ未登録者表示画面の場合)

          showTableNotApp == false ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Box>
              バッジが提出済みですが、学習者登録がなされていないメールアドレスです
            </Box>
            <Button color={"black"} fontSize={"12px"} backgroundColor={"lightgray"}
              onClick={() => setStatePage({...statePage, page: AppPage.BadgeUserList})}
            >
              バッジ提出者一覧に戻る
            </Button>
          </Flex>
        )}

        { //メッセージ表示（データがありませんなど）
          messageTxt == null ? (<></>) : (
          <Box m={[10,100]} fontWeight={"bold"} fontSize={"16px"}>
            {messageTxt}
          </Box>
        )}

        { (showTable == false) ? (<></>) : (
          <Box>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialReactTable
                columns={[
                  { minSize: 300, header: 'ID', accessorKey: 'id', enableSorting: false, enableColumnActions: false },
                  { minSize: 300, header: '提出者名', accessorKey: 'name', enableSorting: false, enableColumnActions: false },
                  { minSize: 300, header: 'Emailアドレス', accessorKey: 'mail', enableSorting: false, enableColumnActions: false },
                  { minSize: 50, header: '提出日', accessorKey: 'submittedDate' },
                  { minSize: 210, header: 'CSVファイル未出力', accessorKey: 'downloaded'},
                ]}
                data={tableData == null ? [] : tableData}
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
                  size: "small",
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
                  { minSize: 400, header: 'ID', accessorKey: 'id', enableSorting: false, enableColumnActions: false },
                  { minSize: 400, header: 'Emailアドレス', accessorKey: 'mail', enableSorting: false, enableColumnActions: false },
                  { minSize: 100, header: '提出日', accessorKey: 'submittedDate' },
                ]}
                data={tableData == null ? [] : tableDataNotApp}
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
                  size: "small",
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

      </Flex>
    </>
  );
}
