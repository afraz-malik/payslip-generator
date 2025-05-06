import db from "@/lib/db";

export async function POST(req: {
  json: () => PromiseLike<{ payslips: any }> | { payslips: any };
}) {
  const { payslips } = await req.json();

  const insert = db.prepare(
    "INSERT OR REPLACE INTO payslips (id, data) VALUES (?, ?)"
  );
  insert.run(1, JSON.stringify(payslips));

  return Response.json({ status: "saved", payslips });
}

export async function GET() {
  const rows = db.prepare("SELECT * FROM payslips WHERE id = 1").all();
  return Response.json(rows);
}
