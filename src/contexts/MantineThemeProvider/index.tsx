'use client'

import * as React from 'react'
import { MantineProvider, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { useTheme } from 'next-themes'

import { cssVariablesResolver, mantineTheme } from './mantineTheme'

/* ========================================================================
              
======================================================================== */
/* Mantine tracks the color scheme in two places:

  1. The `data-mantine-color-scheme` attribute on <html>, which drives all
     CSS-based styling.
  2. Its own internal React state (what useMantineColorScheme and
     useComputedColorScheme return), seeded from Mantine's own localStorage
     key or `defaultColorScheme`.

  next-themes only writes the attribute (via the `attribute` array). Mantine
  never reads the attribute back, so its internal state stays at the default
  and drifts out of sync, and the provider may also overwrite the attribute
  on mount.

  forceColorScheme makes next-themes the single source of truth: Mantine's
  state and the attribute both follow resolvedTheme. It stays undefined
  until next-themes has resolved, so Mantine doesn't force anything early.
*/

export const MantineThemeProvider = ({ children }: React.PropsWithChildren) => {
  const { resolvedTheme } = useTheme()

  return (
    <MantineProvider
      theme={mantineTheme}
      cssVariablesResolver={cssVariablesResolver}
      ///////////////////////////////////////////////////////////////////////////
      //
      // Mantine tracks the color scheme in two places: the data-mantine-color-scheme
      // attribute on <html> (drives CSS) and its own internal React state (what
      // useMantineColorScheme/useComputedColorScheme return). next-themes only writes
      // the attribute, and Mantine never reads it back, so the internal state would
      // stay at its default and drift out of sync. forceColorScheme makes next-themes
      // the single source of truth. It's undefined until resolvedTheme is known.
      //
      /////////////////////////
      //
      // Why the guard for undefined?
      //
      // On the server (and the first client render), next-themes can’t know the user’s preference,
      // so resolvedTheme is undefined. Passing undefined means “don’t force anything yet”, so Mantine
      // renders its default and the server and client HTML match. Once next-themes resolves on the
      // client, forceColorScheme flips to the real value. Without the guard you’d either pass a made-up
      // default (possibly wrong for this user) or crash on the comparison.
      //
      // The tradeoff is that for that first render, Mantine’s JS-side value is the default rather than
      // the real one. Your CSS is still correct from the attribute, so visually nothing flashes.
      // Only JS-branching components could briefly be wrong, and they correct themselves right after hydration.
      //
      ///////////////////////////////////////////////////////////////////////////
      forceColorScheme={resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'light' ? 'light' : undefined}
    >
      {children}
    </MantineProvider>
  )
}

/* ========================================================================
              
======================================================================== */

export function DebugMantineTheme() {
  const { colorScheme } = useMantineColorScheme()
  const computed = useComputedColorScheme('light')
  const { resolvedTheme } = useTheme()
  const [attr, setAttr] = React.useState<string | null>(null)

  /* ======================

  ====================== */

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  /* ======================

  ====================== */

  React.useEffect(() => {
    const el = document.documentElement
    const read = () => setAttr(el.getAttribute('data-mantine-color-scheme'))
    read()
    const observer = new MutationObserver(read)
    observer.observe(el, {
      attributes: true,
      attributeFilter: ['data-mantine-color-scheme']
    })
    return () => observer.disconnect()
  }, [])

  /* ======================

  ====================== */

  if (!mounted) return null

  return (
    <pre className='bg-card rounded-lg border p-6'>
      <code>
        {JSON.stringify(
          { nextThemes: resolvedTheme, attribute: attr, mantineState: colorScheme, mantineComputed: computed },
          null,
          2
        )}
      </code>
    </pre>
  )
}
