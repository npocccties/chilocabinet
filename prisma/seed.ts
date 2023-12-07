import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { UserIDs_Test_1, SubmittedBadges_Test_1 } from "./testdata/testdata_1";

const prisma = new PrismaClient();

async function main() {

  try{
    const [dbResult1, dbResult2] = await prisma.$transaction([
      prisma.users.deleteMany({}),
      prisma.submittedBadges.deleteMany({}),
    ]);
  }
  catch(e) {
    // no act
  }

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
