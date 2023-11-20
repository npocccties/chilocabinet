import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  try {
    if(req.body.type == 'download') {
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




async function proc_download(req, res)
{
  let user_email;
  let user_email_notapp;
  
  try {
    user_email = await prisma.userEMails.findMany({
      select: {
        userID: true,
        userName: true,
        userEMail: true,
      },
      orderBy: {
        userID: 'asc',
      },
      distinct: ['userID'],
    });
  }
  catch(exp) {
    console.log(exp);
  };

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

  for (i = 0; success && i < upload.length; i++) {
    if(upload[i].id == null || upload[i].id == '') {
      success = false;
      msg =  `ERROR: param 'id' is none, index = ${i}`;
      status = 400;
    }
    else if(upload[i].name == null || upload[i].name == '') {
      success = false;
      msg =  `ERROR: param 'name' is none, index = ${i}`;
      status = 400;
    }
    else if(upload[i].email == null || upload[i].email == '') {
      success = false;
      msg =  `ERROR: param 'email' is none, index = ${i}`;
      status = 400;
    }
    else if(upload[i].id.length > 20) {
      success = false;
      msg =  `ERROR: id string length over, max 20, index = ${i}`;
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
        userID:    upload[i].id,
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
