import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AppPage, useAppState_Page } from "@/share/store/appState/main";
import { CABINET_OPERATOR_TITLE } from "@/configs/constants";




export const NonePage = () => {

  const [appStatePage, setAppStatePage] = useAppState_Page();

  if ( appStatePage.page != AppPage.None ) {
    return ( <></> );
  }

  return (
    <>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        fontSize={"12px"}
        gap={"12px"}
      >
        <Box fontSize="16px" fontWeight={"bold"}>
          {CABINET_OPERATOR_TITLE}
        </Box>
        <Box fontSize="16px" fontWeight={"bold"}>
            初期画面(デバッグ)
        </Box>
      </Flex>
    </>
  );
};
