import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
const { setTimeout } = require('timers/promises');

import ION from "@decentralized-identity/ion-tools";
import crypto from "crypto";
import axios from "axios";
const pngitxt = require("png-itxt");
const Through = require("stream").PassThrough;

import {loggerError, loggerWarn, loggerInfo, loggerDebug } from "@/lib/logger";
import { OPENBADGE_VERIFIER_URL } from "@/configs/constants";

type ReturnStatus = {
  fail: boolean,
  status_code: number | null,
  reason_code: number | null,
  reason_msg: string | null,
}

const retStatusInit = {
  fail: false,
  status_code: null,
  reason_code: null,
  reason_msg: null,
}

//デバッグ用データ
const debugData = {
  inputJwt: null,
  privateKey: null,
  publicKey: null,
  skipCheckVcExp: false,
  skipCheckVcSign: false,
  skipCheckBadgeEMailSalt: false,
  skipCheckBadgeMetaData: false,
};

const openBadgeVerifierURL =
  "https://openbadgesvalidator.imsglobal.org/results";




export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { user_id, user_email, badge_vc } = req.body;
  const userID: string = ((user_id == null) ? user_email : user_id);
  const userEMail: string = user_email;
  let vcJwt: string = badge_vc;
 
  let retStatus = {... retStatusInit};

  // for-debug
  //await createDebugData_1();
  if(debugData.inputJwt != null) {
    vcJwt = debugData.inputJwt;
  }

  try {
    retStatus = await submissionBadgeProc(userID, userEMail, vcJwt);
  }
  catch(exp) {
    loggerError(`API submission_badge: Unknown exception.`);
    loggerWarn(exp);
    console.log(`Error: API submission_badge: Unknown exception.`);
    console.log(exp);
    retStatus  = {
      fail: true,
      status_code: 500,
      reason_code: 200,
      reason_msg: 'Submission API, server error.',
    }
  }

  if(retStatus.fail == true) {
    if(retStatus.status_code == null) {
      retStatus.status_code = 500
    }

    if(retStatus.reason_code == null) {
      retStatus.reason_code = 200;
    }

    if(retStatus.reason_msg == null) {
      retStatus.reason_msg = "server error";
    }
  }
  else {
    if(retStatus.status_code == null) {
      retStatus.status_code = 200
    }
    
    if(retStatus.reason_code == null) {
      retStatus.reason_code = 0;
    }

    if(retStatus.reason_msg == null) {
      retStatus.reason_msg = "success";
    }
  }

  if(retStatus.reason_code != 0) {
    loggerError(`API submission_badge: result Error. status=${retStatus.status_code}, reason=${retStatus.reason_code}, msg=${retStatus.reason_msg}`); 
    console.log(`Error: API submission_badge: result Error. status=${retStatus.status_code}, reason=${retStatus.reason_code}, msg=${retStatus.reason_msg}`);
  }

  res.status(retStatus.status_code).json({reason_code: retStatus.reason_code, reason_msg: retStatus.reason_msg});
  return;
}




