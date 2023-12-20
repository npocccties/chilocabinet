import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {loggerError, loggerInfo, loggerDebug } from "@/lib/logger";

//<---- DB全削除API ---->

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  try {
    loggerDebug(req.body);
    loggerInfo("API cleardb, start.");

    //パラメータチェック
    if(req.body.parameter_clear_db_ok === 'Clear DB OK') {

      //テーブル削除操作
      try {
        const [dbResult1, dbResult2] = await prisma.$transaction([
          prisma.users.deleteMany({}),
          prisma.submittedBadges.deleteMany({}),
        ]);

        loggerDebug(dbResult1.toString());
        loggerDebug(dbResult2.toString());

        res.status(200).json({});
      }
      catch(exp) {
        //DB操作時例外
        loggerError("ERROR: API cleardb, DB proc Exception.");
        loggerError(exp);
        res.status(500).json({ error: { errorMessage: "ERROR: DB access error.", detail: exp } });
      };
    }
    else { 
      //削除完了
      res.status(400).json({ error: { errorMessage: "ERROR: Request prameter error."} });
      loggerInfo("API cleardb, success.");
    }
  }
  catch(exp) {
    //その他の例外
    loggerError("ERROR: API cleardb, Exception.");
    loggerError(exp);
    res.status(500).json({ error: { errorMessage: "ERROR: Server error.", detail: exp } });
  }

  return;
}

