import React from "react";
import type { Payslip } from "@/types/payslip";
import { numberToWords } from "@/lib/utils";
interface PayslipPDFProps {
  payslip: Payslip;
}

export const PayslipPDF = React.forwardRef<HTMLDivElement, PayslipPDFProps>(
  ({ payslip }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white relative w-[210mm] min-h-[297mm] mx-auto p-12 text-black"
      >
        <img
          className="absolute -z-1 opacity-20  top-[400px] w-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="/logo.png"
        />
        {/* Header */}
        <div className=" text-white  p-0 flex w-full justify-center items-center">
          <img src={"/logo.png"} className="w-20 h-20" />
          <h1
            style={{ fontFamily: "Cambria, serif" }}
            className="text-3xl text-[#375f91]  w-full font-bold text-left tracking-widest"
          >
            C I P H E R &nbsp; D E V E L O P E R S
          </h1>
        </div>
        <hr className="bg-[#375f91] h-2" />

        {/* Employee Details */}
        <div className="">
          <br />
          <div className="grid grid-cols-2 ">
            <div className="p-1 ">
              <div className="flex">
                <span className="w-32">Employee name</span>
                <span className="font-bold">: {payslip.employeeName}</span>
              </div>
            </div>
            <div className="p-1 ">
              <div className="flex">
                <span className="w-32">Designation</span>
                <span className="font-bold">: {payslip.designation}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 ">
            <div className="p-1 ">
              <div className="flex">
                <span className="w-32">Pay Period</span>
                <span className="font-bold">: {payslip.payPeriod}</span>
              </div>
            </div>
            <div className="p-1 ">
              <div className="flex">
                <span className="w-32">Department</span>
                <span className="font-bold">: {payslip.department}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 ">
            <div className="p-1 ">
              <div className="flex">
                <span className="w-32">Days worked</span>
                <span className="font-bold">: {payslip.daysWorked}</span>
              </div>
            </div>
            <div className="p-1 ">
              <div className="flex">
                <span className="w-32">A/C No:</span>
                <span className="font-bold">: {payslip.accountNumber}</span>
              </div>
            </div>
          </div>
          <br />

          {/* Earnings and Deductions Headers */}
          <div className="grid grid-cols-4   font-bold">
            <div className="p-1 border-b-2 border-black text-left">
              Earnings
            </div>
            <div className="p-1 border-b-2 border-black text-right">Amount</div>
            <div className="p-1 border-b-2 border-black text-left">
              Deductions
            </div>
            <div className="p-1 border-b-2 border-black text-right">Amount</div>
          </div>

          {/* Standard Earnings and Deductions */}
          <div className="grid grid-cols-4 ">
            <div className="p-1 border-b-2 border-gray-300">Basic Pay</div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.basicPay.toLocaleString()}
            </div>
            <div className="p-1 border-b-2 border-gray-300">
              {payslip.customDeductions.length > 0
                ? payslip.customDeductions[0].title
                : "Provident Fund"}
            </div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.customDeductions.length > 0
                ? payslip.customDeductions[0].amount.toLocaleString()
                : "-"}
            </div>
          </div>

          <div className="grid grid-cols-4 ">
            <div className="p-1 border-b-2 border-gray-300">
              Medical Allowance
            </div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.medicalAllowance.toLocaleString()}
            </div>
            <div className="p-1 border-b-2 border-gray-300">
              {payslip.customDeductions.length > 1
                ? payslip.customDeductions[1].title
                : "Professional Tax"}
            </div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.customDeductions.length > 1
                ? payslip.customDeductions[1].amount.toLocaleString()
                : "-"}
            </div>
          </div>

          <div className="grid grid-cols-4 ">
            <div className="p-1 border-b-2 border-gray-300">Incentive Pay</div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.incentivePay > 0
                ? payslip.incentivePay.toLocaleString()
                : "-"}
            </div>
            <div className="p-1 border-b-2 border-gray-300">
              {payslip.customDeductions.length > 2
                ? payslip.customDeductions[2].title
                : ""}
            </div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.customDeductions.length > 2
                ? payslip.customDeductions[2].amount.toLocaleString()
                : ""}
            </div>
          </div>

          {/* Custom Earnings */}
          {payslip.customEarnings.map((earning, index) => (
            <div key={earning.id} className="grid grid-cols-4 ">
              <div className="p-1 border-b-2 border-gray-300">
                {earning.title}
              </div>
              <div className="p-1 border-b-2 border-gray-300 text-right">
                {earning.amount.toLocaleString()}
              </div>
              <div className="p-1 border-b-2 border-gray-300">
                {payslip.customDeductions.length > index + 3
                  ? payslip.customDeductions[index + 3].title
                  : ""}
              </div>
              <div className="p-1 border-b-2 border-gray-300 text-right">
                {payslip.customDeductions.length > index + 3
                  ? payslip.customDeductions[index + 3].amount.toLocaleString()
                  : ""}
              </div>
            </div>
          ))}

          {/* Additional Deductions (if more deductions than earnings) */}
          {payslip.customDeductions.length >
            payslip.customEarnings.length + 3 &&
            payslip.customDeductions
              .slice(payslip.customEarnings.length + 3)
              .map((deduction) => (
                <div key={deduction.id} className="grid grid-cols-4 ">
                  <div className="p-1 border-b-2 border-gray-300"></div>
                  <div className="p-1 border-b-2 border-gray-300"></div>
                  <div className="p-1 border-b-2 border-gray-300">
                    {deduction.title}
                  </div>
                  <div className="p-1 border-b-2 border-gray-300 text-right">
                    {deduction.amount.toLocaleString()}
                  </div>
                </div>
              ))}

          {/* Totals */}
          <div className="grid grid-cols-4  font-bold">
            <div className="p-1 border-b-2 border-gray-300">Total Earnings</div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.totalEarnings.toLocaleString()}
            </div>
            <div className="p-1 border-b-2 border-gray-300">
              Total Deductions
            </div>
            <div className="p-1 border-b-2 border-gray-300 text-right">
              {payslip.totalDeductions.toLocaleString()}
            </div>
          </div>

          {/* Net Pay */}
          <div className="grid grid-cols-4 ">
            <div className="col-span-2"></div>
            <div className="p-1 border-b-2 border-gray-300 font-bold">
              Net Pay
            </div>
            <div className="p-1 border-b-2 border-gray-300 text-right font-bold">
              {payslip.netPay.toLocaleString()}
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-1  text-right">
            ({numberToWords(payslip.netPay)} only)
          </div>
          <br />
          <br />
          {/* Footer */}
          <div className="p-1 font-bold text-center text-sm">
            This is system generated payslip and does not require any signature.
          </div>
        </div>
      </div>
    );
  }
);

PayslipPDF.displayName = "PayslipPDF";
