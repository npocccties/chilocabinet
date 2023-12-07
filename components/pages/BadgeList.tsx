import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay, Spinner } from "@chakra-ui/react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';

import { EXPORT_CSV_VER } from "@/configs/constants"

import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_BadgeList,
  useAppState_Dialog,
} from "@/share/store/appState/main";

//<---- 能力バッジ一覧表示コンポーネント ---->

export const BadgeList = () => {

  const [statePageOrg, setStatePage] = useAppState_Page();
  const [badgeListOrg, setBadgeList] = useAppState_BadgeList();
  const [stateDialogOrg, setStateDialog] = useAppState_Dialog();
  const [resultDialog, setResultDialog] = useState(null);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  let stateDialog = stateDialogOrg;
  let badgeList = badgeListOrg;
  let statePage = statePageOrg;

  let startComm = false;
  let startCommCsv = false;
  let startClear = false;

  //<---- 画面遷移時の処理 ---->

  if(statePage.page == AppPage.BadgeList && statePage.event == AppEvent.OpenPage) {
    startComm = true;
    statePage = {...statePage, event: AppEvent.CommGetBadgeList, lock: true};
    badgeList = { success: false, connecting: true, list: null };
  }

  //<---- ダイアログCLOSE時の処理 ---->

  if(statePage.page == AppPage.BadgeList && statePage.lock == false && resultDialog != null) {
    if(resultDialog.type == 1 && resultDialog.yesno === true) {
      stateDialog = {...stateDialog, type: 2, setResult: setResultDialog, title: null, msg: null};
      statePage = {...statePage, event: AppEvent.ShowDialog, lock: true}; 
    }
    else if(resultDialog.type == 2 && resultDialog.yesno === true) {
      statePage = {...statePage, event: AppEvent.CommClearDB, lock: true};
      startClear = true;
    }
    else if(resultDialog.type == 3 && resultDialog.yesno === true) {
      startCommCsv = true;
      statePage = {...statePage, event: AppEvent.CommExportCsv, lock: true};
    }
  }

  //<---- 能力バッジ取得通信終了時の状態遷移 ---->

  if(statePage.page == AppPage.BadgeList && startComm == false) {
    if(statePage.event == AppEvent.CommGetBadgeList && badgeList.connecting == false) {
      statePage = {...statePage, event: null, lock: false};
    }
  }

  //<---- レンダリング後の状態遷移・通信処理の起動 ---->

  useEffect(() => {
    if(resultDialog != null) {
      setResultDialog(null);
    }
    if(stateDialog != stateDialogOrg) {
      setStateDialog(stateDialog);
    }
    if(badgeList != badgeListOrg) {
      setBadgeList(badgeList);
    }
    if(statePage != statePageOrg){
      setStatePage(statePage);
    }

    //<---- バッジ一覧取得処理 ---->

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

    //<---- DB全削除処理 ---->

    if(startClear == true) {
      const formdata = {
        parameter_clear_db_ok: "Clear DB OK",
      };

      const headerdata = {
        headers: {
          Accept: "application/json",
        },
      };

      axios.post<any>('/api/v1/cleardb', formdata, headerdata)
      .then((resp) => {
        //console.log(resp);
        console.log("DBクリア成功");

        statePage = {...statePage, event: AppEvent.OpenPage, lock: true};
        setStatePage(statePage);
      })
      .catch((err) => {
        console.log(err);
        console.log("DBクリア失敗");

        statePage = {...statePage, event: null, lock: false};
        setStatePage(statePage);
      });
    }

    //<-- バッジ提出者一覧取得(CSV出力用) -->

    if(startCommCsv == true && Object.keys(rowSelection).length <= 0) {
      statePage = {...statePage, event: null, lock: false};
      setStatePage(statePage);
    }
    else if(startCommCsv == true) {

      const badge_class_id = [];
      const keys = Object.keys(rowSelection);
   
      keys.forEach((key) => {
        try {
          const id = badgeList.list[key].badgeClassId;
          const idx = badge_class_id.length;
          badge_class_id[idx] = id;
        }
        catch(e){
          //no act
        }
      });

      console.log(badge_class_id);
 
      const formdata = {
        badge_class_id: badge_class_id, 
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

        console.log(resp.data);

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

  // <---- 表出力内容を作成 ---->

  const tableData = useMemo(() => {
      if(badgeList.list == null) {
        return null;
      }
      else {
        return badgeList.list.map(o => {
          let service = null;
          if(o.badgeClassId != null) {
            let m = o.badgeClassId.match(/^https?:\/\/([^/]+)(\/.*)?$/);
            if(m != null && m[1] != null) {
              service = m[1];
            }
            else {
              service = o.badgeClassId;
            }
          }

          return {
            name: o.badgeName,
            issuer: o.badgeIssuerName,
            count: ((o._count == null) ? null : o._count.userID),
            classid: o.badgeClassId,
            service: service, 
          };
        });
      }
    },
    [badgeList.list]
  );

  // <---- ハンドラ定義 提出者数セルクリック(バッジ別提出者一覧画面へ移動) ---->

  const onClick_moveBadgeUserList = (index) => {
    let classid = null;
    try {
      classid = tableData[index].classid;
    }catch(exp) { //no act
    }
 
    //console.log(`index=${index}, classid=${classid}`);

    if(classid != null && statePage.page == AppPage.BadgeList && statePage.lock == false) {
      statePage = {...statePage, page: AppPage.BadgeUserList, event: AppEvent.OpenPage, param: classid, };
      setStatePage(statePage);
    }
  }

  // <---- ハンドラ定義 DBクリアボタン押下 ---->

  const onClickClearDB = () => {
    if(statePage.page == AppPage.BadgeList && statePage.lock == false) {
      setStateDialog({...stateDialog, type: 1, title: null, msg: null, setResult: setResultDialog});
      setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    }
  }

  // <---- ハンドラCSVダウンロードボタン押下 ---->

  const onClickDownloadCsv = () => {
    if (rowSelection == null || Object.keys(rowSelection).length  === 0) {
      return;  //何も選択されていない場合は処理なし
    }
    else if(statePage.page == AppPage.BadgeList && statePage.lock == false) {
      setStateDialog({...stateDialog, type: 3, setResult: setResultDialog, title: null, msg: null});
      setStatePage({...statePage, event: AppEvent.ShowDialog, lock: true});
    }
  }

  //<---- 画面出力内容の設定 ---->

  let showTable = (tableData != null);
  let messageTxt = null;
  let useSpinner = false;
  let downloadButtonColor = 'gray.400';

  if ( statePage.page != AppPage.BadgeList) {
    return ( <></> );
  }

  if( startComm || badgeList.connecting == true || statePage.event == AppEvent.CommClearDB || statePage.event == AppEvent.CommExportCsv)  {
    useSpinner = true;
  }

  else if( badgeList.success == false || tableData == null ) {
    messageTxt = '＜データ取得失敗＞';
  }

  else if(rowSelection != null && Object.keys(rowSelection).length > 0) {
    downloadButtonColor = 'teal';
  }

  //<---- 画面出力 ---->

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
        { messageTxt == null ? (<></>) : (
          <Box m={[10,100]} fontWeight={"bold"} fontSize={"16px"}>
            {messageTxt}
          </Box>
        )}
        { useSpinner == false ? (<></>) :
          <Spinner m={[10,100]} thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        }
        { showTable == false ? (<></>) : (
          <Flex direction={"row"} alignItems={"center"} gap={"24pt"}>
            <Flex direction={"column"} alignItems={"center"} gap={"4pt"} maxWidth={"240px"}>
              <Box>
                登録した学習者情報・提出された能力バッジ情報全データをDBから削除します 
              </Box>
              <Button color={"white"} fontSize={"12px"} backgroundColor={"red"}
                onClick={onClickClearDB}
              >
                全て削除
              </Button>
            </Flex>
            <Box></Box>
            <Flex direction={"column"} alignItems={"center"} gap={"4pt"} maxWidth={"240px"}>
              <Box>
                チェックした能力バッジの提出者一覧をダウンロードします 
              </Box>
              <Button color={"white"} fontSize={"12px"} backgroundColor={downloadButtonColor}
                onClick={onClickDownloadCsv} 
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
                  { size: 400, header: '能力バッジ名', accessorKey: 'name', enableGlobalFilter: false },
                  { size: 300, header: '発行者', accessorKey: 'issuer', enableGlobalFilter: false },
                  { size: 400, header: '学習サービス', accessorKey: 'service', enableGlobalFilter: false },
                  { size: 200, header: '提出者数', accessorKey: 'count', enableGlobalFilter: false },
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
                enableFilters={false}
                enablePagination={false}
                enableRowSelection={(row) => row.original.count > 0}
                rowNumberMode={"original"}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableColumnFilters={false}
                enableHiding={false}
                enableColumnActions={true}
                initialState={{density: 'comfortable'}}
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
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
              />
            </ThemeProvider>
          </Box>
        )}
      </Flex>
    </>
  );
};
