import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {loggerError, loggerWarn, loggerInfo, loggerDebug } from "@/lib/logger";

//<---- DB全削除API ---->

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  try {
    console.log(req.body);

    //パラメータチェック
    if(req.body.parameter_clear_db_ok === 'Clear DB OK') {

      //テーブル削除操作
      try {
        const [dbResult1, dbResult2] = await prisma.$transaction([
          prisma.users.deleteMany({}),
          prisma.submittedBadges.deleteMany({}),
        ]);

        console.log(dbResult1); 
        console.log(dbResult2);

        res.status(200).json({});
      }
      catch(exp) {
        //DB操作時例外
        console.log(exp);
        res.status(500).json({ error: { errorMessage: "ERROR: DB access error.", detail: exp } });
      };
    }
    else { 
      //削除完了
      res.status(400).json({ error: { errorMessage: "ERROR: Request prameter error."} });
    }
  }
  catch(exp) {
    //その他の例外
    console.log(exp);
    res.status(500).json({ error: { errorMessage: "ERROR: Server error.", detail: exp } });
  }

  return res;
}

