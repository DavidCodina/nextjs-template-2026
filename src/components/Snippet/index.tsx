'use client'

import * as React from 'react'
import { Highlight, themes, type HighlightProps } from 'prism-react-renderer'
import { ClipboardCopy, ClipboardCheck } from 'lucide-react'

import { cn } from '@/utils'
import { useClipboard } from './useClipboard'

type Language = HighlightProps['language']
// type Children = HighlightProps['children']

type SnippetProps = Omit<HighlightProps, 'language' | 'children'> & {
  className?: string
  preClassName?: string
  language?: Language
  showLineNumbers?: boolean
  showCopyButton?: boolean
  lineNumberClassName?: string
  lineNumberStyle?: React.CSSProperties
  startingLineNumber?: number
  style?: React.CSSProperties
  preStyle?: React.CSSProperties
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Originally, I was using react-syntax-highlighter, but it doesn't have jsx/tsx support.
// Vercel uses CodeMirror: https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber
//
// I've also seen Shiki used by Josh Comeau for his Snippet component.
// Shiki gets twice the weekly downloads of prism-react-renderer.
// https://www.joshwcomeau.com/animation/3d-button/
// Then he uses react-simple-code-editor (instead of CodeMirror) for his playground snippets.
// https://www.npmjs.com/package/react-simple-code-editor
//
///////////////////////////////////////////////////////////////////////////
export const Snippet = (props: SnippetProps) => {
  const {
    className = '',
    preClassName = '',
    code,
    // https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/generate-prism-languages/index.ts#L9-L23
    language = 'tsx',
    lineNumberClassName = '',
    lineNumberStyle = {},
    prism,
    showCopyButton = true,
    // Some language types like 'json' d don't show line numbers by default.
    showLineNumbers = true,
    startingLineNumber = 1,
    theme,
    style = {},
    preStyle = {}
  } = props

  // Todo: Josh  Comeau's Snippet component has a shimmer effect when copying:
  // https://www.joshwcomeau.com/animation/3d-button/

  const clipboard = useClipboard({
    timeout: 2000
  })

  /* ======================
    renderCopyButton()
  ===================== */

  const renderCopyButton = () => {
    if (!showCopyButton) {
      return null
    }

    return (
      <div className='absolute top-3 right-2 flex items-center gap-2'>
        {clipboard.copied && (
          <span
            className={cn(
              'rounded border border-green-500 bg-green-500/10 px-1 py-0.5 text-xs font-medium text-green-500 text-shadow-none'
            )}
          >
            Copied
          </span>
        )}

        <button
          className={cn('cursor-pointer text-[rgb(171,178,191)]', clipboard.copied && 'text-green-500')}
          onClick={() => clipboard.copy(code)}
          title='Copy to clipboard'
        >
          {clipboard.copied ? (
            <ClipboardCheck className='pointer-events-none' />
          ) : (
            <ClipboardCopy className='pointer-events-none' />
          )}
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <Highlight code={code} language={language} theme={theme || themes.oneDark} prism={prism}>
        {(renderProps) => {
          const { className: classNameProp, style: styleProp, tokens, getLineProps, getTokenProps } = renderProps

          /* ======================
                  return
          ====================== */

          return (
            <div className={cn('relative', className)} style={style}>
              <pre
                data-slot='snippet'
                style={{
                  ...styleProp,
                  ...preStyle
                }}
                // The default className will look something like: 'prism-code language-tsx'
                className={cn(
                  classNameProp,
                  'relative overflow-x-auto rounded-lg border p-4 text-sm',
                  'dark:[background-color:oklch(from_var(--card)_calc(l_-_0.03)_c_h)]!',
                  showLineNumbers && 'px-4',
                  preClassName
                )}
              >
                {/* Internally, Highlight has a required children prop of:
              type Children = (props: RenderProps) => JSX.Element */}
                {tokens.map((line, i) => {
                  const lineNumbers = (
                    <span className={cn('mr-4 text-xs', lineNumberClassName)} style={lineNumberStyle}>
                      {i + startingLineNumber}
                    </span>
                  )
                  return (
                    <div key={i} {...getLineProps({ line })}>
                      {showLineNumbers && lineNumbers}

                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  )
                })}
              </pre>

              {renderCopyButton()}
            </div>
          )
        }}
      </Highlight>
    </>
  )
}
