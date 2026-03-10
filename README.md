# About This Project

...

## `cacheComponents:true`

This project uses `cacheComponents`. However, as of Next.js version 16.1.6, they're still not really ready for production. In particular, the feature doesn't integrate well with authentication systems like Better Auth because it does away with page blocking. Essentially, this means that all page-level server session checks need to be wrapped in Suspense, rather than occurring directly on the page.tsx, which leads to bad UX. Even Dan Abramov notes that one should still be able to opt into page blocking behavior (See: [issues/86739](https://github.com/vercel/next.js/issues/86739)). That said, this seems to be the direction that Next.js is heading in, so this template still uses `cacheComponents`.

The other issue with `cacheComponents` is that any package that uses `new Date()` will trigger an error. This currently happens at times with Better Auth and with Prisma, which means that a lot of components now also need to be wrapped in `Suspense` just to prevent these errors.

Ultimately, for production if you want a caching system, it's recommended to opt out of `cacheComponents`, and instead use Tanstack Query. Client-side caching is much more intuitive and predictable.

## Authentication

Better Auth is used with credentials + GitHub and Google providers. The credentials feature also supports email verification and password reset.

## Comments

This project has lots of comments! This is a work in progress, and not intended as production-grade code.

## UI

Many of the components in the `components/` folder are abstractions on top of Radix UI. For production, I would switch to Base UI (as was done in the newer Tanstack Start template).
