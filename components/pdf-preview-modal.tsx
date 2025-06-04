"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PayslipPDF } from "./payslip-pdf";
import type { Payslip } from "@/types/payslip";
import { generatePDF } from "@/lib/pdf-generator";

interface PDFPreviewModalProps {
  payslip: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFPreviewModal({
  payslip,
  isOpen,
  onClose,
}: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!payslip) return;

    setIsGenerating(true);
    try {
      await generatePDF(payslip, pdfRef);
      // Close the modal after successful download
      onClose();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!payslip) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Payslip Preview</DialogTitle>
          <DialogDescription>
            Preview of payslip for {payslip.employeeName} - {payslip.payPeriod}
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-md overflow-auto max-h-[70vh] p-4">
          <PayslipPDF ref={pdfRef} payslip={payslip} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
