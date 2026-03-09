import 'dotenv/config'

import { PrismaClient /* , Prisma */ } from '@/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set.')
}
const connectionString = DATABASE_URL
const adapter = new PrismaNeon({ connectionString })

/* ========================================================================

======================================================================== */
// Extends the PrismaClient with a custom result transformer to convert
// the price and rating fields to strings. Prisma’s schema (schema.prisma)
// itself doesn’t support defining computed transformations like converting
// decimals to strings. The database schema is purely declarative—it defines
// structure but doesn’t execute transformations.

// Gotcha: Brad did not include logic for preventing multiple PrismaClient instances.
// This is explicitly demonstrated in https://neon.tech/docs/guides/prisma

/* ======================

====================== */

const createExtendedPrismaClient = () => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: Multiple PrismaClient instances created on mount in development mode.
  //
  // Even with the singleton pattern correctly implemented, you will see 2+
  // PrismaClient instances created on application mount (when you go to the app in browser).
  // Why does this happen? In a Next.js development environment there are multiple Node.js environments.
  // Next.js runs separate Node.js processes for:
  //
  //   - Your page components (browser/client rendering)
  //   - Your API routes
  //
  // Each process has its own memory space and its own global scope.
  // The global object in one process is completely separate from the global object in another process
  // The key insight is that in Next.js development mode, the singleton pattern works within each process
  // but not across different processes. Is this a problem? Having two PrismaClient instances
  // (one for API routes, one for pages) is generally not a problem. This is actually expected
  // behavior in Next.js development mode.
  //
  /////////////////////////
  //
  // ⚠️ Gotcha: new PrismaClient instance generated from within dynamic routes (e.g., '/tickets/123').
  // This behavior is somewhat expected due to how Next.js handles server components and dynamic route segments.
  // The reason is that Next.js may load and process dynamic route segments in separate server contexts or isolate
  // them during rendering, especially when route parameters change. This can create different JavaScript
  // environments where your globalThis doesn't persist between requests.
  //
  // The creation of new PrismaClient instances in this scenario is generally not a critical issue for several reasons:
  //
  //   1. Development vs. Production: This behavior is primarily noticeable in development due
  //      to hot reloading. In production, the server typically has longer-lived processes.
  //
  //   2. Ephemeral Nature: Yes, these PrismaClient instances are ephemeral. When Next.js finishes processing
  //      a request or when the Node.js event loop completes a cycle, unused connections will eventually be garbage collected.
  //
  //   3. Built-in Connection Management: Prisma Client has its own connection pooling mechanism that helps manage database connections efficiently.
  //
  ///////////////////////////////////////////////////////////////////////////

  if (process.env.NODE_ENV === 'development') {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })

    console.log(`\n\nCreating new PrismaClient at ${time}\n\n`)
  }

  return new PrismaClient({
    ///////////////////////////////////////////////////////////////////////////
    //
    // Prisma's Global Omit
    //
    //   https://www.prisma.io/blog/introducing-global-omit-for-model-fields-in-prisma-orm-5-16-0
    //   https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
    //   ByteGrad at 3:30 : https://www.youtube.com/watch?v=Sdd1ScMHzrI
    //
    // To get the password back you should be able to locally override with:
    //
    //   omit: { password: false }
    //
    //   Or:
    //
    //   select: { password: true }
    //
    // This is especially important in the auth.ts authorize() function, used for logging in
    // and/or any login() action you may have.
    //
    ///////////////////////////////////////////////////////////////////////////

    //# omit: { user: { password: true } },

    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Make sure to include: previewFeatures = ["driverAdapters"] in the schema.prisma file.
    // Then rerun `npx prisma generate`. Otherwise, you'l get an error here:
    //
    //   Object literal may only specify known properties, and 'adapter' does not exist
    //   in type 'Subset<PrismaClientOptions, PrismaClientOptions>'.
    //
    // https://www.prisma.io/docs/orm/overview/databases/database-drivers#driver-adapters
    //
    ///////////////////////////////////////////////////////////////////////////
    adapter: adapter
  }).$extends({
    // How To Build a Prisma Client Extension: https://www.youtube.com/watch?v=j5LU6q38E-c
    // While using $allModels is a valid approach, the video points out at 4:00 that you're
    // sacrificing some type safety. When you use the generic $allModels approach, the runtime
    // transformation happens, but the TypeScript types remain based on the original Prisma schema.
    // ❌ model: { $allModels: {} },
    result: {
      //# user: {
      //   role: {
      //     compute(user) {
      //       return user.role.toString()
      //     }
      //   },
      //   ///////////////////////////////////////////////////////////////////////////
      //   //
      //   // Technically, you can pass a Date across the server/client boundary, and
      //   // it will automatically be seriaized into a string. Thus unlike Decimal, JSON knows how
      //   // to convert this value. However, it's still a good idea to explicitly transform the value
      //   // here so that there is fidelity between the manually created Typescript types and the inferred type
      //   // from Prisma. The tradeoff is that if we ever need to use createdAt on the server, prior to
      //   // sending it to the client, we will need to remember that it's actually an ISO 8601 string.
      //   //
      //   ///////////////////////////////////////////////////////////////////////////
      //   createdAt: {
      //     compute(user) {
      //       return new Date(user.createdAt).toISOString()
      //     }
      //   },
      //   updatedAt: {
      //     compute(user) {
      //       return new Date(user.updatedAt).toISOString()
      //     }
      //   },

      //   emailVerified: {
      //     compute(user) {
      //       if (user.emailVerified instanceof Date) {
      //         return new Date(user.emailVerified).toISOString()
      //       }
      //       return user.emailVerified
      //     }
      //   }
      //# },

      post: {
        createdAt: {
          compute(post) {
            return new Date(post.createdAt).toISOString()
          }
        },
        updatedAt: {
          compute(post) {
            return new Date(post.updatedAt).toISOString()
          }
        }
      }
    }
  })
}

/* ======================

====================== */

type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>
const globalForPrisma = global as unknown as { prisma: ExtendedPrismaClient }

export const prisma = globalForPrisma.prisma || createExtendedPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
