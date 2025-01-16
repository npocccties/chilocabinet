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
import React, { useEffect, useState } from "react";

import {
  AppEvent,
  useAppState_Page,
  useAppState_Dialog,
} from "@/share/store/appState/main";
import { CsvExportForm } from "./CsvExportForm";
import { CsvExportFormData } from "../Data";

//<---- ダイアログ表示コンポーネント ---->

export const Dialog = () => {

  const [statePage, setStatePage] = useAppState_Page();
  const [stateDialog] = useAppState_Dialog();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [delayClosing, setDelayClosing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [trainingFlags, setTrainingFlags] = useState<string[]>([]);
  const [trainingThemes, setTrainingThemes] = useState<string[]>([]);
  const [encoding, setEncoding] = useState<string>("Shift-JIS");
  const [indicatorCode, setIndicatorCode] = useState<string>();
  const [trainingAttribute, setTrainingAttribute] = useState<string>();
  
  if(isOpen == false && statePage.event == AppEvent.ShowDialog) {
    onOpen();
  }

  useEffect(() => {
    // Set the default date to the current date for start and end date inputs
    const today = new Date().toISOString().split("T")[0];
    if (!startDate || !endDate) {
      setStartDate(today);
      setEndDate(today);
    }
  }, []);

  const onCloseDialog = async (yesno: boolean | null, formData: any = {}) => {

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
      if(stateDialog.type == 3 && yesno === true && stateDialog.setResult != null) {
        const form: CsvExportFormData = formData;
        console.log('formData', form)
        setIndicatorCode(form.indicatorCode);
        setTrainingFlags(form.trainingFlags);
        setTrainingAttribute(form.trainingAttribute);
        setStartDate((form.startDate as string).replaceAll('/', '-'));
        setEndDate((form.endDate as string).replaceAll('/', '-'));
        setTrainingThemes(form.trainingThemes);
        setEncoding(form.encoding);
        stateDialog.setResult({type: stateDialog.type, yesno: yesno, formData: formData});
      }
    }
  }
  //<---- ダイアログ表示内容を設定 ---->

  let title = "タイトル";
  let msg = "メッセージ";
  let button1 = "no";
  let button2 = "yes";
  let color1 = "gray";
  let color2 = "primary";
  let color2bg = "primary.700";
  let useCloseButton = false;

  if(stateDialog.type == 1) {
    title = "登録情報の全削除";
    msg = "キャビネットに登録されている全ての学習者情報・提出された能力バッジ情報を削除します。削除してよろしいですか。";
    button1 = "キャンセル";
    button2 = "はい全削除します";
    color2 = "red";
    color2bg = "status.danger";
  }

  if(stateDialog.type == 2) {
    title = "情報は復元できません（再確認）";
    msg = "キャビネットに登録されている全ての学習者情報・提出された能力バッジ情報を削除します。削除してよろしいですか。";
    button1 = "キャンセル";
    button2 = "はい全削除します";
    color2 = "red";
    color2bg = "status.danger";
  }

  if(stateDialog.type == 3) {
    title = "バッジ提出者ダウンロード";
    msg = "対象のバッジ一覧を取得しCSVファイルに出力します。";
    button1 = "キャンセル";
    button2 = "OK";
  }

  if(stateDialog.type == 4) {
    title = "学習者一覧登録";
    msg = "学習者一覧をCSVファイルから登録します。" +
      "この操作を行うと現在登録してある学習者一覧は削除されます。" +
      "実行してよろしいですか。";
    button1 = "キャンセル";
    button2 = "OK";
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

        { stateDialog.type == 3 && (
          <CsvExportForm cancelRef={cancelRef} onCloseDialog={onCloseDialog} color1={color1} color2={color2} color2bg={color2bg}
          initIndicatorCode={indicatorCode} initTrainingFlags={trainingFlags} initTrainingThemes={trainingThemes}
          initStartDate={startDate} initEndDate={endDate} initTrainingAttribute={trainingAttribute} initEncoding={encoding} />
        )}
        { stateDialog.type != 3 && (
          <AlertDialogContent hidden={delayClosing}>
            <AlertDialogHeader>
              {title}
            </AlertDialogHeader>
            <AlertDialogCloseButton hidden={useCloseButton == false} />
            <AlertDialogBody>
              {msg}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button hidden={button1 == null} colorScheme={color1} ref={cancelRef} onClick={() => onCloseDialog(false)}>
                {button1}
              </Button>
              <Button hidden={button2 == null} colorScheme={color2} backgroundColor={color2bg} ml={3} onClick={() => onCloseDialog(true)}>
                {button2}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}

      </AlertDialog>
    </>
  );
}
