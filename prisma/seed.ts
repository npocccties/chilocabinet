import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { badgeVcsTestData } from "./testdata/badge_vcs";

const prisma = new PrismaClient();

async function main() {
  // テストデータの挿入;
  for (let i = 0; i < 10; i++) {
    await prisma.mywallets.create({
      data: {
        mywallet_id: i,
        orthros_id: faker.string.uuid(),
        create_time: faker.date.anytime(),
      },
    });
  }
  await prisma.badge_vcs.createMany({
    data: badgeVcsTestData,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
