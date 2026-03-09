import { render, screen } from '@testing-library/react'
import { Parent } from './'

// This example is intended to demonstrate how one can mock a React
// component within another React component.

// Naive Approach:
// jest.mock('../Child', () => ({ Child: jest.fn().mockReturnValue(<div>Mock Child</div>) }))

// ⚠️ Gotcha: In Vitest, we often use async () => {}, but that won't work in Jest.
jest.mock('../Child', () => {
  const originalModule = jest.requireActual('../Child')
  return {
    ...originalModule,
    Child: jest.fn().mockReturnValue(<div>Mock Child</div>)
  }
})

describe('Parent...', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not contain actual <Child/>.', () => {
    render(<Parent />)

    const parentText = screen.getByText(/this is the parent/i)
    expect(parentText).toBeInTheDocument()

    const mockChildText = screen.getByText(/mock child/i)
    expect(mockChildText).toBeInTheDocument()

    const childText = screen.queryByText(/this is the child/i)
    expect(childText).not.toBeInTheDocument()
  })
})
