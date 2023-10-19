import { useRouter } from "next/router";
import React from "react";

import { WalletTemplate } from "../../components/old/templates/Wallet";
import { isExistKeyPair } from "../../lib/repository/keyPair";

const IndexPage: React.FC = () => {
  const router = useRouter();
  React.useEffect(() => {
    if (!isExistKeyPair()) {
      router.push("/createKey");
    }
  }, [router]);

  return <WalletTemplate />;
};

export default IndexPage;
