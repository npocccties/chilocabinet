import { Flex, Box, Button, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DisplayBadgeCount } from "@/components/ui/card/DisplayBadgeCount";
import { SearchForm } from "@/components/ui/SearchForm";
import { VcList } from "@/components/ui/VcList";
import { SearchFormItem } from "@/types/data";
import { badgeListActions } from "@/share/store/badgeList/main";

import { useAppState, useAppValue, useSetAppState } from "@/share/store/appState/main";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";

import { CABINET_OPERATOR_TITLE } from "@/configs/constants";

export const UserListNone = () => {

  const appState = useAppValue();

  if ( appState.viewPage != "UserListNone" ) {
    return ( <></> );
  }

  return (
    <>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        fontSize={"24px"}
        gap={"24px"}
      >
        <Box fontWeight={"bold"}>
          {CABINET_OPERATOR_TITLE + "　学習者一覧"}
        </Box>
        <Box>
          <Button color={"white"} backgroundColor={"teal"}>
            emailリストアップロード
          </Button>
        </Box>
            <Box fontWeight={"bold"}>
            学習者が登録されていません
        </Box>
      </Flex>
    </>
  );
};
