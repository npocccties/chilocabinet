import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req, res) {

  const groupResult = await prisma.submittedBadges.groupBy({
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

  //console.log(groupResult);

  res.status(200).json({ groupResult });
  return;
}
