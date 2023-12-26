import { Flex, Box, Button } from "@chakra-ui/react";

import {
  AppPage,
  AppHeader,
  AppEvent,
  useAppState_Page,
} from "@/share/store/appState/main";

//<-- 学習者一覧画面コンポーネント -->

export const TopPage = () => {

  const [statePage, setStatePage] = useAppState_Page();

  const openUserList = (state) => {
    if(state.lock && statePage.page != AppPage.TopPage) {
      return state;
    }
    const update = {...state};
    update.header = AppHeader.UserList;
    update.page = AppPage.UserList;
    update.event = AppEvent.OpenPage;
    update.lock = true;
    return update;
  };

  const openBadgeList = (state) => {
    if(state.lock  && statePage.page != AppPage.TopPage) {
      return state;
    }
    const update = {...state};
    update.header = AppHeader.BadgeList;
    update.page = AppPage.BadgeList;
    update.event = AppEvent.OpenPage;
    update.lock = true;
    return update;
  };

  //<---- 画面表示 ---->

  if (statePage.page != AppPage.TopPage) {
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
        <Box fontWeight={"bold"} fontSize={"22px"} m={7}>
          バッジキャビネット 
        </Box>
        <Box m={7}>
          <Button width={250} fontSize={"18px"} colorScheme={"gray"} onClick={() => setStatePage(openUserList)}>
            学習者一覧
          </Button>
        </Box>
        <Box m={7}>
          <Button width={250} fontSize={"18px"} colorScheme={"gray"} onClick={() => setStatePage(openBadgeList)}>
            能力バッジ一覧
          </Button>
        </Box>
      </Flex>
    </>
  );
}
