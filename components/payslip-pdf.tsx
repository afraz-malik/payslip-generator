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
        className="bg-white relative w-[250mm] pt-12 pl-3 min-h-[297mm] mx-auto font-sans  text-black"
      >
        {/* Water mark */}
        <img
          className="absolute -z-1 opacity-20  top-[500px] w-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2"
          src="/logo.png"
        />
        {/* Header */}
        <div className=" text-white  px-12 flex w-full justify-center items-center">
          <img src={"/logo.png"} className="w-20 h-20" />
          <h1
            style={{ fontFamily: "sans-serif" }}
            className="text-[2rem] text-[#375f91] -mt-4 w-full font-medium  text-left tracking-widest"
          >
            Cipher Developers
          </h1>
        </div>
        {/* <hr className="bg-[#375f91] h-2 w-[90%] mx-auto" /> */}
        <div className="w-full text-center my-8">
          <b> To Whom It May Concern</b>
          <br /> This is to certify that the following is the official salary
          slip for the mentioned period.
        </div>
        {/* Employee Details */}
        <div className="px-16">
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
            <div className="p-1 border-b-2 border-black pb-2 text-left">
              Earnings
            </div>
            <div className="p-1 border-b-2 border-black pb-2 text-right">
              Amount
            </div>
            <div className="p-1 border-b-2 border-black pb-2 text-left">
              Deductions
            </div>
            <div className="p-1 border-b-2 border-black pb-2 text-right">
              Amount
            </div>
          </div>

          {/* Standard Earnings and Deductions */}
          <div className="grid grid-cols-4 ">
            <div className="p-1 pb-2 border-b-2 border-gray-300">Basic Pay</div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.basicPay.toLocaleString()}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              {payslip.customDeductions.length > 0
                ? payslip.customDeductions[0].title
                : "Provident Fund"}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.customDeductions.length > 0
                ? payslip.customDeductions[0].amount.toLocaleString()
                : "-"}
            </div>
          </div>

          <div className="grid grid-cols-4 ">
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              Medical Allowance
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.medicalAllowance.toLocaleString()}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              {payslip.customDeductions.length > 1
                ? payslip.customDeductions[1].title
                : "Professional Tax"}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.customDeductions.length > 1
                ? payslip.customDeductions[1].amount.toLocaleString()
                : "-"}
            </div>
          </div>

          <div className="grid grid-cols-4 ">
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              Incentive Pay
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.incentivePay > 0
                ? payslip.incentivePay.toLocaleString()
                : "-"}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              {payslip.customDeductions.length > 2
                ? payslip.customDeductions[2].title
                : ""}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.customDeductions.length > 2
                ? payslip.customDeductions[2].amount.toLocaleString()
                : ""}
            </div>
          </div>

          {/* Custom Earnings */}
          {payslip.customEarnings.map((earning, index) => (
            <div key={earning.id} className="grid grid-cols-4 ">
              <div className="p-1 pb-2 border-b-2 border-gray-300">
                {earning.title}
              </div>
              <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
                {earning.amount.toLocaleString()}
              </div>
              <div className="p-1 pb-2 border-b-2 border-gray-300">
                {payslip.customDeductions.length > index + 3
                  ? payslip.customDeductions[index + 3].title
                  : ""}
              </div>
              <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
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
                  <div className="p-1 pb-2 border-b-2 border-gray-300"></div>
                  <div className="p-1 pb-2 border-b-2 border-gray-300"></div>
                  <div className="p-1 pb-2 border-b-2 border-gray-300">
                    {deduction.title}
                  </div>
                  <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
                    {deduction.amount.toLocaleString()}
                  </div>
                </div>
              ))}

          {/* Totals */}
          <div className="grid grid-cols-4  font-bold">
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              Total Earnings
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.totalEarnings.toLocaleString()}
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300">
              Total Deductions
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right">
              {payslip.totalDeductions.toLocaleString()}
            </div>
          </div>

          {/* Net Pay */}
          <div className="grid grid-cols-4 ">
            <div className="col-span-2"></div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 font-bold">
              Net Pay
            </div>
            <div className="p-1 pb-2 border-b-2 border-gray-300 text-right font-bold">
              {payslip.netPay.toLocaleString()}
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-1  text-right">
            ({numberToWords(payslip.netPay)} only)
          </div>
          <br />
          <br />
          <div className="p-1 font-bold text-center text-sm">
            This is system generated payslip and does not require any signature.
          </div>
        </div>
        {/* Footer */}
        <div className="absolute bottom-10 my-auto">
          <img src="/Footer.png" alt="Footer" />
        </div>
      </div>
    );
  }
);

PayslipPDF.displayName = "PayslipPDF";
