import { badge_vcs, mywallets, submissions } from "@prisma/client";

/**
 * Tables
 */
export type MyWallets = mywallets;
export type BadgeVcs = badge_vcs;
export type Submissions = submissions;

export type SearchFormItem = {
  badgeName: string;
  issuerName: string;
  issueDateTo: string;
  issueDateEnd: string;
  category: string;
};

export type BadgeList = {
  badgeList: {
    badgeVcList: BadgeVcs[];
    dataCount?: number;
  };
};

export type BadgeDetail = {
  badgeVc: BadgeVcs | undefined;
  submissions: Submissions[];
};