//バッジ提出受け入れ処理
async function submissionBadgeProc(userID, userEMail: string, vcJwt: string)
{
  //入力パラメータチェック
  let { retStatus, vcHeader, vcPayload, vcSignBin } = await checkInputParam(userID, userEMail, vcJwt);

  if(retStatus.fail == true) {
    return retStatus;
  }

  //VC署名チェック
  retStatus = await checkValidationVc(vcHeader, vcPayload, vcJwt);
  if(retStatus.fail == true) {
    return retStatus;
  }

  //VCデータパース
  let vcSubEMail;   //VC内, OpenBadge対象EMail, OpenBadge検証に使用
  let vcPhoto;      //VC内, OpenBadge画像データ, iTxt領域にメタデータを含む
  let vcExp;        //VC有効期限
  try {
    vcSubEMail = vcPayload.vc.credentialSubject.email;
    vcExp = vcPayload.exp;
    vcPhoto = vcPayload.vc.credentialSubject.photo;    
  }
  catch(exp) {
    loggerError(`API submission_badge: VC data parse Error, not exist data Exception.`);
    loggerWarn(exp);
    console.log(`Error: API submission_badge: VC data parse Error, not exist data Exception.`);
    console.log(exp);
  }

  if(vcSubEMail == null) {
    return { fail:true, status_code:400, reason_code:103, reason_msg:"no exist data, JWT Payload: vc.credentialSubject.email" };
  }
  if(vcPhoto == null) {
    return { fail:true, status_code:400, reason_code:103, reason_msg:"no exist data, JWT Payload: exp" };
  }
  if(vcExp == null) {
    return { fail:true, status_code:400, reason_code:103, reason_msg:"no exist data, JWT Payload: vc.credentialSubject.photol" };
  }

  //現在時刻取得
  const JST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
  let nowTime = new Date();
  let nowTimeJst =  new Date(nowTime.getTime() + JST_OFFSET);

  //有効期限チェック
  try {
    let expTime = new Date(vcExp * 1000);
    if(expTime < nowTime) {
      loggerError(`API submission_badge: VC expire time is over, exp:${expTime}, now:${nowTime}`);
      console.log(`Error: API submission_badge: VC expire time is over, exp:${expTime}, now:${nowTime}`);

      if(debugData.skipCheckVcExp == false) {
        return { fail:true, status_code:400, reason_code:103, reason_msg:"VC expire time is over." };
      }
    }
  }
  catch(exp) {
    loggerError(`API submission_badge: VC expire time is unknown.`);
    console.log(`Error: API submission_badge: VC expire time is unknown.`);
    loggerWarn(exp);
    console.log(exp);
    return { fail:true, status_code:400, reason_code:102, reason_msg:"VC expire time is unknown." };
  }

  //バッジデータパース
  const {ret: badgeMetaData, err: errBadgeMetaData} = await extractOpenBadgeMetadataFromImage(vcPhoto);
  if(badgeMetaData == false) {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 102;
    retStatus.reason_msg = errBadgeMetaData;
    return retStatus;
  }

  let badgeName;
  let badgeClass;
  let badgeIssName;
  let badgeDescription;

  try {
    let badge = badgeMetaData.badge;

    if(typeof(badgeMetaData.badge) === 'string' && badgeMetaData.badge.startsWith('http')) {
      //Badge情報をメタデータ埋め込みURLから取得
      await axios.get<any>(badgeMetaData.badge)
      .then((resp) => {
        //console.log(resp.data);
        badge = resp.data;
      });
    }

    badgeName =  badge.name;
    badgeClass = badge.criteria.id;
    badgeDescription = badge.description;

    if(typeof(badge.issuer) === 'string' && badge.issuer.startsWith('http')) {
      //Issure情報をメタデータ埋め込みURLから取得
      await axios.get<any>(badge.issuer)
      .then((resp) => {
        //console.log(resp.data);
        badge.issuer = resp.data;
      });
    }

    badgeIssName = badge.issuer.name;
  }
  catch(exp) {
    loggerError(`API submission_badge: badge data parse Error, not exist data Exception.`);
    console.log(`Error: API submission_badge: badge data parse Error, not exist data Exception.`);
    loggerWarn(exp);
    console.log(exp);
  }

  if(badgeName == null) {
    return { fail:true, status_code:400, reason_code:102, reason_msg:"no exist data, OpenBadge meta data: badge.name" };
  }
  if(badgeClass == null) {
    return { fail:true, status_code:400, reason_code:102, reason_msg:"no exist data, OpenBadge meta data: badge.issuer.criteria.id" };
  }
  if(badgeIssName == null) {
    return { fail:true, status_code:400, reason_code:102, reason_msg:"no exist data, OpenBadge meta data: badge.issuer.name" };
  }

  //バッジ有効検証チェック
  const {result: validateOBResult, msg: validateOBMsg } = await validateOpenBadge(vcSubEMail, badgeMetaData);
  if(validateOBResult == false) {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 102;
    retStatus.reason_msg = validateOBMsg;
    return retStatus;
  }

  let issuedOnTime;
  try{
    issuedOnTime = new Date(badgeMetaData.issuedOn);

    console.log(badgeMetaData.issuedOn);
    console.log(issuedOnTime);
  }
  catch(exp) { // no act
  }

  //DB登録
  let newDbData;
  try {
    const [dbResult1, dbResult2] = await prisma.$transaction([
      prisma.submittedBadges.deleteMany({
        where: {
          userID: userID,
          badgeClassId: badgeClass,
        }
      }),
      prisma.submittedBadges.create({
        data: {
          userID: userID,
          userEMail: userEMail,
          submittedAt: nowTimeJst,
          badgeName: badgeName,
          badgeClassId: badgeClass,
          badgeEMail: vcSubEMail,
          badgeIssuerName: badgeIssName,
          badgeDescription: badgeDescription,
          badgeIssuedOn: issuedOnTime,
          badgeData: Buffer.from(vcPhoto, "base64"),
          downloadedAt: null,
        },
      }),
    ]);

    newDbData = dbResult2;
  }
  catch(exp) {
    loggerError(`API submission_badge: DB insert exception, to SubmittedBadges table`);
    console.log(`Error: API submission_badge: DB insert exception, to SubmittedBadges table`);
    loggerWarn(exp);
    console.log(exp);
  }

  if(newDbData == false) {
    loggerError(`API submission_badge: DB insert fail, to SubmittedBadges table`);
    console.log(`Error: API submission_badge: DB insert fail, to SubmittedBadges table`);

    retStatus.fail = true;
    retStatus.status_code = 500;
    retStatus.reason_code = 200;
    retStatus.reason_msg = 'Server Error, DB data insert fail.';
    return retStatus;
  }

  //成功応答
  retStatus.status_code = 200;
  retStatus.reason_code = 0;
  retStatus.reason_msg = 'success';
  return retStatus;
}




