import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import React, { useCallback } from "react";

import { 
    useAppState,
    AppControlHeaderOnClick1,
    AppControlHeaderOnClick2,
} from "@/share/store/appState/main";

type Props = {
  onOpen: () => void;
};

export const Header: React.FC<Props> = ({ onOpen }) => {

  const [appState, setAppState] = useAppState();

  const StyleHeaderTitle = {
    width: "60%",
    fontFamily: 'Meiryo',
    fontSize: "24px",
    fontWeight: "bold",
    textDecoration: "none"
  } as const;

  const StyleSelectorOn = {
    fontFamily: 'Meiryo',
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
    color: "blue"
  } as const; 

  const StyleSelectorOff = {
    fontFamily: 'Meiryo',
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
    color: "black"
  } as const;

  const StyleSelector1 = 
      ((appState.viewPage == "UserList" || 
        appState.viewPage == "UserListNone") ? 
            StyleSelectorOn : 
            StyleSelectorOff);

  const StyleSelector2 = 
      ((appState.viewPage == "BadgeList" || 
        appState.viewPage == "BadgeUserList") ? 
           StyleSelectorOn : 
             StyleSelectorOff);

  return (
    <Box as="header" position={"fixed"} w={"100%"} zIndex={1000}>
      <Flex
        h={"64px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        backgroundColor={"gray.200"}
        p={{ base: 8 }}
      >
        <Box style={StyleHeaderTitle}>
          バッジキャビネット
        </Box>
        <Box style={StyleSelector1} onClick={() => setAppState(AppControlHeaderOnClick1)}>
          学習者一覧
        </Box>  
        <Box style={StyleSelector2} onClick={() => setAppState(AppControlHeaderOnClick2)}>
          能力バッジ一覧
        </Box>
        <Flex gap={"16px"}></Flex>
      </Flex>
    </Box>
  );
};
