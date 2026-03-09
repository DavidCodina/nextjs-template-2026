'use client'

export interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activeTab: string
  isPending?: boolean
  value: string
}

/* ========================================================================

======================================================================== */

export const TabButton = ({ value, activeTab, isPending, children, ...props }: TabButtonProps) => {
  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    let classes = 'flex-1 rounded-lg px-2 py-1 text-sm font-bold'

    if (activeTab === value) {
      classes = `${classes} bg-blue-500 text-white`
    } else {
      classes = `${classes} border border-blue-500 bg-white text-blue-500`
    }

    if (isPending) {
      classes = `${classes} opacity-50`
    }

    return classes
  }

  /* ======================
          return
  ====================== */

  return (
    <button {...props} className={getClassName()}>
      {isPending ? 'Loading...' : children}
    </button>
  )
}
