// https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-document-visibility/use-document-visibility.ts
// ⚠️ Gotcha: Will not work when Chrome Devtools are open.
import { useEffect, useState } from 'react'

export function useDocumentVisibility(): DocumentVisibilityState {
  const [documentVisibility, setDocumentVisibility] = useState<DocumentVisibilityState>('visible')

  useEffect(() => {
    setDocumentVisibility(document.visibilityState)
    const listener = () => setDocumentVisibility(document.visibilityState)
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [])

  return documentVisibility
}
