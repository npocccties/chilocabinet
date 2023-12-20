import React, { useState } from "react";
import { Button, useDisclosure } from "@chakra-ui/react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'

import {
  AppEvent,
  useAppState_Page,
  useAppState_Dialog,
} from "@/share/store/appState/main";

//<---- ダイアログ表示コンポーネント ---->

export const Dialog = () => {

  const [statePage, setStatePage] = useAppState_Page();
  const [stateDialog] = useAppState_Dialog();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [delayClosing, setDelayClosing] = useState(false);

  if(isOpen == false && statePage.event == AppEvent.ShowDialog) {
    onOpen();
  }

 const onCloseDialog = async (yesno: boolean | null) => {

    //DB削除時警告のためのダイアログ閉じるディレイ処理
    if(stateDialog.type == 1 && yesno === true && stateDialog.setResult != null) {

      setDelayClosing(true);
      setTimeout(() => {
        onClose();
        setDelayClosing(false);
        setStatePage({...statePage, event: null, lock: false});
        stateDialog.setResult({type: stateDialog.type, yesno: yesno});
      }, 1000);
    }

    //その他のダイアログ閉じる処理
    else {
      onClose();
      setStatePage({...statePage, event: null, lock: false});
      if(stateDialog.setResult != null) {
        stateDialog.setResult({type: stateDialog.type, yesno: yesno});
      }
    }
  }

  //<---- ダイアログ表示内容を設定 ---->

  let title = "タイトル";
  let msg = "メッセージ";
  let button1 = "no";
  let button2 = "yes"
  let color2 = "red";
  let useCloseButton = false;

  if(stateDialog.type == 1) {
    title = "登録情報の全削除";
    msg = "キャビネットに登録されている全ての学習者情報・提出された能力バッジ情報を削除します。削除してよろしいですか。";
    button1 = "キャンセル";
    button2 = "はい全削除します";
    color2 = "red";
  }

  if(stateDialog.type == 2) {
    title = "情報は復元できません（再確認）";
    msg = "キャビネットに登録されている全ての学習者情報・提出された能力バッジ情報を削除します。削除してよろしいですか。";
    button1 = "キャンセル";
    button2 = "はい全削除します";
    color2 = "red";
  }

  if(stateDialog.type == 3) {
    title = "バッジ提出者ダウンロード";
    msg = "対象のバッジ提出者一覧を取得しをCSVファイルに出力します。";
    button1 = "キャンセル";
    button2 = "OK";
    color2 = "teal";
  }

  if(stateDialog.type == 4) {
    title = "学習者一覧登録";
    msg = "学習者一覧をCSVファイルから登録します。" +
      "この操作を行うと現在登録してある学習者一覧は削除されます。" +
      "実行してよろしいですか。";
    button1 = "キャンセル";
    button2 = "OK";
    color2 = "teal";
  }
 
  if(stateDialog.type == 5) {
    title = "確認";
    msg = "学習者一覧を更新しました";
    button1 = null;
    button2 = null;
    useCloseButton = true;
  }

  if(stateDialog.type == 10) {
    title = stateDialog.title;
    msg = stateDialog.msg;
    button1 = null;
    button2 = null;
    useCloseButton = true;
  }

  //<---- ダイアログ表示 ---->

  return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={() => onCloseDialog(null)}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent hidden={delayClosing}>
          <AlertDialogHeader>
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton hidden={useCloseButton == false} />
          <AlertDialogBody>
            {msg}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button hidden={button1 == null} ref={cancelRef} onClick={() => onCloseDialog(false)}>
              {button1}
            </Button>
            <Button hidden={button2 == null} colorScheme={color2} ml={3} onClick={() => onCloseDialog(true)}>
              {button2}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