//入力パラメータチェック・BASE64デコード
async function checkInputParam(userID: string, userEMail: string, vcJwt: string)
{
  let retStatus = {... retStatusInit};
  let retParam = {
    retStatus: retStatus,
    vcHeader: null,
    vcPayload: null,
    vcSignBin: null,
  };

   //パラメータ存在チェック
   if(userID == null || userID == '') {
     retStatus.fail = true;
     retStatus.status_code = 400;
     retStatus.reason_code = 100;
     retStatus.reason_msg = 'Error, Param user_id is none.';
     return retParam;
   }

  //パラメータ存在チェック
  if(userEMail == null || userEMail == '') {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 100;
    retStatus.reason_msg = 'Error, Param user_email is none.';
    return retParam;
  }

  //パラメータ存在チェック
  if(vcJwt == null  || vcJwt == '') {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 100;
    retStatus.reason_msg = 'Error, Param badge_vc is none.';
    return retParam;
  }

  //提出ID存在チェック
  const findID = await prisma.users.findFirst ({
    where: {
      userID: userID,
    },
  });

  if(!findID){
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 101;
    retStatus.reason_msg = 'Error, unknown user_id.';
    return retParam;
  };

  //JWT分割
  const jwtSeparate = vcJwt.split('.');
  if((jwtSeparate.length != 3) ||
     (jwtSeparate[0] == null) ||
     (jwtSeparate[1] == null) ||
     (jwtSeparate[2] == null))
  {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 103;
    retStatus.reason_msg = 'Error, jwt format, bad block separate.';
    return retParam;
  }

  const [ jwtHeaderBase64, jwtPayloadBase64, jwtSignatureBase64 ] = jwtSeparate;

  //BASE64デコード
  let vcHeaderStr  = null;
  let vcPayloadStr = null;
  let vcSignBin = null;

  try {
    vcHeaderStr = base64url.decode(jwtHeaderBase64);
    vcPayloadStr = base64url.decode(jwtPayloadBase64);
    vcSignBin = base64url.decode(jwtSignatureBase64);
  } catch (exceptionVar) {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 103;
    retStatus.reason_msg = 'Error, jwt format, cannot base64 decode.';
    console.log(exceptionVar);
    return retParam;
  };

  //JSONコードにパース
  let vcHeader = null;
  let vcPayload = null;

  try {
    vcHeader = JSON.parse(vcHeaderStr);
    vcPayload = JSON.parse(vcPayloadStr);
  } catch (exceptionVar) {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 103;
    retStatus.reason_msg = 'Error, jwt format, cannot parse to json data.';
    console.log(exceptionVar);
    return retParam;
  };

  //パラメータチェック・パース完了
  retParam = {
    retStatus,
    vcHeader,
    vcPayload,
    vcSignBin,
  };

  return retParam;
}




//ヘッダを参照してDID:WEB公開鍵を返す
async function resolveHeader( header )
{
  let resolvePubKey = null;
  let kid = null;

  try{
    kid = header.kid;
    let kids = kid.split('#');
    let controller = kids[0];
    let id = '#' + kids[1];
    let diddoc = await ION.resolve(kid);

    //console.log(diddoc);
    //console.log(diddoc.didDocument.verificationMethod);

    diddoc.didDocument.verificationMethod.forEach( vm => {
      if(controller == vm.controller && id == vm.id) {
        resolvePubKey = vm.publicKeyJwk;
      }
    });
  }
  catch(exp) {
    console.log('ERROR, did:web resolve error, header.kid=' + kid);
    console.log(exp);
  }

  //console.log(resolvePubKey);
  return resolvePubKey;
}





//VC署名チェック
async function checkValidationVc(vcHeader, vcPayload, vcJwt)
{
  let retStatus = {... retStatusInit};

  //for-debug
  if(debugData.skipCheckVcSign == true)  {
    return retStatus;
  }

  //DID:WEBから公開鍵を取得
  let pubKey;
  if(debugData.publicKey != null) { 
    // for-debug
    pubKey = debugData.publicKey;
  }
  else {
    pubKey = await resolveHeader(vcHeader);
    if(pubKey == null) {
      retStatus.fail = true;
      retStatus.status_code = 400;
      retStatus.reason_code = 103;
      retStatus.reason_msg = 'Error, cannot publilcKey form vcHeader.';
      return retStatus;
    }
  }

  //console.log(pubKey);

  //VC署名検証
  let verifyRet = false;
  try {
    verifyRet = await ION.verifyJws({jws: vcJwt, publicJwk: pubKey});
  } catch (exceptionVar) {
    console.log(exceptionVar);
  };

  if(verifyRet == false) {
    retStatus.fail = true;
    retStatus.status_code = 400;
    retStatus.reason_code = 103;
    retStatus.reason_msg = 'Error, VC signature check NG.';
    return retStatus;
  }

  return retStatus;
}



