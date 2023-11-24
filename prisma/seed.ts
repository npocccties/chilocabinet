import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { UserIDs_Test_1, SubmittedBadges_Test_1 } from "./testdata/testdata_1";

const prisma = new PrismaClient();

async function main() {

  const userlist = UserIDs_Test_1;
  const badgelist = SubmittedBadges_Test_1;

  await prisma.users.createMany({
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
