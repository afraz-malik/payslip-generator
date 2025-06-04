"use client";

import React, { useState, useEffect, useRef } from "react";
import { PayslipForm } from "./payslip-form";
import { PayslipTable } from "./payslip-table";
import { SampleDataLoader } from "./sample-data-loader";
import type { Payslip } from "@/types/payslip";
import { Button } from "./ui/button";
import { PayslipPDF } from "./payslip-pdf";
import { generatePDF } from "@/lib/pdf-generator";
import { toast } from "sonner";

export function PayslipManager() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const hiddenPaySlipRef = useRef<React.RefObject<HTMLElement>>(undefined);
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

  const handleFinalizeAndSendEmail = async () => {
    const password = window.prompt(
      "You are about to trigger sensitive operation. Please enter master password"
    );
    if (password != "rootus3r") {
      alert("Password failed");

      return;
    }
    for (const payslip of payslips) {
      await new Promise((resolve) => {
        toast.promise(
          new Promise(async (res, rej) => {
            try {
              setSelectedPayslip(payslip);
              // Wait for the component to render
              await new Promise((resolve) => setTimeout(resolve, 300));
              if (hiddenPaySlipRef) {
                console.log(hiddenPaySlipRef);

                const pdfBlob = await generatePDF(
                  payslip,
                  hiddenPaySlipRef,
                  true
                );

                if (pdfBlob) {
                  const formData = new FormData();
                  formData.append("file", pdfBlob, "payslip.pdf");
                  formData.append("slip", JSON.stringify(payslip));

                  await fetch("/api/send-payslip", {
                    method: "POST",
                    body: formData,
                  });
                } else {
                  throw new Error("No Blob");
                }
              }
              resolve(true);
              res(true);
            } catch (error) {
              console.log(error);
              rej(false);
            }
          }),
          {
            position: "top-right",
            error: "Failed to send email to " + payslip.employeeName,
            success: "Email sent successfully to  " + payslip.employeeName,
            loading: "Sending email for " + payslip.employeeName,
            duration: 9999999999,
            closeButton: true,
            richColors: true,
          }
        );
      });
    }
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
      <Button
        type="submit"
        className="w-full"
        onClick={() => handleFinalizeAndSendEmail()}
      >
        Finalize and send email
      </Button>
      {selectedPayslip && (
        <PayslipPDF ref={hiddenPaySlipRef} payslip={selectedPayslip} />
      )}
    </div>
  );
}
