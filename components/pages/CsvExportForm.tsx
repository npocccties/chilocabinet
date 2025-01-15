import { dateSchema } from "@/lib/validation";
import {
  Grid,
  FormControl,
  Input,
  GridItem,
  FormLabel,
  Text,
  Select,
  CheckboxGroup,
  Stack,
  Checkbox,
  RadioGroup,
  Radio,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useCheckboxGroup,
  useRadioGroup,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAfter, isSameDay } from "date-fns";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { CsvExportFormData } from "../Data";

type Props = {
  cancelRef: React.MutableRefObject<undefined>;
  onCloseDialog: (yesno: boolean | null, formData?: {}) => Promise<void>;
  color1: string;
  color2: string;
  color2bg: string;
  initIndicatorCode: string;
  initTrainingFlags: string[];
  initTrainingAttribute: string;
  initStartDate: string;
  initEndDate: string;
  initTrainingThemes: string[];
  initEncoding: string;
};

export const CsvExportForm = ({ cancelRef, onCloseDialog, color1, color2, color2bg, initIndicatorCode, initTrainingFlags, initTrainingAttribute, initStartDate, initEndDate, initTrainingThemes, initEncoding }: Props) => {
  const [indicatorCode, setIndicatorCode] = useState<string>();
  const [indicatorCodeError, setIndicatorCodeError] = useState<string>();
  const [trainingAttribute, setTrainingAttribute] = useState<string>();
  const [trainingAttributeError, setTrainingAttributeError] = useState<string>();
  const [encodeError, setEncodeError] = useState<string>();

  const formSchema = z
    .object({
      startDate: dateSchema,
      endDate: dateSchema,
    })
    .refine(
      (args) => {
        const { startDate, endDate } = args;

        if (startDate === "" || endDate === "") {
          return true;
        }
        const startDateObject = new Date(startDate);
        const endDateObjext = new Date(endDate);

        if (isSameDay(startDateObject, endDateObjext)) {
          return true;
        }
        return isAfter(endDateObjext, startDateObject);
      },
      {
        message: "開始日より先の日付は選択できません。",
        path: ["startDate"],
      },
    );
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CsvExportFormData>({ resolver: zodResolver(formSchema) });
  const { startDate, endDate } = watch();
  const constTrainingFlags: string[] = [
    'リアルタイム・オンライン',
    '対面',
    'オンデマンド',
    'その他',
  ];
  const { value: trainingFlags, getCheckboxProps: getTrainingFlagsProps } = useCheckboxGroup({defaultValue: initTrainingFlags});
  const constTrainingThemes = [
    '教科指導関係',
    '生徒指導・教育相談関係',
    '特別支援教育関係',
    '健康・安全教育関係',
    '人権教育関係',
    '情報教育関係',
    'マネジメント関係',
    'その他',
  ];
  const { value: trainingThemes, getCheckboxProps: getTrainingThemesProps } = useCheckboxGroup({defaultValue: initTrainingThemes});
  const constEncoding = [
    'UTF-8',
    'Shift-JIS',
  ];
  const { value: encode, getRadioProps: getEncodeProps } = useRadioGroup({defaultValue: initEncoding});

  useEffect(() => {
    reset({
      trainingFlags: initTrainingFlags,
      trainingThemes: initTrainingThemes,
      encoding: initEncoding,
    });
  }, [reset, initTrainingFlags]);

  useEffect(() => {
    // 初期値をセット
    setIndicatorCode(initIndicatorCode);
    setTrainingAttribute(initTrainingAttribute);
  }, []); // 初回レンダリング時のみ実行

  const onSubmit = async (values: CsvExportFormData) => {
    if (trainingFlags.length == 0) {
      setIndicatorCodeError("研修フラグは少なくとも1つは選択してください。");
      return;
    }
    setIndicatorCodeError("");
    if (trainingThemes.length == 0) {
      setTrainingAttributeError("研修テーマは少なくとも1つは選択してください。");
      return;
    }
    setTrainingAttributeError("");
    if (encode.toString() == "") {
      setEncodeError("エンコードを選択してください。");
      return;
    }
    setEncodeError("");

      // 並び順に基づいてソート
    const sortedTrainingFlags = constTrainingFlags.filter((flag) =>
      trainingFlags.includes(flag)
    );
    const sortedTrainingThemes = constTrainingThemes.filter((theme) =>
      trainingThemes.includes(theme)
    );

    const param: CsvExportFormData = {
      indicatorCode: indicatorCode,
      trainingFlags: sortedTrainingFlags,
      trainingAttribute: trainingAttribute,
      startDate: values.startDate.toString().replace(/-/g, '/'),
      endDate: values.endDate.toString().replace(/-/g, '/'),
      trainingThemes: sortedTrainingThemes,
      encoding: encode.toString(),
    };
    console.log('param', param)
    onCloseDialog(true, param);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
      <AlertDialogContent hidden={false} maxWidth="700px">
          <AlertDialogHeader>
            バッジ提出者ダウンロード
          </AlertDialogHeader>
          <AlertDialogBody>
            対象のバッジ一覧を取得しCSVファイルに出力します。

            <FormControl>
              <Grid gridTemplateColumns={"repeat(2, 1fr)"} justifyContent={"center"} gap={{ base: 2, sm: 4 }}>
                <GridItem colSpan={2}>
                  <FormLabel htmlFor="indicatorCode" mt={4} fontWeight="bold">
                    指標一般コード
                  </FormLabel>
                  <Select id="indicatorCode" defaultValue={initIndicatorCode} onChange={(e) => setIndicatorCode(e.target.value)}>
                    <option value="指標">指標</option>
                    <option value="一般">一般</option>
                  </Select>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel htmlFor="trainingFlags" mt={4} fontWeight="bold">
                    研修フラグ（複数選択可）
                  </FormLabel>
                  <Controller
                    name="trainingFlags"
                    control={control}
                    render={({ field }) => (
                      <CheckboxGroup {...field} colorScheme="blue">
                        <Stack direction="row" wrap="wrap" spacing={6}>
                          {constTrainingFlags &&
                            constTrainingFlags.map((val) => (
                              <Checkbox {...getTrainingFlagsProps({ value: val })}>
                                {val}
                              </Checkbox>
                            ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                  />                  
                  <Text size="xs" mt={2} color={"red"}>
                    {indicatorCodeError}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel htmlFor="trainingAttribute" mt={4} fontWeight="bold">
                    研修属性コード
                  </FormLabel>
                  <Select id="trainingAttribute" defaultValue={initTrainingAttribute} onChange={(e) => setTrainingAttribute(e.target.value)}>
                    <option value="希望研修">希望研修</option>
                    <option value="悉皆研修">悉皆研修</option>
                    <option value="指名研修">指名研修</option>
                    <option value="推薦研修">推薦研修</option>
                    <option value="その他">その他</option>
                  </Select>
                </GridItem>
                <GridItem>
                  <FormLabel htmlFor="startDate" mt={4} fontWeight="bold">開始日</FormLabel>
                  <Input
                    id="startDate"
                    type="date"
                    defaultValue={initStartDate}
                    {...register("startDate", {
                      required: { value: true, message: "開始日は必須です。" }
                    })}
                  />
                  <Text size="xs" mt={2} color={"red"}>
                    {errors.startDate?.message}
                  </Text>
                </GridItem>
                <GridItem>
                  <FormLabel htmlFor="endDate" mt={4} fontWeight="bold">終了日</FormLabel>
                  <Input
                    id="endDate"
                    type="date"
                    defaultValue={initEndDate}
                    {...register("endDate", {
                      required: { value: true, message: "終了日は必須です。" }
                    })}
                  />
                  <Text size="xs" mt={2} color={"red"}>
                    {errors.endDate?.message}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel htmlFor="trainingThemes" mt={4} fontWeight="bold">
                    研修テーマ（複数選択可）
                  </FormLabel>
                  <Controller
                    name="trainingThemes"
                    control={control}
                    render={({ field }) => (
                      <CheckboxGroup {...field} colorScheme="blue">
                        <Stack direction="row" wrap="wrap" spacing={6}>
                          {constTrainingThemes &&
                            constTrainingThemes.map((val) => (
                              <Checkbox {...getTrainingThemesProps({ value: val })}>
                                {val}
                              </Checkbox>
                            ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                  />
                  <Text size="xs" mt={2} color={"red"}>
                    {trainingAttributeError}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel htmlFor="encoding" mt={4} fontWeight="bold">
                    エンコード
                  </FormLabel>
                  <Controller
                    name="encoding"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} >
                        <Stack direction="row" wrap="wrap" spacing={6}>
                          {constEncoding &&
                            constEncoding.map((val) => (
                              <Radio {...getEncodeProps({ value: val })}>
                                {val}
                              </Radio>
                            ))}
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                  <Text size="xs" mt={2} color={"red"}>
                    {encodeError}
                  </Text>
                </GridItem>
              </Grid>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme={color1} ref={cancelRef} onClick={() => onCloseDialog(false)}>
              キャンセル
            </Button>
            <Button type="submit" colorScheme={color2} backgroundColor={color2bg} ml={3} >
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </>
  );
};
