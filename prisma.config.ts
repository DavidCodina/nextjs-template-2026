///////////////////////////////////////////////////////////////////////////
//
// This is necessary - even in Next.js.
//
//   import 'dotenv/config'
//
// While it may work without explicitly installing dotenv, it's a bad
// practice to rely on transitive dependencies.
//
///////////////////////////////////////////////////////////////////////////
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    // Note that src/db/prisma.ts still uses DATABASE_URL for runtime queries.
    url: env('DIRECT_URL')
  }
  // https://www.npmjs.com/package/tsx
  // seed: 'tsx prisma/seed.ts'
})
