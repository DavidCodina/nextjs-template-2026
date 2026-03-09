import { render, screen } from '@testing-library/react'

/* ========================================================================
            
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohavedisplayvalue
// toHaveDisplayValue(value: string | RegExp | (string|RegExp)[])
//
// This allows you to check whether the given form element has the specified displayed
// value (the one the end user will see). It accepts <input>, <select> and <textarea>
// elements with the exception of <input type="checkbox"> and <input type="radio">,
// which can be meaningfully matched only using toBeChecked or toHaveFormValues.
//
///////////////////////////////////////////////////////////////////////////

describe('toHaveDisplayValue...', () => {
  test('should pass', () => {
    render(
      <>
        <label htmlFor='input-example'>First name</label>
        <input id='input-example' onChange={() => {}} type='text' value='Luca' />

        <label htmlFor='textarea-example'>Description</label>
        <textarea id='textarea-example' onChange={() => {}} value='An example description here.' />

        <label htmlFor='single-select-example'>Fruit</label>
        <select id='single-select-example'>
          <option value=''>Select a fruit...</option>
          <option value='banana'>Banana</option>
          <option value='ananas'>Ananas</option>
          <option value='avocado'>Avocado</option>
        </select>

        <label htmlFor='multiple-select-example'>Fruits</label>
        <select id='multiple-select-example' multiple defaultValue={['avocado', 'banana']}>
          <option value=''>Select a fruit...</option>
          <option value='banana'>Banana</option>
          <option value='ananas'>Ananas</option>
          <option value='avocado'>Avocado</option>
        </select>
      </>
    )

    const input = screen.getByLabelText('First name')
    const textarea = screen.getByLabelText('Description')
    const selectSingle = screen.getByLabelText('Fruit')
    const selectMultiple = screen.getByLabelText('Fruits')

    expect(input).toHaveDisplayValue('Luca')
    expect(input).toHaveDisplayValue(/Luc/)
    expect(textarea).toHaveDisplayValue('An example description here.')
    expect(textarea).toHaveDisplayValue(/example/)
    expect(selectSingle).toHaveDisplayValue('Select a fruit...')
    expect(selectSingle).toHaveDisplayValue(/Select/)
    expect(selectMultiple).toHaveDisplayValue([/Avocado/, 'Banana'])
  })
})
