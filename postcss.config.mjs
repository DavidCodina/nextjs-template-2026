// Note:  not need to do npm i -D postcss
// Next.js bundles its own copy of PostCSS and loads your postcss.config.mjs itself,
// so a Next project doesn’t need postcss as a direct dependency.

const config = {
  plugins: {
    // Not needed if you're using the Turbopack configuration in next.config.ts
    // '@tailwindcss/postcss': {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: Mantine's default breakpoints do not inherit from postcss.config.mjs.
      // They are independent definitions that happen to contain the same values.
      // Mantine explicitly documents that the PostCSS variables are static and are
      // not connected to the theme.
      //
      //    +---------------------------------+-------------------------------------------+---------------------------------+
      //    | Configuration                   | Used by                                   | When it is resolved             |
      //    +---------------------------------+-------------------------------------------+---------------------------------+
      //    | Mantine's `theme.breakpoints`   | Responsive Mantine components and         | When Mantine produces           |
      //    |                                 | responsive props                          | responsive styling              |
      //    +---------------------------------+-------------------------------------------+---------------------------------+
      //    | `postcss-simple-vars` variables | Your CSS containing                       | During CSS compilation          |
      //    |                                 | `$mantine-breakpoint-*` references        |                                 |
      //    +---------------------------------+-------------------------------------------+---------------------------------+
      //
      // Mantine’s responsive components use theme.breakpoints. PostCSS replaces $mantine-breakpoint-* references in your CSS with literal
      // values during the build. Neither configuration reads the other.
      //
      ///////////////////////////////////////////////////////////////////////////
      variables: {
        'mantine-breakpoint-xs': '32em',
        'mantine-breakpoint-sm': '40em',
        'mantine-breakpoint-md': '48em',
        'mantine-breakpoint-lg': '64em',
        'mantine-breakpoint-xl': '80em'
      }
    }
  }
}

export default config
