'use client'

import { Component, ErrorInfo, ReactNode, JSX } from 'react'

type OnError = ({ error, errorInfo }: { error: Error; errorInfo: ErrorInfo }) => void

interface Props {
  children?: ReactNode
  fallback: ({ error, onReset }: any) => JSX.Element
  onReset?: () => void
  onError?: OnError
}

interface State {
  hasError: boolean
  error: any
}

/* ========================================================================
                              ErrorBoundary                     
======================================================================== */
// https://dev.to/dinhhuyams/react-error-boundary-surviving-through-pandemic-2pl9
// Usage: <ErrorBoundary fallback={<div>Something went wrong</div>}>...</ErrorBoundary>

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null }

  /* ======================
  getDerivedStateFromError()
  ====================== */

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: error
    }
  }

  /* ======================
     componentDidCatch()
  ====================== */

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // console.log('\n\nerror from comonentDidCatch():', error)
    // console.log('\n\nerrorInfo from comonentDidCatch():', errorInfo)
    this.props?.onError?.({ error, errorInfo })
  }

  /* ======================
          render
  ====================== */

  public render() {
    if (this.state.hasError) {
      return (
        <this.props.fallback
          error={this.state.error}
          onReset={() => {
            this.props.onReset?.()
          }}
        />
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
