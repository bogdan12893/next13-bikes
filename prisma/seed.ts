// import { PrismaClient } from "@prisma/client";
// import { hash } from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   const password = await hash("test", 12);
//   const user = await prisma.user.upsert({
//     where: { email: "ion@ion.dev" },
//     update: {},
//     create: {
//       email: "ion@ion.dev",
//       name: "Ion doi",
//       password,
//     },
//   });
//   console.log({ user });
// }
// main()
//   .then(() => prisma.$disconnect())
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
