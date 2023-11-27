import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Flex, Box, Button, ButtonGroup, Container, Stack, useDisclosure, Drawer, DrawerContent, DrawerOverlay, Spinner } from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import { CABINET_OPERATOR_TITLE } from "@/configs/constants";
import {
  AppPage,
  AppEvent,
  useAppState_Page,
  useAppState_BadgeList,
} from "@/share/store/appState/main";




export const Modal2 = () => {

  let [statePage, setStatePage] = useAppState_Page();
  let { isOpen, onOpen, onClose } = useDisclosure();

  if(statePage.page == AppPage.UserList && statePage.event == AppEvent.OpenPage) { 
    if(isOpen == false) {
      onOpen();
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            メッセージウィンドウサンプル
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
