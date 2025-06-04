import { PayslipManager } from "@/components/payslip-manager";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <Toaster />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Payslip Generator
        </h1>
        <PayslipManager />
      </main>
    </>
  );
}
