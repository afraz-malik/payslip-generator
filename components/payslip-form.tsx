"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { Payslip, PayItem } from "@/types/payslip";

interface PayslipFormProps {
  onAddPayslip: (payslip: Payslip) => void;
  selectedPayslip: Payslip | null;
}

export function PayslipForm({
  onAddPayslip,
  selectedPayslip,
}: PayslipFormProps) {
  const [formData, setFormData] = useState<Omit<Payslip, "id">>({
    employeeName: "",
    designation: "",
    email: "",
    payPeriod: "",
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
  });

  // Update form when a payslip is selected for editing
  useEffect(() => {
    if (selectedPayslip) {
      setFormData({
        employeeName: selectedPayslip.employeeName,
        designation: selectedPayslip.designation,
        payPeriod: selectedPayslip.payPeriod,
        email: selectedPayslip.email || "",
        department: selectedPayslip.department,
        accountNumber: selectedPayslip.accountNumber,
        daysWorked: selectedPayslip.daysWorked,
        basicPay: selectedPayslip.basicPay,
        medicalAllowance: selectedPayslip.medicalAllowance,
        incentivePay: selectedPayslip.incentivePay || 0,
        customEarnings: selectedPayslip.customEarnings || [],
        customDeductions: selectedPayslip.customDeductions || [],
        totalEarnings: selectedPayslip.totalEarnings,
        totalDeductions: selectedPayslip.totalDeductions,
        netPay: selectedPayslip.netPay,
      });
    }
  }, [selectedPayslip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let numericValue = value;
    if (
      name === "basicPay" ||
      name === "medicalAllowance" ||
      name === "incentivePay"
    ) {
      numericValue = value === "" ? "0" : value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: ["basicPay", "medicalAllowance", "incentivePay"].includes(name)
        ? Number.parseFloat(numericValue)
        : value,
    }));
  };

  const handleCustomEarningChange = (
    id: string,
    field: "title" | "amount",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customEarnings: prev.customEarnings.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]:
              field === "amount" ? Number.parseFloat(value || "0") : value,
          };
        }
        return item;
      }),
    }));
  };

  const handleCustomDeductionChange = (
    id: string,
    field: "title" | "amount",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customDeductions: prev.customDeductions.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]:
              field === "amount" ? Number.parseFloat(value || "0") : value,
          };
        }
        return item;
      }),
    }));
  };

  const addCustomEarning = () => {
    const newItem: PayItem = {
      id: uuidv4(),
      title: "",
      amount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      customEarnings: [...prev.customEarnings, newItem],
    }));
  };

  const addCustomDeduction = () => {
    const newItem: PayItem = {
      id: uuidv4(),
      title: "",
      amount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      customDeductions: [...prev.customDeductions, newItem],
    }));
  };

  const removeCustomEarning = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customEarnings: prev.customEarnings.filter((item) => item.id !== id),
    }));
  };

  const removeCustomDeduction = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customDeductions: prev.customDeductions.filter((item) => item.id !== id),
    }));
  };

  const calculateTotals = () => {
    // Calculate total earnings
    const standardEarnings =
      formData.basicPay + formData.medicalAllowance + formData.incentivePay;
    const customEarningsTotal = formData.customEarnings.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalEarnings = standardEarnings + customEarningsTotal;

    // Calculate total deductions
    const customDeductionsTotal = formData.customDeductions.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalDeductions = customDeductionsTotal;

    // Calculate net pay
    const netPay = totalEarnings - totalDeductions;

    return {
      totalEarnings,
      totalDeductions,
      netPay,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalEarnings, totalDeductions, netPay } = calculateTotals();

    // Create new payslip with ID or use existing ID when updating
    const newPayslip: Payslip = {
      id: selectedPayslip ? selectedPayslip.id : uuidv4(),
      ...formData,
      totalEarnings,
      totalDeductions,
      netPay,
    };

    onAddPayslip(newPayslip);

    // Reset form
    setFormData({
      employeeName: "",
      designation: "",
      payPeriod: "",
      email: "",
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
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {selectedPayslip ? "Edit Payslip" : "Add New Payslip"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Details Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Employee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payPeriod">Pay Period (Month Year)</Label>
                <Input
                  id="payPeriod"
                  name="payPeriod"
                  value={formData.payPeriod}
                  onChange={handleChange}
                  placeholder="February 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daysWorked">Days Worked</Label>
                <Input
                  id="daysWorked"
                  name="daysWorked"
                  value={formData.daysWorked}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">A/C No</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Earnings Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Earnings</h3>

            {/* Standard Earnings */}
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="basicPay">Basic Pay</Label>
                </div>
                <div>
                  <Label htmlFor="basicPayAmount">Amount</Label>
                </div>

                <div className="col-span-2">
                  <Input
                    id="basicPay"
                    name="basicPay"
                    value="Basic Pay"
                    disabled
                  />
                </div>
                <div>
                  <Input
                    id="basicPayAmount"
                    name="basicPay"
                    type="number"
                    value={formData.basicPay || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    id="medicalAllowance"
                    name="medicalAllowance"
                    value="Medical Allowance"
                    disabled
                  />
                </div>
                <div>
                  <Input
                    id="medicalAllowanceAmount"
                    name="medicalAllowance"
                    type="number"
                    value={formData.medicalAllowance || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <Input
                    id="incentivePay"
                    name="incentivePay"
                    value="Incentive Pay"
                    disabled
                  />
                </div>
                <div>
                  <Input
                    id="incentivePayAmount"
                    name="incentivePay"
                    type="number"
                    value={formData.incentivePay || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Custom Earnings */}
            <div className="space-y-4">
              {formData.customEarnings.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <div className="col-span-2">
                    <Input
                      placeholder="Earning Title"
                      value={item.title}
                      onChange={(e) =>
                        handleCustomEarningChange(
                          item.id,
                          "title",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={item.amount || ""}
                      onChange={(e) =>
                        handleCustomEarningChange(
                          item.id,
                          "amount",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCustomEarning(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addCustomEarning}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Earning
              </Button>
            </div>
          </div>

          {/* Deductions Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Deductions</h3>

            {/* Custom Deductions */}
            <div className="space-y-4">
              {formData.customDeductions.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <div className="col-span-2">
                    <Input
                      placeholder="Deduction Title"
                      value={item.title}
                      onChange={(e) =>
                        handleCustomDeductionChange(
                          item.id,
                          "title",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={item.amount || ""}
                      onChange={(e) =>
                        handleCustomDeductionChange(
                          item.id,
                          "amount",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCustomDeduction(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addCustomDeduction}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deduction
              </Button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-lg font-medium">
                  {calculateTotals().totalEarnings.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Deductions
                </p>
                <p className="text-lg font-medium">
                  {calculateTotals().totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Net Pay</p>
                <p className="text-xl font-bold">
                  {calculateTotals().netPay.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            {selectedPayslip ? "Update Payslip" : "Add Payslip"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
