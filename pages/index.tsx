import React from "react";

import type { NextPage } from "next";

import { Layout } from "@/components/Layout";
import { Metatag } from "@/components/Metatag";
import { UserList } from "@/components/page/UserList";
import { UserListNone } from "@/components/page/UserListNone";
import { BadgeList } from "@/components/page/BadgeList";
import { BadgeUserList } from "@/components/page/BadgeUserList";

//import { MyWaletVCList } from "@/components/page/mywallet/List";

import { SERVICE_NAME, SERVICE_DESCRITION } from "@/configs";

const Home: NextPage = () => {
  return (
    <Layout maxW="xl">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <UserList />
      <UserListNone />
      <BadgeList />
      <BadgeUserList />
    </Layout>
  );
};

export default Home;
