import { Paper, createTheme } from '@mantine/core'

import type {
  CSSVariablesResolver,
  // VariantColorsResolver, // What is this?
  MantineColorsTuple
  // MantineThemeColors
} from '@mantine/core'

const scale = (name: string): MantineColorsTuple => [
  `var(--color-${name}-50)`,
  `var(--color-${name}-100)`,
  `var(--color-${name}-200)`,
  `var(--color-${name}-300)`,
  `var(--color-${name}-400)`,
  `var(--color-${name}-500)`,
  `var(--color-${name}-600)`,
  `var(--color-${name}-700)`,
  `var(--color-${name}-800)`,
  `var(--color-${name}-900)`,
  `var(--color-${name}-950)`
]

const primary = scale('primary')
const secondary = scale('secondary')
const success = scale('success')
const info = scale('info')
const warning = scale('warning')
// Why destructive and not error? Calling it error ultimately makes mores sense.
// However, currently the Tailwind design system is still using destructive, which
// originally came from ShadCN, so I'm trying to maintain fidelity for now.
const destructive = scale('destructive')
// dark
// gray
const red = scale('red')
const pink = scale('pink')
// grape
const violet = scale('violet')
const indigo = scale('indigo')
const blue = scale('blue')
const cyan = scale('cyan')
const teal = scale('teal')
const green = scale('green')
const lime = scale('lime')
const yellow = scale('yellow')
const orange = scale('orange')

/* ========================================================================
                              Mantine Theme
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://v1.mantine.dev/pages/theming/
// http://mantine.dev/theming/theme-object/
// https://v7.mantine.dev/theming/default-theme/
//
// Here we're treating Tailwind as the source of truth.
// However, you could go in the opposite direction and have
// Mantine colors map to Tailwind with tailwind-preset-mantine.
//
///////////////////////////////////////////////////////////////////////////

export const mantineTheme = createTheme({
  scale: 1,
  fontSmoothing: true,
  focusRing: 'auto',
  white: '#fff',
  black: '#000',
  colors: {
    // dark
    // gray
    red,
    pink,
    // grape
    violet,
    indigo,
    blue,
    cyan,
    teal,
    green,
    lime,
    yellow,
    orange,

    /* ======================
        Semantic Colors
    ====================== */

    primary,
    secondary,
    success,
    info,
    warning,
    destructive
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // If you want different shades in light vs dark on a per-color basis,
  // then you need to use the cssVariableResolver to do something like:
  //
  //   light: {
  //     '--mantine-color-destructive-filled': 'var(--color-destructive-600)',
  //     '--mantine-color-destructive-filled-hover': 'var(--color-destructive-700)',
  //   },
  //   dark: {
  //     '--mantine-color-destructive-filled': 'var(--color-destructive-400)',
  //     '--mantine-color-destructive-filled-hover': 'var(--color-destructive-300)',
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////

  primaryShade: { light: 5, dark: 4 },
  primaryColor: 'primary',
  autoContrast: false,
  luminanceThreshold: 0.3,
  fontFamily: 'var(--font-sans)',
  fontFamilyMonospace: 'var(--font-mono)',
  respectReducedMotion: false,
  cursorType: 'default',

  // defaultGradient: {
  //   from: 'blue',
  //   to: 'cyan',
  //   deg: 45
  // },

  defaultRadius: 'md',
  activeClassName: 'mantine-active',
  // focusClassName: '',

  headings: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '700',
    textWrap: 'wrap',
    sizes: {
      h1: { fontSize: 'var(--text-4xl)', lineHeight: '1.5' },
      h2: { fontSize: 'var(--text-3xl)', lineHeight: '1.5' },
      h3: { fontSize: 'var(--text-2xl)', lineHeight: '1.5' },
      h4: { fontSize: 'var(--text-xl)', lineHeight: '1.5' },
      h5: { fontSize: 'var(--text-lg)', lineHeight: '1.5' },
      h6: { fontSize: 'var(--text-base)', lineHeight: '1.5' }
    }
  },

  fontSizes: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    md: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)'
  },

  lineHeights: {
    xs: '1.5',
    sm: '1.5',
    md: '1.5',
    lg: '1.5',
    xl: '1.5'
  },

  radius: {
    xs: 'var(--radius-xs)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)'
  },

  // Tailwind --spcacing is 0.25rem
  spacing: {
    xs: 'calc(var(--spacing) * 2)',
    sm: 'calc(var(--spacing) * 3)',
    md: 'calc(var(--spacing) * 4)',
    lg: 'calc(var(--spacing) * 6)',
    xl: 'calc(var(--spacing) * 8)'
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // By default, Mantine does this:
  //
  //   breakpoints: {
  //     xs: '36em',
  //     sm: '48em',
  //     md: '62em',
  //     lg: '75em',
  //     xl: '88em'
  //   },
  //
  //
  // Whatever you set here, make sure it aligns with what is set in postcss.config.mjs.
  //
  // The goal here is to use Tailwind's breakpoints.
  //
  //   https://mantine.dev/styles/responsive/
  //   https://tailwindcss.com/docs/responsive-design
  //
  // However, Mantine expects breakpoint values in em, and its responsive behavior needs usable breakpoint
  // values rather than ordinary property-level CSS aliases. Tailwind’s documented default breakpoints use rem.
  // Keep concrete, synchronized values here instead of treating breakpoints like colors or radii.
  //
  ///////////////////////////////////////////////////////////////////////////

  breakpoints: {
    xs: '32em', // 512px  — custom
    sm: '40em', // 640px  — Tailwind sm
    md: '48em', // 768px  — Tailwind md
    lg: '64em', // 1024px — Tailwind lg
    xl: '80em' // 1280px  — Tailwind xl
  },

  // shadows: {
  //   xs: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), 0 calc(0.0625rem * var(--mantine-scale)) calc(0.125rem * var(--mantine-scale)) rgba(0, 0, 0, 0.1)',
  //   sm: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(0.625rem * var(--mantine-scale)) calc(0.9375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.4375rem * var(--mantine-scale)) calc(0.4375rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
  //   md: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(1.25rem * var(--mantine-scale)) calc(1.5625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.625rem * var(--mantine-scale)) calc(0.625rem * var(--mantine-scale)) calc(-0.3125rem * var(--mantine-scale))',
  //   lg: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(1.75rem * var(--mantine-scale)) calc(1.4375rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(0.75rem * var(--mantine-scale)) calc(0.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))',
  //   xl: '0 calc(0.0625rem * var(--mantine-scale)) calc(0.1875rem * var(--mantine-scale)) rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 calc(2.25rem * var(--mantine-scale)) calc(1.75rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale)), rgba(0, 0, 0, 0.04) 0 calc(1.0625rem * var(--mantine-scale)) calc(1.0625rem * var(--mantine-scale)) calc(-0.4375rem * var(--mantine-scale))'
  // }

  // other: {},

  // Many changes must be made at the component level.
  // With 120+ components, this will be a work in progress.
  components: {
    // Changes to Paper will also affect Card.
    Paper: Paper.extend({
      styles: {
        root: {
          '--paper-border-color': 'var(--border-color)',
          backgroundColor: 'var(--color-card)'
        }
      }
    })
  }
})

