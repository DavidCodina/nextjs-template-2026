'use client'

import { useTransition, useState } from 'react'
import { TabButton } from './TabButton'
import { About, Team, Contact } from './tabs'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Purpose of useTransition: The useTransition hook is designed to allow you to mark certain state updates as "transitions."
// A transition refers to a state update that may take longer to complete, such as rendering a complex component.
// When you wrap a state update in startTransition, you are indicating that this update is less urgent and can
// be interrupted if necessary. This allows for a smoother user experience.
// The key feature of startTransition is that it allows React to treat the state update as interruptible.
// AKA useInterruptibleState.
//
/////////////////////////
//
// In this example the Team tab is slow rendering UI. The problem is that
// new state updates are delayed until the render cycle completes.
//
// In React, when a state update occurs, it triggers a re-render of the component.
// If a component is in the middle of rendering (i.e., during the render cycle),
// any new state updates that occur will be queued and processed in the next render cycle.
// This means that if a state update is triggered while the Team tab is rendering,
// that update will not take effect until the current render cycle completes.
//
// If we commment out the startTransition, and click on the Team tab then
// immediately click on the Contact tab, we will have to wait until the
// Team tab finishes rendering before switching to the Contact Tab.
// Again, a new state update can't take place until the current render cycle completes.
//
// By using startTransition, you can mark certain state updates as lower priority.
// This allows React to keep the UI responsive, meaning that user interactions can
// still be processed even if a slow rendering operation is ongoing. In this case,
// if a user clicks to switch tabs while the Team tab is rendering, the transition
// to the new tab can occur without waiting for the Team tab to finish rendering.
//
// Thus if we implement the startTransition wrapper, we can interrupt
// the rendering of the Team tab and immediately switch to the Contact tab.
// Essentially, startTransition decouples state changes from the render cycle.
//
// Normally, when we wrap a state update in startTransition, we're effectively
// telling React that it's low priority relative to other state updates.
//
// When setActiveTab fires it kicks off a new render cycle.
// If we click on a new tab, it interrupts that render cycle allowing for a new state update.
// The state being updated is the same state: activeTab.
// Both updates are marked as transitions.
// It's not that newer updates are more important than older updates.
// Rather, the thing that allows the second state update to occur while
// the first state update is still processing is the fact that  it's interruptable.
//
// What's interesting is that this example is that we're updating the same state.
// In this case, we're telling React that newer updates OF THE SAME STATE have
// higher priority over older updates.
//
///////////////////////////////////////////////////////////////////////////

export const PracticalUseTransition = () => {
  const [activeTab, setActiveTab] = useState('about')
  const [isPending, startTransition] = useTransition()

  function selectTab(tab: string) {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (
    <div className='mx-auto max-w-[800px] rounded-lg border border-neutral-400 bg-[#fafafa] p-4 shadow'>
      <section className=''>
        <div className='mb-4 flex gap-4'>
          <TabButton value='about' activeTab={activeTab} onClick={() => selectTab('about')}>
            About
          </TabButton>

          <TabButton value='team' isPending={isPending} activeTab={activeTab} onClick={() => selectTab('team')}>
            Team
          </TabButton>

          <TabButton value='contact' activeTab={activeTab} onClick={() => selectTab('contact')}>
            Contact
          </TabButton>
        </div>

        <div className=''>
          {activeTab === 'about' && <About />}
          {activeTab === 'team' && <Team />}
          {activeTab === 'contact' && <Contact />}
        </div>
      </section>
    </div>
  )
}
