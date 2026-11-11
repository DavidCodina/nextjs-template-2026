'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/DEPRECATED_dialog'

import { Button } from '@/components'

/* ========================================================================

======================================================================== */

export const DialogDemo = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='mx-auto mb-6 flex' size='sm' variant='secondary'>
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription asChild>
              <div>
                <p className='mb-4'>
                  The default ShadCN <code className='text-pink-500'>Dialog</code> implementation still needs more work
                  in order to make it responsive.
                </p>

                <p className='mb-4'>
                  <strong>Note:</strong> The default Radix{' '}
                  <code className='text-pink-500'>DialogPrimitive.Description</code> renders a{' '}
                  <code className='text-pink-500'>{`<p>`}</code> tag. If you include one or more{' '}
                  <code className='text-pink-500'>{`<p>`}</code> tags within the{' '}
                  <code className='text-pink-500'>{`<DialogDescription>`}</code>, you will get a hydration error in
                  Next.js. Use the <code className='text-pink-500'>asChild</code> prop to fix this:
                </p>

                <pre className='text-primary border-primary bg-card rounded-xl border shadow'>
                  <code>{`
  <DialogDescription asChild>
    <div>
      <p>...</p>
      <p>...</p>
    </div>
  </DialogDescription>
                `}</code>
                </pre>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
