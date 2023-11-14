import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  try {
    if(req.body.type == 'for_test_1') {
      await proc_test1(req, res); 
    }
    else if(req.body.type == 'download') {
      await proc_download(req, res);
    }
    else if(req.body.type == 'upload') {
      await proc_upload(req, res);
    }
    else {
      res.status(400).json({ success: false, msg: "ERROR: Api userlist, unknown type."});
    }
  }
  catch(exp) {
    console.log(exp);
  }

  return;
}




async function proc_test1(req, res)
{
  let result_dbg;

  try {
    result_dbg = await prisma.submittedBadges.findMany({
      where: {
        NOT: {userEMailInfo: {userEMail: {not: ''}}},
      },
      select: {
        userEMail: true,
        submittedAt: true,
        badgeName: true,
        badgeClassId: true,
        badgeEMail: true,
        badgeIssuerName: true,
        downloadedAt: true,
      },
    });
  }
  catch(exp) {
    console.log(exp);
  };

  console.log(result_dbg);

  res.status(200).json({ success: (result_dbg != null), reesult: result_dbg });
  return;
}




async function proc_download(req, res)
{
  let user_email;
  let user_email_notapp;
  
  try {
    user_email = await prisma.userEMails.findMany({
      select: {
        userName: true,
        userEMail: true,
      },
      orderBy: {
        userEMail: 'asc',
      },
      distinct: ['userEMail'],
    });
  }
  catch(exp) {
    console.log(exp);
  };

  console.log(user_email);

  if(user_email == null) {
    res.status(200).json({
      success: false,
      user_email: null,
      user_email_notapp: null, 
    });
    return;
  }
 
  try {
    user_email_notapp = await prisma.submittedBadges.findMany({
      where: {
        NOT: {userEMailInfo: {userEMail: {not: ''}}},
      },
      select: {
        userEMail: true,
        submittedAt: true,
      },
      orderBy: [
        { userEMail: 'asc' },
        { submittedAt: 'asc' },
      ],
      distinct: ['userEMail'],
    });
  }
  catch(exp) {
    console.log(exp);
  };

  if(user_email_notapp == null) {
    res.status(200).json({
      success: false,
      user_email: user_email,
      user_email_notapp: null, 
    });
    return;
  }

  console.log(user_email_notapp);

  res.status(200).json({
    success: true,
    user_email: user_email,
    user_email_notapp: user_email_notapp,
  });
  return;
}




async function proc_upload(req, res) {

  let i;
  let success = true;
  let msg = "success";
  let status = 200;
  let expmsg = null;
  let upload = null;

  console.log(req.body.upload);
  console.log("start proc_upload");

  type TypeUploadData = {
    name: string,
    email: string,
  };

  if(req.body.upload == null) {
    success = false;
    msg =  "ERROR: Upload data is null.";
    status = 400;
  }

  try {
    if(typeof req.body.upload == 'string') {
      upload = JSON.parse(req.body.upload);
      console.log(upload);
    }
    else {
      upload = req.body.upload;
    }
  }
  catch(exp) {
    expmsg = exp;
    console.log(exp);
  }

  if(upload == null) {
    success = false;
    msg =  "ERROR: Upload data type is invalid.";
    status = 400;
  }

  if(success && Array.isArray(upload) == false) {
    success = false;
    msg =  "ERROR: Upload data type is invalid.";
    status = 400;
  }

  if(success && upload.length == 0) {
    success = false;
    msg =  "ERROR: Upload data array size is 0.";
    status = 400;
  }

  if(success && upload.length > 10000) {
    success = false;
    msg =  "ERROR: Upload data array size is over, max size is 10,000.";
    status = 400;
  }

  for (i = 0; success && i < upload.length; i++) {
    if(upload[i].name == null) {
      success = false;
      msg =  `ERROR: param 'name' is none, index = ${i}`;
      status = 400;
    }
    else if(upload[i].email == null) {
      success = false;
      msg =  `ERROR: param 'email' is none, index = ${i}`;
      status = 400;
    }
    else if(upload[i].name.length > 256) {
      success = false;
      msg =  `ERROR: name string length over, max 256, index = ${i}`;
      status = 400;
    }  
    else if(upload[i].email.length > 254) {
      success = false;
      msg = `ERROR: email string length over, max 254, index = ${i}`;
      status = 400;
    }
    else {
      const regstr = '^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$';
      if(upload[i].email.match(regstr) == null){
        success = false;
        msg = `ERROR: email string format NG, index = ${i}`;
        status = 400;
      }
    }
  }

  if(success) {
    let db_delete;
    let db_insert;
    let tabledata = [];

    const JST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
    let nowTimeJst = new Date((new Date()).getTime() + JST_OFFSET);

    for (i = 0; i < upload.length; i++) {
      tabledata.push({
        userEMail: upload[i].email,
        userName:  upload[i].name,
        createdAt: nowTimeJst,
      });    
    }

    console.log(tabledata);

    try {
      [db_delete, db_insert] = await prisma.$transaction([
        prisma.userEMails.deleteMany({}),
        prisma.userEMails.createMany({data: tabledata}),
      ]);

      console.log(db_delete);
      console.log(db_insert);
    }
    catch(exp) {
      success = false;
      msg = "ERROR: Upload UserEMail data, DB Fail. Exception.";
      expmsg = exp;
      status = 500;
      console.log(msg);
      console.log(exp);
    }

    if(success && (db_delete == null || db_insert == null)) {
      success = false;
      msg = "ERROR: Upload UserEMail data, DB Fail.";
      status = 500;
      console.log(msg);
    }
  }

  if(success == false) {
    console.log(msg);
  }

  res.status(status).json({
    success: success,
    msg: msg,
    exp: expmsg,
  });

  return;
}
