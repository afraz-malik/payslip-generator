"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, DollarSign, Users } from "lucide-react";

interface PayrollEntry {
  id: string;
  employeeName: string;
  netPay: number;
}

interface PayrollData {
  id: number;
  date: string;
  data: string;
}

interface PayrollCardsProps {
  data: PayrollData[];
  onCardClick?: (data: any) => void;
}

export default function PayrollCards({ data, onCardClick }: PayrollCardsProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const processedData = useMemo(() => {
    const cards: Array<{
      id: number;
      monthYear: string;
      year: string;
      totalExpenditure: number;
      totalEmployees: number;
      data: string;
    }> = [];
    const years = new Set<string>();

    data.forEach((item) => {
      try {
        const itemDate = new Date(item.date);
        const year = itemDate.getFullYear().toString();
        const monthYear = itemDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        years.add(year);

        const parsedEntries: PayrollEntry[] = JSON.parse(item.data);
        const totalExpenditure = parsedEntries.reduce(
          (sum, entry) => sum + entry.netPay,
          0
        );
        const totalEmployees = parsedEntries.length;

        cards.push({
          id: item.id,
          monthYear,
          year,
          totalExpenditure,
          totalEmployees,
          data: item.data,
        });
      } catch (error) {
        console.error("Error parsing payroll data:", error);
      }
    });

    return { cards, years: Array.from(years).sort() };
  }, [data]);

  const filteredCards = useMemo(() => {
    if (selectedYear === "all") {
      return processedData.cards;
    }

    return processedData.cards.filter((card) => card.year === selectedYear);
  }, [processedData.cards, selectedYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  const handleCardClick = (
    monthYear: string,
    data: string,
    objectId: number
  ) => {
    if (onCardClick) {
      onCardClick(JSON.parse(data));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Monthly Payroll</h2>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {processedData.years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCards
          .sort(
            (a, b) =>
              new Date(a.monthYear).getTime() - new Date(b.monthYear).getTime()
          )
          .map((card) => (
            <Card
              key={card.id}
              className="hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50"
              onClick={() =>
                handleCardClick(card.monthYear, card.data, card.id)
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {card.monthYear}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Expenditure
                    </p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(card.totalExpenditure)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Employees
                    </p>
                    <p className="font-bold text-blue-600">
                      {card.totalEmployees}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No data found for selected year
          </p>
        </div>
      )}
    </div>
  );
}
