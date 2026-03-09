import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import js from '@eslint/js'

import pluginPromise from 'eslint-plugin-promise'

import pluginJest from 'eslint-plugin-jest'
import pluginJestDom from 'eslint-plugin-jest-dom'
import pluginTestingLibrary from 'eslint-plugin-testing-library'
import pluginStorybook from 'eslint-plugin-storybook'

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Flat configs are still experimental and need to be enabled in VSCode ESLint using
// the eslint.experimental.useFlatConfig setting:  "eslint.useFlatConfig": true
// That said, Editor linting may still not support all flat config features or custom rules.
//
///////////////////////////////////////////////////////////////////////////
import custom from 'custom-eslint-plugin'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// eslint-config-next already comes with:
//
//   @typescript-eslint/eslint-plugin
//   @typescript-eslint/parser,
//   eslint-plugin-react
//   eslint-plugin-react-hooks
//
///////////////////////////////////////////////////////////////////////////

const eslintConfig = defineConfig([
  ...nextVitals,
  // The "js/recommended" configuration ensures all of the rules marked as recommended on the rules page will be turned on.
  // https://eslint.org/docs/latest/rules
  js.configs.recommended,
  ...nextTs,

  pluginPromise.configs['flat/recommended'],
  ...pluginStorybook.configs['flat/recommended'],
  pluginJest.configs['flat/recommended'],
  pluginJestDom.configs['flat/recommended'],
  pluginTestingLibrary.configs['flat/react'],

  eslintPluginPrettierRecommended,

  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      custom
    },

    rules: {
      'custom/no-form-action-prop': 'warn',
      'custom/no-button-form-action-prop': 'warn',
      /* ======================
        eslint-plugin-prettier
      ====================== */

      'prettier/prettier': 'warn', // For eslint-plugin-prettier - downgrade to "warn"
      'arrow-body-style': 'off', // eslint-plugin-prettier recommendation
      'prefer-arrow-callback': 'off', // eslint-plugin-prettier recommendation

      /* ======================
              eslint
      ====================== */

      ///////////////////////////////////////////////////////////////////////////
      //
      //   const data = { name: 'Fred',  age: 35,}
      //
      //   for (const key in data) {
      //     if (Object.prototype.hasOwnProperty.call(data, key)) {
      //       console.log(`${key}: ${data[key as keyof typeof data]}`)
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////
      'guard-for-in': 'warn', // Off by default in Next.js

      // Would require an await inside the body of an async function: export const func = async () => null
      // Off by default in Next.js
      'require-await': 'off',

      'no-var': 'warn', // Warns user to implement let or const instead.

      'prefer-const': 'warn', // Prefer const over let, etc.
      'no-throw-literal': 'warn', // Warns user to use an Error object
      'no-unreachable': 'warn', // Warns user when code is unreachable due to return, throw, etc.

      // By default, all types of anonymous default exports are forbidden, but any types can be selectively
      // allowed by toggling them on in the options. Ensuring that default exports are named helps improve
      // the grepability of the codebase by encouraging the re-use of the same identifier for the module's
      // default export at its declaration site and at its import sites.
      // We could set this to "off", but for now "warn"
      'import/no-anonymous-default-export': 'warn',
      'no-eq-null': 'warn', // Warns user to implement strict equality.
      'no-prototype-builtins': 'off',

      /* ======================
              react
      ====================== */

      //! I turned this off because I don't see why they enforce this.
      'react/no-unescaped-entities': 'off', // Allow apostrophes in text...

      //! I turned this off temporarily, but you should turn it back on.
      // This was introduced in React 19.1
      // It enforces component purity by flagging impure functions like Date.now(), Math.random(),
      // and crypto.randomUUID() during render.
      'react-hooks/purity': 'off',

      //! I turned this off temporarily, but you should turn it back on.
      'react-hooks/set-state-in-effect': 'off',

      //! I turned this off temporarily, but you should turn it back on.
      'react-hooks/immutability': 'off',

      /* ======================
      eslint-plugin-react-compiler
      ====================== */

      //# Eventually add eslint-plugin-react-compiler
      //# "react-compiler/react-compiler": "warn",

      /* ======================
               @next
      ====================== */

      '@next/next/no-img-element': 'off', // Allow <img> tag in Next.js

      /* ======================
      @typescript-eslint/eslint-plugin
      ====================== */

      '@typescript-eslint/ban-ts-comment': 'off', // Allows @ts-ignore statement

      '@typescript-eslint/no-non-null-assertion': 'off', // Allows ! bang operator - already "off" in Next.js by defualt.

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-empty-object-type': 'off', // Allows type Props = {}
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Ignore unused arguments that start with _
          varsIgnorePattern: '^_', // Ignore unused variables that start with _
          caughtErrorsIgnorePattern: '^_', // Ignore caught errors that start with _
          destructuredArrayIgnorePattern: '^_' // Ignore destructured array elements that start with _
        }
      ],

      /* ======================
        eslint-plugin-promise
      ====================== */

      'promise/always-return': 'warn',
      'promise/no-return-wrap': 'warn',
      'promise/param-names': 'warn',
      'promise/catch-or-return': ['warn', { allowFinally: true }],
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'warn',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
      'promise/no-multiple-resolved': 'warn',

      /* ======================
              jest
      ====================== */

      'jest/no-disabled-tests': 'off',
      'jest/no-commented-out-tests': 'off',
      'testing-library/no-debugging-utils': 'off'
    }
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '!.storybook',
    'src/generated'
  ])
])

export default eslintConfig
