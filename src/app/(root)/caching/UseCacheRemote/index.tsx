import { cacheTag } from 'next/cache'
import { UpdateTagButton } from '@/components'
import { sleep } from '@/utils'

const getTime = async () => {
  'use cache: remote'
  cacheTag('time')

  await sleep(2000)

  const time = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })

  console.log(`\nGetting time: ${time}\n`)

  return time
}

/* ========================================================================
              
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// 💲💲💲 Remote costs extra (storage and network latency), and tag-purge calls are rate limited by plan.
//
// https://nextjs.org/docs/app/api-reference/directives/use-cache-remote
//
// Remote caching provides the most value when content is deferred to request
// time (outside the static shell). This typically happens when a component
// accesses request values like cookies(), headers(), or searchParams, placing
// it inside a Suspense boundary.
//
// Note: like 'use cache', 'use cache: remote' (AKA cache at runtime) is still
// shared across all users.
//
// User 1 in Seattle is on the app and goes to the page that runs this component.
// It then gives them back a time of 10:00:00 AM. Then user 2 in Portland goes to
// the app 5 minutes later and goes to the page that runs this component. They will
// also get the value of 10:00:00 AM.
//
// The key difference: plain 'use cache' can be baked in at build time, while 'use cache: remote'
// is deferred to runtime and cached on the first real request.
//
// Why remote vs. in-memory matters
//
//   In-memory caches are per instance. On serverless or multi-instance setups:
//
//     - Instances are ephemeral, so the cache vanishes when the instance is recycled.
//
//     - Instance A and instance B each have their own cache, so user 1 might see 10:00:00
//       and user 2 (hitting another instance) might see 10:05:00.
//
// Remote caching fixes both: one shared entry, and it survives deploys of instances and cold starts.
// So the use case is an expensive computation or fetch that happens at request time, where you want
// one shared result across all instances. For example, a DB query or API call that depends on a
// runtime value like a cookie-derived region or a searchParams filter. Y
//
/////////////////////////
//
// Plain 'use cache' stores data in memory. On Vercel, your app runs as serverless functions.
// Each function instance has its own memory. When the instance shuts down, the cache is gone.
//
// “Instance” means one running copy of your server: a separate process or container with its own memory.
// Even with one app, one repo, and one deployment, Vercel doesn’t run it as a single always-on server.
//
// How Vercel creates multiple instances
//
//   Your app runs as serverless functions. Vercel spins up an instance when a request arrives and no existing one is available, and it can run many at once. You get several instances when:
//
//   - Traffic is concurrent. If many requests arrive at once, Vercel scales out to handle them in parallel.
//   - Users are in different regions. Depending on your function region config, requests may be handled in different data centers, each with its own instances.
//   - A cold start happens. After idle time, instances are shut down. The next request starts a fresh one with empty memory.
//   - You deploy. A new deployment means new instances, all starting empty.
//
// Your Seattle/Portland example makes this concrete. User 1’s request may be handled by instance A, which runs getTime() and stores the result in its
// own memory. Five minutes later, user 2’s request may land on instance B, or on A after it was shut down and restarted. Either way, there’s nothing in memory.
//
// What that means for caching
//
//   +----------------------+----------------------------+------------------------------------------------+
//   | Directive            | Where the cached value     | Consequence on Vercel                          |
//   |                      | lives                      |                                                |
//   +----------------------+----------------------------+------------------------------------------------+
//   | 'use cache'          | In-memory on that one      | Each instance may compute and cache its own    |
//   |                      | instance                   | copy. Users can see different values, and the  |
//   |                      |                            | cache disappears when the instance is          |
//   |                      |                            | recycled.                                      |
//   +----------------------+----------------------------+------------------------------------------------+
//   | 'use cache: remote'  | A shared store outside any | All instances read the same entry. It          |
//   |                      | instance                   | survives cold starts and deploys of instances. |
//   +----------------------+----------------------------+------------------------------------------------+
//
// 'use cache: remote' stores the cached data in a shared key-value store that all serverless instances can access.
// On Vercel, this is called Runtime Cache. It lives in the same region as your function. You do not set it up.
// Vercel provides it automatically.
//
// So 'use cache: remote' matters for request-time content where you want one computation shared across all
// instances, not one per instance. That’s most valuable when the computation is expensive (slow DB query,
// rate-limited API) and the content can’t be baked into the static shell at build time.
//
// If your app is low-traffic, you may rarely notice the difference, since one warm instance might handle everything.
// The difference appears under load, across regions, or after idle periods. That’s also why testing locally can mislead
// you: locally you only ever have one instance, so 'use cache' and 'use cache: remote' look identical.
//
/////////////////////////
//
// Do we ever NEED 'use cache: remote' for it to work?
//
// No, you never need 'use cache: remote' for something to work. The docs say this:
//
//   Remote caching provides the most value when content is deferred to request time
//   (outside the static shell). This typically happens when a component accesses request
//   values like cookies(), headers(), or searchParams.
//
// However, that's a little misleading because cookies(), headers(), and searchParams
// all work the same whether you implement 'use cache' or 'use cache: remote'.
//
// Remote only changes where the entry is stored, so the cache survives instance death
// and is shared by every instance. Whether that matters depends entirely on how much
// a miss costs you. For most apps it doesn’t, and plain 'use cache' is the right choice.
//
/////////////////////////
//
// Why would we ever need 'use cache: remote'?
//
//   1. The upstream is expensive or limited. A paid API charged per call, a rate-limited third-party
//      service, or a 5-second report query. Each redundant miss costs money or burns quota.
//
//   2. Fan-out under load. With many serverless instances, a popular key can miss once per instance.
//     A thousand concurrent users could trigger dozens of identical expensive calls instead of one.
//
//   3. User-facing latency. The unlucky user who hits a cold instance waits through the full miss.
//      If the miss is 2+ seconds, that’s visible.
//
//   4. Invalidation consistency (possibly the strongest reason). With per-instance memory, calling
//      updateTag/revalidateTag may only clear the entry on the instance that handled that call,
//      while other instances keep serving the stale value until it expires. A shared store gives
//      you one entry to invalidate. I’m not certain exactly how Vercel propagates invalidation for
//      in-memory entries, so verify that in the docs. If it’s a real gap, it’s a correctness argument,
//      not just a performance one.
//
/////////////////////////
//
// TL;DR:
//
//  If refetching on a new instance is cheap and nothing downstream is rate-limited or billed per call,
//  plain 'use cache' is the right choice and 'use cache: remote' isn’t for you.
//
//   - 'use cache' and 'use cache: remote' behave identically in code. Same APIs, same keys, same results.
//      The only difference is where the entry is stored: per-instance memory vs. a shared durable store.
//
//   - Remote is a tuning knob for expensive or limited misses, or for cases where you need consistent
//     invalidation across instances. It’s not a capability switch.
//
//   - The headers/cookies/searchParams framing in the docs is just describing when a cache miss happens
//     at request time, not something remote enables.
//
//   - Default to 'use cache'. Reach for remote only if production logs or bills show you repeated
//     expensive misses, or you see stale data lingering after invalidation.
//
// 'use cache: remote' can be confusing if you're looking for an answer to "why do I need this" and just
// not getting it. It’s a niche optimization, and you can safely ignore it until a real problem points you to it.
//
/////////////////////////
//
// Addendum:
//
// If I'm on instance A and have cached posts, then I add a post and call updatedTag('posts'), does that affect
// only instance A, or does Vercel propagate tag invalidation across instances? If it only affects instance A,
// then that's another important use case for using a remote KV store (i.e., 'use cache: remote'). Again, if
// no propagation occurs, but you NEED immediate world-wide fidelity between all instances of the data, then
// 'use cache: remote' might be the right answer.
//
// The docs seem to imply that updateTag() only works locally - No default cross-instance tag sync.
//
//   https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers#distributed-tag-coordination
//   When running multiple Next.js instances, tag invalidation must be coordinated across instances.
//   The default in-memory handler only tracks tags locally, so calling revalidateTag() on one instance
//   does not affect others.
//
// It seems that we don't know if updateTag syncs across instances, but evidence seems to suggest that it doesn't.
// Thus, in cases where we absolutely need reliable, cross-instance cache purging 'use cache: remote' gives you
// shared caching AND tag invalidation across server instances.
//
// Thus 'use cache: remote' has at least two distinct reasons to exist:
//
//   1. Protecting expensive or rate-limited upstreams (performance and cost).
//      Plain 'use cache' lives in each instance’s memory, so a popular key can miss once per instance and once
//      per cold start. A shared store means roughly one miss per cache lifetime. If a miss is cheap, you can ignore this.
//
//   2. Consistent invalidation across instances (correctness).
//      With plain 'use cache', a call like updateTag('posts') clears the entry where it runs. Self-hosted with the default
//      handler, other instances keep serving their old copy until cacheLife expires it. On Vercel, whether plain 'use cache'
//      gets purged across instances is undocumented. With 'use cache: remote', the entry lives in a shared store, and
//      Vercel documents global tag invalidation (around 300ms). If “everyone must see the new post right away” is a
//      requirement, this is the safer choice.
//
/////////////////////////
//
// Regarding the docs emphasis on cookies(), headers() and searchParams.
//
//   Remote caching provides the most value when content is deferred to request time
//   (outside the static shell). This typically happens when a component accesses
//   request values like cookies(), headers(), or searchParams, placing it inside a
//   Suspense boundary.
//
// First and foremost, remote caching is NOT tied to them. cookies(), headers() and searchParams
// behave the same regardless of whether you're using 'use cache' or 'use cache: remote'. In other
// words, just because you're using one of those should not be the determining factor in whether or
// not you reach for 'use cache: remote'.
//
// The docs say remote caching is most valuable for content deferred to request time, “typically”
// because a component reads cookies(), headers(), or searchParams. The first half is accurate,
// but the second half is misleading because it makes remote caching sound tied to those APIs.
// It isn’t. They are just some common way to end up outside the static shell. Dynamic route
// params are the other common cause, but they can often be partly prerendered with generateStaticParams,
// so they’re a less clean example.
//
// In practice, a function keyed by searchParams.category behaves no differently from one keyed
// by a route param like getPost(id) on /posts/[id]. In both cases the cache sees a function
// plus its arguments and stores one entry per distinct combination, and in both cases the
// worst-case cost of using in-memory caching is roughly (distinct keys) × (instances that see them)
// upstream calls per cache lifetime.
//
// The real rule is that remote caching pays off when content is rendered at request time and either
//
//   1. a cache miss is expensive, slow, rate-limited, or billed per call, so you don’t want each instance to repeat it
//   2. invalidation needs to be consistent across instances.
//
// So... Just to belabor the point. Let's say we have a bunch of posts that can be accessed individually via route param.
// Should we necessarily cache them with 'use cache: remote'? No. It depends primarily on the same factors as before:
//
//   - whether a miss is slow, costly or rate-limited.
//   - whether updates need to show up consistently for everyone.
//
// That's it!
//
///////////////////////////////////////////////////////////////////////////

export const UseCacheRemote = async () => {
  const time = await getTime()
  /* ======================
          return
  ====================== */

  return (
    <>
      <UpdateTagButton className='mx-auto flex' shouldLog={true} tag='time' size='sm'>
        Update Time
      </UpdateTagButton>
      <div className='text-primary my-12 text-center text-4xl font-bold'>{time}</div>
    </>
  )
}
