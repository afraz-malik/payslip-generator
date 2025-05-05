"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface PayslipFilterProps {
  onFilterChange: (month: string) => void
}

export function PayslipFilter({ onFilterChange }: PayslipFilterProps) {
  const [month, setMonth] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(month)
  }

  const handleClear = () => {
    setMonth("")
    onFilterChange("")
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="month-filter">Filter by Month</Label>
            <Input
              id="month-filter"
              placeholder="e.g. February 2025"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
