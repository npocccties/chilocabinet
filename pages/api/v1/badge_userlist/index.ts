import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  let badge_class_id = null;
  let badge_name = null;
  let badge_userlist = null;
  let badge_userlist_notapp = null;

  try{
    badge_class_id = req.body.badge_class_id;
  }
  catch(exp) {
    //no act
  }

  if(badge_class_id == null) {
    res.status(400).json({
      list: null,
      list_notapp: null,
      badge_name: null,
      msg: "ERROR: No param, Badge classID."
    });
    return;
  }

  try {
    const result = await prisma.submittedBadges.findMany({
      select: {
        badgeName: true,
        userEMail: true,
        submittedAt: true,
        downloadedAt: true,
        userEMailInfo: true,
      },
      where: {
        badgeClassId: badge_class_id,
      },
      orderBy: {
        submittedAt: 'asc',
      },
      distinct: ['userEMail'],
    });

    if(result.length >= 1) {
      badge_name = result[0].badgeName;
    }

    if(badge_name == null) {
      res.status(400).json({
        list: null,
        list_notapp: null,
        badge_name: null,
        msg: "ERROR: Missing badge specified."
      });
      return;
    }

    badge_userlist = result.map( o => {
      if(o.userEMailInfo == null) {
        return null;
      }
      else {
        return {
          userID: o.userEMailInfo.userID,
          userName: o.userEMailInfo.userName,
          userEMail: o.userEMail,
          submittedAt: o.submittedAt == null ? null : o.submittedAt.toISOString(),
          downloadedAt: o.downloadedAt == null ? null : o.downloadedAt.toISOString(), 
        };
      }
    }).filter(Boolean);

    badge_userlist_notapp = result.map( o => {
      if(o.userEMailInfo == null) {
        return {
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
    console.log("ERROR: API badge_userlist, DB access fail.");
    console.log(exp);
  };

  if(badge_name == null || badge_userlist == null || badge_userlist_notapp == null) {
    res.status(500).json({
      list: badge_userlist,
      list_notapp: badge_userlist_notapp,
      badge_name: badge_name,
      msg: "ERROR: DB access fail."
    });
  }
  else {
    res.status(200).json({
      badgeName: badge_name,
      list: badge_userlist,
      listNotApp: badge_userlist_notapp,
      msg: null
    });
  }

  return;
}

