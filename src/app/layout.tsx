///////////////////////////////////////////////////////////////////////////
//
// Next.js will complain if you use <link> to bring in Material Symbols:
//
//   <head>
//     <link // eslint-disable-line
//       href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
//       rel='stylesheet'
//     />
//   </head>
//
// Unfortunately, there is no MaterialSymbols export in 'next/font/google' :
// https://github.com/vercel/next.js/discussions/42881
//
// However, we can do this in globals.css :
//
//   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
//
// Another potential option is to use:
//
//   https://github.com/google/material-design-icons --> https://github.com/marella/material-symbols/tree/main/material-symbols#readme
//
// This is what I've done here.
//
///////////////////////////////////////////////////////////////////////////

import 'material-symbols'
import '../styles/globals.css'

import { CSSProperties } from 'react'
//^ import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { Providers } from '@/contexts'
import { Toaster } from '@/components/sonner'

import { SidebarTrigger, SidebarProvider, SidebarFlipper, SidebarInset } from 'components/sidebar'

import { AppSidebar } from '@/components/AppSidebar'

/* ======================
        fonts
====================== */

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

/* ======================
        metadata
====================== */

// export const metadata: Metadata = {
//   title: 'Demo',
//   description: 'Demo Next.js App'
// }

export const metadata: Metadata = {
  title: {
    default: 'Demo',
    template: '%s | Demo'
  },
  description: 'Demo Next.js App'
}

/* ========================================================================
                                RootLayout
======================================================================== */

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: The primary layout.tsx was using cookies() as part of the the SidebarProvider implementation.
  //
  //   const cookieStore = await cookies()
  //   Using cookies() in a layout makes the entire route segment (and all child routes) dynamic, even with generateStaticParams.
  //   const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'
  //
  // However, there's a MAJOR problem with that. It causes every child page.tsx that would otherwise be built
  // as static to instead be built as a dynamic page.
  //
  // What's worse is that in some cases static pages implemented generateStaticParams() will look correct
  // in the build output:
  //
  //   ├ ● /static-rendering/[id]                 685 B         308 kB
  //   ├   ├ /static-rendering/1
  //   ├   ├ /static-rendering/2
  //   ├   └ /static-rendering/3
  //
  //   ...
  //
  //   ○  (Static)   prerendered as static content
  //   ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
  //   ƒ  (Dynamic)  server-rendered on demand
  //
  // But in actual practice, the pages won't behave statically because the build
  // doesn't actually generate the associated .html pages (i.e., silently fails).
  //
  // The ShadCN SidebarProvider is no longer using cookies() or the defaultOpen prop.
  // In the future, if we really want that feature, we can instead read from localStorage.
  //
  ///////////////////////////////////////////////////////////////////////////

  //^ const cookieStore = await cookies()
  //^ Using cookies() in a layout makes the entire route segment (and all child routes) dynamic, even with generateStaticParams.
  //^ const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  /* ======================
          return
  ====================== */
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${poppins.className} flex w-full flex-1 flex-col antialiased`}
        style={{
          // ❌ 100vh does not work well on mobile/tablet.
          minHeight: '100dvh',
          width: '100%'
        }}
      >
        <Providers>
          {/* ⚠️ Make sure <Toaster /> is placed first to avoid potential race conditions when a page mounts.
          Also, make sure <Toaster /> is inside of <Providers>, so it has access to the theme. */}
          <Toaster />
          {/* <SessionProvider> */}

          {/* The SidebarProvider is consumed here and not with the other providers in order
          to implement the optional 'persisted State' feature with cookies. */}

          <SidebarProvider
            // defaultSide='right'
            defaultCollapsible='icon'
            // defaultVariant='inset'
            forceMobile={false}
            // For multiple sidebars in your application, you can use the style prop to set
            // the width of the sidebar. To set the width of the sidebar, you can use
            // the --sidebar-width and --sidebar-width-mobile CSS variables in the style prop.
            // The values must be of type string. They will have precedence over the SIDEBAR_WIDTH
            //  and SIDEBAR_WIDTH_MOBILE constants set in the component files.
            style={
              {
                // '--sidebar-width': '20rem',
                // '--sidebar-width-mobile': '20rem'
              } as CSSProperties
            }
            //^ defaultOpen={defaultOpen}
            defaultOpen={false}
            // Gotcha: The presence of this prop assumes it's a controlled component
            // being used in conjunction with the `open` prop. Consequently, the normal
            // behavior of the SidebarTrigger will not work. Moreover, if you want to
            // implement a controlled implementation, then the provider must me moved into
            // a client component.
            // onOpenChange={(open) => { }}
          >
            <SidebarFlipper AppSidebar={AppSidebar} SidebarTrigger={SidebarTrigger}>
              <SidebarInset
                // SidebarInset checks the value of variant internally and only applies className and style
                // when variant === 'inset'.

                // ❌ md:max-h-[calc(100vh_-_16px)]

                //^ Was: md:max-h-[calc(100dvh_-_16px)]
                className='md:border-primary md:max-h-[calc(100dvh-16px)] md:overflow-y-auto md:border'
              >
                {children}
              </SidebarInset>
            </SidebarFlipper>
          </SidebarProvider>
          {/* </SessionProvider> */}
        </Providers>
      </body>
    </html>
  )
}