/* ========================================================================
                          cssVariablesResolver
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://mantine.dev/styles/css-variables/
// https://mantine.dev/styles/css-variables-list/
// See also node_modules/@mantine/core/styles.layer.css
//
// Fortunately, changing the theme changes many of the variables.
// That said, some variables can't be updated through the theme.
// cssVariablesResolver allows for more fine-grained control.
//
///////////////////////////////////////////////////////////////////////////

export const cssVariablesResolver: CSSVariablesResolver = () => {
  const semanticVariables = {
    // --mantine-color-bright:	var(--mantine-color-black)
    '--mantine-color-text': 'var(--color-foreground)',
    '--mantine-color-body': 'var(--color-background)',
    '--mantine-color-error': 'var(--color-destructive)',
    '--mantine-color-success': 'var(--color-success)',

    // '--mantine-color-placeholder': 'var(--color-muted-foreground)',
    // '--mantine-color-anchor': 'var(--color-primary)',
    // '--mantine-color-default': 'var(--mantine-color-white)',
    // '--mantine-color-default-hover': 'var(--mantine-color-gray-0)',
    // '--mantine-color-default-color': 'var(--mantine-color-black)',

    '--mantine-color-default-border': 'var(--border-color)',

    // This is for muted text, etc. It's similar to --color-muted-foreground.
    '--mantine-color-dimmed': 'var(--color-muted-foreground)' // was 'var(--mantine-color-gray-6)'

    // '--mantine-color-disabled': 'var(--mantine-color-gray-2)',
    // '--mantine-color-disabled-color': 'var(--mantine-color-gray-5)',
    // '--mantine-color-disabled-border': 'var(--mantine-color-gray-3)'
  }

  return {
    variables: {},
    light: semanticVariables,
    dark: semanticVariables
  }
}
