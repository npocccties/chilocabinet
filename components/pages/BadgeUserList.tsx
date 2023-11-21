import React, { useEffect, useMemo } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay, Spinner } from "@chakra-ui/react";

import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_BadgeUserList,
} from "@/share/store/appState/main";




export const BadgeUserList = () => {

  let [statePage, setStatePage] = useAppState_Page();
  let [badgeUserList, setBadgeUserList] = useAppState_BadgeUserList();

  let pageAct = false;
  let startComm = false;

  if(statePage.page == AppPage.BadgeUserList && statePage.event == AppEvent.OpenPage) {
    pageAct = true;
    startComm = true;
    statePage = {...statePage, event: AppEvent.CommGetBadgeUserList, lock: true};
    badgeUserList = { success: false, connecting: true, list: null, listNotApp: null, badgeName: null };
  }

  if(statePage.page == AppPage.BadgeUserList && startComm == false) {
    if(statePage.event == AppEvent.CommGetBadgeUserList && badgeUserList.connecting == false) {
      pageAct = true;
      statePage = {...statePage, event: null, lock: false};
    }
  }

  useEffect(() => {
    if(startComm) {
      setBadgeUserList(badgeUserList);
    }
    if(pageAct){
      setStatePage(statePage);
    }
  });

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

      setBadgeUserList(update);
    });
  }

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

  const tableDataNotApp = useMemo(() => {
      if(badgeUserList.listNotApp == null) {
        return null;
      }
      else {
        return badgeUserList.listNotApp.map(o => {
          return {
            mail: o.userEMail,
            submittedAt: o.submittedAt == null ? null : o.submittedAt,
            submittedDate: o.submittedAt == null ? null : o.submittedAt.split('T')[0].replaceAll('-', '/'),
          };
        });
      }
    },
    [badgeUserList.listNotApp]
  );




  let useSpinner = false;
  let messageTxt = null;
  let showTable = false;
  let showTableNotApp = false;
  let showBackButton = false;
  let showTableNotAppButton = false;

  if ( statePage.page != AppPage.BadgeUserList && statePage.page != AppPage.BadgeUserListNotApp ) {
    return ( <></> );
  }

  if( startComm || badgeUserList.connecting == true ) {
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

  const defaultMaterialTheme = createTheme();




  // <---- 画面表示 ---->

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

        <Box fontWeight={"bold"} fontSize={"20px"} as={"u"}>
          { //バッジ名表示
            badgeUserList.badgeName
          }
        </Box>

        { //タイトル表示
          statePage.page != AppPage.BadgeUserList ? (<></> ) :
          <Box fontWeight={"bold"} fontSize={"16px"}>
            {"バッジ提出者一覧"}
          </Box>
        }

        { //通信中スピナ表示
          useSpinner == false ? (<></>) :
          <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        }

        { //未登録emailのバッジが提出済みの場合の画面遷移ボタン表示 
          showTableNotAppButton == false ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Box color={"red"} textDecoration={"underline"}
              onClick={() => setStatePage({...statePage, page: AppPage.BadgeUserListNotApp})}
            >
              ※提出済みで学習者一覧に登録のないメールアドレスがあります。
            </Box>
            <Button color={"black"} fontSize={"12px"} backgroundColor={"lightgray"}
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
              <><Box></Box>
              <Button color={"white"} fontSize={"12px"} backgroundColor={"teal"}
                onClick={null}
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
            <Box color={"red"} textDecoration={"underline"}>
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
          <Box fontWeight={"bold"} fontSize={"16px"}>
            {messageTxt}
          </Box>
        )}

        { (showTable == false) ? (<></>) : (
          <Box>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialReactTable
                columns={[
                  { minSize: 100, header: '職員ID', accessorKey: 'id', enableSorting: false, enableColumnActions: false },
                  { minSize: 400, header: '提出者名', accessorKey: 'name', enableSorting: false, enableColumnActions: false },
                  { minSize: 400, header: 'Emailアドレス', accessorKey: 'mail', enableSorting: false, enableColumnActions: false },
                  { minSize: 100, header: '提出日', accessorKey: 'submittedDate' },
                  { minSize: 100, header: 'CSVファイル出力未了', accessorKey: 'downloaded' },
                ]}
                data={tableData == null ? [] : tableData}
                enableGlobalFilterModes
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableColumnFilters={false}
                enableHiding={false}
                enableColumnActions={true}
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
                muiTableBodyCellProps = {(cell) => ({
                  sx: {
                    'color': 'red',
                  },
                })}
              />
            </ThemeProvider>
          </Box>
        )}

      </Flex>
    </>
  );
};
