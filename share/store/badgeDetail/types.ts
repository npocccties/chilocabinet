import { BadgeDetail } from "@/types/data";

export type BadgeDetailState = BadgeDetail;

export type BadgeDetailGetters = {
  useBadgeDetail: () => BadgeDetailState;
};

export type BadgeDetailActions = {
  useFetchBadgeDetail: () => {
    fetchBadgeDetail: (vsId: string) => void;
  };
};
