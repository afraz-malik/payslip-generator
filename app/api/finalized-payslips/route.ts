import db from "@/lib/db";

export async function POST(req: {
  json: () =>
    | PromiseLike<{ payslips: any; month: string }>
    | { payslips: any; month: string };
}) {
  const { payslips, month } = await req.json();

  const insert = db.prepare(
    "INSERT OR REPLACE INTO monthly_payslips (id, date, data) VALUES (?, ?, ?)"
  );
  insert.run(Date.now(), month, JSON.stringify(payslips));

  return Response.json({ status: "saved", payslips, month });
}

export async function GET() {
  const rows = db.prepare("SELECT * FROM monthly_payslips ").all();
  return Response.json(rows);
}
