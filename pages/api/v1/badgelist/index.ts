import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req, res) {

  let groupResult = null;

  try {
    groupResult = await prisma.submittedBadges.groupBy({
      by: [
        'badgeClassId',
        'badgeName',
        'badgeIssuerName',
      ],
      _count: {
        _all: true,
        userEMail: true,      
      },
      orderBy: [
        { badgeIssuerName: 'asc' },
        { badgeName: 'asc' },
        { badgeClassId: 'asc' },
      ],
    });

    for(let i=0; i<groupResult.length; i++) {
      const emailCount = await prisma.submittedBadges.findMany({
        select: {
          userEMail: true,
        },
        where: {
          badgeClassId: groupResult[i].badgeClassId,
        },
        distinct: ['userEMail'],
      });

      groupResult[i]._count.userEMail = emailCount.length;
    }
  }
  catch(exp) {
    console.log("ERROR: API badgelist, DB access exception.")
    console.log(exp);
  }

  if(groupResult == null) {
    res.status(500).json({ list: null, msg: "DB access error." });
  }
  else {
    res.status(200).json({list: groupResult, msg: null});
  }

  return;
}
