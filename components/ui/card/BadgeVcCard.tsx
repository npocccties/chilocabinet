import { Box, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import React from "react";

import { formatDateToJST } from "@/lib/date";

type Props = {
  image: string;
  name: string;
  issuer: string;
  issuedate: string;
};

// TODO: レスポンシブ対応
export const BadgeVcCard = ({ image, name, issuer, issuedate }: Props) => {
  // const { card } = storedVC.manifest.display;

  return (
    <Grid
      bg={"ffffff"}
      border={"2px"}
      borderColor={"gray.100"}
      rounded="2xl"
      templateRows={"repeat(3)"}
      templateColumns={"repeat(3, 1fr)"}
      p={{ base: 3, sm: 6 }}
    >
      <GridItem alignItems="center" rowSpan={3}>
        <Image h="24" w="24" fit={"cover"} src={"data:image/png;base64," + image} alt={"test"} />
      </GridItem>
      <GridItem px="2" py="1" alignItems="center" margin={"0"} colSpan={2}>
        <Text fontSize={{ sm: "xl", base: "md" }} fontWeight={"bold"}>
          {name}
        </Text>
      </GridItem>

      <GridItem px="2" py="1" alignItems="center" colSpan={2}>
        <Flex direction={"row"} alignItems={"center"}>
          <Text fontSize={{ base: "9px", sm: "xs" }}>発行者</Text>
          <Text fontSize={{ base: "12px", sm: "sm" }} ml={{ base: 1, sm: 2 }}>
            {issuer}
          </Text>
          <Text mx={{ base: 1, sm: 2 }}>/</Text>
          <Text fontSize={{ base: "9px", sm: "xs" }}>発行日</Text>
          <Text fontSize={{ base: "12px", sm: "sm" }} ml={{ base: 1, sm: 2 }}>
            {formatDateToJST(issuedate)}
          </Text>
        </Flex>
      </GridItem>

      <GridItem px="2" py="1" alignItems="center" colSpan={2}>
        <Flex direction={"row"} alignItems={"flex-start"}>
          <Box>
            <Text fontSize={"xs"}>バッジ提出状況</Text>
          </Box>
          <Flex ml={8} direction={"column"}>
            <Box w={{ base: 24, sm: 48 }} borderBottom={"1px"} borderColor={"gray.200"}>
              <Text fontSize={"xs"}>{formatDateToJST(issuedate)} ○○市</Text>
            </Box>
            <Box w={{ base: 24, sm: 48 }} borderBottom={"1px"} borderColor={"gray.200"}>
              <Text fontSize={"xs"}>{formatDateToJST(issuedate)} ○○市</Text>
            </Box>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};
