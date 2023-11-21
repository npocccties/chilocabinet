import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay, Spinner } from "@chakra-ui/react";

import { CABINET_OPERATOR_TITLE } from "@/configs/constants";
import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_BadgeList,
} from "@/share/store/appState/main";




export const BadgeList = () => {

  let [statePage, setStatePage] = useAppState_Page();
  let [badgeList, setBadgeList] = useAppState_BadgeList();

  let pageAct = false;
  let startComm = false;

  if(statePage.page ==  AppPage.BadgeList && statePage.event == AppEvent.OpenPage) {
    pageAct = true;
    startComm = true;
    statePage = {...statePage, event: AppEvent.CommGetBadgeList, lock: true};
    badgeList = { success: false, connecting: true, list: null };
  }

  if(statePage.page == AppPage.BadgeList && startComm == false) {
    if(statePage.event == AppEvent.CommGetBadgeList && badgeList.connecting == false) {
      pageAct = true;
      statePage = {...statePage, event: null, lock: false};
    }
  }

  useEffect(() => {
    if(startComm) {
      setBadgeList(badgeList);
    }
    if(pageAct){
      setStatePage(statePage);
    }
  });

  if(startComm == true) {
    axios.get<any>('/api/v1/badgelist')
    .then((resp) => { 
      let update = {
        list: null,
        connecting: false,
        success: false,
      };

      if(resp.data != null && resp.data.list != null) {
        update = {
          list: resp.data.list,
          connecting: false,
          success: true,
        };
      }
      else {
         console.log("ERROR: コンポーネント(BadgeList) サーバデータ取得エラー(能力バッジ一覧情報)");
      }

      setBadgeList(update);
    })
    .catch((err) => {
      console.log("ERROR: コンポーネント(BadgeList) サーバデータ取得エラー(能力バッジ一覧情報)");
      console.log(err);

      let update = {
        list: null,
        connecting: false,
        success: false,
      };

      setBadgeList(update);
    });
  }

  const tableData = useMemo(() => {
      if(badgeList.list == null) {
        return null;
      }
      else {
        return badgeList.list.map(o => {
          return {
            name: o.badgeName,
            issuer: o.badgeIssuerName,
            count: ((o._count == null) ? null : o._count.userEMail),
            classid: o.badgeClassId,
          };
        });
      }
    },
    [badgeList.list]
  );




  const onClick_moveBadgeUserList = (index) => {
    let classid = null;
    try {
      classid = tableData[index].classid;
    }catch(exp) { //no act
    }
 
    console.log(`index=${index}, classid=${classid}`);

    if(classid != null && statePage.page == AppPage.BadgeList && statePage.lock == false) {
      statePage = {...statePage, page: AppPage.BadgeUserList, event: AppEvent.OpenPage, param: classid, };
      setStatePage(statePage);
    }
  }

  let showTable = (tableData != null);
  let messageTxt = null;
  let useSpinner = false;

  if ( statePage.page != AppPage.BadgeList) {
    return ( <></> );
  }

  if( startComm || badgeList.connecting == true ) {
    useSpinner = true;
  }

  else if( badgeList.success == false || tableData == null ) {
    messageTxt = '＜データ取得失敗＞';
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
          能力バッジ一覧
        </Box>
        { messageTxt == false ? (<></>) : (
          <Box fontWeight={"bold"} fontSize={"16px"}>
            {messageTxt}
          </Box>
        )}
        { useSpinner == false ? (<></>) :
          <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        }
        { showTable == false ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Flex direction={"column"} alignItems={"center"} gap={"4pt"} maxWidth={"240px"}>
              <Box>
                登録した学習者情報・提出された能力バッジ情報全データをDBから削除します 
              </Box>
              <Button color={"white"} fontSize={"12px"} backgroundColor={"red"}
                onClick={null}
              >
                全て削除
              </Button>
            </Flex>
            <Box></Box>
            <Flex direction={"column"} alignItems={"center"} gap={"4pt"} maxWidth={"240px"}>
              <Box>
                チェックした能力バッジの提出者一覧をダウンロードします 
              </Box>
              <Button color={"white"} fontSize={"12px"} backgroundColor={"teal"}
                onClick={null} 
              >
                CSVダウンロード 
              </Button>
            </Flex>
          </Flex>
        )}
        { (showTable == false) ? (<></>) : (
          <Box>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialReactTable
                columns={[
                  { minSize: 300, header: '能力バッジ名', accessorKey: 'name' },
                  { minSize: 300, header: '発行者', accessorKey: 'issuer' },
                  { minSize: 10, header: '提出者数', accessorKey: 'count' },
                ]}
                data={tableData == null ? [] : tableData}
                muiTableBodyCellProps={ (cell) => {
                  return cell.column.id != 'count' ? {} :
                  {
                    onClick: (event) => {
                      onClick_moveBadgeUserList(cell.row.id);
                    },
                    sx: {
                      'textDecoration': 'underline',
                      'color': 'blue',
                    },
                  }
                }}
                enableRowSelection={true}
                enableGlobalFilterModes
                rowNumberMode={"original"}
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
      </Flex>
    </>
  );
};
