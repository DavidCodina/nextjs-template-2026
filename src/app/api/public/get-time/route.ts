import { codes, handleError } from '@/utils'

/* ========================================================================

======================================================================== */

// Note: If you reload the page, you will still see the time change.
// This is because there's no caching during development.
// Thus run `npm run build` and `npm run start`.
// The cached time will now reference when the app was built.
// export const dynamic = 'force-static'

///////////////////////////////////////////////////////////////////////////
//
// But what if we want to periodically update our data without rebuilding the entire application?
// For that case, we can use revalidate. This is a form of incremenal static regeneration.
//
// ⚠️ After 30s have passed, the next request will still show the cached data, while a new version of
// the code is generated in the background. Then the next time that request is made, the new data
// will be shown. This is super weird and unintuitive!
//
// Why did Next.js decide to do it like this? They decided to prioritize instant response times over
// immediate freshness. Here's why this design choice was made:
//
//   1. User Experience - Speed Wins
//      The pattern helps developers balance between immediacy—loading cached content right away—and freshness—ensuring
//      updates to the cached content are used in the future InfoQ. When the 30 seconds expires:
//
//      - First request after expiry: User gets instant response (stale data) + regeneration happens in background
//      - Second request: User gets the fresh data
//
//      The alternative would be:
//      - First request after expiry: User waits for regeneration to complete before getting a response
//
//     The advantage for this method is that more users receive content from the cache, which is likely much faster.
//     Your server only needs to handle the revalidation requests happening 'in the background', without keeping users waiting
//
//  2. Resilience and Reliability
//     If an error is thrown while attempting to revalidate data, the last successfully generated data will continue to be
//     served from the cache Next.js. This means if your regeneration fails:
//
//     - Users still get a working response (slightly stale)
//     - Your app doesn't break
//     - Next.js will retry on the next request
//
//   3. Server Load Management:
//      The philosophy is: "If nobody's visiting, why waste server resources regenerating?"
//      Next.js rebuilds the page only when the same page is requested again. It allows to only rebuild pages according to
//      their traffic. If you have a very low traffic page, you don't want to rebuild it every 60sec for no reason GitHub.
//      This is traffic-based regeneration rather than time-based. A page that nobody visits doesn't waste server resources
//      regenerating.
//
//   4. HTTP Standard Pattern
//      This isn't a Next.js invention - it's part of the HTTP caching mechanism and is defined in RFC 5861.
//      The pattern has been used successfully across CDNs and caching layers for years.
//
//      - https://medium.com/@rathkalyforgna/what-is-stale-while-revalidate-f1f22d408f6a
//      - https://www.debugbear.com/docs/stale-while-revalidate
//
//
// The pattern assumes: Showing slightly stale content instantly is better than making users wait for fresh content.
// This works great for:
//
//   - Blogs, news sites, product pages
//   - Content that changes occasionally but not critically
//   - High-traffic pages where someone will trigger updates regularly
//
// It works poorly for:
//
//   - Stock tickers, live scores
//   - Content requiring strict consistency
//   - Low-traffic pages where staleness accumulates
//
// Note: the cache is shared across all users. Here's the consequence:
//
//   - Assuming you have many users making frequent requests per a minute.
//     In this case, the user who actually triggers the regeneration (i.e., the "trigger user")
//     will likely get data that is at most a minute stale.
//
//   - However, if there are very few users and the API only gets hit once an hour, then the
//     trigger user will end up with VERY stale data!
//
// The irony is that ISR works best for popular pages (where it saves tons of server resources)
// but can be problematic for unpopular pages (where staleness accumulates). It's a traffic-based
// optimization that assumes your pages are actually getting traffic!
//
///////////////////////////////////////////////////////////////////////////

// ⚠️  Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`. Please remove it.
// export const revalidate = 30

// ⚠️ Caching only works with GET. Caching will not work when using the request object,
// or working with dynamic functions like headers() and cookies().
export async function GET(/* _req: Request*/) {
  try {
    /* ======================
            Response
    ====================== */

    return Response.json({
      code: codes.OK,

      data: {
        time: new Date().toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        })
      },
      message: 'Success.',
      success: true
    })
  } catch (err) {
    // if (err instanceof Error) { console.log({ name: err.name, message: err.message }) }
    return Response.json(handleError(err), { status: 500 })
  }
}
