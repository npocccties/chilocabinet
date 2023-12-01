import React from "react";

import type { NextPage } from "next";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { UserList } from "@/components/pages/UserList";
import { BadgeList } from "@/components/pages/BadgeList";
import { BadgeUserList } from "@/components/pages/BadgeUserList";
import { Dialog } from "@/components/pages/Dialog";

import { SERVICE_NAME, SERVICE_DESCRITION } from "@/configs";

const Home: NextPage = () => {
  return (
    <Layout maxW="container.xl">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <UserList />
      <BadgeList />
      <BadgeUserList />
      <Dialog />
    </Layout>
  );
};

export default Home;
