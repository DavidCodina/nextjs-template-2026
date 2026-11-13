import type { TableData } from '../../types'

export const testData: TableData = {
  header: ['Invoice', 'Status', 'Method', 'Amount'],
  body: [
    ['INV001', 'Paid', 'Credit Card', '$150.00'],
    ['INV002', 'Paid', 'Credit Card', '$250.00'],
    ['INV003', 'Paid', 'Credit Card', '$350.00'],
    ['INV004', 'Paid', 'Credit Card', '$450.00'],
    ['INV005', 'Paid', 'Credit Card', '$550.00']
  ],
  footer: ['Invoice', 'Status', 'Method', 'Amount']
}
