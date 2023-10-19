import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { BadgeDetailActions, BadgeDetailGetters, BadgeDetailState } from "@/share/store/badgeDetail/types";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import { useBadgeDetailApi } from "@/share/usecases/badgeDetail/useBadgeDetailApi";

const badgeDetailState = atom<BadgeDetailState>({
  key: RECOIL_ATOMS_KEYS.BADGE_DETAIL_STATE,
  default: {
    badgeVc: undefined,
    submissions: undefined,
  },
});

// Getter的役割
const useBadgeDetail = () => {
  return useRecoilValue(badgeDetailState);
};

export const badgeDetailGetters: BadgeDetailGetters = {
  useBadgeDetail,
};

/**  badgeDetail の fetch */
const useFetchBadgeDetail = () => {
  const setState = useSetRecoilState(badgeDetailState);

  const fetchBadgeDetail = useCallback(
    async (vcId: string) => {
      const { data } = await useBadgeDetailApi(vcId);
      setState(() => {
        if (!data) {
          return {
            badgeVc: undefined,
            submissions: undefined,
          };
        }
        return data;
      });
    },
    [setState],
  );

  return { fetchBadgeDetail };
};

export const badgeDetailActions: BadgeDetailActions = {
  useFetchBadgeDetail,
};
