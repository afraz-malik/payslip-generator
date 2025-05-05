"use client"

import { useState, useEffect } from "react"
import { PayslipForm } from "./payslip-form"
import { PayslipTable } from "./payslip-table"
import { PayslipFilter } from "./payslip-filter"
import { SampleDataLoader } from "./sample-data-loader"
import type { Payslip } from "@/types/payslip"

export function PayslipManager() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [filteredPayslips, setFilteredPayslips] = useState<Payslip[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)

  // Load payslips from localStorage on component mount
  useEffect(() => {
    const savedPayslips = localStorage.getItem("payslips")
    if (savedPayslips) {
      const parsedPayslips = JSON.parse(savedPayslips)
      setPayslips(parsedPayslips)
      setFilteredPayslips(parsedPayslips)
    }
  }, [])

  // Save payslips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("payslips", JSON.stringify(payslips))

    // Apply filter when payslips or selectedMonth changes
    if (selectedMonth) {
      setFilteredPayslips(payslips.filter((payslip) => payslip.payPeriod.includes(selectedMonth)))
    } else {
      setFilteredPayslips(payslips)
    }
  }, [payslips, selectedMonth])

  const handleAddPayslip = (newPayslip: Payslip) => {
    if (selectedPayslip) {
      // Update existing payslip
      setPayslips((prev) => prev.map((payslip) => (payslip.id === selectedPayslip.id ? newPayslip : payslip)))
      setSelectedPayslip(null) // Clear selection after update
    } else {
      // Add new payslip
      setPayslips((prev) => [...prev, newPayslip])
    }
  }

  const handleDeletePayslip = (id: string) => {
    setPayslips((prev) => prev.filter((payslip) => payslip.id !== id))
    // Clear selection if the deleted payslip was selected
    if (selectedPayslip && selectedPayslip.id === id) {
      setSelectedPayslip(null)
    }
  }

  const handleFilterChange = (month: string) => {
    setSelectedMonth(month)
  }

  const handleSelectPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip)
  }

  const handleLoadSampleData = (sampleData: Payslip[]) => {
    setPayslips(sampleData)
    setSelectedPayslip(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
        <PayslipForm onAddPayslip={handleAddPayslip} selectedPayslip={selectedPayslip} />
        <SampleDataLoader onLoadSampleData={handleLoadSampleData} />
      </div>
      <PayslipFilter onFilterChange={handleFilterChange} />
      <PayslipTable
        payslips={filteredPayslips}
        onDeletePayslip={handleDeletePayslip}
        onSelectPayslip={handleSelectPayslip}
      />
    </div>
  )
}
