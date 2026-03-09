# About This Project

...

## `cacheComponents:true`

This project uses `cacheComponents`. However, as of Next.js version 16.1.6, they're still not really ready for production. In particular, the feature doesn't integrate well with authentication systems like Better Auth because it does away with navigation blocking. Essentially, this means that all page-level server session checks need to be wrapped in Suspense, rather than occurring directly on the `page.tsx`, which leads to bad UX. Even Dan Abramov notes that one should still be able to opt into page blocking behavior (See: [issues/86739](https://github.com/vercel/next.js/issues/86739)).

The other issue with `cacheComponents` is that any package that uses `new Date()` will trigger an error. This currently happens with Prisma.

#### Update (October 2026):

With Next.js 16.3, they introduced `export const instant = false`, which brings navigation blocking back. The Prisma issue was discussed in [issue #28588](https://github.com/prisma/orm/issues/28588), resolved in [PR #28724](https://github.com/prisma/orm/pull/28724), and released in [Prisma 7.6.0](https://github.com/prisma/orm/releases/tag/7.6.0).

#### Regarding UI State Preservation

The `cacheComponents` paradigm flips assumptions about navigation on their head. [Component state now persists across navigations](https://nextjs.org/docs/app/guides/migrating-to-cache-components#ui-state-preservation) (See also [PR #93633](https://github.com/vercel/next.js/pull/93633)). One way to get back to the expected behavior is to use the donut pattern and do this kind of thing in `src/components/NoPreserve/index.tsx`:

```
'use client'

import  * as React  from  'react'
import { useRouter } from  'next/navigation'

export  const  NoPreserve  = ({ children }: { children:  React.ReactNode }) => {
  const { bfcacheId } =  useRouter()
  return  <React.Fragment  key={bfcacheId}>{children}</React.Fragment>
}
```

All of the custom `<Page />` components in this app already have that baked into their logic with an _opt-in_ prop of `preserve`.

#### Regarding Error Caching

One other thing about `cacheComponents` is that it becomes critically important to always have retry UI in the case of an error. Unlike TanStack Query, there's no background refetching, so unless you do this kind of thing, you may end up creating static UI errors:

```
if (success !== true) {
  return (
    <Alert
      leftSection={<AlertCircle className='size-6'/>}
      // 👇🏻 Calls updateTagAction internally...
      rightSection={
        <UpdateTagButton tag='posts' size='sm' variant='destructive'>
          Retry
        </UpdateTagButton>
      }
      title={'Error'}
      variant={'destructive'}
      className='mx-auto my-6 max-w-200'
    >
      {message}
    </Alert>
  )
}
```

## Authentication

Better Auth is used with credentials + GitHub and Google providers. The credentials feature also supports email verification and password reset.

## Comments

This project has lots of comments! This is a work in progress, and not intended as production-grade code.

## UI

Many of the components in the `components/` folder are abstractions on top of Radix UI. For production, I would switch to Base UI (as was done in the newer Tanstack Start template).

## Server Actions and Server Functions

Both server actions and server functions (i.e., `server-only` "query" functions) use an envelope pattern to consistently returns a type of `ResponsePromise`. Obviously, in the latter case it's not technically an HTTP response being returned, but conceptually it's still reasonable to follow this convention.

```
export type Code = (typeof codes)[keyof typeof codes]

export  type  ResBody<DataType> = {
  code?: Code
  data: DataType
  errors?: Record<string, string> | null
  message: string
  success: boolean
}

export type ResponsePromise<T = unknown> = Promise<ResBody<T>>
```

This shape makes sense here because there's no actual HTTP `status` or `statusText` to rely on. Conversely, actual API routes carry the success/failure signal in the `status` code, which allows us to simply return bare data directly (no envelope). Using bare data in that context also aligns with the way modern libraries like TanStack Query (SWR, Nuxt useFetch, etc.) are designed to consume async functions.

## Optional: TanStack Query

Caching in Next.js has been a pain point since the app router first released. Even with the introduction of `export const instant = false` and `cacheComponents` now being stable in v16.4, it's still a pain. The Next caching system is built on the foundation of a server cache. This is arguably the wrong tool for the job. Client-first caching systems like TanStack Query are often much easier to work with and reason about.

It's worth noting that [TanStack Start is now stable](https://tanstack.com/blog/tanstack-start-1-0)! If you have a new project, then that's probably the best way to go. However, if you're locked into, or simply prefer staying with Next.js, _you don't have to adopt every part of it_.

**Note:** `src/utils/getQueryClient.ts` implements the `QueryClient` with server prefetching in mind. However, there's largely no practical benefit to prefetching on the server. Suppose you want navigation blocking when there is no cached data, but instant rendering with background refetching when there is cached data. That can be accomplished simply through `useSuspenseQuery` in a child client component plus `export const instant = false` on the `page.tsx`, and yes that does also populate the source code with the HTML for SEO.

#### Hybrid Approach

One strategy that can be useful is to rely solely on `cacheComponents` for the caching layer, but still employ TanStack Query for the occasional client-side fetch. The trick here is setting `gcTime: 0`. This essentially allows one to implement `useQuery`/`useSuspenseQuery` as a fetching hook (more or less analagous to `useFetch` from Nuxt.js), while opting out of caching. This gives you a quick and easy client-side fetching solution without the manual implementation of `error`,`loading` and `data` states, and no `useEffect`.

```
const { data } = useSuspenseQuery({
  queryKey: ['_posts'],
  queryFn: getPosts,
  gcTime:  0, // 👈🏻 No caching!
  staleTime:  0
})
```

#### Implications Of Using TanStack Query At Scale

One consequence of serious adoption of TanStack Query as the caching layer is that it likely implies writing more API routes and less server actions and `server-only` query functions. In theory, it's possible to run a client-side server action within `useQuery`/`useSuspenseQuery`, but it's pretty hacky. Moreover, server actions are technically intended for mutations and not queries.

```
queryFn: async () => {
  await Promise.resolve()
  return getPostsAction()
}
```
