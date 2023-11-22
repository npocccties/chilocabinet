import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  let badgeClassID = null;
  let badgeName = null;
  let badgeUserList = null;
  let badgeUserListNoApp = null;

  try{
     badgeClassID= req.body.badge_class_id;
  }
  catch(exp) {
    //no act
  }

  if(badgeClassID == null) {
    res.status(400).json({
      list: null,
      listNotApp: null,
      badgeName: null,
      msg: "ERROR: No param, Badge classID."
    });
    return;
  }

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
        submittedAt: 'asc',
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

