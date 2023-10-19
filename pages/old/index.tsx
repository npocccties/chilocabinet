import { Button, Text, Heading, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { Layout } from "../../components/Layout";
import { Metatag } from "../../components/Metatag";
import { SERVICE_NAME, SERVICE_DESCRITION } from "../../configs";
import { isExistKeyPair } from "../../lib/repository/keyPair";


import type { NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!isExistKeyPair()) {
      router.push("/create-key");
    }
  }, [router]);
  return (
    <Layout maxW="5xl" textAlign="center" align="center">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <Heading fontWeight={600} fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }} lineHeight={"110%"}>
        Verifiable Credential meets{" "}
        <Text as={"span"} color={"green.400"}>
          OpenBadge
        </Text>
      </Heading>
      <Text color={"gray.500"} maxW={"3xl"}>
        {SERVICE_DESCRITION}
      </Text>
      <Stack spacing={8} direction={"row"}>
        <NextLink href="/moodle2vc" passHref>
          <Button as={"a"} rounded={"full"} px={6} colorScheme={"green"} bg={"green.400"} _hover={{ bg: "green.500" }}>
            Get My Badges from Moodle
          </Button>
        </NextLink>
        {/* 
        <NextLink href="/issue" passHref>
          <Button
            as={"a"}
            rounded={"full"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
          >
            Issue
          </Button>
        </NextLink>
      */}
        <NextLink href="/verify" passHref>
          <Button as={"a"} rounded={"full"} px={6} colorScheme={"green"} bg={"green.400"} _hover={{ bg: "green.500" }}>
            Verify
          </Button>
        </NextLink>
      </Stack>
    </Layout>
  );
};

export default Home;
