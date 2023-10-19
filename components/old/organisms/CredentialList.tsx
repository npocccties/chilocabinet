import { Box, Grid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { useStoredVCs } from "../../../hooks/useStoredVCs";
import { PlainCard } from "../../ui/card/PlainCard";

export const CredentialList: React.FC = () => {
  const router = useRouter();
  const { storedVCs } = useStoredVCs();
  return (
    <Grid gap={4}>
      {storedVCs.map((storedVC) => {
        return (
          <Box key={storedVC.id}>
            <Box
              cursor={"pointer"}
              _hover={{ opacity: 0.9, transition: "0.2s" }}
              onClick={() => {
                router.push({
                  pathname: "/credential-detail",
                  query: {
                    vcID: storedVC.id,
                  },
                });
              }}
            >
              <PlainCard storedVC={storedVC} />
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

export default CredentialList;
