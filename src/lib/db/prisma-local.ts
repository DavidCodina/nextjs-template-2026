///////////////////////////////////////////////////////////////////////////
//
//# Can Dev: https://www.youtube.com/watch?v=Ndhx_rNkoUw&t=3s
//
// https://www.prisma.io/docs/guides/nextjs
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
//
//
//
///////////////////////////////////////////////////////////////////////////

// import { PrismaClient } from '@/generated/prisma/client'

// type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>

// const DATABASE_URL = process.env.DATABASE_URL
// if (!DATABASE_URL) {
//   throw new Error('DATABASE_URL must be set.')
// }

// /* ========================================================================

// ======================================================================== */

// const createExtendedPrismaClient = () => {
//   ///////////////////////////////////////////////////////////////////////////
//   //
//   // ⚠️ Gotcha: Multiple PrismaClient instances created on mount in development mode.
//   //
//   // Even with the singleton pattern correctly implemented, you will see 2+
//   // PrismaClient instances created on application mount (when you go to the app in browser).
//   // Why does this happen? In a Next.js development environment there are multiple Node.js environments.
//   // Next.js runs separate Node.js processes for:
//   //
//   //   - Your page components (browser/client rendering)
//   //   - Your API routes
//   //
//   // Each process has its own memory space and its own global scope.
//   // The global object in one process is completely separate from the global object in another process
//   // The key insight is that in Next.js development mode, the singleton pattern works within each process
//   // but not across different processes. Is this a problem? Having two PrismaClient instances
//   // (one for API routes, one for pages) is generally not a problem. This is actually expected
//   // behavior in Next.js development mode.
//   //
//   /////////////////////////
//   //
//   // ⚠️ Gotcha: new PrismaClient instance generated from within dynamic routes (e.g., '/tickets/123').
//   // This behavior is somewhat expected due to how Next.js handles server components and dynamic route segments.
//   // The reason is that Next.js may load and process dynamic route segments in separate server contexts or isolate
//   // them during rendering, especially when route parameters change. This can create different JavaScript
//   // environments where your globalThis doesn't persist between requests.
//   //
//   // The creation of new PrismaClient instances in this scenario is generally not a critical issue for several reasons:
//   //
//   //   1. Development vs. Production: This behavior is primarily noticeable in development due
//   //      to hot reloading. In production, the server typically has longer-lived processes.
//   //
//   //   2. Ephemeral Nature: Yes, these PrismaClient instances are ephemeral. When Next.js finishes processing
//   //      a request or when the Node.js event loop completes a cycle, unused connections will eventually be garbage collected.
//   //
//   //   3. Built-in Connection Management: Prisma Client has its own connection pooling mechanism that helps manage database connections efficiently.
//   //
//   ///////////////////////////////////////////////////////////////////////////

//   if (process.env.NODE_ENV === 'development') {
//     const time = new Date().toLocaleTimeString('en-US', {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       fractionalSecondDigits: 3
//     })

//     console.log(`\n\nCreating new PrismaClient at ${time}\n\n`)
//   }

//   return new PrismaClient({
//     // See here at 3:30 : https://www.youtube.com/watch?v=Sdd1ScMHzrI
//     // To get the password back you should be able to locally override:  select: { password: true }
//     // omit: {
//     //   user: { password: true }
//     // }
//   }).$extends({
//     // How To Build a Prisma Client Extension: https://www.youtube.com/watch?v=j5LU6q38E-c
//     // While using $allModels is a valid approach, the video points out at 4:00 that you're
//     // sacrificing some type safety. When you use the generic $allModels approach, the runtime
//     // transformation happens, but the TypeScript types remain based on the original Prisma schema.
//     // ❌ model: { $allModels: {} },
//     result: {
//       user: {
//         role: {
//           compute(user) {
//             return user.role.toString()
//           }
//         },
//         ///////////////////////////////////////////////////////////////////////////
//         //
//         // Technically, you can pass a Date across the server/client boundary, and
//         // it will automatically be seriaized into a string. Thus unlike Decimal, JSON knows how
//         // to convert this value. However, it's still a good idea to explicitly tranform the value
//         // here so that there is fidelity between the manually created Typescript types and the inferred type
//         // from Prisma. The tradeoff is that if we ever need to use createdAt on the server, prior to
//         // sending it to the client, we will need to remember that it's actually an ISO 8601 string.
//         //
//         ///////////////////////////////////////////////////////////////////////////
//         createdAt: {
//           compute(user) {
//             return new Date(user.createdAt).toISOString()
//           }
//         },
//         updatedAt: {
//           compute(user) {
//             return new Date(user.updatedAt).toISOString()
//           }
//         }
//       },
//       post: {
//         createdAt: {
//           compute(post) {
//             return new Date(post.createdAt).toISOString()
//           }
//         },
//         updatedAt: {
//           compute(post) {
//             return new Date(post.updatedAt).toISOString()
//           }
//         }
//       }
//     }
//   })
// }

// /* ======================

// ====================== */

// // ❌ const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
// const globalForPrisma = globalThis as unknown as {
//   prisma: ExtendedPrismaClient
// }

// // ❌ export const prisma = globalForPrisma.prisma || new PrismaClient()
// export const prisma = globalForPrisma.prisma || createExtendedPrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
