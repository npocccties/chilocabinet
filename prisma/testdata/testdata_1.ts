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
    userID:    "id=01",
    userEMail: "test_user_01@mail.a.server",
    userName:  "てすとゆーざ１ＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡ",
    createdAt:  dateToJtc(faker.date.anytime()),    
  },
  {
    userID:    "id=02",
    userEMail: "test_user_02______________________________________________@mail.b.server",
    userName:  "てすとゆーざ２",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=03",
    userEMail: "test_user_03@mail.c.server",
    userName:  "てすとゆーざ３",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=04",
    userEMail: "test_user_04@mail.d.server",
    userName:  "てすとゆーざ４",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=05",
    userEMail: "test_user_05@mail.e.server",
    userName:  "てすとゆーざ５",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=06",
    userEMail: "test_user_06@mail.x.server",
    userName:  "てすとゆーざ６",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=07",
    userEMail: "test_user_07@mail.x.server",
    userName:  "てすとゆーざ７",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=08",
    userEMail: "test_user_08@mail.x.server",
    userName:  "てすとゆーざ８",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=09",
    userEMail: "test_user_09@mail.x.server",
    userName:  "てすとゆーざ９",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=10",
    userEMail: "test_user_10@mail.x.server",
    userName:  "てすとゆーざ１０",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=11",
    userEMail: "test_user_11@mail.x.server",
    userName:  "てすとゆーざ１１",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=12",
    userEMail: "test_user_12@mail.x.server",
    userName:  "てすとゆーざ１２",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=13",
    userEMail: "test_user_13@mail.x.server",
    userName:  "てすとゆーざ１３",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=14",
    userEMail: "test_user_14@mail.x.server",
    userName:  "てすとゆーざ１４",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=15",
    userEMail: "test_user_15@mail.x.server",
    userName:  "てすとゆーざ１５",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=16",
    userEMail: "test_user_16@mail.x.server",
    userName:  "てすとゆーざ１６",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=17",
    userEMail: "test_user_17@mail.x.server",
    userName:  "てすとゆーざ１７",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=18",
    userEMail: "test_user_18@mail.x.server",
    userName:  "てすとゆーざ１８",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=19",
    userEMail: "test_user_19@mail.x.server",
    userName:  "てすとゆーざ１９",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=20",
    userEMail: "test_user_20@mail.x.server",
    userName:  "てすとゆーざ２０",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=21",
    userEMail: "test_user_21@mail.x.server",
    userName:  "てすとゆーざ２１",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=22",
    userEMail: "test_user_22@mail.x.server",
    userName:  "てすとゆーざ２２",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=23",
    userEMail: "test_user_23@mail.x.server",
    userName:  "てすとゆーざ２３",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=24",
    userEMail: "test_user_24@mail.x.server",
    userName:  "てすとゆーざ２４",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=25",
    userEMail: "test_user_25@mail.x.server",
    userName:  "てすとゆーざ２５",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=26",
    userEMail: "test_user_26@mail.x.server",
    userName:  "てすとゆーざ２６",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=27",
    userEMail: "test_user_27@mail.x.server",
    userName:  "てすとゆーざ２７",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=28",
    userEMail: "test_user_28@mail.x.server",
    userName:  "てすとゆーざ２８",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=29",
    userEMail: "test_user_29@mail.x.server",
    userName:  "てすとゆーざ２９",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=30",
    userEMail: "test_user_30@mail.x.server",
    userName:  "てすとゆーざ３０",
    createdAt:  dateToJtc(faker.date.anytime()),
  },
  {
    userID:    "id=31",
    userEMail: "test_user_31@mail.x.server",
    userName:  "てすとゆーざ３１",
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
    badgeData: new Buffer(2), 
    downloadedAt: null,
  },
  {
    userEMail: "test_user_02@mail.b.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＡ２",
    badgeClassId: "http://test_badge_a2",
    badgeEMail: "test_user_02.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ａ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_02@mail.b.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＢ１",
    badgeClassId: "http://test_badge_b1",
    badgeEMail: "test_user_02.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｂ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_04@mail.d.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＡ２",
    badgeClassId: "http://test_badge_a2",
    badgeEMail: "test_user_04.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ａ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_98@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ１",
    badgeClassId: "http://test_badge_x1",
    badgeEMail: "test_user_98.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ１",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_99@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ２",
    badgeClassId: "http://test_badge_x2",
    badgeEMail: "test_user_98.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ２",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_98@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＣ１",
    badgeClassId: "http://test_badge_x3",
    badgeEMail: "test_user_98.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ３",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_100@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_100.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_101@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_101.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_102@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_102.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_103@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_103.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_104@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_104.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_105@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_105.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_106@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_106.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_107@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_107.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_108@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_108.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_109@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_109.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_110@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_110.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_111@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_111.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_112@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_112.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_113@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_113.oodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_114@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_114.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_115@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_115.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_116@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_116.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_117@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_117.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_118@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_118.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
  {
    userEMail: "test_user_119@mail.x.server",
    submittedAt: dateToJtc(faker.date.anytime()),
    badgeName: "テストバッジＸ",
    badgeClassId: "http://test_badge_xx",
    badgeEMail: "test_user_x_119.moodle@mail.server",
    badgeIssuerName: "バッジ発行者Ｘ",
    badgeData: new Buffer(2),
    downloadedAt: null,
  },
];

