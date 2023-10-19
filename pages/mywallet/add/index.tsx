import React from "react";

import { Layout } from "../../../components/Layout";
import { Metatag } from "../../../components/Metatag";
import { Add } from "../../../components/page/mywallet/Add";
import { SERVICE_DESCRITION, SERVICE_NAME } from "../../../configs";

const index = () => {
  // TODO: OrthrosでログインしたユーザーのID, 氏名を取得する
  return (
    <Layout maxW="xl">
      <Metatag title={SERVICE_NAME} description={SERVICE_DESCRITION} />
      <Add id={"xxxxxx-dddddd-yyyyyy"} name={"○○ 太郎"} />
    </Layout>
  );
};

export default index;
