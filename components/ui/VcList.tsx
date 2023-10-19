import { Box, Grid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { badgeListGetters } from "@/share/store/badgeList/main";
import { BadgeVcCard } from "@/components/ui/card/BadgeVcCard";

export const VcList = () => {
  const { badgeList } = badgeListGetters.useBadgeList();
  const router = useRouter();

  return (
    <>
      {badgeList?.badgeVcList?.map((item, idx) => {
        const vcPayload = JSON.parse(item.vc_data_payload);
        const image = vcPayload.vc.credentialSubject.photo;
        return (
          <Grid gap={4} key={idx}>
            <Box
              cursor={"pointer"}
              _hover={{ opacity: 0.9, transition: "0.2s" }}
              onClick={() => {
                router.push(`/detail/${item.badge_vc_id}`);
              }}
            >
              <BadgeVcCard
                image={image}
                name={item.badge_name}
                issuer={item.badge_issuer_name}
                issuedate={item.badge_issuedon.toString()}
              />
            </Box>
          </Grid>
        );
      })}
    </>
  );
};
