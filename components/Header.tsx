import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Spacer } from "@chakra-ui/react";
import React from "react";

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

  const StyleColor = {
    headerBackGround: "gray.200",
  }

  const StyleHeaderTitle = {
    marginRight: "20px",
    marginLeft: "20px",
    fontFamily: 'Meiryo',
    fontSize: "18px",
    fontWeight: "bold",
    textDecoration: "none"
  } as const;

  const StyleHeaderSelectorOn = {
    marginRight: "20px",
    marginLeft: "20px",
    fontFamily: 'Meiryo',
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "blue"
  } as const; 

  const StyleHeaderSelectorOff = {
    marginRight: "20px",
    marginLeft: "20px",
    fontFamily: 'Meiryo',
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "black"
  } as const;

  return (
    <Box as="header" position={"fixed"} w={"100%"} zIndex={1000}>
      <Flex
        h={"48px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        backgroundColor={StyleColor.headerBackGround}
        p={{base: 4}}
      >
        <Box style={StyleHeaderTitle}>
          バッジキャビネット
        </Box>
        <Spacer />
        { (appStatePage.header == AppHeader.UserList) ?
          ( <Box style={StyleHeaderSelectorOn}>
              学習者一覧
            </Box>
          ) :
          ( <Box style={StyleHeaderSelectorOff}>
              <Link onClick={() => setAppStatePage(HeaderOnClick1)}>
                学習者一覧
              </Link>
            </Box>
          )
        }
        { (appStatePage.header == AppHeader.BadgeList) ?
          ( <Box style={StyleHeaderSelectorOn}>
              能力バッジ一覧
            </Box>
          ) :
          ( <Box style={StyleHeaderSelectorOff}>
              <Link onClick={() => setAppStatePage(HeaderOnClick2)}>
               能力バッジ一覧 
              </Link>
            </Box>
          )
        }
        <Box style={StyleHeaderSelectorOff}>
          <Link href={process.env.NEXT_PUBLIC_HELP_LINK} isExternal>
            ヘルプ<ExternalLinkIcon/>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

//ヘッダセレクタ1クリックハンドラ
//学習者一覧画面へ遷移

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

//ヘッダセレクタ2クリックハンドラ
//バッジ一覧画面へ遷移

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

