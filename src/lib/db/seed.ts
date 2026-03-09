// // ❌ import { PrismaClient } from '@prisma/client'
// // ❌ import { PrismaClient } from '@/generated/prisma'
// import { prisma } from '@/lib/db/prisma'
// import sampleData from './sample-data'
// import { hash } from 'bcryptjs'

// /* ========================================================================

// ======================================================================== */
// // To run this script do: npx tsx ./src/lib/db/seed

// async function main() {
//   await prisma.post.deleteMany() // ⚠️ Destructive!

//   await prisma.user.deleteMany()

//   const users = []

//   for (let i = 0; i < sampleData.users.length; i++) {
//     users.push({
//       ...sampleData.users[i],
//       password: await hash(sampleData.users[i].password, 10)
//     })
//     // console.log(
//     //   sampleData.users[i].password,
//     //   await hash(sampleData.users[i].password)
//     // );
//   }

//   await prisma.user.createMany({ data: users })

//   const createdUsers = await prisma.user.findMany()
//   const firstUser = createdUsers[0]

//   const posts = [
//     {
//       title: `${firstUser.firstName} Post 1`,
//       body: 'Bla, bla, bla...',
//       published: true,
//       authorId: firstUser.id
//     },
//     {
//       title: `${firstUser.firstName} Post 2`,
//       body: 'Bla, bla, bla...',
//       published: true,
//       authorId: firstUser.id
//     },
//     {
//       title: `${firstUser.firstName} Post 3`,
//       body: 'Bla, bla, bla...',
//       published: false,
//       authorId: firstUser.id
//     }
//   ]

//   await prisma.post.createMany({ data: posts })
//   console.log('Database seeded successfully!')
// }

// main()
