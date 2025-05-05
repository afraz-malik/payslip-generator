import { v4 as uuidv4 } from "uuid"
import type { Payslip, PayItem } from "@/types/payslip"

// Sample custom earnings
const sampleCustomEarnings1: PayItem[] = [
  {
    id: uuidv4(),
    title: "Bonus",
    amount: 10000,
  },
  {
    id: uuidv4(),
    title: "Overtime",
    amount: 5000,
  },
]

const sampleCustomEarnings2: PayItem[] = [
  {
    id: uuidv4(),
    title: "Performance Bonus",
    amount: 15000,
  },
]

// Sample custom deductions
const sampleCustomDeductions1: PayItem[] = [
  {
    id: uuidv4(),
    title: "Provident Fund",
    amount: 2000,
  },
  {
    id: uuidv4(),
    title: "Professional Tax",
    amount: 500,
  },
]

const sampleCustomDeductions2: PayItem[] = [
  {
    id: uuidv4(),
    title: "Income Tax",
    amount: 3000,
  },
  {
    id: uuidv4(),
    title: "Health Insurance",
    amount: 1500,
  },
]

// Sample payslips
export const samplePayslips: Payslip[] = [
  {
    id: uuidv4(),
    employeeName: "Muhammad Sohail",
    designation: "Full Stack Developer",
    payPeriod: "February 2025",
    department: "Dev",
    accountNumber: "01860010055036760018",
    daysWorked: "Full",
    basicPay: 52000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 57000,
    totalDeductions: 0,
    netPay: 57000,
  },
  {
    id: uuidv4(),
    employeeName: "Awais Tahir",
    designation: "MERN Stack Developer",
    payPeriod: "February 2025",
    department: "Dev",
    accountNumber: "18527992591103",
    daysWorked: "Full",
    basicPay: 86000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 91000,
    totalDeductions: 0,
    netPay: 91000,
  },
  {
    id: uuidv4(),
    employeeName: "Sarah Khan",
    designation: "UI/UX Designer",
    payPeriod: "March 2025",
    department: "Design",
    accountNumber: "01860010055789012",
    daysWorked: "Full",
    basicPay: 65000,
    medicalAllowance: 5000,
    incentivePay: 8000,
    customEarnings: sampleCustomEarnings1,
    customDeductions: sampleCustomDeductions1,
    totalEarnings: 88000, // 65000 + 5000 + 8000 + 10000 + 5000
    totalDeductions: 2500, // 2000 + 500
    netPay: 85500, // 88000 - 2500
  },
  {
    id: uuidv4(),
    employeeName: "Ali Ahmed",
    designation: "Project Manager",
    payPeriod: "March 2025",
    department: "Management",
    accountNumber: "01860010055123456",
    daysWorked: "Full",
    basicPay: 95000,
    medicalAllowance: 8000,
    incentivePay: 12000,
    customEarnings: sampleCustomEarnings2,
    customDeductions: sampleCustomDeductions2,
    totalEarnings: 130000, // 95000 + 8000 + 12000 + 15000
    totalDeductions: 4500, // 3000 + 1500
    netPay: 125500, // 130000 - 4500
  },
]

// Function to get a template payslip (for reuse)
export const getTemplatePayslip = (templateName: string): Omit<Payslip, "id" | "employeeName" | "payPeriod"> => {
  switch (templateName) {
    case "developer":
      return {
        designation: "Full Stack Developer",
        department: "Dev",
        accountNumber: "",
        daysWorked: "Full",
        basicPay: 52000,
        medicalAllowance: 5000,
        incentivePay: 0,
        customEarnings: [],
        customDeductions: [],
        totalEarnings: 57000,
        totalDeductions: 0,
        netPay: 57000,
      }
    case "designer":
      return {
        designation: "UI/UX Designer",
        department: "Design",
        accountNumber: "",
        daysWorked: "Full",
        basicPay: 65000,
        medicalAllowance: 5000,
        incentivePay: 8000,
        customEarnings: JSON.parse(JSON.stringify(sampleCustomEarnings1)),
        customDeductions: JSON.parse(JSON.stringify(sampleCustomDeductions1)),
        totalEarnings: 88000,
        totalDeductions: 2500,
        netPay: 85500,
      }
    case "manager":
      return {
        designation: "Project Manager",
        department: "Management",
        accountNumber: "",
        daysWorked: "Full",
        basicPay: 95000,
        medicalAllowance: 8000,
        incentivePay: 12000,
        customEarnings: JSON.parse(JSON.stringify(sampleCustomEarnings2)),
        customDeductions: JSON.parse(JSON.stringify(sampleCustomDeductions2)),
        totalEarnings: 130000,
        totalDeductions: 4500,
        netPay: 125500,
      }
    default:
      return {
        designation: "",
        department: "",
        accountNumber: "",
        daysWorked: "Full",
        basicPay: 0,
        medicalAllowance: 0,
        incentivePay: 0,
        customEarnings: [],
        customDeductions: [],
        totalEarnings: 0,
        totalDeductions: 0,
        netPay: 0,
      }
  }
}
