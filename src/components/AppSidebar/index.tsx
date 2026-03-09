'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Home,
  // ShoppingCart,
  UserIcon,
  UserPlus,
  UserCog,
  LogIn,
  LogOut,
  Info
  // Calendar,
  // Inbox,
  // Search,
  // Settings,
  // Settings2,
  // ChevronDown,
  // Plus,
  // Menu,
  // MoreHorizontal
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarRail,
  // SidebarGroupAction,
  // SidebarMenuAction,
  // SidebarMenuSub,
  // SidebarMenuSubItem,
  // SidebarMenuSubButton,
  // SidebarMenuBadge,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '@/components/sidebar'

import { authClient } from '@/lib/auth-client'
import { logout } from '@/actions'
import { SignedIn, SignedOut, AdminOnly, ThemeToggle } from '@/components'

// import {
//   Collapsible,
//   CollapsibleTrigger,
//   CollapsibleContent
// } from './collapsible'

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem
// } from './dropdown-menu'

import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE } from '@/components/sidebar/SidebarConstants'

import { SIDEBAR_ZINDEX_CLASS } from '@/components/component-constants'
import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const AppSidebar = () => {
  const router = useRouter()

  const { open, openMobile, isMobile, collapsible, variant /*, side */ } = useSidebar()
  const isOpen = (open && !isMobile) || (openMobile && isMobile)
  const isClosed = !isOpen

  const _isOffcanvas = collapsible === 'offcanvas'
  const isIcon = collapsible === 'icon'
  const isNone = collapsible === 'none'

  const _isIconAndOpen = isIcon && isOpen
  const _isIconAndClosed = isIcon && isClosed

  const sidebarWidth = isMobile ? SIDEBAR_WIDTH_MOBILE : SIDEBAR_WIDTH
  const floatingOffset = '16px'

  /* ======================
    handleServerLogout()
  ====================== */

  const _handleServerLogout = async () => {
    try {
      const { /* code, */ data, message, success } = await logout()

      if (success !== true) {
        const errorMessage = typeof message === 'string' ? message : 'Unable to log out.'
        toast.error(errorMessage, {
          // duration: Infinity
        })
        console.log('\nError from logout() server action')
        console.log(message)
        return
      }
      toast.success('Log out success.')
      console.log('\ndata from logout() server action')
      console.log(data)
    } catch (_err) {
      toast.error('Unable to log out.')
    }
  }

  /* ======================
    handleClientLogout()
  ====================== */

  const handleClientLogout = async () => {
    //^ const searchParams = new URLSearchParams(window.location.search)
    // Used to condiationally opt-out of callbackUrl in middleware.
    //^ searchParams.set('logout', 'true')
    // Use replaceState to update the URL without adding to the history stack
    //^ window.history.replaceState(null, '', `?${searchParams.toString()}`)

    try {
      const { /* data, */ error } = await authClient.signOut({
        //# Test that fetchOptions actually imply that signOut
        //# was good/bad and not just the fetch.
        //# On the other hand, the successContext/errorContext are not typed well.
        fetchOptions: {
          onSuccess: (_successContext) => {
            router.push('/login')
          },
          onError: (_errorContext) => {
            // ...
          }
        }
      })

      //# Switch to using the onSuccess and onError callbacks.
      // data and error are a discriminated union.
      if (error) {
        const errorMessage = typeof error.message === 'string' ? error.message : 'Unable to log out.'
        toast.error(errorMessage, {
          // duration: Infinity
        })
        // console.log('\nError from authClient.signOut()')
        // console.log(error)
        return
      }

      // Otherwise... (i.e., if data)
      toast.success('Log out success.')

      // console.log('\ndata from authClient.signOut()')
      // console.log(data)
    } catch (_err) {
      // console.log('\nError from authClient.signOut()')
      // console.log(err)
      toast.error('Unable to log out.')
    }
  }

  /* ======================
     renderNavLinkGroup()
  ====================== */
  // Use the isActive prop to mark a menu item as active.
  // This essentially changes the styles in the component by setting this: data-active={isActive}
  // Then using the data-[active=true]: modifier. The current styles are very subtle.
  // Right now it doesn't make any sense to implement isActive because we're mapping over the
  // dummy items, but eventually, we can set it.

  const renderNavLinkGroup = () => {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className='gap-2'>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip='Home'>
                <Link href='/' className='text-[inherit]'>
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip='About'>
                <Link href='/about' className='text-[inherit]' prefetch={false}>
                  <Info />
                  <span>About</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <AdminOnly>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='Admin'>
                  <Link href='/admin' className='text-[inherit]'>
                    <UserCog />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </AdminOnly>

            <SignedIn>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='User'>
                  <Link href='/user' className='text-[inherit]'>
                    <UserIcon />
                    <span>User</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='Sign Out'>
                  <button onClick={handleClientLogout} className='cursor-pointer text-[inherit]'>
                    <LogOut />
                    <span>Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SignedIn>

            <SignedOut>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='Sign In'>
                  <Link href='/login' className='text-[inherit]'>
                    <LogIn />
                    <span>Sign In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip='Sign Up'>
                  <Link href='/register' className='text-[inherit]'>
                    <UserPlus />
                    <span>Sign Up</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SignedOut>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Sidebar className={SIDEBAR_ZINDEX_CLASS}>
      <div
        className={cn('flex items-center px-2', {
          'justify-between': !isNone
        })}
        style={{
          // When floating or inset, the Sidebar component sets `p-2`. This offsets that.
          minWidth:
            variant === 'floating' || variant === 'inset' ? `calc(${sidebarWidth} - ${floatingOffset})` : sidebarWidth
        }}
      >
        {collapsible !== 'none' && <SidebarTrigger className='cursor-pointer' />}

        <SidebarHeader>Sidebar Header</SidebarHeader>

        {/* Conditionally setting tabIndex to -1 is very important! 
        When defaultCollapsible='icon', the content is hidden with
        overflow-hidden (now overflow-clip) in Sidebar.tsx. If you try 
        to tab to an element that is effectively hidden, the browser will 
        have a meltdown and crash the layout. This ultimately was causing
        all of SidebarContent to momentarily disappear! */}
        <ThemeToggle tabIndex={isClosed ? -1 : 0} />
      </div>

      <SidebarSeparator />

      <SidebarContent>{renderNavLinkGroup()}</SidebarContent>
    </Sidebar>
  )
}
