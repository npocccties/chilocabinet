import {
  Button,
  Grid,
  FormControl,
  FormLabel,
  Input,
  GridItem,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import React from "react";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

import { SearchFormItem } from "@/types/data";

type Props = {
  register: UseFormRegister<SearchFormItem>;
  handleSubmit: UseFormHandleSubmit<SearchFormItem, undefined>;
  isSubmitting: boolean;
};
export const SearchForm = ({ register, handleSubmit, isSubmitting }: Props) => {
  const onSubmit = (values) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2));
        resolve();
      }, 1000);
    });
  };

  return (
    <Box border={"2px solid"} borderColor={"gray.200"} borderRadius={"2xl"} overflow={"hidden"}>
      <Accordion allowToggle borderRadius={"2xl"}>
        <AccordionItem border={"none"}>
          <h2>
            <AccordionButton _expanded={{ bg: "gray.200", boxShadow: "none" }}>
              <AccordionIcon />
              <Box as="span" flex={"1"} textAlign={"left"}>
                検索
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
                  <GridItem colSpan={2}>
                    <FormLabel htmlFor="badgeName" mt={4}>
                      バッジ名
                    </FormLabel>
                    <Input id="badgeName" {...register("badgeName")} />
                  </GridItem>
                  <GridItem>
                    <FormLabel htmlFor="issueDateTo">発行日To</FormLabel>
                    <Input id="issueDateTo" type="date" {...register("issueDateTo")} />
                  </GridItem>
                  <GridItem>
                    <FormLabel htmlFor="issueDateEnd">発行日End</FormLabel>
                    <Input id="issueDateEnd" type="date" {...register("issueDateEnd")} />
                  </GridItem>
                  <GridItem></GridItem>
                  <GridItem>
                    <Button colorScheme={"teal"} mt={8} w={"100%"} isLoading={isSubmitting} type="submit">
                      検索
                    </Button>
                  </GridItem>
                </Grid>
              </FormControl>
            </form>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
