import axios from "axios";

import { api } from "../api";

import { BadgeDetailState } from "@/share/store/badgeDetail/types";

export const useBadgeDetailApi = async (vcId: string) => {
  const apiPath = api.v1.getVcDetail;

  if (!vcId) return { data: undefined };

  const { data } = await axios.get<BadgeDetailState>(`${apiPath}?badge_vc_id=${vcId}`);

  return { data };
};
