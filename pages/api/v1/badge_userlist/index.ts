import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {loggerError, loggerInfo, loggerDebug } from "@/lib/logger";

//<---- API バッジ提出者一覧取得・CSVエクスポート情報取得 ---->

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  let badgeClassID;
  let exportFlg;
  let msg;

  loggerDebug(req.body);
  loggerInfo("API badge_userlist, start.");

  //<---- パラメータチェック ---->

  try {
    if(req.body.badge_class_id == null) {
      msg = "ERROR: param Badge classID is none.";
      loggerError("ERROR: API badgeUserList, param Badge classID is none.");
    }

    //CSVエクスポート情報要求時はexportフラグONを設定
    exportFlg = (req.body.export == true);
    badgeClassID = req.body.badge_class_id;

    if( (badgeClassID == null) ||
        (exportFlg == false && typeof(badgeClassID) != 'string') ||
        (exportFlg == true && Array.isArray(badgeClassID) == false) ||
        (exportFlg == true && badgeClassID.length == 0)
    ) {
      //適切なバッジクラスIDが設定されていない
      badgeClassID = null;
    }
    else if(exportFlg == true) {
      //CSVエクスポート用のパラメータチェック
      //バッジクラスIDが配列で渡される
      for(let i=0; i < badgeClassID.length; i++) {
        if(typeof(badgeClassID[i]) != 'string') {
          //適切なバッジクラスIDが設定されていない
          badgeClassID = null;
          break;
        }
      }
    }

    if(badgeClassID == null && msg == null) {
      msg = "ERROR: cannot parse, Badge classID.";
      loggerError("ERROR: API badgeUserList, cannot parese, Badge classID.");
    }
  }
  catch(exp) {
    msg = "ERROR: cannot parese, Badge classID.";
    loggerError("ERROR: API badgeUserList, cannot parese, Badge classID. Exception.");
    loggerError(exp)
  }

  if(msg != null) {
    //要求パラメータエラー応答
    res.status(400).json({
      list: null,
      listNotApp: null,
      exportData: null,
      msg: msg,
    });
    return;
  }

  if(exportFlg) {
    //CSVエクスポート用情報取得
    exportCsvBadgeUserList(badgeClassID, res);
  }
  else {
    //バッジ一覧画面表示用情報取得
    getBadgeUserList(badgeClassID, res);
  }

  return;
}

//<---- バッジ提出者一覧取得 ---->

async function getBadgeUserList( badgeClassID: string, res: NextApiResponse)
{
  let badgeName = null;
  let badgeUserList = null;
  let badgeUserListNoApp = null;

  try {
    loggerInfo(badgeClassID);

    const result = await prisma.submittedBadges.findMany({
      select: {
        userID: true,
        badgeName: true,
        userEMail: true,
        submittedAt: true,
        downloadedAt: true,
        userIDInfo: true,
      },
      where: {
        badgeClassId: badgeClassID,
      },
      orderBy: {
        submittedAt: 'desc',
      },
      distinct: ['userID'],
    });

    loggerDebug(result.toString());

    if(result.length >= 1) {
      badgeName = result[0].badgeName;
    }

    //クラスIDにマッチするバッジ名が取得できない場合要求エラーとする
    if(badgeName == null) {
      res.status(400).json({
        list: null,
        listNotApp: null,
        badgeName: null,
        msg: "ERROR: Missing badge specified."
      });
      return;
    }

    //DB取得結果から学習者リスト登録者のみ抽出
    badgeUserList = result.map( o => {
      if(o.userIDInfo == null) {
        //配列から削除
        return null;
      }
      else {
        return {
          userID: o.userID,
          userName: o.userIDInfo.userName,
          userEMail: o.userEMail,
          submittedAt: o.submittedAt == null ? null : o.submittedAt.toISOString(),
          downloadedAt: o.downloadedAt == null ? null : o.downloadedAt.toISOString(),
        };
      }
    }).filter(Boolean);    // undifinedのデータは出力に含めない

    //DB取得結果から学習者リスト未登録者のみ抽出
    badgeUserListNoApp = result.map( o => {
      if(o.userIDInfo == null) {
        return {
          userID: o.userID,
          userEMail: o.userEMail,
          submittedAt: o.submittedAt == null ? null : o.submittedAt.toISOString(),
        };
      }
      else {
        //配列から削除
        return null;
      };
    }).filter(Boolean);    // undifinedのデータは出力に含めない
  }
  catch(exp) {
    loggerError("ERROR: API badgeUserList, DB access fail.");
    loggerError(exp);
  };

  if(badgeName == null || badgeUserList == null || badgeUserListNoApp == null) {
    res.status(500).json({
      list: badgeUserList,
      listNotApp: badgeUserListNoApp,
      badgeName: badgeName,
      msg: "ERROR: DB access fail."
    });
  }
  else {
    //正常終了
    res.status(200).json({
      badgeName: badgeName,
      list: badgeUserList,
      listNotApp: badgeUserListNoApp,
      msg: null
    });
  }

  return;  
}

