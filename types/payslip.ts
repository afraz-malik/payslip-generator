export interface PayItem {
  id: string
  title: string
  amount: number
}

export interface Payslip {
  id: string
  employeeName: string
  designation: string
  payPeriod: string
  department: string
  accountNumber: string
  daysWorked: string
  // Standard earnings
  basicPay: number
  medicalAllowance: number
  incentivePay: number
  // Custom earnings and deductions
  customEarnings: PayItem[]
  customDeductions: PayItem[]
  // Totals
  totalEarnings: number
  totalDeductions: number
  netPay: number
}
