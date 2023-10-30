import type { NextApiRequest, NextApiResponse } from "next";
import { Session, withSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest & Session, res: NextApiResponse) {

  const { user_email, badge_vc } = req.body;
  const vc_jwt = badge_vc;

  var ret  = {
    reason_code: null,
    reason_msg: null,
  }

  submission_badge_proc(user_email, vc_jwt, ret);

  var ret_code = 500;
  if(ret.reason_code) {
    ret_code = ret.reason_code;
  }

  res.status(ret_code).json(ret);
  return;
}

function submission_badge_proc(user_email, vc_jwt, ret)
{
  if(!user_email || user_email == '') {
    ret.reason_code = 400;
    ret.reason_msg = 'email none';
    return;
  }

  if(!vc_jwt || vc_jwt == '') {
    ret.reason_code = 400;
    ret.reason_msg = 'badge_vc none';
    return;
  }

  ret.reason_code = 200;
  ret.reason_msg = 'success';
  return;
}
