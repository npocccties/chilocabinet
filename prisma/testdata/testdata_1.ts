import { faker } from "@faker-js/faker";
import { UserEMails } from "@prisma/client";
import { SubmittedBadges } from "@prisma/client";


const dateToJtc = (dateUTC: Date) => {
  // JST（日本標準時）に変換
  // UTCからJSTは+9時間なので、それをミリ秒で計算
  const JST_OFFSET = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
  return new Date(dateUTC.getTime() + JST_OFFSET);
};

export const UserEMails_Test_1: UserEMails[] = [
  {
    userEMail: "test_user_01@mail.a.server",
    userName:  "てすとゆーざ１",
    createdAt:  dateToJtc(faker.date.anytime()),    
  },
  {
    userEMail: "test_user_02@mail.b.server",
    userName:  "てすとゆーざ２",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userEMail: "test_user_03@mail.c.server",
    userName:  "てすとゆーざ３",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userEMail: "test_user_04@mail.d.server",
    userName:  "てすとゆーざ４",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userEMail: "test_user_05@mail.e.server",
    userName:  "てすとゆーざ５",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
];

export const SubmittedBadges_Test_1: SubmittedBadges[] = [
  {
    userEMail: "test_user_02@mail.b.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＡ１",
    badgeClassId: "http://test_badge_a1",
    badgeEMail: "test_user_02.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ａ",
    badgeData: new Buffer(10), 
    downloadedAt: null,
  },
  {
    userEMail: "test_user_02@mail.b.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＡ２",
    badgeClassId: "http://test_badge_a2",
    badgeEMail: "test_user_02.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ａ",
    badgeData: new Buffer(10),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_02@mail.b.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＢ１",
    badgeClassId: "http://test_badge_b1",
    badgeEMail: "test_user_02.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｂ",
    badgeData: new Buffer(10),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_04@mail.d.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＡ２",
    badgeClassId: "http://test_badge_a2",
    badgeEMail: "test_user_04.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ａ",
    badgeData: new Buffer(10),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_05@mail.e.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＣ１",
    badgeClassId: "http://test_badge_c1",
    badgeEMail: "test_user_05.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｃ",
    badgeData: new Buffer(10),
    downloadedAt: null,
  },
];

