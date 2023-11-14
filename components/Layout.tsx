import { Flex, Box, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import React from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

export interface LayoutProps {
  children: React.ReactNode;
  maxW?: string;
  textAlign?: "center";
  align?: string;
}

export const Layout: React.VFC<LayoutProps> = ({ children, maxW, textAlign, align }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Header onOpen={onOpen} />
      <Box flex={1}>
        <Container maxW={maxW}>
          <Stack textAlign={textAlign} align={align} spacing={{ base: 8, md: 10 }} py={{ base: 20, md: 20 }}>
            {children}
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
};
