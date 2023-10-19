import { BadgeList } from "@/types/data";

export type BadgeListState = BadgeList;

export type BadgeListGetters = {
  useBadgeList: () => BadgeListState;
};

export type BadgeListActions = {
  useFetchBadgeList: () => {
    fetchBadgeList: () => void;
  };
  // useSetBadgeVc: () => {
  //   setBadge: (badge: BadgeVcs) => void;
  // };
};
