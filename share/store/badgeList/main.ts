import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { BadgeListActions, BadgeListGetters, BadgeListState } from "@/share/store/badgeList/types";
import { RECOIL_ATOMS_KEYS } from "@/share/store/keys";
import { useBadgeListApi } from "@/share/usecases/badgeList/useBadgeListApi";

// state はそのまま export しない
const badgeListState = atom<BadgeListState>({
  key: RECOIL_ATOMS_KEYS.BADGE_LIST_STATE,
  default: {
    badgeList: {
      badgeVcList: [],
      dataCount: 0,
    },
  },
});

// Getter的役割
const useBadgeList = () => {
  return useRecoilValue(badgeListState);
};

export const badgeListGetters: BadgeListGetters = {
  useBadgeList,
};

// Action をカスタムフックとして定義
/**  badgeList の fetch */
const useFetchBadgeList = () => {
  const setState = useSetRecoilState(badgeListState);

  const fetchBadgeList = useCallback(async () => {
    const { data } = await useBadgeListApi();
    setState(() => {
      if (!data) {
        return {
          badgeList: {
            badgeVcList: [],
            dataCount: 0,
          },
        };
      }
      return data;
    });
  }, [setState]);

  return { fetchBadgeList };
};

// /** Badgeを追加 */
// const useSetBadgeVc = () => {
//   const setState = useSetRecoilState(badgeListState);

//   // 引数がある場合は、useCallbackの第一引数へ記述
//   const setBadge = useCallback(
//     (badge: BadgeVcs) => {
//       setState((prev) => {
//         return {
//           badgeList: {
//             badgeVcList: [...prev.badgeList.badgeVcList, badge],
//           },
//         };
//       });
//     },
//     [setState]
//   );

//   return { setBadge };
// };

export const badgeListActions: BadgeListActions = {
  useFetchBadgeList,
  // useSetBadgeVc,
};
