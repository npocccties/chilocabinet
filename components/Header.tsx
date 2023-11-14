import { HamburgerIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import React, { useCallback } from "react";

import { 
    AppHeader,
    AppPage,
    AppEvent,
    useAppState_Page,
} from "@/share/store/appState/main";

type Props = {
  onOpen: () => void;
};

export const Header: React.FC<Props> = ({ onOpen }) => {

  const [appStatePage, setAppStatePage] = useAppState_Page(); 

  const StyleHeaderTitle = {
    width: "40%",
    fontFamily: 'Meiryo',
    fontSize: "18px",
    fontWeight: "bold",
    textDecoration: "none"
  } as const;

  const StyleSelectorOn = {
    fontFamily: 'Meiryo',
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "blue"
  } as const; 

  const StyleSelectorOff = {
    fontFamily: 'Meiryo',
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "black"
  } as const;

  const StyleSelector1 = ((appStatePage.header == AppHeader.UserList) ? StyleSelectorOn : StyleSelectorOff);
  const StyleSelector2 = ((appStatePage.header == AppHeader.BadgeList) ? StyleSelectorOn : StyleSelectorOff);

  return (
    <Box as="header" position={"fixed"} w={"100%"} zIndex={1000}>
      <Flex
        h={"48px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        backgroundColor={"gray.200"}
        p={{ base: 4 }}
      >
        <Box style={StyleHeaderTitle}>
          バッジキャビネット
        </Box>
        <Box style={StyleSelector1} onClick={() => setAppStatePage(HeaderOnClick1)}>
          学習者一覧
        </Box>  
        <Box style={StyleSelector2} onClick={() => setAppStatePage(HeaderOnClick2)}>
          能力バッジ一覧
        </Box>
        <Box style={StyleSelectorOff}>
          ヘルプ<ExternalLinkIcon/>
        </Box>
        <Flex gap={"16px"}></Flex>
      </Flex>
    </Box>
  );
}




const HeaderOnClick1 = (state) => {
  if(state.lock || state.header == AppHeader.UserList) {
    return state;
  }
  const update = {...state};
  update.header = AppHeader.UserList;
  update.page = AppPage.UserList;
  update.event = AppEvent.OpenPage;
  update.lock = true;
  return update;
}





const HeaderOnClick2 = (state) => {
  if(state.lock || state.header == AppHeader.BadgeList) {
    return state;
  }
  const update = {...state};
  update.header = AppHeader.BadgeList;
  update.page = AppPage.BadgeList;
  update.event = AppEvent.OpenPage;
  update.lock = true;
  return update;
}

