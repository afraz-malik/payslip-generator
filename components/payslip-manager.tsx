"use client";

import { useState, useEffect } from "react";
import { PayslipForm } from "./payslip-form";
import { PayslipTable } from "./payslip-table";
import { SampleDataLoader } from "./sample-data-loader";
import type { Payslip } from "@/types/payslip";

export function PayslipManager() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const getPayslips = async () => {
    const res = await fetch("/api/payslips", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const savedPayslips = await res.json();
    if (savedPayslips && savedPayslips.length && savedPayslips[0]?.data) {
      const parsedPayslips = JSON.parse(savedPayslips[0].data);
      setPayslips(parsedPayslips);
    }
  };
  // Load payslips from localStorage on component mount
  useEffect(() => {
    getPayslips();
  }, []);

  const savePayslips = async () => {
    const res = await fetch("/api/payslips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payslips }),
    });

    const data = await res.json();
    console.log("Saved to SQLite:", data);
  };

  // Save payslips to localStorage whenever they change
  useEffect(() => {
    if (payslips.length) savePayslips();
  }, [payslips]);

  const handleAddPayslip = (newPayslip: Payslip) => {
    if (selectedPayslip) {
      // Update existing payslip
      setPayslips((prev) =>
        prev.map((payslip) =>
          payslip.id === selectedPayslip.id ? newPayslip : payslip
        )
      );
      setSelectedPayslip(null); // Clear selection after update
    } else {
      // Add new payslip
      setPayslips((prev) => [...prev, newPayslip]);
    }
  };

  const handleDeletePayslip = (id: string) => {
    setPayslips((prev) => prev.filter((payslip) => payslip.id !== id));
    // Clear selection if the deleted payslip was selected
    if (selectedPayslip && selectedPayslip.id === id) {
      setSelectedPayslip(null);
    }
  };

  const handleSelectPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
  };

  const handleLoadSampleData = (sampleData: Payslip[]) => {
    console.log(sampleData);

    setPayslips(sampleData);
    setSelectedPayslip(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
        <PayslipForm
          onAddPayslip={handleAddPayslip}
          selectedPayslip={selectedPayslip}
        />
        {/* <SampleDataLoader onLoadSampleData={handleLoadSampleData} /> */}
      </div>
      <PayslipTable
        payslips={payslips}
        onDeletePayslip={handleDeletePayslip}
        onSelectPayslip={handleSelectPayslip}
      />
    </div>
  );
}
