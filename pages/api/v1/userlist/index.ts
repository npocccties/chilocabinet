import type { NextApiRequest, NextApiResponse } from "next";

import {loggerError, loggerInfo, loggerDebug } from "@/lib/logger";
import prisma from "@/lib/prisma";

//<---- 学習者一覧取得 ---->

export default async function handler(req: NextApiRequest, res: NextApiResponse)
{
  loggerDebug(req.body);

  try {
    if(req.body.type == 'download') {
      loggerInfo("API userliset, start get info.");
      await proc_download(req, res);
    }
    else if(req.body.type == 'upload') {
      loggerInfo("API userliset, start upload CSV.");
      await proc_upload(req, res);
    }
    else {
      res.status(400).json({ success: false, msg: "ERROR: Api userlist, unknown type."});
    }
  }
  catch(exp) {
    loggerError("ERROR: API userliset, Exception.");    
    loggerError(exp);
  }

  return;
}

//<---- 学習者一覧取得 ---->

async function proc_download(req, res)
{
  let userID;
  let userIDNotApp;
  
  try {
    userID = await prisma.users.findMany({
      select: {
        userID: true,
        userName: true,
      },
      orderBy: {
        userID: 'asc',
      },
      distinct: ['userID'],
    });
  }
  catch(exp) {
    loggerError("ERROR: API userlist, get userlist, DB Exception.");
    loggerError(exp);
  };

  if(userID == null) {
    res.status(500).json({ success: false, msg: "ERROR: DB access fail."});
    return;
  }
 
  try {
    userIDNotApp = await prisma.submittedBadges.findMany({
      where: {
        NOT: {userIDInfo: {userID: {not: ''}}},
      },
      select: {
        userID: true,
        userEMail: true,
        submittedAt: true,
      },
      orderBy: [
        { userID: 'asc' },
        { submittedAt: 'asc' },
      ],
      distinct: ['userID'],
    });
  }
  catch(exp) {
    loggerError("ERROR: API userlist, get userlist not app, DB Exception.");
    loggerError(exp);
  };

  if(userIDNotApp == null) {
    res.status(500).json({ success: false, msg: "ERROR: DB access fail."});
    return;
  }

  loggerDebug(userID.toString());
  loggerDebug(userIDNotApp.toString());
  loggerInfo("API userlist, get info success.");

  res.status(200).json({
    success: true,
    userID: userID,
    userIDNotApp: userIDNotApp,
  });
  return;
}

//<---- 学習者一覧CSVアップロード ---->

async function proc_upload(req, res) {

  let i;
  let success = true;
  let msg = "success";
  let status = 200;
  let expMsg = null;
  let upload = null;

  //<---- パラメータ内容のチェック ---->

  if(req.body.upload == null) {
    success = false;
    msg =  "ERROR: Upload data is null.";
    status = 400;
  }

  try {
    if(typeof req.body.upload == 'string') {
      upload = JSON.parse(req.body.upload);
    }
    else {
      upload = req.body.upload;
    }
  }
  catch(exp) {
    loggerError("ERROR: API userlist, upload CSV param Exception.");
    loggerError(exp);
    expMsg = exp;
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
    else if(upload[i].id.length > 254) {
      success = false;
      msg =  `ERROR: id string length over, max 20, index = ${i}`;
      status = 400;
    }
    else if(upload[i].name.length > 256) {
      success = false;
      msg =  `ERROR: name string length over, max 256, index = ${i}`;
      status = 400;
    }  
  }

  let dbInsert;
  let dbDelete;
  let tabledata = [];

  if(success) {
    const JST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
    let nowTimeJst = new Date((new Date()).getTime() + JST_OFFSET);

    for (i = 0; i < upload.length; i++) {
      tabledata.push({
        userID:    upload[i].id,
        userName:  upload[i].name,
        createdAt: nowTimeJst,
      });    
    }

    //<---- DB更新 ---->
    loggerDebug(tabledata.toString());

    try {
      [dbDelete, dbInsert] = await prisma.$transaction([
        prisma.users.deleteMany({}),
        prisma.users.createMany({data: tabledata}),
      ]);
    }
    catch(exp) {
      loggerError("ERROR: API userlist, upload CSV DB fail. Exception.");
      loggerError(exp);
      success = false;
      msg = "ERROR: Upload UserID data, DB Fail. Exception.";
      expMsg = exp;
      status = 500;
    }

    if(success && (dbDelete == null || dbInsert == null)) {
      success = false;
      msg = "ERROR: Upload UserID data, DB Fail.";
      status = 500;
    }
  }

  if(success == false) {
    loggerError("ERROR: API userlist, upload CSV fail, " + msg);
  }
  else {
    loggerInfo("API userlist, upload CSV success.");
    loggerDebug(dbDelete);
    loggerDebug(dbInsert);
  }

  res.status(status).json({
    success: success,
    msg: msg,
    exp: expMsg,
  });

  return;
}
