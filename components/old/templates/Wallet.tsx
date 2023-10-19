import React from "react";

import { Layout } from "../../Layout";
import { CredentialList } from "../organisms/CredentialList";

export const WalletTemplate: React.FC = () => {
  return (
    <Layout>
      <CredentialList />
    </Layout>
  );
};
