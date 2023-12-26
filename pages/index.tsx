import React from "react";

import type { NextPage } from "next";

import { Layout } from "@/components/Layout";
import { TopPage } from "@/components/pages/TopPage";
import { UserList } from "@/components/pages/UserList";
import { BadgeList } from "@/components/pages/BadgeList";
import { BadgeUserList } from "@/components/pages/BadgeUserList";
import { Dialog } from "@/components/pages/Dialog";

const Home: NextPage = () => {
  return (
    <Layout maxW="container.xl">
      <TopPage />
      <UserList />
      <BadgeList />
      <BadgeUserList />
      <Dialog />
    </Layout>
  );
};

export default Home;
