"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Payslip } from "@/types/payslip";
import { Trash2, Copy, Eye, Edit } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { PDFPreviewModal } from "./pdf-preview-modal";

interface PayslipTableProps {
  payslips: Payslip[];
  hideActions?: boolean;
  onDeletePayslip?: (id: string) => void;
  onSelectPayslip?: (payslip: Payslip) => void;
}

export function PayslipTable({
  payslips,
  hideActions,
  onDeletePayslip,
  onSelectPayslip,
}: PayslipTableProps) {
  const [selectedPayslipForPDF, setSelectedPayslipForPDF] =
    useState<Payslip | null>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  const handlePreviewPDF = (payslip: Payslip) => {
    setSelectedPayslipForPDF(payslip);
    setIsPDFModalOpen(true);
  };

  const handleDuplicatePayslip = (payslip: Payslip, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click

    // Create a duplicate with a new ID
    const duplicatedPayslip: Payslip = {
      ...payslip,
      id: uuidv4(),
      employeeName: `${payslip.employeeName} (Copy)`,
    };

    savePayslips([...payslips, duplicatedPayslip]).then((el) =>
      // Reload the page to refresh the data
      window.location.reload()
    );
  };

  const savePayslips = async (slips: any) => {
    const res = await fetch("/api/payslips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payslips: slips }),
    });

    const data = await res.json();
    console.log("Saved to SQLite:", data);
  };

  if (payslips.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50">
        <p>No payslips found. Add a new payslip to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Pay Period</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Total Earnings</TableHead>
              <TableHead className="text-right">Total Deductions</TableHead>
              <TableHead className="text-right">Net Pay</TableHead>
              {!hideActions && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payslips.map((payslip) => (
              <TableRow
                key={payslip.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={(e) => handlePreviewPDF(payslip)}
              >
                <TableCell className="font-medium">
                  {payslip.employeeName}
                </TableCell>
                <TableCell className="font-medium">{payslip.email}</TableCell>
                <TableCell>{payslip.payPeriod}</TableCell>
                <TableCell>{payslip.department}</TableCell>

                <TableCell className="text-right">
                  {payslip.totalEarnings.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {payslip.totalDeductions.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {payslip.netPay.toLocaleString()}
                </TableCell>
                {!hideActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          if (onSelectPayslip) onSelectPayslip(payslip);
                        }}
                        title="Edit Slip"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Slip</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => handleDuplicatePayslip(payslip, e)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicate</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          if (onDeletePayslip) onDeletePayslip(payslip.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PDFPreviewModal
        payslip={selectedPayslipForPDF}
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
      />
    </>
  );
}
