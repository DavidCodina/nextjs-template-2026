'use client'

import { useState } from 'react'
import { Rating } from '../' // adjust to wherever your Rating lives

/* ========================================================================
                                RatingDemo
======================================================================== */

export const RatingDemo = () => {
  const [value, setValue] = useState(3)
  const [hovered, setHovered] = useState<number | null>(null)

  const section = { marginBottom: '2rem' } as const

  return (
    <div style={{ padding: '1rem' }}>
      {/* 1. Basic, uncontrolled-ish (defaultValue is required) */}
      <div style={section}>
        <h4>Basic</h4>
        <Rating defaultValue={2} />
      </div>

      {/* 2. Controlled: keep state in the parent, pass it back via defaultValue.
             The component syncs to defaultValue changes via useEffect. */}
      <div style={section}>
        <h4>Controlled + onChange / onHover</h4>
        <Rating defaultValue={value} onChange={setValue} onHover={setHovered} activeColor='gold' defaultColor='#ddd' />
        <p>
          Value: {value} | Hovering: {hovered ?? '-'}
        </p>
        <button onClick={() => setValue(0)}>Reset</button>
      </div>

      {/* 3. Hearts, custom size/spacing */}
      <div style={section}>
        <h4>Hearts</h4>
        <Rating defaultValue={4} shape='heart' activeColor='crimson' defaultColor='#ccc' size='36px' spacing='10px' />
      </div>

      {/* 4. Tooltips via titleArray (length must be >= count) */}
      <div style={section}>
        <h4>With titles (hover tooltips)</h4>
        <Rating defaultValue={0} showTitle titleArray={['Awful', 'Meh', 'OK', 'Great', 'Amazing']} />
      </div>

      {/* 5. Read-only display of an existing rating */}
      <div style={section}>
        <h4>Read-only</h4>
        <Rating defaultValue={4} readOnly size='18px' />
      </div>

      {/* 6. Different count */}
      <div style={section}>
        <h4>10 icons</h4>
        <Rating defaultValue={7} count={10} size='20px' spacing='2px' />
      </div>
    </div>
  )
}

export default RatingDemo
