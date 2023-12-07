import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {loggerError, loggerWarn, loggerInfo, loggerDebug } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  let badgeClassID;
  let exportFlg;
  let msg;

  try {
    if(req.body.badge_class_id == null) {
      msg = "ERROR: param Badge classID is none.";
      console.log("ERROR: API badgeUserList, param Badge classID is none.");
    }

    exportFlg = (req.body.export == true);
    badgeClassID = req.body.badge_class_id;

    if( (badgeClassID == null) ||
        (exportFlg == false && typeof(badgeClassID) != 'string') ||
        (exportFlg == true && Array.isArray(badgeClassID) == false) ||
        (exportFlg == true && badgeClassID.length == 0)
    ) {
      badgeClassID = null;
    }
    else if(exportFlg == true) {
      for(let i=0; i < badgeClassID.length; i++) {
        if(typeof(badgeClassID[i]) != 'string') {
          badgeClassID = null;
          break;
        }
      }
    }

    if(badgeClassID == null && msg == null) {
      msg = "ERROR: cannot parse, Badge classID.";
      console.log("ERROR: API badgeUserList, cannot parese, Badge classID.");
    }
  }
  catch(exp) {
    msg = "ERROR: cannot parese, Badge classID.";
    console.log("ERROR: API badgeUserList, cannot parese, Badge classID. Exception.");
    console.log(exp)
  }

  if(msg != null) {
    res.status(400).json({
      list: null,
      listNotApp: null,
      exportData: null,
      msg: msg,
    });
    return;
  }

  if(exportFlg) {
    exportCsvBadgeUserList(badgeClassID, res);
  }
  else {
    getBadgeUserList(badgeClassID, res);
  }

  return;
}




async function getBadgeUserList( badgeClassID: string, res: NextApiResponse)
{
  let badgeName = null;
  let badgeUserList = null;
  let badgeUserListNoApp = null;

  try {
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

    if(result.length >= 1) {
      badgeName = result[0].badgeName;
    }

    if(badgeName == null) {
      res.status(400).json({
        list: null,
        listNotApp: null,
        badgeName: null,
        msg: "ERROR: Missing badge specified."
      });
      return;
    }

    badgeUserList = result.map( o => {
      if(o.userIDInfo == null) {
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
    }).filter(Boolean);

    badgeUserListNoApp = result.map( o => {
      if(o.userIDInfo == null) {
        return {
          userID: o.userID,
          userEMail: o.userEMail,
          submittedAt: o.submittedAt == null ? null : o.submittedAt.toISOString(),
        };
      }
      else {
        return null;
      };
    }).filter(Boolean);
  }
  catch(exp) {
    console.log("ERROR: API badgeUserList, DB access fail.");
    console.log(exp);
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
    res.status(200).json({
      badgeName: badgeName,
      list: badgeUserList,
      listNotApp: badgeUserListNoApp,
      msg: null
    });
  }

  return;  
}




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

    for(let i=0; i<badgeClassID.length; i++) {

      //console.log(badgeClassID[i]);

      try {
        [dbResult1, dbResult2] = await prisma.$transaction([
          prisma.submittedBadges.updateMany({
            data: {
              downloadedAt: nowTimeJst, 
            },
            where: {
              badgeClassId: badgeClassID[i],
            },
          }),
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
      }
      catch(e) {
        exp = e;
        ng = true;
        console.log(e);
      }

      if(dbResult2 == null) {
        ng = true;
        break;
      }
      else {
        output = output.concat(dbResult2);
      }
    }

    if(ng == false) {
      output = output.map((badge) => {
        if(badge.badgeIssuedOn != null) {
          const date = badge.badgeIssuedOn;
          const dateStr = `${date.getFullYear().toString()}/${date.getMonth().toString().padStart(2,'0')}/${date.getDay().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}`;
          return {...badge, badgeIssuedOn: dateStr};
        }
        else {
          return badge;
        } 
      });

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
    console.log(e);
  }

  if(ng == true) {
    res.status(500).json({
      exportData: null,
      msg: `ERROR: DB access fail,\r\nException = ` + exp,
    });
  }

  return;
}
