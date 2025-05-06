import { v4 as uuidv4 } from "uuid";
import type { Payslip, PayItem } from "@/types/payslip";

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
];

const sampleCustomEarnings2: PayItem[] = [
  {
    id: uuidv4(),
    title: "Performance Bonus",
    amount: 15000,
  },
];

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
];

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
];

const now = new Date();
now.setMonth(now.getMonth() - 1); // Move to previous month

const thisMonth = now.toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});

// Sample payslips
export const samplePayslips: Payslip[] = [
  {
    id: uuidv4(),
    employeeName: "Muhammad Sohail",
    designation: "Full Stack Developer",
    payPeriod: thisMonth,
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
    employeeName: "Awais Akram",
    designation: "Full Stack Developer",
    payPeriod: thisMonth,
    department: "Dev",
    accountNumber: "0002117992108403",
    daysWorked: "Full",
    basicPay: 65000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 70000,
    totalDeductions: 0,
    netPay: 70000,
  },
  {
    id: uuidv4(),
    employeeName: "Awais Tahir",
    designation: "Full Stack Developer",
    payPeriod: thisMonth,
    department: "Dev",
    accountNumber: "018527992591103",
    daysWorked: "Full",
    basicPay: 88000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 93000,
    totalDeductions: 0,
    netPay: 93000,
  },
  {
    id: uuidv4(),
    employeeName: "Shehram Azam",
    designation: "QA Eng.",
    payPeriod: thisMonth,
    department: "QA",
    accountNumber: "0098650107869536",
    daysWorked: "Full",
    basicPay: 35000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 40000,
    totalDeductions: 0,
    netPay: 40000,
  },
  {
    id: uuidv4(),
    employeeName: "Muhammad Ahmad",
    designation: "QA Eng.",
    payPeriod: thisMonth,
    department: "QA",
    accountNumber: "01287903296903",
    daysWorked: "Full",
    basicPay: 30000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 35000,
    totalDeductions: 0,
    netPay: 35000,
  },
  {
    id: uuidv4(),
    employeeName: "Ahsan Ahmad",
    designation: "Ui Ux Designer",
    payPeriod: thisMonth,
    department: "Designer",
    accountNumber: "02410105656342",
    daysWorked: "Full",
    basicPay: 50000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 55000,
    totalDeductions: 0,
    netPay: 55000,
  },
  {
    id: uuidv4(),
    employeeName: "Ali Hamza",
    designation: "Full Stack Developer",
    payPeriod: thisMonth,
    department: "Dev",
    accountNumber: "06187902122003",
    daysWorked: "Full",
    basicPay: 30000,
    medicalAllowance: 5000,
    incentivePay: 0,
    customEarnings: [],
    customDeductions: [],
    totalEarnings: 35000,
    totalDeductions: 0,
    netPay: 35000,
  },
];

// Function to get a template payslip (for reuse)
export const getTemplatePayslip = (
  templateName: string
): Omit<Payslip, "id" | "employeeName" | "payPeriod"> => {
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
      };
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
      };
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
      };
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
      };
  }
};