//<---- バッジ提出者一覧CSVエクスポート情報取得 ---->

async function exportCsvBadgeUserList(badgeClassID: string[], res: NextApiResponse)
{
  //現在時刻取得
  const JST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
  const  nowTime = new Date();
  const nowTimeJst =  new Date(nowTime.getTime() + JST_OFFSET);

  let output = [];
  let exp;
  let ng = false;

  try {
    let dbResult1;
    let dbResult2;

    //パラメータ配列の数ループ
    for(let i=0; i<badgeClassID.length; i++) {
      dbResult1 = null;
      dbResult2 = null;

      loggerInfo(badgeClassID[i]);
 
      try {
        [dbResult1, dbResult2] = await prisma.$transaction([
          //CSVエクスポートするバッジ提出情報はダウンロード日時を記録する
          prisma.submittedBadges.updateMany({
            data: {
              downloadedAt: nowTimeJst, 
            },
            where: {
              badgeClassId: badgeClassID[i],
            },
          }),
          //CSVエクスポート情報を取得
          prisma.submittedBadges.findMany({
            select: {
              userID: true,
              userEMail: true,
              badgeName: true,
              badgeDescription: true,
              badgeIssuerName: true,
              badgeIssuedOn: true,
              downloadedAt: true,
            },
            where: {
              badgeClassId: badgeClassID[i],
              userIDInfo: {userID: {not: ''}},              
            },
            orderBy: {
              submittedAt: 'desc',
            },
            distinct: ['userID'],
          }),
        ]);

        loggerDebug(dbResult1);
        loggerDebug(dbResult2);
      }
      catch(e) {
        exp = e;
        ng = true;
        loggerError("ERROR: API badge_userlist, get export CSV info, DB access Fail.");
        loggerError(e);
      }

      if(dbResult2 == null) {
        ng = true;
        break;
      }
      else {
        //DB取得情報を応答用配列に追加
        output = output.concat(dbResult2);
      }
    }

    if(ng == false) {
      output = output.map((badge) => {
        if(badge.badgeIssuedOn != null) {
          //現在日時の文字列書式をCSV出力用に変換
          const date = badge.badgeIssuedOn;
          const dateStr = `${date.getFullYear().toString()}/` +
              `${(date.getMonth()+1).toString().padStart(2,'0')}/` +
              `${date.getDate().toString().padStart(2,'0')} ` +
              `${date.getHours().toString().padStart(2,'0')}:` +
              `${date.getMinutes().toString().padStart(2,'0')}:` +
              `${date.getSeconds().toString().padStart(2,'0')}`;

          return {...badge, badgeIssuedOn: dateStr};
        }
        else {
          return badge;
        } 
      });

      //正常処理終了
      res.status(200).json({
        exportData: output,
        msg: null,
      });
      return;
    }
  }
  catch(e) {
    exp = e;
    ng = true;
    loggerError("ERROR: API badge_userlist, get export CSV info, parse time string Fail.");
    loggerError(e);
  }

  if(ng == true) {
    res.status(500).json({
      exportData: null,
      msg: `ERROR: DB access fail,\r\nException = ` + exp,
    });
  }

  return;
}
