import type React from "react"
import type { Payslip } from "@/types/payslip"

export async function generatePDF(payslip: Payslip, pdfRef: React.RefObject<HTMLElement>) {
  if (!pdfRef.current) {
    console.error("PDF reference is not available")
    return
  }

  // Since usePDF is a hook and can't be used in a regular function,
  // we'll use the direct approach with the underlying library

  // Import the library dynamically to avoid SSR issues
  const { jsPDF } = await import("jspdf")
  const html2canvas = (await import("html2canvas")).default

  try {
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")

    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    pdf.save(`Payslip_${payslip.employeeName.replace(/\s+/g, "_")}_${payslip.payPeriod.replace(/\s+/g, "_")}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
