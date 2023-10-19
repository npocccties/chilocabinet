import { CheckIcon } from "@chakra-ui/icons";
import {
  FormLabel,
  Flex,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Select,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";

import { Layout } from "../../components/Layout";
import { Metatag } from "../../components/Metatag";
import { IfBadgeInfo } from "../../types/BadgeInfo";

const CreateVC = () => {
  //export default function HookForm() {
  const [badgeList, setBadgeList] = React.useState<IfBadgeInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getMyBadges = async () => {
    const username = "testtest";
    const password = "1456";
    setIsLoading(true);
    const res = await axios.post("http://localhost:3000/api/temp/dummyBadge", {
      username,
      password,
    });
    console.log("res", res.data);

    const badgeData = res.data.badgeList;
    setIsLoading(false);
    setBadgeList(badgeData);
  };
  return (
    // <Layout textAlign="center" align="center">
    <Layout align="center" textAlign="center" maxW="2xl">
      <Metatag title="Get Open Badge from Moodle" description="Moodle" />
      <Flex w="full" justify={"space-between"} direction={"row"} alignItems={"flex-end"}>
        <Box>
          <FormLabel mb={2}>発行者選択</FormLabel>
          <Select w={{ sm: "64", base: "48" }}>
            <option value={"option1"}>大阪市教育委員会</option>
            <option value={"option2"}>大阪府教育委員会</option>
            <option value={"option3"}>堺市教育委員会</option>
          </Select>
        </Box>
        <Box>
          <Button colorScheme={"blue"} type="button" onClick={() => getMyBadges()} isLoading={isLoading}>
            <Text fontSize={{ sm: "md", base: "sm" }}>バッジデータ取得</Text>
          </Button>
        </Box>
      </Flex>
      <Flex w="full" align={"center"} direction={"column"}>
        <Box display={{ sm: "block", base: "none" }}>{myBadgesList(badgeList)}</Box>
        <Box display={{ sm: "none", base: "block" }}>{myBadgesListSp(badgeList)}</Box>
      </Flex>
    </Layout>
  );
};

export default CreateVC;

const myBadgesList = (badgeList: IfBadgeInfo[]) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="green" size="lg">
        <Thead>
          <Tr bg="green.300">
            <Th>取得済み</Th>
            <Th minW="200">バッジ名</Th>
            <Th minW="200">バッジ詳細</Th>
            <Th>発行日</Th>
          </Tr>
        </Thead>
        <Tbody>
          {badgeList?.map((badge, index: number) => {
            const dateTime = new Date(badge.timecreated * 1000);
            return (
              <Tr key={index} textAlign="left">
                {/** TODO: 取得済みであるかをチェック DBに登録されているバッジ名で比較する？ */}
                <Td>{badge.name === "コーステスト" && <CheckIcon />}</Td>
                <Td>
                  <Link
                    color="teal.500"
                    href="#"
                    onClick={
                      () => alert("わーーーー")
                      // convertOpenBadgeToVC4clearInterval(badge)
                    }
                  >
                    {badge.name}
                  </Link>
                </Td>
                <Td>{badge.description}</Td>
                <Td>
                  {dateTime.getFullYear()}/{dateTime.getMonth() + 1}/{dateTime.getDate()}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const myBadgesListSp = (badgeList: IfBadgeInfo[]) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="green" size="lg">
        <Thead>
          <Tr bg="green.300">
            <Th p={4}>取得済み</Th>
            <Th>バッジ名</Th>
            <Th>発行日</Th>
          </Tr>
        </Thead>
        <Tbody>
          {badgeList?.map((badge, index: number) => {
            const dateTime = new Date(badge.timecreated * 1000);
            return (
              <Tr key={index} textAlign="left">
                {/** TODO: 取得済みであるかをチェック DBに登録されているバッジ名で比較する？ */}
                <Td>{badge.name === "コーステスト" && <CheckIcon />}</Td>
                <Td>
                  <Link
                    color="teal.500"
                    href="#"
                    onClick={
                      () => alert("わーーーー")
                      // convertOpenBadgeToVC4clearInterval(badge)
                    }
                  >
                    {badge.name}
                  </Link>
                </Td>
                <Td>
                  {dateTime.getFullYear()}/{dateTime.getMonth() + 1}/{dateTime.getDate()}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

// export const getServerSideProps = async ({ context }) => {
//   const username = "testtest";
//   const password = "1456";
//   const res = await axios.post("http://localhost:3000/api/temp/dummyBadge", {
//     username,
//     password,
//   });
//   console.log("res", res.data);

//   const badgeData = res.data.badgeList;
//   return { props: { badgeData } };
// };
