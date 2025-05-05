"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { samplePayslips, getTemplatePayslip } from "@/data/sample-payslips"
import { v4 as uuidv4 } from "uuid"
import type { Payslip } from "@/types/payslip"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SampleDataLoaderProps {
  onLoadSampleData: (data: Payslip[]) => void
}

export function SampleDataLoader({ onLoadSampleData }: SampleDataLoaderProps) {
  const [templateType, setTemplateType] = useState<string>("")
  const [employeeName, setEmployeeName] = useState<string>("")
  const [payPeriod, setPayPeriod] = useState<string>("")

  const handleLoadAllSamples = () => {
    onLoadSampleData(samplePayslips)
  }

  const handleCreateFromTemplate = () => {
    if (!templateType || !employeeName || !payPeriod) return

    const templateData = getTemplatePayslip(templateType)
    const newPayslip: Payslip = {
      id: uuidv4(),
      employeeName,
      payPeriod,
      ...templateData,
    }

    // Load the new payslip along with existing ones
    const existingPayslips = JSON.parse(localStorage.getItem("payslips") || "[]")
    onLoadSampleData([...existingPayslips, newPayslip])

    // Reset form
    setTemplateType("")
    setEmployeeName("")
    setPayPeriod("")
  }

  return (
    <Card className="w-full md:w-80">
      <CardHeader>
        <CardTitle>Sample Data</CardTitle>
        <CardDescription>Load sample data or create from templates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleLoadAllSamples} className="w-full">
          Load All Sample Payslips
        </Button>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Create from Template</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="template-type">Template Type</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger id="template-type">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Job Roles</SelectLabel>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="employee-name">Employee Name</Label>
              <Input
                id="employee-name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Enter employee name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pay-period">Pay Period</Label>
              <Input
                id="pay-period"
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
                placeholder="e.g. April 2025"
              />
            </div>

            <Button
              onClick={handleCreateFromTemplate}
              className="w-full"
              disabled={!templateType || !employeeName || !payPeriod}
            >
              Create from Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
