import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { UserEMails_Test_1, SubmittedBadges_Test_1 } from "./testdata/testdata_1";

const prisma = new PrismaClient();

async function main() {

  const userlist = UserEMails_Test_1;
  const badgelist = SubmittedBadges_Test_1;

  await prisma.userEMails.createMany({
     data: userlist,
  });

  await prisma.submittedBadges.createMany({
     data: badgelist,
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
