import { Flex, Box, BoxProps, CloseButton, FlexProps } from "@chakra-ui/react";
import React from "react";


const LinkItems: Array<{ name: string; link?: string }> = [
  { name: "マイウォレット", link: "/" },
  { name: "バッジ取り込み", link: "/badge/list" },
  { name: "分析" },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg="gray.200"
      borderRight="1px"
      borderRightColor="gray.300"
      w="100%"
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="flex-end">
        <CloseButton onClick={onClose} />
      </Flex>
      {LinkItems.map((item) => (
        <NavItem key={item.name} link={item.link}>
          {item.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  children: React.ReactNode;
  link?: string;
}

const NavItem = ({ children, link, ...rest }: NavItemProps) => {
  return (
    <Box as="a" href={link ? link : "#"} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="2"
        mx="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "gray.400",
          color: "white",
        }}
        {...rest}
      >
        {children}
      </Flex>
    </Box>
  );
};
