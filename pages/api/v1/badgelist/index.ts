import type { NextApiRequest, NextApiResponse } from "next";

import {loggerError, loggerInfo, loggerDebug } from "@/lib/logger";
import prisma from "@/lib/prisma";

//<---- API 能力バッジ一覧情報取得・CSVエクスポート情報取得 ---->

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  loggerDebug(req.body);
  loggerInfo("API badgelist, get info start.");

  let groupResult = null;

  //<---- 提出されたバッジ一覧・カウント情報取得(学習者登録の有無は区別していない) ---->

  try {
    groupResult = await prisma.submittedBadges.groupBy({
      by: [
        'badgeClassId',
        'badgeName',
        'badgeIssuerName',
      ],
      _count: {
        _all: true,
        userID: true,      
      },
      orderBy: [
        { badgeIssuerName: 'asc' },
        { badgeName: 'asc' },
        { badgeClassId: 'asc' },
      ],
    });

    //<---- バッジ別に学習者登録されているを提出数を取得 ---->

    for(let i=0; i<groupResult.length; i++) {
      const idCount = await prisma.submittedBadges.findMany({
        select: {
          userID: true,
        },
        where: {
          badgeClassId: groupResult[i].badgeClassId,
          userIDInfo: {userID: {not: ''}},
        },
        distinct: ['userID'],
      });

      groupResult[i]._count.userID = idCount.length;
    }
  }
  catch(exp) {
    loggerError("ERROR: API badgelist, DB access exception.")
    loggerError(exp);
    loggerDebug(groupResult);
    groupResult = null;
  }

  if(groupResult == null) {
    res.status(500).json({ list: null, msg: "DB access error." });
  }
  else {
    loggerInfo("API badgelist, get info success.");
    res.status(200).json({list: groupResult, msg: null});
  }

  return;
}
