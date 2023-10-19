import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { BadgeDetail } from "@/types/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse<BadgeDetail>) {
  console.log("server id", req.query.badge_vc_id);
  // TODO: badge_vc_idからbadges_idを取得し、データをもとに知識バッジを取得
  const badgeInfo = await axios.get(
    `https://okutep.osaka-kyoiku.ac.jp/api/v1/badges/?badges_ids=${30}&badges_type=wisdom`,
  );

  const knowledge_badges_list = badgeInfo.data[0].detail.knowledge_badges_list;
  const knowledge_badges = await axios.get(
    `https://okutep.osaka-kyoiku.ac.jp/api/v1/badges/?badges_ids=${knowledge_badges_list}&badges_type=knowledge`,
  );
  console.log("knowledge_badges_list", knowledge_badges);

  const [badgeVcs, submissions] = await Promise.all([
    prisma.badge_vcs.findUnique({
      where: {
        badge_vc_id: Number(req.query.badge_vc_id),
      },
    }),
    prisma.submissions.findMany({
      where: {
        badge_vc_id: Number(req.query.badge_vc_id),
      },
    }),
  ]);

  res.status(200).json({
    badgeVc: badgeVcs,
    submissions,
  });
}
