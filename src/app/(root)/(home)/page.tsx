import Link from 'next/link'
import { Page, PageContainer, UpdateTagButton } from '@/components'

// import { ComponentDemos } from '@/components/ComponentDemos'

//# Review caching
// Todo: Test out caching behavior and invalidateTag behavior.

//` Update eCommerce app with all auth related files, including proxy.ts. Parts of auth.ts, etc.

//# Review Better Auth
//# - including custom components: SignedIn, SignedOut, SignIn, Authenticated, AdminOnly, getServerSession.

//# Also review auth.actions and user.actions. These look fucked up.

//# Also ProtectedAction, which looks like it needs updating...

//# Also review login and register pages.

//# Also review my blog article here:
//# https://www.linkedin.com/posts/david-codina-b7b015230_nextjs-proxyts-for-superficial-authentication-activity-7408243100751454208-n1p2

//# When I deploy this to Vercel it's 7 hours ahead.
//# How can I fix that?

// const getTime = async () => {
//   const time = new Date().toLocaleTimeString('en-US', {
//     hour12: true,
//     hour: 'numeric',
//     minute: '2-digit',
//     second: '2-digit'
//   })

//   return time
// }

/* ========================================================================

======================================================================== */

// Todo: Sidebar needs CSS fix for the border when both defaultCollapsible='none' and defaultVariant='inset'
//# Also defaultCollapsible='none' Sidebar header is not right.

// Todo: Create a Posts and PostDetails page with full CRUD.

// Todo: As an experiment, eventually switch back to the local Postgres database
//# when in development.

// Todo: Review Calendar behavior and best practices/contracts when sending dates to server.

// Todo: Build out RHF controlled form demo.

// Todo: Change all /components components to PascalCase & update components/index.ts
//# Watch out for Vercel Gotcha - name append 'X' temporarily.

// Bonus: Consider adding special variants in button, badge, and alert of
// light, dark, and light-dark. These will be quasi-custom color variants.

const Home = async () => {
  // Anti-pattern: Do not await an async function directly in page.tsx,
  // especially the home page. It will always block rendering.
  // Instead, wrap a child component in a Suspense and either await
  // the async data locally in the child component, or pass down a
  // promise as a prop the the child component and implement use() API.
  // ❌ const session = await getData()

  // const posts   = await getPosts()
  // const { data } = await getUsers()

  // const time = await getTime()

  /* ======================
          return
  ====================== */
  return (
    <Page
    // currentPageLoader
    // currentPageLoaderProps={{
    //   className: 'border border-2 border-dashed border-pink-500'
    // }}
    >
      <PageContainer

      ///////////////////////////////////////////////////////////////////////////
      //
      // By default, PageContainer will scroll if content overflows:
      //
      //   <div className='h-12 bg-sky-400' style={{ width: 1200 }} />
      //
      // Pass `overflow-hidden` if you want to prevent the scroll behavior.
      // Alternatively, pass `overflow-x-auto` to Page.
      //
      ///////////////////////////////////////////////////////////////////////////
      >
        <div className='my-12 flex items-center justify-center gap-4'>
          <Link
            className='text-primary border-primary rounded-lg border px-2 py-1 font-bold hover:underline'
            href='/caching'
          >
            Cached Post Page
          </Link>

          <UpdateTagButton
            // Client-side only
            // onUpdated={(result) => { console.log('\nUpdate result:', result) }}
            shouldLog={true}
            tag='posts'
            size='sm'
          >
            Update Posts
          </UpdateTagButton>
        </div>

        {/* <Snippet
          className='my-12'
          code={`export const randomFail = (failureRate: number = 0.5): boolean => {
  if (typeof failureRate !== 'number' || failureRate > 1 || failureRate < 0) {
    failureRate = 0.5
  }

  return Math.random() < failureRate
}`}
        /> */}

        {/* <style>{`
        .pushable {
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(
      to left,
      hsl(340deg 100% 16%) 0%,
      hsl(340deg 100% 32%) 8%,
      hsl(340deg 100% 32%) 92%,
      hsl(340deg 100% 16%) 100%
    );
  }
  .front {
    display: block;
    position: relative;
    padding: 12px 42px;
    border-radius: 12px;
    font-size: 1.25rem;
    color: white;
    background: hsl(345deg 100% 47%);
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .pushable:hover {
    filter: brightness(110%);
  }

  .pushable:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  .pushable:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  .pushable:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  .pushable:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
  }

  .pushable:focus:not(:focus-visible) {
    outline: none;
  }
        `}</style>

        <button className='pushable'>
          <span className='shadow'></span>
          <span className='edge'></span>
          <span className='front'> Push me </span>
        </button> */}

        {/* <div className='text-primary my-6 text-center text-xl'>{time}</div> */}
        {/* <ComponentDemos /> */}
      </PageContainer>
    </Page>
  )
}

export default Home
