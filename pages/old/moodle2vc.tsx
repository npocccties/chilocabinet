// pages/Login.tsx
// import '../login.css'
import { WarningIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Heading,
  Text,
  FormLabel,
  Flex,
  Input,
  Button,
  FormControl,
  Box,
  List,
  ListItem,
  ListIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Spinner,
} from "@chakra-ui/react";
import ION from "@decentralized-identity/ion-tools";
import axios from "axios";

import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { Metatag } from "../../components/Metatag";
import { LOCAL_STORAGE_VC_REQUEST_KEY } from "../../configs/constants";
import { proxyHttpRequest } from "../../lib/http";
import { getProtectedHeaderFromVCRequest, getRequestFromVCRequest, getRequestUrlFromUrlMessage } from "../../lib/utils";
import { IfBadgeInfo } from "../../types/BadgeInfo";
import { QRCodeStatus, RequestStatus } from "../../types/status";

import type { NextPage } from "next";

const MoodleToVC: NextPage = () => {
  //export default function HookForm() {
  const router = useRouter();
  const [requestStatus, setRequestStatus] = React.useState<RequestStatus>("waiting");

  const [qrCodeStatus, setQrCodeStatus] = React.useState<QRCodeStatus>("none");

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  //  const [badgeList, setBadgeList] = React.useState("");
  const [badgeList, setBadgeList] = React.useState<IfBadgeInfo[]>();

  const [email, setEmail] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [pin, setPin] = React.useState("");

  const isUsernameError = username === "";
  const isPasswordError = password === "";

  const handleClick = () => {
    setUsername("");
    setPassword("");
  };

  const myBadgesListTr = (badgeList: IfBadgeInfo[]) => {
    const memberList = badgeList.map((badge, index: number) => {
      const dateTime = new Date(badge.timecreated * 1000);
      return (
        <Tr key={index} textAlign="left">
          <Td>{index + 1}</Td>
          <Td>
            {/* <a href="#" onClick={() => convertOpenBadgeToVC(badge)}>
              {badge.name}
            </a> */}
            <Link color="teal.500" href="#" onClick={() => convertOpenBadgeToVC4clearInterval(badge)}>
              {badge.name}
            </Link>
          </Td>
          <Td>{badge.description}</Td>{" "}
          <Td>
            {" "}
            {dateTime.getFullYear()}/{dateTime.getMonth() + 1}/{dateTime.getDate()}
          </Td>
        </Tr>
      );
    });

    return memberList;
  };

  const getMyBadges = async () => {
    setRequestStatus("loading");

    axios
      .post("/api/moodle/my-openbadges", {
        username,
        password,
      })
      .then(function ({ data }) {
        const { badgeList } = data;
        console.log(`Return : your badges count =[${badgeList.length} ]`);
        // for (let i = 0; i < badgeList.length; i++) {
        //   console.log(`badges[${i}] ${JSON.stringify(badgeList[i])}`);
        // }
        setBadgeList(badgeList);
        setRequestStatus("requested");
      })
      .catch(function (err) {
        console.error(err);
        setRequestStatus("failed");
      });
  };

  const convertOpenBadgeToVC = async (badge: IfBadgeInfo) => {
    console.log(`convertOpenBadgeToVC:uniquehash=${badge.uniquehash} email=${badge.email}`);
    setRequestStatus("loading");
    // let intervalObj;
    axios
      .get(`/api/moodle/${badge.uniquehash}?email=${badge.email}`)
      .then(function ({ data }) {
        const { url, pin, sessionId } = data;
        setUrl(url);
        setPin(pin);
        console.log("URL=", url);

        setRequestStatus("requested");
        setQrCodeStatus("waiting");
        const intervalMs = 5000;
        const intervalObj = setInterval(() => {
          getIssuanceResponse(sessionId); // createIssuanceRequestのstate値
        }, intervalMs);
      })
      .catch(function (err) {
        console.error(err);
        // clearInterval(intervalObj);
        setRequestStatus("failed");
      });
  };

  // レスポンス処理
  const getIssuanceResponse = (state: string) => {
    console.log("issuance-response state =", state);
    axios.get("/api/issuer/issuance-response?state=" + state).then(function ({ data }) {
      const { status } = data;
      // console.log("issuance-resposen status =", status);
      if (status === "request_retrieved") {
        setQrCodeStatus("scanned");
      } else if (status === "issuance_successful") {
        setQrCodeStatus("success");
        window.location.href = "/"; // successしたらTopPageへ移動  //TODO Intervalのクリアが出来たらTOPPageへの移動はしない
      } else if (status === "issuance_error") {
        setQrCodeStatus("failed");
        setTimeout((window.location.href = "/"), 7000);
        // TODO ;Intervalのクリアをしたい
      }
    });
  };

  const convertOpenBadgeToVC4clearInterval = async (badge: IfBadgeInfo) => {
    console.log(`convertOpenBadgeToVC:uniquehash=${badge.uniquehash} email=${badge.email}`);
    setRequestStatus("loading");
    // let intervalObj;
    axios
      .get(`/api/moodle/${badge.uniquehash}?email=${badge.email}`)
      .then(function ({ data }) {
        const { url, pin, sessionId } = data;
        setUrl(url);
        // setUrl(url);
        setPin(pin);
        console.log("URL=", url);

        console.log("### sessionId=", sessionId);
        setRequestStatus("requested");
        setQrCodeStatus("waiting");
        scannedUrl(url);
        // const intervalMs = 5000;
        // const intervalObj = setInterval(() => {
        //   axios
        //     .get("/api/issuer/issuance-response?state=" + sessionId)
        //     .then(function ({ data }) {
        //       const { status } = data;
        //       console.log("issuance-resposen status =", status);
        //       if (status === "request_retrieved") {
        //         setQrCodeStatus("scanned");
        //       } else if (status === "issuance_successful") {
        //         setQrCodeStatus("success");
        //         clearInterval(intervalObj);
        //         window.location.href = "/"; // successしたらTopPageへ移動  //TODO Intervalのクリアが出来たらTOPPageへの移動はしない
        //       } else if (status === "issuance_error") {
        //         setQrCodeStatus("failed");
        //         setTimeout((window.location.href = "/"), 7000);
        //         clearInterval(intervalObj);
        //         // TODO ;Intervalのクリアをしたい
        //       }
        //     });
        // }, intervalMs);
      })
      .catch(function (err) {
        console.error(err);
        // clearInterval(intervalObj);
        setRequestStatus("failed");
      });
  };

  const scannedUrl = async (url: string) => {
    console.log("sccaned", url);
    if (!url) return;

    const requestUrl = getRequestUrlFromUrlMessage(url);
    let vcRequestInJwt = "";
    let vcRequestVerified = "";
    try {
      vcRequestInJwt = await proxyHttpRequest<string>("get", requestUrl);
      const header = getProtectedHeaderFromVCRequest(vcRequestInJwt);
      const issDIDDocument = await ION.resolve(header.kid);
      vcRequestVerified = await ION.verifyJws({
        jws: vcRequestInJwt,
        publicJwk: issDIDDocument.didDocument.verificationMethod[0].publicKeyJwk,
      });
    } catch (e) {
      console.log("error", e);
    }

    const { vcRequest } = getRequestFromVCRequest(vcRequestInJwt);

    localStorage.setItem(LOCAL_STORAGE_VC_REQUEST_KEY, JSON.stringify(vcRequest));

    router.push("/issue-request");
  };

  return (
    // <Layout textAlign="center" align="center">
    <Layout align="center" textAlign="center">
      <Metatag title="Get Open Badge from Moodle" description="Moodle" />
      <Heading
        textAlign={"center"}
        fontWeight={600}
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        lineHeight={"110%"}
      >
        Select Badges from Moodle
      </Heading>
      {/* <FormControl isInvalid={isEmailError}> */}
      {requestStatus == "waiting" && (
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          {/* <FormErrorMessage>email is required.</FormErrorMessage> */}
          {/* <FormControl isInvalid={isPasswordError}> */}
          {/* <FormLabel htmlFor="password">password</FormLabel> */}
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <FormErrorMessage>password is required.</FormErrorMessage> */}
          {/* </FormControl> */}
          {/*<Button mt={4} colorScheme="green" onClick={handleClick}> */}
          <Button mt={4} colorScheme="green" onClick={getMyBadges}>
            My OpenBadges List
          </Button>
        </FormControl>
      )}
      {requestStatus == "requested" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <Box>
            <Heading size="md">My Badges List,Click badge name to convert to VC</Heading>
          </Box>
          <br></br>
          {/* debug:check for status {qrCodeStatus}:{requestStatus} */}
          {qrCodeStatus === "none" && (
            <Box>
              <TableContainer>
                <Table variant="striped" colorScheme="green" size="lg">
                  <Thead>
                    <Tr bg="green.300">
                      <Th>No.</Th>
                      <Th minW="200">Name</Th>
                      <Th minW="200">description</Th>
                      <Th>createed</Th>
                    </Tr>
                  </Thead>
                  <Tbody>{myBadgesListTr(badgeList)}</Tbody>
                </Table>
              </TableContainer>
              {/* {myBadgesList(badgeList as IfBadgeInfo[])} */}
            </Box>
          )}
          {qrCodeStatus === "waiting" && (
            <Box p={"4px"}>
              <Flex mb="8" w="full" align={"center"} direction={"column"}>
                <CheckCircleIcon textAlign={"center"} mt="8" w={8} h={8} color="green.500" />
                <Text mb="4" align="center" fontSize="sm" mt="2">
                  OpenBadge verified
                </Text>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Input Email is verified with openbadge recipients
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    OpenBadge is validated by IMS Global OpanBadge Validator
                  </ListItem>
                </List>
              </Flex>
              <Flex w="full" align={"center"} direction={"column"}>
                <Text textAlign={"center"} fontSize="lg" mb="2" fontWeight={"bold"}>
                  MS Authenticator QR
                </Text>
                <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"></Spinner>
                {/* <QRCode value={url} /> */}
                <Text mt="8px" textAlign={"center"} fontSize="xl" fontWeight={"bold"}>
                  PIN: {pin}
                </Text>
              </Flex>
            </Box>
          )}
          {qrCodeStatus === "scanned" && (
            <Text fontSize="lg" mt="8">
              QR code scanned... PIN: {pin}
            </Text>
          )}
          {qrCodeStatus === "success" && (
            <Text fontSize="lg" mt="8">
              VC Issued, check MS Authenticator
            </Text>
          )}
          {qrCodeStatus === "failed" && (
            <Text fontSize="lg" mt="8">
              Issuance error occured, did you enter the wrong pincode? Please refresh the page and try again.
            </Text>
          )}
        </Flex>
      )}
      {requestStatus == "loading" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <Loading />
        </Flex>
      )}
      {requestStatus == "failed" && (
        <Flex w="full" align={"center"} direction={"column"}>
          <WarningIcon w={24} h={24} color="red.500" />
          <Text my="4">Verification failed </Text>
          <Button
            w="full"
            colorScheme="blue"
            my="4"
            onClick={() => setRequestStatus("waiting")}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Try again
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default MoodleToVC;
