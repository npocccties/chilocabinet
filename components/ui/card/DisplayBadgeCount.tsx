import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  badgeCount: number;
};
// TODO: 提出数と取得数をPropsで受け取る
export const DisplayBadgeCount = ({ badgeCount }: Props) => {
  return (
    <Box border={"2px solid"} borderColor={"gray.200"} borderRadius={"2xl"} p={8}>
      <Grid templateColumns={"repeat(2, 1fr)"}>
        <GridItem>
          <Center>
            <Box as="span" textAlign={"left"}>
              バッジ
            </Box>
            <Box as="span" fontSize={"24px"} color={"blue"}>
              取得数
            </Box>
            <Box as="span" ml={4} fontSize={"32px"} color={"blue"}>
              {badgeCount}
            </Box>
          </Center>
        </GridItem>
        <GridItem>
          <Center>
            <Box as="span" textAlign={"left"}>
              バッジ
            </Box>
            <Box as="span" fontSize={"24px"} color={"skyblue"}>
              提出数
            </Box>
            <Box as="span" ml={4} fontSize={"32px"} color={"skyblue"}>
              3
            </Box>
          </Center>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <Center>
            <Accordion allowToggle>
              <AccordionItem border={"none"}>
                <AccordionButton pt={0} pb={0}>
                  <AccordionIcon />
                  <Box as="span" flex={"1"} textAlign={"left"}>
                    <Text fontSize={"sm"}>提出先別一覧</Text>
                  </Box>
                </AccordionButton>
                <AccordionPanel>
                  <Flex direction={"row"} alignItems={"flex-end"}>
                    <Text fontSize={"sm"}>○○市</Text>
                    <Text fontSize={"md"} color={"blue"}>
                      提出数
                    </Text>
                    <Text fontSize={"xl"} ml={2}>
                      3
                    </Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Center>
        </GridItem>
      </Grid>
    </Box>
  );
};
