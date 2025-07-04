"use client";

import type { Payslip } from "@/types/payslip";
import { useEffect, useRef, useState } from "react";
import { PayslipForm } from "./payslip-form";
import { PayslipPDF } from "./payslip-pdf";
import { PayslipTable } from "./payslip-table";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayrollCards from "./payslipHistory";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf-generator";

export function PayslipManager() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const hiddenPaySlipRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
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

    await fetch("/api/finalized-payslips")
      .then((el) => el.json())
      .then((el) => setHistory(el));
  };
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
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
    setIsAddFormOpen(false);
  };

  const handleDeletePayslip = (id: string) => {
    const answer = window.confirm("Are you sure you want to delete ? ");
    if (!answer) {
      return;
    }
    setPayslips((prev) => prev.filter((payslip) => payslip.id !== id));
    // Clear selection if the deleted payslip was selected
    if (selectedPayslip && selectedPayslip.id === id) {
      setSelectedPayslip(null);
    }
  };

  const handleSelectPayslip = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setIsAddFormOpen(true);
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

    await fetch("/api/finalized-payslips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: new Date(), payslips }),
    });
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Current Employees</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <h1>List of All Employees</h1>
                  <Button onClick={() => setIsAddFormOpen(true)}>
                    Add New Employee
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col  gap-4 justify-between">
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <div className="container mx-auto py-8 px-4">
            <PayrollCards
              data={history}
              onCardClick={(data: any) => {
                setSelectedHistory(data);
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
      {selectedPayslip && (
        <PayslipPDF ref={hiddenPaySlipRef} payslip={selectedPayslip} />
      )}
      {selectedHistory && (
        <HistoryModal
          data={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}
      {true && (
        <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
          <PaySlipAddForm
            isOpen={isAddFormOpen}
            onClose={() => {
              setSelectedPayslip(null);
              setIsAddFormOpen(false);
            }}
            title={"hello"}
            selectedPayslip={selectedPayslip}
            handleAddPayslip={handleAddPayslip}
          />
          {/* <SampleDataLoader onLoadSampleData={handleLoadSampleData} /> */}
        </div>
      )}
    </div>
  );
}

const PaySlipAddForm = ({
  isOpen,
  title,
  onClose,
  selectedPayslip,
  handleAddPayslip,
}: {
  isOpen: any;
  title: any;
  onClose: any;
  selectedPayslip: any;
  handleAddPayslip: any;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {/* {selectedPayslip ? "Edit Payslip" : "Add New Payslip"} */}
          </DialogTitle>
        </DialogHeader>

        <div className=" overflow-auto max-h-[70vh]">
          <PayslipForm
            onAddPayslip={handleAddPayslip}
            selectedPayslip={selectedPayslip}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
const HistoryModal = ({ data, onClose }: { data: any; onClose: any }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        onClose();
      }}
    >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle> List of sent slips.</DialogTitle>
        </DialogHeader>

        <PayslipTable
          hideActions
          payslips={data}
          // onDeletePayslip={handleDeletePayslip}
          // onSelectPayslip={handleSelectPayslip}
        />
      </DialogContent>
    </Dialog>
  );
};