//BASE64エンコード・デコード
const base64url = {
  encode: (unencoded) => {
    return Buffer.from(unencoded).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  decode: (encoded) => {
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) {
      encoded += "=";
    }
    return Buffer.from(encoded, "base64").toString("utf8");
  },

  decodeToBuffer: (encoded) => {
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) {
      encoded += "=";
    }
    return Buffer.from(encoded, "base64");
  },
};




//OpenBadge画像データからiTxtデータを取得
export const extractOpenBadgeMetadataFromImage = async (imageString: string) => {
  let ret = null;
  let retErr = null;

  const file = Buffer.from(imageString, "base64");
  const getITxt = new Promise<any>(function (resolve, reject) {
    const start = new Through();
    start.pipe(
      pngitxt.get("openbadges", function (err: any, data: any) {

        //console.log(data);

        if (err) {
          err = true;
          reject(err);
        }

        try {
          ret = JSON.parse(data.value);
          resolve(ret);
        }    
        catch(exp) {
          retErr = 'PNG iTxt data cannot get. (no data, or parse error)';
          reject(err);
        }
      })
    );
    start.write(file);
  });

  //iTxt取得操作時に例外発生した場合
  //awaitが完結しないケースがあるためタイムアウト時間を設ける
  const controller = new AbortController();
  const timeout = setTimeout(5000, null, { signal: controller.signal });
  try {
    await Promise.race([getITxt, timeout]);
  }
  catch(exp) {
    console.log(exp);
    if(retErr == null) {
      retErr = 'PNG iTxt data cannot get.';
    }
  }
  controller.abort();

  if(ret == null && retErr == null) {
    return { ret: null, err: 'PNG iTxt data cannot get. (timeout, this data is PNG ?)'};
  }

  return { ret, err: retErr };
};




//OpenBadge 検証
export const validateOpenBadge = async (
  email: string,
  openBadgeMetadata: any
) => {
  const [, expectedEmailHash] = openBadgeMetadata.recipient.identity.split("$");
  const salt = openBadgeMetadata.recipient.salt;
  let saltVal = salt === null || salt === undefined ? "" : salt;
  //console.log("saltVal=", saltVal);
  const inputEmailHash = crypto
    .createHash("sha256")
    .update(email + saltVal)
    .digest("hex");

  if (inputEmailHash !== expectedEmailHash) {
    loggerError(`API submission_badge: email and salt unmatch, email=${email}, salt=${saltVal}`);
    console.log(`Error: API submission_badge: email and salt unmatch, email=${email}, salt=${saltVal}`);

    let msg = `Error, validateOpenBadge, email and salt unmatch, email=${email}, salt=${saltVal}`;
    if(debugData.skipCheckBadgeEMailSalt == false)
    {
      return { result: false, msg: msg };
    }
  }

  const postProc = axios.post(
    OPENBADGE_VERIFIER_URL,
    {
      data: JSON.stringify(openBadgeMetadata),
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  let retValidate;  
  try {
    retValidate = await postProc;
  }
  catch(exp) {
    loggerError(`API submission_badge: OpenBadge validaterURL POST exception.`);
    console.log(`Error: API submission_badge: OpenBadge validaterURL POST exception.`);
    loggerWarn(exp);
    console.log(exp);

    if(debugData.skipCheckBadgeMetaData == false) {
      return { result: false, msg: "OpenBadge validater POST Fail, URL = " +  OPENBADGE_VERIFIER_URL};
    }
  }

  //console.log(retValidate);
  //console.log("END openBadgeValidator ret=", retValidate.data.report.valid);

  let result;
  let msg;
  if( retValidate != null && retValidate.data != null && retValidate.data.report != null && retValidate.data.report.valid != null) { 
    result = retValidate.data.report.valid;
    msg = JSON.stringify(retValidate.data.report);
  }

  if(result == true) {
    msg = 'validateOpenBadge success';
  }
  else if(msg == null) {
    msg = 'validateOpenBadge Fail';

    loggerError(`API submission_badge: OpenBadge validater result, NG.`);
    console.log(`Error: API submission_badge: OpenBadge validater result, NG.`);
  }

  if(debugData.skipCheckBadgeMetaData == true) {
    result = true;
  }

  return { result, msg };
}