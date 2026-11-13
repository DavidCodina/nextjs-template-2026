import { cva } from 'class-variance-authority'

const ACTIVE_SCALE_MIXIN = 'active:scale-[0.98]'

const DISABLED_MIXIN = `
disabled:border-(--table-disabled-color)
disabled:text-(--table-disabled-color)
disabled:pointer-events-none
disabled:opacity-65
`

const SVG_MIXIN = `
[&_svg]:pointer-events-none
[&_svg]:shrink-0
[&_svg:not([class*='size-'])]:size-[1.25em]
`

const baseClasses = `
inline-flex items-center justify-center gap-[0.5em] shrink-0
whitespace-nowrap font-medium
transition-[color,box-shadow]
rounded-[0.375em]
px-[0.5em] py-[0.25em]
cursor-pointer select-none
focus-visible:ring-[3px] 
disabled:pointer-events-none disabled:opacity-75
outline-none 
${SVG_MIXIN}
${DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const editableButtonVariants = cva(baseClasses, {
  variants: {
    variant: {
      default: `
      bg-transparent text-muted-foreground border 
      hover:bg-primary hover:text-white hover:border-primary
      focus-visible:ring-border/50
      ${ACTIVE_SCALE_MIXIN}
      `,

      primary: `
      bg-transparent text-primary border border-primary
      hover:bg-primary hover:text-white
      focus-visible:ring-primary/50
      ${ACTIVE_SCALE_MIXIN}
      `,

      secondary: `
      bg-transparent text-secondary border border-secondary
      hover:bg-secondary hover:text-white
      focus-visible:ring-secondary/50
      ${ACTIVE_SCALE_MIXIN}
      `
    },

    size: {
      xs: 'text-xs leading-[1.5]',
      sm: 'text-sm leading-[1.5]',
      md: 'text-base leading-[1.5]',
      lg: 'text-lg leading-[1.5]',
      xl: 'text-xl leading-[1.5]'
    }
  },

  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})
